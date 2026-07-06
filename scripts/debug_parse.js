const fs = require('fs');
const collegesJs = fs.readFileSync('src/data/colleges.js', 'utf-8');
const lines = collegesJs.split('\n');

const entries = [];
let current = {};

for (const line of lines) {
  const idMatch = line.match(/^\s*id:\s*['"]([^'"]+)['"],?$/);
  const nameMatch = line.match(/^\s*name:\s*['"]([^'"]+)['"],?$/);
  const photoMatch = line.match(/^\s*photo:\s*['"]([^'"]+)['"],?$/);
  
  if (idMatch) current.id = idMatch[1];
  if (nameMatch) current.name = nameMatch[1];
  if (photoMatch) current.photo = photoMatch[1];
  
  const trimmed = line.trim();
  if (trimmed === '},' || trimmed === '}' || trimmed === '];') {
    if (current.id && current.name && current.photo) {
      entries.push(current);
    }
    current = {};
  }
}

console.log('Found ' + entries.length + ' entries');
console.log('Placeholders: ' + entries.filter(e => e.photo.includes('placeholder')).length);

// Check St. Joseph's entries
entries.filter(e => e.id.includes('sju')).forEach(e => console.log(JSON.stringify(e)));
