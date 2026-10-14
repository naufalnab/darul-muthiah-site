import os
import json
from PIL import Image

baseline_dir = "previews"
new_dir = "previews/new"

pages = ["index", "profil", "pengajian", "kemasukan", "galeri", "hubungi"]
views = ["Desktop_Full", "Mobile_Full"]

comparison_results = []

for page in pages:
    for view in views:
        filename = f"{page}_{view}.png"
        base_path = os.path.join(baseline_dir, filename)
        new_path = os.path.join(new_dir, filename)

        if not os.path.exists(base_path) or not os.path.exists(new_path):
            continue

        base_img = Image.open(base_path)
        new_img = Image.open(new_path)

        bw, bh = base_img.size
        nw, nh = new_img.size

        # Sample comparison at top 800px (hero fold)
        crop_h = min(800, bh, nh)
        base_fold = base_img.crop((0, 0, bw, crop_h)).convert("RGB")
        new_fold = new_img.crop((0, 0, nw, crop_h)).convert("RGB")

        # Compute simple pixel difference ratio in fold
        base_pixels = list(base_fold.getdata())
        new_pixels = list(new_fold.getdata())

        total_pixels = len(base_pixels)
        diff_count = 0
        for p1, p2 in zip(base_pixels, new_pixels):
            # Allow subtle anti-aliasing tolerance
            if abs(p1[0] - p2[0]) > 10 or abs(p1[1] - p2[1]) > 10 or abs(p1[2] - p2[2]) > 10:
                diff_count += 1

        fold_similarity = round((1 - (diff_count / total_pixels)) * 100, 2)

        result = {
            "page": page,
            "view": view,
            "baseline_dimensions": f"{bw}x{bh}",
            "new_dimensions": f"{nw}x{nh}",
            "width_match": bw == nw,
            "height_delta": nh - bh,
            "fold_similarity_pct": fold_similarity
        }
        comparison_results.append(result)

print(json.dumps(comparison_results, indent=2))
with open(os.path.join(baseline_dir, "visual_comparison.json"), "w") as f:
    json.dump(comparison_results, f, indent=2)
