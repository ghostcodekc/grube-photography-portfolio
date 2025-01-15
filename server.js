const express = require('express');
const path = require('path');
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to set basePath
app.use((req, res, next) => {
  res.locals.basePath = '/';
  next();
});

// Define routes
app.get('/', (req, res) => {
  res.render('pages/index', { basePath: res.locals.basePath });
});

app.get('/about', (req, res) => {
  res.render('pages/about', { basePath: res.locals.basePath });
});

app.get('/portraits', (req, res) => {
  res.render('pages/portraits', { basePath: res.locals.basePath });
});

app.get('/services', (req, res) => {
  res.render('pages/services', { basePath: res.locals.basePath });
});

// Serve static HTML files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle 404 for static HTML files
app.use((req, res, next) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'dist', '404.html'));
  } else {
    next();
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
