"""Convert downloaded JPGs to WebP."""
import os
from PIL import Image

photos = [
    ("bmsce", "campus.jpg"),
    ("mcc-bba", "campus.jpg"),
    ("dsce", "campus.jpg"),
    ("christ-bba", "campus.jpg"),
]

for cid, fn in photos:
    path = os.path.join("public/images/colleges", cid, fn)
    if not os.path.exists(path):
        print(f"SKIP {cid}: {fn} not found")
        continue
    img = Image.open(path)
    if img.mode not in ('RGB',):
        img = img.convert('RGB')
    w, h = img.size
    if w > 1200:
        r = 1200 / w
        img = img.resize((1200, int(h * r)), Image.LANCZOS)
    out = os.path.join("public/images/colleges", cid, "campus.webp")
    img.save(out, 'WEBP', quality=85)
    kb = os.path.getsize(out) // 1024
    print(f"OK {cid}: {img.size[0]}x{img.size[1]} {kb}KB")
    os.remove(path)
