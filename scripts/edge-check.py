"""
Pixel-level edge cutoff detector + auto-fix.
Checks outer border strips for dark content.
If --fix is passed, shrinks the image and adds white padding.

Usage:
  python3 scripts/edge-check.py image.png          # check only
  python3 scripts/edge-check.py image.png --fix     # check + auto-fix if failing
"""
import sys
from PIL import Image

MARGIN_PERCENT = 8   # Check outer 8% on each side
DARK_THRESHOLD = 128
MAX_DARK_RATIO = 0.02  # 2% tolerance


def check_edges(img_path):
    img = Image.open(img_path).convert("L")
    w, h = img.size
    scale = 300 / max(w, h)
    img = img.resize((int(w * scale), int(h * scale)))
    w, h = img.size

    mx = max(int(w * MARGIN_PERCENT / 100), 4)
    my = max(int(h * MARGIN_PERCENT / 100), 4)

    edges = {
        "top": [(x, y) for y in range(my) for x in range(w)],
        "bottom": [(x, y) for y in range(h - my, h) for x in range(w)],
        "left": [(x, y) for x in range(mx) for y in range(h)],
        "right": [(x, y) for x in range(w - mx, w) for y in range(h)],
    }

    failures = []
    for name, pixels in edges.items():
        dark = sum(1 for x, y in pixels if img.getpixel((x, y)) < DARK_THRESHOLD)
        ratio = dark / len(pixels) if pixels else 0
        if ratio > MAX_DARK_RATIO:
            failures.append((name, ratio))

    return failures


def fix_image(img_path):
    """Shrink image to 75% and center on white canvas — guarantees margins."""
    img = Image.open(img_path).convert("RGB")
    w, h = img.size

    new_w = int(w * 0.75)
    new_h = int(h * 0.75)
    shrunk = img.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGB", (w, h), (255, 255, 255))
    offset_x = (w - new_w) // 2
    offset_y = (h - new_h) // 2
    canvas.paste(shrunk, (offset_x, offset_y))
    canvas.save(img_path, "PNG")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 edge-check.py <image.png> [--fix]")
        sys.exit(2)

    img_path = sys.argv[1]
    do_fix = "--fix" in sys.argv

    failures = check_edges(img_path)

    if not failures:
        print("PASS")
        sys.exit(0)

    for name, ratio in failures:
        print(f"FAIL:{name}:{ratio*100:.1f}%")

    if do_fix:
        print("FIX:shrinking to 75% with white padding")
        fix_image(img_path)
        # Re-check after fix
        failures2 = check_edges(img_path)
        if not failures2:
            print("PASS_AFTER_FIX")
            sys.exit(0)
        else:
            for name, ratio in failures2:
                print(f"STILL_FAIL:{name}:{ratio*100:.1f}%")
            sys.exit(1)

    sys.exit(1)
