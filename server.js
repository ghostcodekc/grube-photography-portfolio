const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Load gallery data
const gallery = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'gallery.json'), 'utf8'));

// Serve static files with explicit MIME types if needed
express.static.mime.define({'image/avif': ['avif']});
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to set basePath
app.use((req, res, next) => {
  res.locals.basePath = '/';
  next();
});

// Define routes
app.get(['/', '/index.html'], (req, res) => {
  res.render('pages/index', { basePath: res.locals.basePath, gallery });
});

app.get(['/about', '/about.html'], (req, res) => {
  res.render('pages/about', { basePath: res.locals.basePath });
});

app.get(['/portraits', '/portraits.html'], (req, res) => {
  res.render('pages/portraits', { basePath: res.locals.basePath });
});

app.get(['/services', '/services.html'], (req, res) => {
  res.render('pages/services', { basePath: res.locals.basePath });
});

// Serve static HTML files
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.avif')) {
      res.setHeader('Content-Type', 'image/avif');
    }
  }
}));

// Handle 404 for dynamic rendering
app.use((req, res, next) => {
  res.status(404).render('pages/404', { basePath: res.locals.basePath });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
