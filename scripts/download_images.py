"""Download college images from existing data URLs and store locally as WebP."""
import requests, os, time
from PIL import Image
from io import BytesIO

D = "public/images/colleges"
os.makedirs(D, exist_ok=True)
s = requests.Session()
s.headers.update({"User-Agent": "CollegeCompass/1.0"})

# Exact gallery URLs from the current data file
galleries = {
    "rvce": [
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1592289659353-8d0705307b22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    "pesu": [
        "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1606761568499-6d2451b08c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    "msrit": [
        "https://images.unsplash.com/photo-1525926477800-7a3b10316ac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    "bmsce": ["https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "dsce": ["https://images.unsplash.com/photo-1621287955502-18ee911fb6b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "nmit": ["https://images.unsplash.com/photo-1592289659353-8d0705307b22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "christ-bba": ["https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "jain-bba": ["https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "mcc-bba": ["https://images.unsplash.com/photo-1525926477800-7a3b10316ac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "sju-bba": ["https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "kjc-bba": ["https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "christ-bcom": ["https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "sju-bcom": ["https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "mcc-bcom": ["https://images.unsplash.com/photo-1525926477800-7a3b10316ac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "jain-bcom": ["https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    "kjc-bcom": ["https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
}

def dl(url, path, max_w=1200):
    try:
        r = s.get(url, timeout=30)
        r.raise_for_status()
        img = Image.open(BytesIO(r.content))
        if img.mode == 'P':
            img = img.convert('RGBA' if img.info.get('transparency') else 'RGB')
        elif img.mode not in ('RGB', 'RGBA'):
            img = img.convert('RGB')
        w, h = img.size
        if w > max_w:
            ratio = max_w / w
            img = img.resize((max_w, int(h * ratio)), Image.LANCZOS)
        kw = {"quality": 85}
        if img.mode == 'RGBA':
            kw["lossless"] = True
        img.save(path, 'WEBP', **kw)
        kb = os.path.getsize(path) / 1024
        print(f"  OK {os.path.basename(path)} ({kb:.0f}KB {img.size[0]}x{img.size[1]})")
        return True
    except Exception as e:
        print(f"  FAIL {type(e).__name__}: {str(e)[:60]}")
        return False

def placeholder(cid, label):
    colors = ["#2563EB","#059669","#DC2626","#D97706","#7C3AED"]
    c = colors[hash(cid) % len(colors)]
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
<rect width="400" height="300" fill="{c}"/>
<rect x="100" y="60" width="200" height="140" rx="8" fill="rgba(255,255,255,0.15)"/>
<rect x="130" y="90" width="140" height="10" rx="4" fill="rgba(255,255,255,0.35)"/>
<rect x="150" y="115" width="100" height="10" rx="4" fill="rgba(255,255,255,0.25)"/>
<rect x="140" y="140" width="120" height="10" rx="4" fill="rgba(255,255,255,0.25)"/>
<rect x="160" y="165" width="80" height="10" rx="4" fill="rgba(255,255,255,0.25)"/>
<rect x="100" y="220" width="200" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
<text x="200" y="250" text-anchor="middle" fill="white" font-size="14" font-family="sans-serif" font-weight="bold">{label}</text>
<text x="200" y="270" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="11" font-family="sans-serif">placeholder</text>
</svg>'''
    with open(os.path.join(D, cid, f"{cid}.svg"), "w") as f:
        f.write(svg)
    print(f"  SVG {cid}.svg")

# Also try to get Commons campus photos (CC-licensed) via Special:FilePath redirect
commons = {
    "rvce": "RV College of Engineering campus",
    "pesu": "PES University campus",
    "msrit": "MSRIT Apex Block.jpg",
    "bmsce": "B.M. Sreenivasaiah College of Engineering campus",
    "dsce": "Dayananda Sagar College of Engineering campus",
    "christ-bba": "Christ University buildings",
    "jain-bba": "Jain-University-Bangalore.jpg",
    "mcc-bba": "Mount Carmel College rosewater.jpg",
}

# Step 1: Download gallery images
for cid, urls in galleries.items():
    print(f"\n[{cid}] gallery")
    d = os.path.join(D, cid)
    os.makedirs(d, exist_ok=True)
    for i, url in enumerate(urls):
        dl(url, os.path.join(d, f"gallery_{i}.webp"))
        time.sleep(1)

# Step 2: Try Commons campus photos via Special:FilePath
for cid, filename in commons.items():
    print(f"\n[{cid}] Commons campus photo")
    d = os.path.join(D, cid)
    os.makedirs(d, exist_ok=True)
    # Try Special:FilePath redirect - this works without API
    try:
        r = s.get(f"https://commons.wikimedia.org/wiki/Special:FilePath/{filename}", timeout=15, allow_redirects=True)
        if r.status_code == 200 and r.url and 'static' not in r.url:
            dl(r.url, os.path.join(d, "campus.webp"))
        else:
            print(f"  Not found via redirect")
    except Exception as e:
        print(f"  Error: {e}")
    time.sleep(3)

# Step 3: Placeholder SVGs for colleges without gallery_0
for cid in galleries:
    d = os.path.join(D, cid)
    os.makedirs(d, exist_ok=True)
    g0 = os.path.join(d, "gallery_0.webp")
    if not os.path.exists(g0):
        placeholder(cid, cid.upper().replace("-BBA","").replace("-BCOM","").replace("-",""))

print("\n=== DONE ===")
