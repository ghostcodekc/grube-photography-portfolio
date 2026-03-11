const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const thumbsBaseDir = path.join(__dirname, 'public', 'assets', 'images', 'thumbs');

// Cleanup existing thumbnails
if (fs.existsSync(thumbsBaseDir)) {
  console.log('Cleaning up old thumbnails...');
  fs.rmSync(thumbsBaseDir, { recursive: true, force: true });
}

// Ensure the thumbs directory exists with subfolders
['general', 'portraits'].forEach(sub => {
  const dir = path.join(thumbsBaseDir, sub);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

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

async function run() {
  console.log('Starting image optimization...');
  await generateThumbnailsForCategory('general');
  await generateThumbnailsForCategory('portraits');
  console.log('Thumbnail generation complete.');
}

run().catch(err => console.error('Generation failed:', err));
