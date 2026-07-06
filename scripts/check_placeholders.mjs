import fs from 'fs';
const c = fs.readFileSync('src/data/colleges.js', 'utf-8');
const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('placeholder.svg') && line.includes('photo:')) {
    console.log(`Line ${i+1}: photo still has placeholder`);
  }
}
