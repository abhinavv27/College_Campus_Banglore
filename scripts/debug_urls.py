"""Try different approaches to download from WM Commons."""
import requests, os, time, hashlib, urllib.request
from PIL import Image
from io import BytesIO

url = "https://upload.wikimedia.org/wikipedia/commons/3/33/RV_College_Campus.JPG"

print(f"URL: {url}")

# Approach 1: Python requests with browser UA
print("\n1. Python requests (browser UA):")
s = requests.Session()
s.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
r = s.get(url, timeout=15)
print(f"   Status: {r.status_code}")
if r.status_code != 200:
    print(f"   Body: {r.text[:200]}")

# Approach 2: urllib
print("\n2. urllib.request:")
time.sleep(10)
try:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=15)
    print(f"   Status: {resp.status}")
except Exception as e:
    print(f"   Error: {type(e).__name__}")

# Approach 3: curl.exe
print("\n3. curl.exe:")
import subprocess
time.sleep(10)
result = subprocess.run(["curl.exe", "-s", "-o", "nul", "-w", "%{http_code}", url], capture_output=True, text=True, timeout=15)
print(f"   Status: {result.stdout}")

# Approach 4: Via Special:FilePath
print("\n4. Special:FilePath redirect:")
time.sleep(10)
r2 = s.get("https://commons.wikimedia.org/wiki/Special:FilePath/RV_College_Campus.JPG", timeout=15, allow_redirects=True)
print(f"   Status: {r2.status_code}")
if r2.status_code == 200:
    print(f"   Final URL: {r2.url[:100]}")
    img = Image.open(BytesIO(r2.content))
    print(f"   Image: {img.size}")
