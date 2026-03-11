# Grube Photography Portfolio

A modern, fast, and data-driven photography portfolio website.

## 🚀 Performance Features
- **AVIF & WebP Support**: Automatically serves the most efficient image format.
- **Responsive Images**: Picture tags with source sets for different screen sizes.
- **Lazy Loading**: Images load as they enter the viewport to save 3G bandwidth.
- **Zero-Dependency Lightbox**: Powered by PhotoSwipe v5 for a smooth, app-like experience.

## 💻 Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Tailwind CSS Watcher
In a separate terminal, run this to compile styles as you edit:
```bash
npx tailwindcss -i ./src/input.css -o ./public/assets/css/output.css --watch
```

### 3. Build and Run
To generate the static files and start the development server:
```bash
npm run build && npm run start
```
The server will be running at `http://localhost:8080`.

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
  "isHero": false // (Only in gallery.json) Set to true for the top home page image
}
```
*Note: `width` and `height` are automatically detected during the build process and do not need to be manually added.*

### 3. Build
Run `npm run build` to generate optimized thumbnails and static HTML.

### 4. Deploy
Commit your changes and push to `main`. AWS Amplify will automatically detect the changes and deploy the site.

## 🛠 Tech Stack
- **Engine**: Node.js / Express / EJS
- **Styling**: Tailwind CSS
- **Images**: Sharp
- **Gallery**: PhotoSwipe v5
