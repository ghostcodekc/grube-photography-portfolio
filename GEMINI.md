# Grube Photography Portfolio - Project Documentation

## Project Overview
A photography portfolio website for Andrew Grube, featuring a gallery, services, and an "About" section. The project uses a hybrid approach: it's built as a dynamic EJS/Express application for development and can be rendered into a static site for production.

## Architecture
- **Hybrid SSR/Static**: 
  - **Development**: Uses Express and EJS to serve dynamic routes.
  - **Build Process**: `build.js` renders EJS templates into static `.html` files and automatically generates optimized thumbnails (small/medium) from the `full/` image directory using `sharp`.
- **Client-Side**: Uses Tailwind CSS for styling, Feather Icons for iconography, and Lightbox2 for the image gallery experience.

## Performance Standards
- **Image Optimization**: The build process automatically generates both AVIF and WebP thumbnails to reduce payload size. AVIF is prioritized for its superior compression.
- **Priority Loading**: Hero images use `fetchpriority="high"` and `loading="eager"`.
- **Lazy Loading**: Non-critical images use `loading="lazy"` and `decoding="async"` to improve 3G network performance.
- **Responsive Images**: Use of `<picture>` tags with AVIF and WebP source sets to serve the smallest viable image to the client.

## Tech Stack
- **Backend**: Node.js, Express
- **Templating**: EJS (Embedded JavaScript)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Image Processing**: `sharp` (used in `build.js`)
- **Frontend Libs**: jQuery (dependency for Lightbox2), Lightbox2, Feather Icons
- **Build Tools**: `fs-extra` for asset management, `ejs` for static rendering

## Deployment
- **Platform**: AWS Amplify
- **Trigger**: Automatic deployment occurs when a commit is pushed to the `main` branch.
- **Workflow**: Amplify executes the build script to generate the static `dist/` folder which is then served.

## Key Files & Directories
- `server.js`: Express server for local development. Handles 404s via dynamic EJS rendering.
- `build.js`: The SSG (Static Site Generation) script that prepares the `dist/` folder.
- `views/`: Contains EJS templates.
  - `pages/`: Individual page templates (index, about, etc.).
  - `partials/`: Reusable components (header, footer, sidebar).
- `public/assets/`: Static assets (images, CSS, JS) used by both Express and the static build.
- `src/input.css`: Tailwind entry point.

## Conventions
- **Routing**: Support both clean URLs (e.g., `/about`) and static extensions (e.g., `/about.html`) in `server.js` to ensure compatibility between dev and prod environments.
- **Base Paths**: Use `<%= basePath %>` in templates to ensure links work correctly regardless of the environment's root directory.
- **Images**: High-resolution images are stored in `public/assets/images/full/`, while optimized thumbnails and responsive variants are in `public/assets/images/thumbs/`.
- **Styling**: Prefer Tailwind utility classes. The main output is generated to `public/assets/css/output.css`.

## Documentation Mandate
- **Maintenance**: This `GEMINI.md` file is the primary source of truth for the project's architecture and standards. It **MUST** be updated immediately following any significant changes to the build process, tech stack, or directory structure to ensure continuity for future development.

## Future Upgrades
- **Refactor to Data (`gallery.json`)**: Automate the gallery by moving image metadata (filenames, titles, locations, alt text) from `index.ejs` into a centralized `src/data/gallery.json`.
  - **Strategy**: Update `index.ejs` to loop through this JSON. New photos can then be deployed by simply uploading to `full/` and adding an entry to the JSON, triggering an Amplify build.
- **Extreme 3G Optimization**: Explore removing jQuery/Lightbox2 in favor of a modern, zero-dependency lightbox (like PhotoSwipe v5) to further reduce payload size.
- **Critical CSS**: Inline the CSS required for the initial viewport to eliminate render-blocking CSS.