#!/usr/bin/env python3
"""Fetch licence-checked imagery from Wikimedia Commons for the Leadership Focus site.

Reads a manifest (JSON array). Each entry:
  {"id": "alexander-hero", "out": "docs/images/heroes/alexander.jpg", "width": 1600,
   "title": "File:Exact name.jpg"            # exact Commons file, OR
   "search": "Alexander Mosaic Pompeii",     # Commons full-text search, first acceptable hit
   "wikidata": "Q8409",                      # use the entity's P18 image
   "orient": "landscape" | "portrait" | "any", "min_width": 1200,
   "caption": "..."}
Writes the resized JPEG with ImageMagick and appends a credit record to the credits file.
Accepts only Public domain / CC0 / PDM / CC BY / CC BY-SA licences. Standard library only.
Usage: python3 fetch-images.py <manifest.json> --credits <credits.json> [--root <repo-root>] [--only id,id]
"""
import json, re, sys, time, html, subprocess, urllib.request, urllib.parse, pathlib, argparse

UA = "LeadershipFocusSiteBot/0.2 (https://github.com/groot99-droid/Strategy-Planner)"
API = "https://commons.wikimedia.org/w/api.php"
OK_LICENCE = re.compile(r"^(Public domain|CC0|PDM|CC BY(-SA)? \d(\.\d)?|CC-BY(-SA)?-\d(\.\d)?|CC BY-SA|CC BY)", re.I)
BAD_MIME = ("image/svg+xml", "image/gif", "image/tiff", "application/pdf", "video/webm")

def get(url, params=None, retries=12):
    if params:
        url = url + "?" + urllib.parse.urlencode(params)
    for attempt in range(retries):
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < retries - 1:
                wait = 60 if attempt < 2 else 120
                print("  429, waiting", wait, "s", flush=True); time.sleep(wait); continue
            raise
        except Exception:
            if attempt < retries - 1:
                time.sleep(3); continue
            raise

