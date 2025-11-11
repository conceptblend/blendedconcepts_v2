# Andrew J Wright - Portfolio & Blog

Personal portfolio and blog site for Andrew J Wright, a UX/Product Design Leader based in Calgary, Alberta, Canada.

## About

This is a minimal, custom-built static site generator that converts Markdown blog posts into a clean, fast website. Built without frameworks or complex dependencies - just plain HTML, CSS, and a simple Node.js build script.

## Development

### Prerequisites
- Node.js 18 or higher
- npm

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Build the site:
```bash
npm run build
```

3. Start local development server:
```bash
npm start
```

The site will be available at http://localhost:8000

### Available Commands

- `npm run build` - Build the static site to `/dist`
- `npm start` - Build and serve the site locally
- `npm run serve` - Serve the built site (requires prior build)
- `npm run clean` - Remove build output
- `npm run format` - Format code with Prettier

## Project Structure

```
.
├── content/
│   ├── blog/           # Blog posts (Markdown files)
│   └── assets/         # Images and media
├── public/
│   └── css/           # Stylesheets
├── static/            # Static files (copied to dist)
├── build.js           # Build script
└── dist/              # Generated site (git-ignored)
```

## Adding Blog Posts

1. Create a new directory in `content/blog/your-post-name/`
2. Add an `index.md` file with frontmatter:

```markdown
---
title: "Your Post Title"
description: "A brief description"
date: "2024-01-01"
pinned: false
---

Your content here...
```

3. Run `npm run build` to generate the updated site

## Deployment

The site automatically deploys to GitHub Pages via GitHub Actions when pushing to the main/master branch.

### Manual Deployment

1. Build the site: `npm run build`
2. Deploy the `dist/` directory to your hosting service

## License

MIT
