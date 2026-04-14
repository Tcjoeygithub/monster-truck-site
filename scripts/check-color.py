"""
Detect if an image has color (not black and white).
Coloring pages must be black and white line art only.

Exit code 0 = PASS (black and white)
Exit code 1 = FAIL (has color)

Usage: python3 scripts/check-color.py image.png
"""
import sys
from PIL import Image

COLOR_THRESHOLD = 25  # Max saturation for "grayscale" pixels
MAX_COLOR_RATIO = 0.003  # If more than 0.3% of pixels have color, it fails


def check_color(img_path):
    img = Image.open(img_path).convert("RGB")
    w, h = img.size

    # Downscale for speed
    scale = 300 / max(w, h)
    img = img.resize((int(w * scale), int(h * scale)))

    pixels = list(img.getdata())
    colored = 0

    for r, g, b in pixels:
        # Check saturation: if R, G, B values are far apart, it's colored
        max_c = max(r, g, b)
        min_c = min(r, g, b)
        saturation = max_c - min_c
        if saturation > COLOR_THRESHOLD:
            colored += 1

    ratio = colored / len(pixels)
    return ratio, ratio > MAX_COLOR_RATIO


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 check-color.py <image.png>")
        sys.exit(2)

    ratio, has_color = check_color(sys.argv[1])

    if has_color:
        print(f"FAIL:color:{ratio*100:.1f}% of pixels are colored")
        sys.exit(1)
    else:
        print(f"PASS:bw:{ratio*100:.1f}% colored (within tolerance)")
        sys.exit(0)
