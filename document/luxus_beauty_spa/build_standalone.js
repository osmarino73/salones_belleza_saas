const fs = require('fs');
const path = require('path');

console.log('Building standalone HTML for Luxus Beauty Spa...');

let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');

// 1. Embed CSS directly inside <style>
html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`);

// 2. Convert all images in assets/images/ to Base64 data URIs
const imgDir = path.join(__dirname, 'assets', 'images');
if (fs.existsSync(imgDir)) {
  const files = fs.readdirSync(imgDir);
  for (let file of files) {
    const ext = path.extname(file).replace('.', '');
    const imgPath = path.join(imgDir, file);
    const base64 = fs.readFileSync(imgPath).toString('base64');
    const dataUri = `data:image/${ext};base64,${base64}`;
    const relativePath = `assets/images/${file}`;
    
    // Replace all occurrences of relative image path with dataUri
    html = html.split(relativePath).join(dataUri);
    console.log(`Embedded image in Base64: ${file}`);
  }
}

// Save back to index.html and create luxus_beauty_spa_standalone.html
fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
fs.writeFileSync(path.join(__dirname, 'luxus_beauty_spa_standalone.html'), html, 'utf8');

// Copy to root level as luxus_beauty_spa_standalone.html
fs.writeFileSync(path.join(__dirname, '..', 'luxus_beauty_spa_standalone.html'), html, 'utf8');

console.log('Successfully generated 100% standalone HTML for Luxus Beauty Spa!');
