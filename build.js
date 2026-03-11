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

// Ensure the thumbs directory exists with subfolders
const thumbsBaseDir = path.join(__dirname, 'public', 'assets', 'images', 'thumbs');
['general', 'portraits'].forEach(sub => {
  const dir = path.join(thumbsBaseDir, sub);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define the pages to render
const pages = [
  { template: 'pages/index.ejs', output: 'dist/index.html' },
  { template: 'pages/about.ejs', output: 'dist/about.html' },
  { template: 'pages/portraits.ejs', output: 'dist/portraits.html' },
  { template: 'pages/services.ejs', output: 'dist/services.html' },
  { template: 'pages/404.ejs', output: 'dist/404.html' },
];

// Helper to generate thumbnails for a specific category
async function generateThumbnailsForCategory(category) {
  const fullDir = path.join(__dirname, 'public', 'assets', 'images', 'full', category);
  const thumbsDir = path.join(thumbsBaseDir, category);
  
  if (!fs.existsSync(fullDir)) return;

  const files = fs.readdirSync(fullDir).filter(file => /\.(webp|jpg|jpeg|png)$/i.test(file));

  for (const file of files) {
    const fileName = path.parse(file).name;
    const fullPath = path.join(fullDir, file);

    const taskGroups = [
      {
        name: 'hero',
        crop: false,
        sizes: [
          { suffix: '', width: 2000 },
          { suffix: '-medium', width: 1200 },
          { suffix: '-small', width: 800 }
        ]
      },
      {
        name: 'thumb',
        crop: true,
        sizes: [
          { suffix: '-thumb', width: 1600, height: 1200 },
          { suffix: '-thumb-medium', width: 1200, height: 900 },
          { suffix: '-thumb-small', width: 800, height: 600 }
        ]
      }
    ];

    for (const group of taskGroups) {
      for (const size of group.sizes) {
        const formats = [
          { ext: '.avif', quality: 50 },
          { ext: '.webp', quality: 80 }
        ];

        for (const format of formats) {
          const outputName = `${fileName}${size.suffix}${format.ext}`;
          const outputPath = path.join(thumbsDir, outputName);

          if (!fs.existsSync(outputPath)) {
            console.log(`Generating ${category}/${group.name} (${format.ext}): ${outputName}`);
            let pipeline = sharp(fullPath);
            
            if (group.crop) {
              pipeline = pipeline.resize(size.width, size.height, {
                fit: 'cover',
                position: 'center'
              });
            } else {
              pipeline = pipeline.resize(size.width);
            }
            
            if (format.ext === '.avif') {
              await pipeline.avif({ quality: format.quality, effort: 4 }).toFile(outputPath);
            } else {
              await pipeline.webp({ quality: format.quality }).toFile(outputPath);
            }
          }
        }
      }
    }
  }
}

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
  console.log('Starting image optimization...');
  await generateThumbnailsForCategory('general');
  await generateThumbnailsForCategory('portraits');

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