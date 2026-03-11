# Grube Photography Portfolio

A modern, fast, and data-driven photography portfolio website.

## 🚀 Performance Features
- **AVIF & WebP Support**: Automatically serves the most efficient image format.
- **Responsive Images**: Picture tags with source sets for different screen sizes.
- **Lazy Loading**: Images load as they enter the viewport to save 3G bandwidth.
- **Zero-Dependency Lightbox**: Powered by PhotoSwipe v5 for a smooth, app-like experience.

## 📸 How to Add New Images

The gallery is data-driven, meaning you don't need to touch HTML to add new photos.

### 1. Upload the Full Image
- Place your high-resolution WebP (or JPG/PNG) image into:
  `public/assets/images/full/`

### 2. Update the Gallery Data
- Open `src/data/gallery.json`.
- Add a new entry for your photo:
```json
{
  "id": "YOUR_FILENAME_WITHOUT_EXTENSION",
  "title": "Display Title - Location",
  "alt": "Accessibility Description",
  "width": 1234,  // Actual width of the full-res file
  "height": 5678, // Actual height of the full-res file
  "categories": ["general", "portrait"], // Use "general" for home page, "portrait" for portraits page
  "isHero": false // Set to true if this should be the top featured image on the home page
}
```

### 3. Build the Site
- Run the build command:
  ```bash
  npm run build
  ```
- This will:
  - Scan your new image.
  - Generate optimized AVIF and WebP thumbnails (Small, Medium, and 4:3 cropped).
  - Render the updated HTML pages into the `dist/` folder.

### 4. Deploy
- Commit your changes and push to `main`. AWS Amplify will automatically detect the changes and deploy the site.

## 🛠 Tech Stack
- **Engine**: Node.js / Express / EJS
- **Styling**: Tailwind CSS
- **Images**: Sharp
- **Gallery**: PhotoSwipe v5
