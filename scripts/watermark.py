"""
Watermark all coloring page images with a consistent branded frame.
Adds a bottom banner with site URL and tagline.

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
TAGLINE = "New Pages Uploaded Daily!"

# Banner styling
BANNER_HEIGHT = 70
BANNER_BG = (245, 245, 245)       # light gray background
URL_COLOR = (30, 30, 30)          # near-black for URL
TAGLINE_COLOR = (255, 107, 0)     # brand orange for tagline
BORDER_COLOR = (220, 220, 220)    # subtle border line
ACCENT_COLOR = (255, 107, 0)      # orange accent line at top of banner


def get_font(size):
    """Try to load a nice font, fall back to default."""
    font_paths = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNSText.ttf",
        "/System/Library/Fonts/SFCompact.ttf",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                continue
    return ImageFont.load_default()


def add_watermark(image_path):
    """Add branded bottom banner to a coloring page image."""
    img = Image.open(image_path).convert("RGBA")
    orig_width, orig_height = img.size

    # Create new canvas with banner space at bottom
    new_height = orig_height + BANNER_HEIGHT
    canvas = Image.new("RGBA", (orig_width, new_height), (255, 255, 255, 255))

    # Paste original image at top
    canvas.paste(img, (0, 0))

    draw = ImageDraw.Draw(canvas)

    # Banner background
    banner_top = orig_height
    draw.rectangle(
        [(0, banner_top), (orig_width, new_height)],
        fill=BANNER_BG + (255,),
    )

    # Orange accent line at top of banner
    draw.rectangle(
        [(0, banner_top), (orig_width, banner_top + 3)],
        fill=ACCENT_COLOR + (255,),
    )

    # Subtle border at very bottom
    draw.rectangle(
        [(0, new_height - 1), (orig_width, new_height)],
        fill=BORDER_COLOR + (255,),
    )

    # Small truck icon (drawn as simple shapes)
    icon_x = 20
    icon_y = banner_top + 20
    # Truck body
    draw.rectangle([(icon_x, icon_y), (icon_x + 28, icon_y + 14)], outline=TAGLINE_COLOR + (255,), width=2)
    # Cab
    draw.rectangle([(icon_x + 4, icon_y - 8), (icon_x + 18, icon_y + 2)], outline=TAGLINE_COLOR + (255,), width=2)
    # Wheels
    draw.ellipse([(icon_x + 2, icon_y + 12), (icon_x + 12, icon_y + 22)], outline=TAGLINE_COLOR + (255,), width=2)
    draw.ellipse([(icon_x + 16, icon_y + 12), (icon_x + 26, icon_y + 22)], outline=TAGLINE_COLOR + (255,), width=2)

    # URL text - bold and prominent
    url_font = get_font(22)
    tagline_font = get_font(15)

    url_bbox = draw.textbbox((0, 0), SITE_URL, font=url_font)
    url_width = url_bbox[2] - url_bbox[0]

    # Center the text block (icon + text)
    text_x = 60
    url_y = banner_top + 14
    tagline_y = banner_top + 42

    draw.text((text_x, url_y), SITE_URL, fill=URL_COLOR + (255,), font=url_font)
    draw.text((text_x, tagline_y), TAGLINE, fill=TAGLINE_COLOR + (255,), font=tagline_font)

    # Small stars/dots as decoration on the right side
    right_x = orig_width - 40
    for i, y_off in enumerate([18, 33, 48]):
        dot_y = banner_top + y_off
        size = 3 if i == 1 else 2
        draw.ellipse(
            [(right_x - size, dot_y - size), (right_x + size, dot_y + size)],
            fill=TAGLINE_COLOR + (255,),
        )

    # Convert back to RGB for PNG saving
    final = canvas.convert("RGB")
    final.save(image_path, "PNG", optimize=True)
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
        print(f"No images found matching pattern")
        return

    for f in sorted(files):
        name = os.path.basename(f)
        w, h = add_watermark(f)
        print(f"  Watermarked: {name} ({w}x{h})")

    print(f"\nDone! {len(files)} image(s) watermarked.")


if __name__ == "__main__":
    main()
