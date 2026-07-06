import fs from 'fs';
const collegesJs = fs.readFileSync('src/data/colleges.js', 'utf-8');
const lines = collegesJs.split('\n');

let idCount = 0;
let nameCount = 0;
let photoCount = 0;
let closeCount = 0;
let entries = [];

let current = {};
for (const line of lines) {
  const idMatch = line.match(/^\s*id:\s*['"]([^'"]+)['"],?$/);
  const nameMatch = line.match(/^\s*name:\s*(['"])(.*?)\1,?\s*$/);
  const photoMatch = line.match(/^\s*photo:\s*['"]([^'"]+)['"],?$/);
  
  if (idMatch) { current.id = idMatch[1]; idCount++; }
  if (nameMatch) { current.name = nameMatch[2]; nameCount++; }
  if (photoMatch) { current.photo = photoMatch[1]; photoCount++; }
  
  const trimmed = line.trim();
  if (trimmed === '},' || trimmed === '}' || trimmed === '];') {
    closeCount++;
    if (current.id && current.name && current.photo) {
      entries.push(current);
    }
    current = {};
  }
}

console.log(`IDs: ${idCount}, Names: ${nameCount}, Photos: ${photoCount}, Closes: ${closeCount}, Entries: ${entries.length}`);

if (entries.length === 0) {
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('id:')) console.log('  LINE: ' + trimmed.substring(0, 60));
  }
}
