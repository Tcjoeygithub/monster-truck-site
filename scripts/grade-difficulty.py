"""
Objective difficulty grader for coloring pages.
Analyzes the actual image to determine difficulty based on measurable factors.

Scoring (each 0-10, weighted):
  - Line density: ratio of dark pixels to total pixels (more lines = harder)
  - Small region count: number of distinct enclosed white areas (more = harder)
  - Edge complexity: total perimeter of all outlines (more complex outlines = harder)

Final grade:
  easy   (ages 2-4): score 0-33  — few lines, big open areas, simple shapes
  medium (ages 4-6): score 34-60 — moderate detail, medium areas
  hard   (ages 6-8): score 61+   — many lines, small areas, complex shapes

Usage:
  python3 scripts/grade-difficulty.py image.png
  Returns JSON: {"grade": "easy|medium|hard", "score": 0-100, "details": {...}}
"""
import sys
import json
from PIL import Image, ImageFilter

ANALYSIS_SIZE = 400  # Downscale to this for fast analysis


def analyze(img_path):
    img = Image.open(img_path).convert("L")
    w, h = img.size

    # Downscale for consistent analysis regardless of original size
    scale = ANALYSIS_SIZE / max(w, h)
    img = img.resize((int(w * scale), int(h * scale)))
    w, h = img.size
    total_pixels = w * h

    # --- Metric 1: Line density (% of dark pixels) ---
    pixels = list(img.getdata())
    dark_count = sum(1 for p in pixels if p < 128)
    line_density = dark_count / total_pixels

    # --- Metric 2: Small region count ---
    # Threshold to binary
    binary = img.point(lambda p: 255 if p > 128 else 0)
    # Count distinct white regions using flood fill approach
    from collections import deque
    data = list(binary.getdata())
    visited = [False] * len(data)
    regions = []

    for i in range(len(data)):
        if data[i] == 255 and not visited[i]:
            # BFS flood fill
            queue = deque([i])
            visited[i] = True
            region_size = 0
            while queue:
                idx = queue.popleft()
                region_size += 1
                y, x = divmod(idx, w)
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h:
                        ni = ny * w + nx
                        if not visited[ni] and data[ni] == 255:
                            visited[ni] = True
                            queue.append(ni)
            # Only count regions that aren't the background (< 50% of image)
            if region_size < total_pixels * 0.5:
                regions.append(region_size)

    # Count small colorable regions (regions between 0.1% and 20% of image)
    min_region = total_pixels * 0.001
    max_region = total_pixels * 0.2
    colorable_regions = [r for r in regions if min_region < r < max_region]
    small_regions = [r for r in colorable_regions if r < total_pixels * 0.02]
    total_regions = len(colorable_regions)

    # --- Metric 3: Edge complexity (outline perimeter) ---
    edges = binary.filter(ImageFilter.FIND_EDGES)
    edge_pixels = list(edges.getdata())
    edge_count = sum(1 for p in edge_pixels if p > 128)
    edge_ratio = edge_count / total_pixels

    # --- Scoring ---
    # Line density: 5% = simple, 10% = moderate, 15%+ = complex
    density_score = min(100, (line_density / 0.18) * 100)

    # Regions: 5-10 = simple, 15-25 = moderate, 30+ = complex
    region_score = min(100, (total_regions / 45) * 100)

    # Small regions: more tiny areas = harder for small hands
    small_region_score = min(100, (len(small_regions) / 25) * 100)

    # Edge complexity: higher = more intricate outlines
    edge_score = min(100, (edge_ratio / 0.12) * 100)

    # Weighted final score
    final_score = (
        density_score * 0.25
        + region_score * 0.30
        + small_region_score * 0.25
        + edge_score * 0.20
    )

    # Grade
    if final_score <= 33:
        grade = "easy"
        age_range = "2-4"
    elif final_score <= 60:
        grade = "medium"
        age_range = "4-6"
    else:
        grade = "hard"
        age_range = "6-8"

    return {
        "grade": grade,
        "ageRange": age_range,
        "score": round(final_score, 1),
        "details": {
            "lineDensity": round(line_density * 100, 1),
            "lineDensityScore": round(density_score, 1),
            "totalRegions": total_regions,
            "regionScore": round(region_score, 1),
            "smallRegions": len(small_regions),
            "smallRegionScore": round(small_region_score, 1),
            "edgeComplexity": round(edge_ratio * 100, 1),
            "edgeScore": round(edge_score, 1),
        },
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 grade-difficulty.py <image.png>")
        sys.exit(2)

    result = analyze(sys.argv[1])
    print(json.dumps(result))
