#!/usr/bin/env python3
"""Fallback fetcher used when the Commons API is rate-limited.

Manifest entries carry explicit candidate titles:
  {"id": "hero-cyrus", "out": "docs/images/heroes/cyrus.jpg", "width": 1280, "orient": "landscape",
   "titles": ["File:Pasargad_Tomb_Cyrus3.jpg", "File:Defeat_of_Croesus_546_BCE.jpg"], "caption": "..."}
Metadata (size, licence, author) comes from the Toolforge commonsapi mirror; the file itself is
fetched through Special:FilePath. Licence rules are the same as fetch-images.py. Standard library only.
Usage: python3 fetch-images-direct.py <manifest.json> --credits <credits.json> --root <repo-root> [--force]
"""
import json, re, sys, time, html, subprocess, urllib.request, urllib.parse, pathlib, argparse
import xml.etree.ElementTree as ET

UA = "LeadershipFocusSiteBot/0.2 (https://github.com/groot99-droid/Strategy-Planner)"
OK_LICENCE = re.compile(r"^(Public domain|CC0|PDM|CC BY(-SA)? \d(\.\d)?|CC-BY(-SA)?-\d(\.\d)?|CC BY-SA|CC BY|Attribution)", re.I)

def get(url, retries=10):
    for attempt in range(retries):
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < retries - 1:
                wait = 90 if attempt < 3 else 180
                print('  429, waiting', wait, 's', flush=True); time.sleep(wait); continue
            raise
        except Exception:
            if attempt < retries - 1: time.sleep(5); continue
            raise

def strip_html(s): return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()

def meta(title):
    name = title.replace("File:", "").replace(" ", "_")
    xml = get("https://magnus-toolserver.toolforge.org/commonsapi.php?" + urllib.parse.urlencode({"image": name, "thumbwidth": 1280}))
    root = ET.fromstring(xml)
    f = root.find("file")
    if f is None: return None
    def t(path):
        el = f.find(path); return (el.text or "").strip() if el is not None else ""
    lic = root.find("licenses/license/full_name"); lic_name = root.find("licenses/license/name")
    short = t("license_shortname") or (lic.text if lic is not None else "")
    return {"title": "File:" + name.replace("_", " "), "name": name, "width": int(t("width") or 0), "height": int(t("height") or 0),
            "mime": t("mime") or ("image/jpeg" if name.lower().endswith((".jpg", ".jpeg")) else "image/png" if name.lower().endswith(".png") else ""),
            "licence": short, "licence_code": lic_name.text if lic_name is not None else "",
            "author": strip_html(t("author"))[:160], "source": strip_html(t("source"))[:160],
            "description": strip_html(t("description"))[:300] or strip_html((root.findtext("description/language") or ""))[:300],
            "source_url": t("urls/description") or f"https://commons.wikimedia.org/wiki/File:{name}"}

def acceptable(m, entry, strict_orient=True):
    if not m or not m["licence"] or not OK_LICENCE.match(m["licence"]): return False
    if m["name"].lower().endswith((".svg", ".gif", ".tif", ".tiff", ".pdf", ".webm")): return False
    w, h = m["width"], m["height"]
    if w < entry.get("min_width", 1000): return False
    o = entry.get("orient", "any")
    if strict_orient and o == "landscape" and w < h * 0.95: return False
    if strict_orient and o == "portrait" and h < w * 0.95: return False
    return True

def download(m, entry, root):
    out = root / entry["out"]; out.parent.mkdir(parents=True, exist_ok=True)
    raw = out.with_suffix(".download")
    w = entry.get("width", 1280)
    url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(m["name"]) + f"?width={w}"
    raw.write_bytes(get(url))
    subprocess.run(["convert", str(raw) + "[0]", "-auto-orient", "-strip", "-resize", f"{w}x{w}>", "-quality", str(entry.get("quality", 82)), str(out)], check=True)
    raw.unlink(); return out

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("manifest"); ap.add_argument("--credits", required=True); ap.add_argument("--root", default="."); ap.add_argument("--only", default=""); ap.add_argument("--force", action="store_true")
    a = ap.parse_args(); root = pathlib.Path(a.root).resolve(); manifest = json.load(open(a.manifest)); credits_path = root / a.credits
    credits = json.load(open(credits_path)) if credits_path.exists() else {}; only = set(filter(None, a.only.split(","))); failures = []
    for entry in manifest:
        if only and entry["id"] not in only: continue
        out = root / entry["out"]
        if out.exists() and entry["id"] in credits and not a.force: continue
        chosen = None
        try:
            metas = []
            for title in entry.get("titles", []):
                try: m = meta(title)
                except Exception as e: print("  meta fail", title, repr(e)[:80]); m = None
                metas.append(m); time.sleep(0.8)
                if acceptable(m, entry): chosen = m; break
            if not chosen:
                for m in metas:
                    if acceptable(m, entry, strict_orient=False): chosen = m; break
            if not chosen:
                failures.append((entry["id"], "no acceptable file among " + str(len(entry.get("titles", []))))); print("MISS", entry["id"], [ (m["name"], m["licence"], m["width"], m["height"]) if m else None for m in metas]); continue
            download(chosen, entry, root)
            credits[entry["id"]] = {"file": entry["out"].replace("docs/", "", 1), "caption": entry.get("caption", ""), "commons_title": chosen["title"], "source_url": chosen["source_url"],
                                    "licence": chosen["licence"], "licence_url": "", "author": chosen["author"] or chosen["source"], "description": chosen["description"], "original_width": chosen["width"], "original_height": chosen["height"]}
            credits_path.write_text(json.dumps(credits, indent=1, ensure_ascii=False))
            print("OK  ", entry["id"], "<-", chosen["name"], "|", chosen["licence"], f"{chosen['width']}x{chosen['height']}", flush=True)
        except Exception as e:
            failures.append((entry["id"], repr(e)[:160])); print("FAIL", entry["id"], repr(e)[:160], flush=True)
        time.sleep(8)
    if failures:
        print("\nFailures:", len(failures)); [print(" ", *f) for f in failures]
    return 1 if failures else 0

if __name__ == "__main__": sys.exit(main())
