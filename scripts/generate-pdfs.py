#!/usr/bin/env python3
"""Convert each published coloring-page PNG into a print-ready PDF.

Reads src/data/coloring-pages.json, loads the full-res image at imagePath,
and writes public/pdfs/{slug}.pdf. US Letter portrait, fits the image with
a small margin. Skips slugs whose PDF already exists (pass --force to redo).
"""
import json
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "data" / "coloring-pages.json"
OUT_DIR = ROOT / "public" / "pdfs"

# US Letter at 150 DPI
PAGE_W, PAGE_H = 1275, 1650
MARGIN = 40


def build_pdf(src_png: Path, dest_pdf: Path):
    img = Image.open(src_png).convert("RGB")
    max_w = PAGE_W - 2 * MARGIN
    max_h = PAGE_H - 2 * MARGIN
    ratio = min(max_w / img.width, max_h / img.height)
    new_w = int(img.width * ratio)
    new_h = int(img.height * ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    canvas = Image.new("RGB", (PAGE_W, PAGE_H), "white")
    canvas.paste(img, ((PAGE_W - new_w) // 2, (PAGE_H - new_h) // 2))
    dest_pdf.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest_pdf, "PDF", resolution=150.0)


def main():
    force = "--force" in sys.argv
    pages = json.loads(DATA.read_text())
    made = skipped = missing = 0
    for p in pages:
        if p.get("status") != "published":
            continue
        slug = p["slug"]
        src = ROOT / "public" / p["imagePath"].lstrip("/")
        if not src.exists():
            print(f"[missing] {slug}: {src}")
            missing += 1
            continue
        dest = OUT_DIR / f"{slug}.pdf"
        if dest.exists() and not force:
            skipped += 1
            continue
        build_pdf(src, dest)
        print(f"[ok] {slug}")
        made += 1
    print(f"\nDone. made={made} skipped={skipped} missing={missing}")


if __name__ == "__main__":
    main()
