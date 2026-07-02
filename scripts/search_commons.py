"""Search Commons for college photos."""
import requests, time, json
s = requests.Session()
s.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
api = "https://commons.wikimedia.org/w/api.php"

searches = [
    "MSRIT Apex Block",
    "Mount Carmel College Bangalore",
    "RV College of Engineering campus",
    "PES University campus",
    "BMS College of Engineering Bangalore",
    "Dayananda Sagar College of Engineering campus",
    "Christ University Bangalore building",
    "RVCE campus",
    "DSCE campus",
]
for q in searches:
    print(f"\n--- {q} ---")
    r = s.get(api, params={"action":"query","list":"search","srsearch":q,"srnamespace":"6","srlimit":"5","format":"json"}, timeout=20)
    if r.status_code == 200:
        data = r.json()
        for item in data.get("query",{}).get("search",[]):
            print(f"  {item['title']}")
    else:
        print(f"  Status {r.status_code}")
    time.sleep(5)
