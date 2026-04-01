"""
Pixel-level edge cutoff detector for coloring page artwork.

If dark content is found at ANY edge, the artwork is INCOMPLETE —
the AI drew something that extends beyond the canvas. This image
must be REGENERATED, not shrunk.

Exit code 0 = PASS (artwork fully contained with margins)
Exit code 1 = FAIL (artwork is cut off — MUST regenerate)

Usage: python3 scripts/edge-check.py image.png
"""
import sys
from PIL import Image

MARGIN_PERCENT = 8   # Check outer 8% border strip on each side
DARK_THRESHOLD = 128
MAX_DARK_RATIO = 0.01  # 1% tolerance — very strict


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


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 edge-check.py <image.png>")
        sys.exit(2)

    failures = check_edges(sys.argv[1])

    if not failures:
        print("PASS")
        sys.exit(0)

    for name, ratio in failures:
        print(f"FAIL:{name}:{ratio*100:.1f}%")
    sys.exit(1)
