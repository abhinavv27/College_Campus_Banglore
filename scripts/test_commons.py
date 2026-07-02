"""Test downloading a single Commons image with different approaches."""
import requests, os, time
from PIL import Image
from io import BytesIO

s = requests.Session()
s.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})

# First get the URL via API
api = "https://commons.wikimedia.org/w/api.php"
params = {
    "action": "query", "titles": "File:Jain-University-Bangalore.jpg",
    "prop": "imageinfo", "iiprop": "url", "format": "json"
}
r = s.get(api, params=params, timeout=20)
data = r.json()
for p in data["query"]["pages"].values():
    url = p["imageinfo"][0]["url"]
    print(f"URL: {url}")

# Try downloading with different approaches
print("\n--- Approach 1: Direct with browser UA ---")
time.sleep(5)
r = s.get(url, timeout=30)
print(f"  Status: {r.status_code}")
if r.status_code == 200:
    img = Image.open(BytesIO(r.content))
    print(f"  Size: {img.size}")
else:
    print(f"  Headers: {dict(r.headers)}")
    print(f"  Body: {r.text[:200]}")

print("\n--- Approach 2: With referrer ---")
time.sleep(5)
s2 = requests.Session()
s2.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://commons.wikimedia.org/"
})
r2 = s2.get(url, timeout=30)
print(f"  Status: {r2.status_code}")
if r2.status_code == 200:
    img = Image.open(BytesIO(r2.content))
    print(f"  Size: {img.size}")
else:
    print(f"  Response: {r2.text[:200]}")

print("\n--- Approach 3: Using /w/load.php?file=  ---")
time.sleep(5)
file_url = "https://commons.wikimedia.org/w/load.php?modules=filepage&file=Jain-University-Bangalore.jpg"
r3 = s2.get(file_url, timeout=30)
print(f"  Status: {r3.status_code}")

print("\n--- Approach 4: Using thumbs endpoint ---")
time.sleep(5)
thumb_url = f"https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Jain-University-Bangalore.jpg/800px-Jain-University-Bangalore.jpg"
r4 = s2.get(thumb_url, timeout=30)
print(f"  Status: {r4.status_code}")
if r4.status_code == 200:
    img = Image.open(BytesIO(r4.content))
    print(f"  Size: {img.size}")
else:
    print(f"  Response: {r4.text[:300]}")
