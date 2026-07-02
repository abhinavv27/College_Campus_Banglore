"""Download Commons photos with verified URLs and delays to avoid rate limiting."""
import requests, os, time, hashlib
from PIL import Image
from io import BytesIO

D = "public/images/colleges"
os.makedirs(D, exist_ok=True)
s = requests.Session()
s.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})

def dl(url, path):
    try:
        r = s.get(url, timeout=30, stream=True)
        r.raise_for_status()
        img = Image.open(BytesIO(r.content))
        if img.mode == 'P':
            img = img.convert('RGBA' if img.info.get('transparency') else 'RGB')
        elif img.mode not in ('RGB', 'RGBA'):
            img = img.convert('RGB')
        w, h = img.size
        if w > 1200:
            ratio = 1200 / w
            img = img.resize((1200, int(h * ratio)), Image.LANCZOS)
        kw = {"quality": 85}
        if img.mode == 'RGBA':
            kw["lossless"] = True
        img.save(path, 'WEBP', **kw)
        kb = os.path.getsize(path) / 1024
        print(f"  OK ({kb:.0f}KB {img.size[0]}x{img.size[1]})")
        return True
    except Exception as e:
        print(f"  FAIL: {type(e).__name__}")
        return False

photos = [
    ("msrit", "https://upload.wikimedia.org/wikipedia/commons/4/4a/MSRIT_apex_block.jpg"),
    ("mcc-bba", "https://upload.wikimedia.org/wikipedia/commons/9/9a/Mount_Carmel_College_Bangalore_entrance_East_side_pictured_April_2024.jpg"),
    ("rvce", "https://upload.wikimedia.org/wikipedia/commons/3/33/RV_College_Campus.JPG"),
    ("bmsce", "https://upload.wikimedia.org/wikipedia/commons/7/7e/BMSCE_Campus.jpg"),
    ("dsce", "https://upload.wikimedia.org/wikipedia/commons/c/c8/Campus_View%2C_Dayananda_Sagar_College_of_Engineering%2C_Bangalore%2C_Karnataka%2C_India_%282012%29.jpg"),
    ("christ-bba", "https://upload.wikimedia.org/wikipedia/commons/d/db/Christ_University_buildings%2C_Bangalore_10.jpg"),
]

for cid, url in photos:
    print(f"\n[{cid}]")
    d = os.path.join(D, cid)
    os.makedirs(d, exist_ok=True)
    time.sleep(30)
    dl(url, os.path.join(d, "campus.webp"))
