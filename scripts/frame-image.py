"""
Frame a coloring page image with a decorative border + watermark.
Guarantees the artwork is fully contained — nothing gets cut off.

Process:
1. Shrink artwork to fit inside frame with padding
2. Draw a rounded rectangle border around it
3. Add watermark text below the frame

Usage:
  python3 scripts/frame-image.py image.png
  python3 scripts/frame-image.py skull-crusher    (looks in coloring-pages dir)
"""
import sys
import os
import glob
from PIL import Image, ImageDraw, ImageFont

IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "coloring-pages")

# Output dimensions (US Letter portrait at 150 DPI)
CANVAS_WIDTH = 1200
CANVAS_HEIGHT = 1575

# Frame settings
FRAME_MARGIN = 40          # Space from canvas edge to frame border
FRAME_CORNER_RADIUS = 20   # Rounded corner radius
FRAME_LINE_WIDTH = 4       # Border line thickness
FRAME_COLOR = (50, 50, 50) # Dark gray border

# Artwork padding inside the frame
ART_PADDING = 30           # Space between frame border and artwork

# Watermark below frame
WATERMARK_SITE = "FreeMonsterTruckColoringPages.com"
WATERMARK_TAGLINE = "New Pages Uploaded Daily"
WATERMARK_HEIGHT = 50      # Space reserved below frame for watermark
WATERMARK_COLOR = (100, 100, 100)
WATERMARK_LIGHT = (160, 160, 160)


def get_font(size):
    font_paths = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                continue
    return ImageFont.load_default()


def rounded_rectangle(draw, xy, radius, outline, width):
    """Draw a rounded rectangle."""
    x0, y0, x1, y1 = xy
    r = radius

    # Four straight edges
    draw.line([(x0 + r, y0), (x1 - r, y0)], fill=outline, width=width)  # top
    draw.line([(x0 + r, y1), (x1 - r, y1)], fill=outline, width=width)  # bottom
    draw.line([(x0, y0 + r), (x0, y1 - r)], fill=outline, width=width)  # left
    draw.line([(x1, y0 + r), (x1, y1 - r)], fill=outline, width=width)  # right

    # Four corners
    draw.arc([(x0, y0), (x0 + 2*r, y0 + 2*r)], 180, 270, fill=outline, width=width)
    draw.arc([(x1 - 2*r, y0), (x1, y0 + 2*r)], 270, 360, fill=outline, width=width)
    draw.arc([(x0, y1 - 2*r), (x0 + 2*r, y1)], 90, 180, fill=outline, width=width)
    draw.arc([(x1 - 2*r, y1 - 2*r), (x1, y1)], 0, 90, fill=outline, width=width)


def frame_image(img_path):
    """Frame artwork with border and watermark."""
    artwork = Image.open(img_path).convert("RGB")

    # Calculate frame interior dimensions
    frame_x0 = FRAME_MARGIN
    frame_y0 = FRAME_MARGIN
    frame_x1 = CANVAS_WIDTH - FRAME_MARGIN
    frame_y1 = CANVAS_HEIGHT - FRAME_MARGIN - WATERMARK_HEIGHT

    interior_w = frame_x1 - frame_x0 - (ART_PADDING * 2) - FRAME_LINE_WIDTH
    interior_h = frame_y1 - frame_y0 - (ART_PADDING * 2) - FRAME_LINE_WIDTH

    # Shrink artwork to fit inside frame interior
    art_w, art_h = artwork.size
    scale = min(interior_w / art_w, interior_h / art_h)
    new_w = int(art_w * scale)
    new_h = int(art_h * scale)
    artwork = artwork.resize((new_w, new_h), Image.LANCZOS)

    # Create white canvas
    canvas = Image.new("RGB", (CANVAS_WIDTH, CANVAS_HEIGHT), (255, 255, 255))

    # Center artwork inside frame
    art_x = frame_x0 + ART_PADDING + FRAME_LINE_WIDTH // 2 + (interior_w - new_w) // 2
    art_y = frame_y0 + ART_PADDING + FRAME_LINE_WIDTH // 2 + (interior_h - new_h) // 2
    canvas.paste(artwork, (art_x, art_y))

    # Draw frame border
    draw = ImageDraw.Draw(canvas)
    rounded_rectangle(
        draw,
        (frame_x0, frame_y0, frame_x1, frame_y1),
        radius=FRAME_CORNER_RADIUS,
        outline=FRAME_COLOR,
        width=FRAME_LINE_WIDTH,
    )

    # Draw watermark below frame
    url_font = get_font(18)
    tagline_font = get_font(13)

    url_bbox = draw.textbbox((0, 0), WATERMARK_SITE, font=url_font)
    url_w = url_bbox[2] - url_bbox[0]

    sep = "  \u2022  "
    sep_bbox = draw.textbbox((0, 0), sep, font=tagline_font)
    sep_w = sep_bbox[2] - sep_bbox[0]

    tag_bbox = draw.textbbox((0, 0), WATERMARK_TAGLINE, font=tagline_font)
    tag_w = tag_bbox[2] - tag_bbox[0]

    total_w = url_w + sep_w + tag_w
    start_x = (CANVAS_WIDTH - total_w) // 2
    text_y = frame_y1 + (WATERMARK_HEIGHT - 18) // 2

    draw.text((start_x, text_y), WATERMARK_SITE, fill=WATERMARK_COLOR, font=url_font)
    draw.text((start_x + url_w, text_y + 2), sep, fill=WATERMARK_LIGHT, font=tagline_font)
    draw.text((start_x + url_w + sep_w, text_y + 2), WATERMARK_TAGLINE, fill=WATERMARK_LIGHT, font=tagline_font)

    canvas.save(img_path, "PNG", optimize=True)
    return CANVAS_WIDTH, CANVAS_HEIGHT


def main():
    specific = sys.argv[1] if len(sys.argv) > 1 else None

    if specific:
        # Check if it's a full path or just a name
        if os.path.exists(specific):
            files = [specific]
        else:
            files = sorted(glob.glob(os.path.join(IMAGES_DIR, f"{specific}*.png")))
    else:
        files = sorted(glob.glob(os.path.join(IMAGES_DIR, "*.png")))

    if not files:
        print("No images found")
        return

    for f in files:
        name = os.path.basename(f)
        w, h = frame_image(f)
        print(f"  Framed: {name} ({w}x{h})")

    print(f"\nDone! {len(files)} image(s) framed.")


if __name__ == "__main__":
    main()
