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

// Ensure the thumbs directory exists
const thumbsDir = path.join(__dirname, 'public', 'assets', 'images', 'thumbs');
if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

// Define the pages to render
const pages = [
  { template: 'pages/index.ejs', output: 'dist/index.html' },
  { template: 'pages/about.ejs', output: 'dist/about.html' },
  { template: 'pages/portraits.ejs', output: 'dist/portraits.html' },
  { template: 'pages/services.ejs', output: 'dist/services.html' },
  { template: 'pages/404.ejs', output: 'dist/404.html' },
];

// Helper to generate thumbnails
async function generateThumbnails() {
  const fullDir = path.join(__dirname, 'public', 'assets', 'images', 'full');
  const files = fs.readdirSync(fullDir).filter(file => /\.(webp|jpg|jpeg|png)$/i.test(file));

  for (const file of files) {
    const fileName = path.parse(file).name;
    const ext = '.webp'; // Standardizing on webp for production
    const fullPath = path.join(fullDir, file);

    const sizes = [
      { name: '', width: 1600, height: 1200 }, // Standardized 4:3 thumb
      { name: '-medium', width: 1200, height: 900 },
      { name: '-small', width: 800, height: 600 }
    ];

    for (const size of sizes) {
      const formats = [
        { ext: '.avif', quality: 50 },
        { ext: '.webp', quality: 80 }
      ];

      for (const format of formats) {
        const outputName = `${fileName}${size.name}${format.ext}`;
        const outputPath = path.join(thumbsDir, outputName);

        // Forcing regeneration for the new aspect ratio
        console.log(`Generating 3:4 thumbnail: ${outputName}`);
        let pipeline = sharp(fullPath);
        
        // Resize and crop to 3:4 aspect ratio
        pipeline = pipeline.resize(size.width, size.height, {
          fit: 'cover',
          position: 'center' // Can be adjusted to 'entropy' or 'attention' for smarter cropping
        });
        
        if (format.ext === '.avif') {
          await pipeline.avif({ quality: format.quality, effort: 4 }).toFile(outputPath);
        } else {
          await pipeline.webp({ quality: format.quality }).toFile(outputPath);
        }
      }
    }
  }
}

// Main build process
async function build() {
  console.log('Starting image optimization...');
  await generateThumbnails();

  // Render each page
  pages.forEach(page => {
    const templatePath = path.join(__dirname, 'views', page.template);
    const outputPath = path.join(__dirname, page.output);

    ejs.renderFile(templatePath, { basePath: '' }, (err, str) => {
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