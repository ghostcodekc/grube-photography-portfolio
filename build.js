const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const sharp = require('sharp');

// Ensure the output directory exists
if (!fs.existsSync('dist')) {
  try {
    fs.mkdirSync('dist');
    console.log('Created dist directory.');
  } catch (err) {
    console.error('Error creating dist directory:', err);
    process.exit(1);
  }
}

// Define the pages to render
const pages = [
  { template: 'pages/index.ejs', output: 'dist/index.html' },
  { template: 'pages/about.ejs', output: 'dist/about.html' },
  { template: 'pages/portraits.ejs', output: 'dist/portraits.html' },
  { template: 'pages/services.ejs', output: 'dist/services.html' },
  { template: 'pages/404.ejs', output: 'dist/404.html' },
];

// Helper to automatically find dimensions if missing
async function enrichData(data, category) {
  for (const img of data) {
    if (!img.width || !img.height) {
      const imgPath = path.join(__dirname, 'public', 'assets', 'images', 'full', category, `${img.id}.webp`);
      if (fs.existsSync(imgPath)) {
        const metadata = await sharp(imgPath).metadata();
        img.width = metadata.width;
        img.height = metadata.height;
        console.log(`Auto-detected dimensions for ${img.id}: ${img.width}x${img.height}`);
      }
    }
  }
  return data;
}

// Load data
let gallery = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'gallery.json'), 'utf8'));
let portraits = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'portraits.json'), 'utf8'));

// Main build process
async function build() {
  console.log('Enriching data with dimensions...');
  gallery = await enrichData(gallery, 'general');
  portraits = await enrichData(portraits, 'portraits');

  // Render each page
  pages.forEach(page => {
    const templatePath = path.join(__dirname, 'views', page.template);
    const outputPath = path.join(__dirname, page.output);

    ejs.renderFile(templatePath, { basePath: '', gallery, portraits }, (err, str) => {
      if (err) {
        console.error(`Error rendering ${templatePath}:`, err);
      } else {
        fs.writeFileSync(outputPath, str);
        console.log(`Rendered ${outputPath}`);
      }
    });
  });

  // Copy assets folder
  const srcAssets = path.join(__dirname, 'public', 'assets');
  const destAssets = path.join(__dirname, 'dist', 'assets');

  fse.copy(srcAssets, destAssets, err => {
    if (err) {
      console.error('Error copying assets folder:', err);
    } else {
      console.log('Assets folder copied successfully.');
    }
  });

  // Copy web manifest
  fs.copyFile("site.webmanifest", "dist/site.webmanifest", (err) => {
    if (err) {
      console.error('Error copying manifest: ', err);
    } else {
      console.log('Manifest file copied successfully.');
    }
  });
}

build().catch(err => console.error('Build failed:', err));
