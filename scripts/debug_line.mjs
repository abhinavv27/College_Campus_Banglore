import fs from 'fs';
const collegesJs = fs.readFileSync('src/data/colleges.js', 'utf-8');
const lines = collegesJs.split('\n');

// Try each id-like line with different patterns
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('id:')) {
    // Test different regexes
    const r1 = line.match(/^\s*id:\s*['"]([^'"]+)['"],?$/);
    const r2 = line.match(/id:\s*['"]([^'"]+)['"]/);
    const r3 = line.match(/id:/);
    console.log(`LINE: "${line.replace(/\r/g, '\\r')}"`);
    console.log(`  r1=${!!r1} r2=${!!r2} r3=${!!r3} charCodes=${line.split('').map(c => c.charCodeAt(0)).slice(0, 10)}`);
    if (r1) break; // Only need first match to confirm
    break;
  }
}