def strip_html(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()

STD=[320,640,800,1024,1280,1920,2560]
def std_width(w):
    return min([x for x in STD if x>=w] or [2560])

def imageinfo(titles, width):
    width = std_width(width)
    data = json.loads(get(API, {"action": "query", "prop": "imageinfo", "iiprop": "extmetadata|url|size|mime",
                                "iiurlwidth": width, "titles": "|".join(titles), "format": "json"}))
    out = []
    for page in data.get("query", {}).get("pages", {}).values():
        ii = (page.get("imageinfo") or [None])[0]
        if not ii: continue
        meta = ii.get("extmetadata", {})
        out.append({
            "title": page["title"], "mime": ii.get("mime"), "width": ii.get("width"), "height": ii.get("height"),
            "url": ii.get("thumburl") or ii.get("url"), "orig": ii.get("url"),
            "licence": strip_html(meta.get("LicenseShortName", {}).get("value")),
            "licence_url": strip_html(meta.get("LicenseUrl", {}).get("value")),
            "author": strip_html(meta.get("Artist", {}).get("value"))[:160],
            "credit": strip_html(meta.get("Credit", {}).get("value"))[:160],
            "description": strip_html(meta.get("ImageDescription", {}).get("value"))[:300],
            "source_url": ii.get("descriptionurl"),
        })
    return out

def acceptable(info, entry):
    if not info["licence"] or not OK_LICENCE.match(info["licence"]): return False
    if info["mime"] in BAD_MIME: return False
    w, h = info.get("width") or 0, info.get("height") or 0
    if w < entry.get("min_width", 1000): return False
    orient = entry.get("orient", "any")
    if orient == "landscape" and w < h * 0.95: return False
    if orient == "portrait" and h < w * 0.95: return False
    return True

def wikidata_p18(qid):
    data = json.loads(get(f"https://www.wikidata.org/wiki/Special:EntityData/{qid}.json"))
    ent = data["entities"][qid]
    claims = ent.get("claims", {}).get("P18", [])
    return ["File:" + c["mainsnak"]["datavalue"]["value"] for c in claims if "datavalue" in c["mainsnak"]]

def search(term, limit=25):
    data = json.loads(get(API, {"action": "query", "list": "search", "srnamespace": 6, "srlimit": limit,
                                "srsearch": term + " filetype:bitmap", "format": "json"}))
    return [h["title"] for h in data.get("query", {}).get("search", [])]

def resolve(entry):
    width = entry.get("width", 1600)
    candidates = []
    if entry.get("title"): candidates = [entry["title"]]
    elif entry.get("wikidata"): candidates = wikidata_p18(entry["wikidata"])
    elif entry.get("search"): candidates = search(entry["search"])
    for i in range(0, len(candidates), 10):
        infos = imageinfo(candidates[i:i+10], width)
        by_title = {x["title"].replace("_", " "): x for x in infos}
        for t in candidates[i:i+10]:
            info = by_title.get(t.replace("_", " "))
            if info and acceptable(info, entry):
                return info
        time.sleep(0.6)
    return None

def download_and_resize(info, entry, root):
    out = root / entry["out"]
    out.parent.mkdir(parents=True, exist_ok=True)
    raw = out.with_suffix(".download")
    raw.write_bytes(get(info["url"]))
    w = entry.get("width", 1600)
    geometry = entry.get("geometry") or f"{w}x{w}>"
    cmd = ["convert", str(raw), "-auto-orient", "-strip", "-resize", geometry]
    if entry.get("crop"):  # e.g. "16:9" -> centre crop to that ratio before resize
        cmd = ["convert", str(raw), "-auto-orient", "-strip", "-gravity", entry.get("gravity", "center"),
               "-crop", entry["crop"].replace(":", ":") + "+0+0" if "x" in entry["crop"] else f"{entry['crop']}", "+repage",
               "-resize", geometry]
    cmd += ["-quality", str(entry.get("quality", 82)), str(out)]
    subprocess.run(cmd, check=True)
    raw.unlink()
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest"); ap.add_argument("--credits", required=True)
    ap.add_argument("--root", default="."); ap.add_argument("--only", default="")
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    root = pathlib.Path(a.root).resolve()
    manifest = json.load(open(a.manifest))
    credits_path = root / a.credits
    credits = json.load(open(credits_path)) if credits_path.exists() else {}
    only = set(filter(None, a.only.split(",")))
    failures = []
    for entry in manifest:
        if only and entry["id"] not in only: continue
        out = root / entry["out"]
        if out.exists() and entry["id"] in credits and not a.force:
            continue
        try:
            info = resolve(entry)
            if not info:
                failures.append((entry["id"], "no acceptable file")); print("MISS", entry["id"]); continue
            download_and_resize(info, entry, root)
            credits[entry["id"]] = {
                "file": entry["out"].replace("docs/", "", 1), "caption": entry.get("caption", ""),
                "commons_title": info["title"], "source_url": info["source_url"],
                "licence": info["licence"], "licence_url": info["licence_url"],
                "author": info["author"] or info["credit"], "description": info["description"],
                "original_width": info["width"], "original_height": info["height"],
            }
            print("OK  ", flush=True) if False else print("OK  ", entry["id"], "<-", info["title"], "|", info["licence"], f"{info['width']}x{info['height']}")
            credits_path.parent.mkdir(parents=True, exist_ok=True)
            credits_path.write_text(json.dumps(credits, indent=1, ensure_ascii=False))
        except Exception as e:
            failures.append((entry["id"], repr(e)[:200])); print("FAIL", entry["id"], repr(e)[:200])
        time.sleep(2.5)
    if failures:
        print("\nFailures:", len(failures))
        for f in failures: print(" ", *f)
    return 1 if failures else 0

if __name__ == "__main__":
    sys.exit(main())
