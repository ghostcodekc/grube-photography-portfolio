# Grube Photography Portfolio - Project Documentation

## Project Overview
A photography portfolio website for Andrew Grube, featuring a gallery, services, and an "About" section. The project uses a hybrid approach: it's built as a dynamic EJS/Express application for development and can be rendered into a static site for production.

## Architecture
- **Hybrid SSR/Static**: 
  - **Development**: Uses Express and EJS to serve dynamic routes.
  - **Build Process**: `build.js` renders EJS templates into static `.html` files and automatically generates optimized thumbnails (small/medium/4:3 cropped) from organized `full/` image directories using `sharp`.
- **Data-Driven Gallery**: The site is powered by `src/data/gallery.json` (Home) and `src/data/portraits.json` (Portraits), allowing for easy image management without editing HTML.
- **Automated Metadata**: The build and development processes automatically extract image dimensions (width/height) using `sharp`, eliminating the need for manual technical data entry in JSON files.
- **Categorized Storage**: Images are organized into `general` and `portraits` subdirectories within both `full/` and `thumbs/` folders.
- **Client-Side**: Uses Tailwind CSS for styling, Feather Icons for iconography, and **PhotoSwipe v5** (zero-dependency) for the image gallery experience.

## Performance Standards
- **Image Optimization**: The build process automatically generates both AVIF and WebP thumbnails to reduce payload size. AVIF is prioritized for its superior compression.
- **Fixed Aspect Ratios**: Gallery grid images are automatically cropped to **4:3 (Landscape)** to ensure a uniform UI and prevent layout shifts.
- **Priority Loading**: Hero images use `fetchpriority="high"` and `loading="eager"`. The hero image on the home page is constrained to `50vh`.
- **Lazy Loading**: Non-critical images use `loading="lazy"` and `decoding="async"` to improve 3G network performance.
- **Minimal Payload**: Zero-dependency frontend (no jQuery). PhotoSwipe v5 significantly reduces the initial JavaScript payload.
- **Responsive Images**: Use of `<picture>` tags with AVIF and WebP source sets to serve the smallest viable image to the client.

## Tech Stack
- **Backend**: Node.js, Express
- **Templating**: EJS (Embedded JavaScript)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Image Processing**: `sharp` (used in `build.js`)
- **Frontend Libs**: PhotoSwipe v5, Feather Icons
- **Build Tools**: `fs-extra` for asset management, `ejs` for static rendering

## Deployment
- **Platform**: AWS Amplify
- **Trigger**: Automatic deployment occurs when a commit is pushed to the `main` branch.
- **Workflow**: Amplify executes the build script to generate the static `dist/` folder which is then served.

## Key Files & Directories
- `server.js`: Express server for local development. Handles 404s via dynamic EJS rendering and serves AVIF with correct MIME types.
- `build.js`: The SSG (Static Site Generation) script that prepares the `dist/` folder and processes images.
- `src/data/`: Contains `gallery.json` and `portraits.json` metadata.
- `views/`: Contains EJS templates.
- `public/assets/images/`: Organized into `full/` (source) and `thumbs/` (generated, git-ignored).
- `src/input.css`: Tailwind entry point.

## Conventions
- **Routing**: Support both clean URLs (e.g., `/about`) and static extensions (e.g., `/about.html`) in `server.js`.
- **Base Paths**: Use `<%= basePath %>` in templates.
- **Styling**: Prefer Tailwind utility classes. Output generated to `public/assets/css/output.css`.

## Documentation Mandate
- **Maintenance**: This `GEMINI.md` file is the primary source of truth. It **MUST** be updated immediately following any significant changes.
- **Git Operations**: I am permitted to stage changes and draft/execute commit messages. However, I must **NEVER** automatically push to `origin` unless explicitly instructed for a specific task.

## Future Upgrades
- **Critical CSS**: Inline the CSS required for the initial viewport.
- **Implementation of a contact form handler**: Add a backend or serverless function to handle inquiries.
