import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'public', 'images', 'colleges');
const COLLEGES_JS = path.join(ROOT, 'src', 'data', 'colleges.js');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, {
      headers: { 'User-Agent': 'CollegeCompass-Bangalore/1.0 (image-fetcher)' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    const req = mod.get(url, {
      headers: { 'User-Agent': 'CollegeCompass-Bangalore/1.0 (image-downloader)' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const contentType = res.headers['content-type'] || '';
      if (contentType.startsWith('image/')) {
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      } else {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`Not an image: ${contentType}`));
      }
    });
    req.on('error', (e) => { file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); reject(e); });
  });
}

function getExt(url, contentType) {
  if (url.match(/\.png/i)) return 'png';
  if (url.match(/\.svg/i)) return 'svg';
  if (contentType?.includes('png')) return 'png';
  if (contentType?.includes('svg')) return 'svg';
  return 'jpg';
}

async function getWikiImage(searchTerm) {
  try {
    const searchResult = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&srlimit=1`
    );
    const searchData = JSON.parse(searchResult);
    const title = searchData.query?.search?.[0]?.title;
    if (!title) return null;

    const pageResult = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages|images&pithumbsize=400&format=json`
    );
    const pageData = JSON.parse(pageResult);
    const pages = pageData.query?.pages;
    if (!pages) return null;

    for (const pid of Object.keys(pages)) {
      // Check pageimage thumbnail - skip Wikimedia/Commons logos
      const thumb = pages[pid].thumbnail?.source;
      if (thumb && !/Commons|Wikipedia|Wikimedia/i.test(thumb)) {
        return { url: thumb, type: 'wiki' };
      }

      // Try to find logo or campus images from page images list
      const images = pages[pid].images || [];
      
      // Prefer campus/entrance/building photos, then logo SVGs/PNGs
      const campus = images.find(i => /campus|entrance|building|academic|front|view/i.test(i.title));
      const preferred = images.find(i => /logo/i.test(i.title) && !/Commons/i.test(i.title));
      const anyImg = images.find(i => !/Commons|Wikipedia/i.test(i.title));
      
      const target = campus || preferred || anyImg;
      if (target) {
        const imgResult = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(target.title)}&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json`
        );
        const imgData = JSON.parse(imgResult);
        for (const cpid of Object.keys(imgData.query?.pages || {})) {
          const url = imgData.query.pages[cpid].imageinfo?.[0]?.url;
          if (url && !url.includes('Commons-logo') && !url.includes('Wikipedia-logo')) {
            return { url, type: 'wiki' };
          }
        }
      }
    }

    return null;
  } catch (e) {
    return null;
  }
}

const searchOverrides = {
  'iimb': 'IIM Bangalore',
  'dms-iisc': 'Indian Institute of Science',
  'xime': 'Xavier Institute of Management and Entrepreneurship Bangalore',
  'alliance-mba': 'Alliance University Bangalore',
  'welingkar': 'Welingkar Institute of Management Bangalore',
  'ibs-bangalore': 'ICFAI Business School Bangalore',
  'nmims-bangalore': 'NMIMS Bangalore',
  'isbr': 'International School of Business and Research Bangalore',
  'ibmt': 'Institute of Business Management and Technology Bangalore',
  'iba': 'Indus Business Academy Bangalore',
  'rims': 'Ramaiah Institute of Management Bangalore',
  'msrim': 'M S Ramaiah Institute of Management',
  'isbm': 'Indian School of Business Management Bangalore',
  'dsbs': 'Dayananda Sagar Business School',
  'vift': 'Vogue Institute of Fashion Technology',
  'iipm': 'Indian Institute of Plantation Management Bangalore',
  'ibrr-ibs': 'Institute of Business Management and Research Bangalore',
  'vbs': 'Vanguard Business School Bangalore',
  'bims': 'Bangalore Institute of Management Studies',
  'acharya-school': 'Acharya School of Management',
  'aims-business': 'AIMS School of Business Bangalore',
  'siet-sim': 'SIET Institute of Management Bangalore',
  'symbiosis-siub': 'Symbiosis International University Bangalore',
  'reva-university': 'REVA University',
  'iiem': 'Indian Institute of Export Management',
  'tjims': 'T John Institute of Management',
  'acharya-aims': 'Acharya Institute of Management and Science',
  'nid-bangalore': 'National Institute of Design Bangalore',
  's-vyasa': 'S VYASA Bangalore',
  'isibc': 'Indian Statistical Institute Bangalore',
  'iiitb': 'International Institute of Information Technology Bangalore',
  'amrita-engineering': 'Amrita School of Engineering',
  'cambridge-institute': 'Cambridge Institute of Technology Bangalore',
  'iisc': 'Indian Institute of Science Bangalore',
  'amity-global-bschool': 'Amity Global Business School Bangalore',
  'indian-academy': 'Indian Academy Group of Institutions',
  'surana-college': 'Surana College Bangalore'
};

// Parse colleges.js by splitting into entry blocks
const collegesJs = fs.readFileSync(COLLEGES_JS, 'utf-8');
const entries = [];
const lines = collegesJs.split('\n');
let current = {};
for (const line of lines) {
  const idMatch = line.match(/^\s*id:\s*['"]([^'"]+)['"],?\s*$/);
  const nameMatch = line.match(/^\s*name:\s*(['"])(.*?)\1,?\s*$/);
  const photoMatch = line.match(/^\s*photo:\s*['"]([^'"]+)['"],?\s*$/);
  if (idMatch) current.id = idMatch[1];
  if (nameMatch) current.name = nameMatch[1];
  if (photoMatch) current.photo = photoMatch[1];
  if (line.trim() === '},' || line.trim() === '}' || line.trim() === '];') {
    if (current.id && current.name && current.photo) {
      entries.push({ id: current.id, name: current.name, photo: current.photo });
    }
    current = {};
  }
}

const placeholders = entries.filter(e => {
  // Check if the referenced image file actually exists on disk
  const imgPath = path.join(ROOT, 'public', e.photo);
  return !fs.existsSync(imgPath);
});
console.log(`Found ${entries.length} total entries, ${placeholders.length} need images`);

console.log(`Need images for ${placeholders.length} colleges`);

// Track replacements
const replacements = [];

async function main() {
  for (const entry of placeholders) {
    const searchTerm = searchOverrides[entry.id] || entry.name;
    const destDir = path.join(IMG_DIR, entry.id);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    process.stdout.write(`[${entry.id}] "${searchTerm}"... `);
    const result = await getWikiImage(searchTerm);

    if (result) {
      const ext = getExt(result.url);
      const destFile = path.join(destDir, `photo.${ext}`);
      try {
        await download(result.url, destFile);
        const newPath = `/images/colleges/${entry.id}/photo.${ext}`;
        replacements.push({ id: entry.id, old: entry.photo, new: newPath });
        console.log(`OK (${result.type})`);
      } catch (e) {
        console.log(`DOWNLOAD FAILED: ${e.message}`);
        const svgPath = createSvg(entry, destDir);
        replacements.push({ id: entry.id, old: entry.photo, new: svgPath });
      }
    } else {
      console.log('NO IMAGE FOUND - creating SVG');
      const svgPath = createSvg(entry, destDir);
      replacements.push({ id: entry.id, old: entry.photo, new: svgPath });
    }

    await new Promise(r => setTimeout(r, 600));
  }

  // Update colleges.js - replace only photo: lines with placeholder paths
  if (replacements.length > 0) {
    let updated = fs.readFileSync(COLLEGES_JS, 'utf-8');
    // Use a regex that specifically targets photo lines with placeholder paths
    for (const r of replacements) {
      const photoRegex = new RegExp(`(photo:\\s*)'${r.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, '');
      updated = updated.replace(photoRegex, `$1'${r.new}'`);
    }
    fs.writeFileSync(COLLEGES_JS, updated);
    console.log(`\nUpdated ${replacements.length} photo paths in colleges.js`);
  }

  console.log('\nDone!');
}

function createSvg(entry, destDir) {
  const initials = (entry.name || entry.id)
    .replace(/[–—\-–—].*$/, '').trim()
    .split(/[\s,]+/)
    .map(w => w[0])
    .filter(c => c && /[A-Za-z]/.test(c))
    .slice(0, 3)
    .join('')
    .toUpperCase();

  const hue = (entry.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 37) % 360;
  const displayName = (entry.name || '').substring(0, 50);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue}, 60%, 50%)"/>
      <stop offset="100%" style="stop-color:hsl(${hue}, 70%, 30%)"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" rx="12" fill="url(#bg)"/>
  <text x="200" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white">${initials}</text>
  <text x="200" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="rgba(255,255,255,0.85)">${displayName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
</svg>`;
  const filePath = path.join(destDir, 'photo.svg');
  fs.writeFileSync(filePath, svg);
  return `/images/colleges/${entry.id}/photo.svg`;
}

main();
