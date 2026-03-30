"""
Watermark all coloring page images with a clean, print-friendly bottom banner.
Black and white only — no colors, no icons, just clean text.

Usage:
  python3 scripts/watermark.py                   # process all images
  python3 scripts/watermark.py skull-crusher      # process one image
"""

import sys
import os
import glob
from PIL import Image, ImageDraw, ImageFont

IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "coloring-pages")

SITE_URL = "FreeMonsterTruckColoringPages.com"
TAGLINE = "New Pages Uploaded Daily"

BANNER_HEIGHT = 56
TEXT_COLOR = (60, 60, 60)
LINE_COLOR = (180, 180, 180)
DIVIDER_COLOR = (140, 140, 140)


def get_font(size, bold=False):
    """Try to load a clean font, fall back to default."""
    if bold:
        font_paths = [
            "/System/Library/Fonts/Helvetica.ttc",
            "/Library/Fonts/Arial Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        ]
    else:
        font_paths = [
            "/System/Library/Fonts/Helvetica.ttc",
            "/Library/Fonts/Arial.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                continue
    return ImageFont.load_default()


def add_watermark(image_path):
    """Add clean black-and-white bottom banner."""
    img = Image.open(image_path).convert("RGB")
    orig_width, orig_height = img.size

    new_height = orig_height + BANNER_HEIGHT
    canvas = Image.new("RGB", (orig_width, new_height), (255, 255, 255))
    canvas.paste(img, (0, 0))

    draw = ImageDraw.Draw(canvas)
    banner_top = orig_height

    # Thin horizontal line separating image from banner
    draw.line([(30, banner_top + 8), (orig_width - 30, banner_top + 8)], fill=LINE_COLOR, width=1)

    url_font = get_font(20, bold=True)
    tagline_font = get_font(14)

    # Measure text to center everything
    url_bbox = draw.textbbox((0, 0), SITE_URL, font=url_font)
    url_w = url_bbox[2] - url_bbox[0]

    tagline_bbox = draw.textbbox((0, 0), TAGLINE, font=tagline_font)
    tagline_w = tagline_bbox[2] - tagline_bbox[0]

    # Layout: URL centered, then a dot separator, then tagline — all on one line
    separator = "  \u2022  "
    sep_bbox = draw.textbbox((0, 0), separator, font=tagline_font)
    sep_w = sep_bbox[2] - sep_bbox[0]

    total_w = url_w + sep_w + tagline_w
    start_x = (orig_width - total_w) // 2
    text_y = banner_top + 20

    # Draw URL
    draw.text((start_x, text_y), SITE_URL, fill=TEXT_COLOR, font=url_font)

    # Draw separator dot
    draw.text((start_x + url_w, text_y + 3), separator, fill=DIVIDER_COLOR, font=tagline_font)

    # Draw tagline
    draw.text((start_x + url_w + sep_w, text_y + 3), TAGLINE, fill=DIVIDER_COLOR, font=tagline_font)

    canvas.save(image_path, "PNG", optimize=True)
    return orig_width, new_height


def main():
    specific = sys.argv[1] if len(sys.argv) > 1 else None

    if specific:
        patterns = [
            os.path.join(IMAGES_DIR, f"{specific}.png"),
            os.path.join(IMAGES_DIR, f"{specific}-thumb.png"),
        ]
    else:
        patterns = [os.path.join(IMAGES_DIR, "*.png")]

    files = []
    for p in patterns:
        files.extend(glob.glob(p))

    if not files:
        print("No images found matching pattern")
        return

    for f in sorted(files):
        name = os.path.basename(f)
        w, h = add_watermark(f)
        print(f"  Watermarked: {name} ({w}x{h})")

    print(f"\nDone! {len(files)} image(s) watermarked.")


if __name__ == "__main__":
    main()
