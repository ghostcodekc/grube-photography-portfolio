const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

// Ensure the output directory exists
if (!fs.existsSync('dist')) {
  try {
    fs.mkdirSync('dist');
    console.log('Created dist directory.');
  } catch (err) {
    console.error('Error creating dist directory:', err);
    process.exit(1); // Exit the process with an error code
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

// Render each page
pages.forEach(page => {
  const templatePath = path.join(__dirname, 'views', page.template);
  const outputPath = path.join(__dirname, page.output);

  ejs.renderFile(templatePath, { basePath: '' }, (err, str) => { // Set basePath to empty string for static site
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
