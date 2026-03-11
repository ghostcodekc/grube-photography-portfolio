# Grube Photography Portfolio

A modern, fast, and data-driven photography portfolio website.

## 🚀 Performance Features
- **AVIF & WebP Support**: Automatically serves the most efficient image format.
- **Responsive Images**: Picture tags with source sets for different screen sizes.
- **Lazy Loading**: Images load as they enter the viewport to save 3G bandwidth.
- **Zero-Dependency Lightbox**: Powered by PhotoSwipe v5 for a smooth, app-like experience.

## 📸 How to Add New Images

The gallery is data-driven and organized by category.

### 1. Upload the Full Image
- **General Gallery**: Place high-res images in `public/assets/images/full/general/`
- **Portraits Gallery**: Place high-res images in `public/assets/images/full/portraits/`

### 2. Update the Gallery Data
Open the corresponding JSON file in `src/data/`:
- `gallery.json` for general photos.
- `portraits.json` for portrait photos.

Add a new entry:
```json
{
  "id": "YOUR_FILENAME_WITHOUT_EXTENSION",
  "title": "Display Title - Location",
  "alt": "Accessibility Description",
  "width": 1234,  // Actual width of the full-res file
  "height": 5678, // Actual height of the full-res file
  "isHero": false // (Only in gallery.json) Set to true for the top home page image
}
```

### 3. Build and Deploy
- Run the build command to generate the static site:
  ```bash
  npm run build
  ```
- If you are running the development server (`npm start`), you must **restart the server** to see changes made to the JSON files.

### 4. Deploy
- Commit your changes and push to `main`. AWS Amplify will automatically detect the changes and deploy the site.

## 🛠 Tech Stack
- **Engine**: Node.js / Express / EJS
- **Styling**: Tailwind CSS
- **Images**: Sharp
- **Gallery**: PhotoSwipe v5
