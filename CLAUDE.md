# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog site for Andrew J Wright (UX/Product Design Leader). Built with a minimal, custom static site generator using vanilla Node.js - no frameworks, no React, no complex build tools. The site showcases blog posts about user experience, product design, and related topics.

**Philosophy**: Simple, fast, maintainable. The entire build system is in one ~250 line Node.js file.

## Development Commands

### Build and Development
- `npm run build` - Build static site to `/dist` directory
- `npm start` - Build and serve site locally at http://localhost:8000
- `npm run serve` - Serve pre-built site from `/dist` (requires prior build)
- `npm run clean` - Remove `/dist` directory
- `npm run format` - Format code with Prettier

### Installation
```bash
npm install
```

Only 3 dependencies: `markdown-it`, `gray-matter`, `fs-extra`

## Architecture

### Build System
The entire build is orchestrated by `build.js`, a single Node.js script that:
1. Reads Markdown files from `/content/blog/`
2. Parses frontmatter with gray-matter
3. Converts Markdown to HTML with markdown-it
4. Generates static HTML pages using template literals
5. Copies assets and static files to `/dist`

No plugins, no complex configuration, no virtual DOM - just straightforward file I/O and string templating.

### Content Management
Blog posts are stored in `/content/blog/` as Markdown files. Each post:
- Lives in its own directory (e.g., `/content/blog/post-name/index.md`)
- Has YAML frontmatter with: `title`, `description`, `date`, optional `pinned`, `imageURL`, `tags`, `editorsNote`
- Gets converted to HTML at `/dist/blog/post-name/index.html`
- Slug is derived from directory name

**Frontmatter Example:**
```yaml
---
title: "Your Post Title"
description: "Brief description"
date: "2024-01-01"
pinned: false
imageURL: "https://example.com/image.jpg"
---
```

### Page Generation (build.js)
The build script handles everything:

1. **getPosts()** - Reads all blog directories, parses markdown files, extracts frontmatter
2. **generateIndex()** - Creates homepage with bio and post list (pinned posts first)
3. **generatePost()** - Creates individual blog post pages with prev/next navigation
4. **layout()** - HTML template function that wraps content with proper head/meta tags
5. **Image copying** - All non-markdown files (images, etc.) from each blog post directory are copied to the corresponding dist directory

**Sorting Logic**: Posts are sorted with pinned posts first, then by date (newest first).

**Image Handling**: The build script automatically copies all images and assets from each blog post's source directory to the generated output directory, preserving the same directory structure. This allows relative image paths (like `./image.png`) in markdown to work correctly in the generated HTML.

### Project Structure
```
├── build.js              # Single-file build system
├── package.json          # Minimal dependencies
├── content/
│   ├── blog/            # Blog posts (Markdown with frontmatter)
│   └── assets/          # Images (profile-pic.jpg)
├── public/
│   └── css/             # Plain CSS (no preprocessing)
│       └── main.css
├── static/              # Files copied as-is to dist/
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   └── robots.txt
├── dist/                # Generated site (git-ignored)
│   ├── index.html
│   ├── blog/
│   │   └── [post-slug]/
│   │       └── index.html
│   ├── assets/
│   └── css/
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Actions deployment
```

### Styling
- Plain CSS in `/public/css/main.css` (converted from original SCSS)
- CSS custom properties (CSS variables) for brand colors
- Google Fonts (Noto Sans, Patua One) loaded via CDN
- Normalize.css loaded from CDN
- No CSS preprocessing, no PostCSS, no build step for styles

### Template System
HTML templates are defined as JavaScript template literals in `build.js`:
- `layout()` - Main HTML wrapper with head/meta tags
- `generateBio()` - Author bio section (inline HTML)
- `generateIndex()` - Homepage template
- `generatePost()` - Blog post template

All SEO meta tags (Open Graph, Twitter Cards) are embedded in the layout function.

### Key Functions in build.js

- **getPosts()** - File reading, frontmatter parsing, reading time calculation
- **generateIndex(posts)** - Homepage generation with bio + post list
- **generatePost(post, prevPost, nextPost)** - Individual post pages with navigation
- **layout(title, content, seoDescription, seoImage)** - HTML wrapper with meta tags
- **generateBio()** - Author bio section
- **formatDate(dateString)** - Date formatting helper
- **build()** - Main orchestrator

## Deployment

### GitHub Pages
Automatic deployment via GitHub Actions (`.github/workflows/deploy.yml`):
- Triggers on push to `main` or `master` branch
- Installs dependencies, runs build, deploys to GitHub Pages
- No manual deployment needed

### GitHub Pages Setup Required
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main/master branch to trigger deployment

### Manual Deployment
```bash
npm run build
# Upload contents of /dist/ to any static hosting
```

The `/dist` directory is a complete, self-contained static site.

## Site Metadata
All site configuration is in `build.js` at the top:
```javascript
const SITE = {
  title: 'Andrew J Wright',
  author: 'Andrew J Wright',
  description: '...',
  url: 'https://ajw.design',
  twitter: 'andrewjwright'
};
```

Change these values to update site-wide metadata.

## Content Conventions

### Pinned Posts
Add `pinned: true` to frontmatter to feature a post at the top of the homepage.

### Reading Time
Automatically calculated from word count (200 words/minute).

### Images

**Blog Post Images (preferred method)**:
- Store images in the same directory as your blog post (e.g., `/content/blog/my-post/image.png`)
- Reference with relative path in markdown: `![Alt text](./image.png)`
- Build script automatically copies these images to the same relative location in dist
- This is the recommended approach for most blog post images

**Shared Assets**:
- Store in `/content/assets/` for images shared across multiple posts
- Reference with absolute path: `/assets/filename.jpg`

**External Images**:
- Use full URL in markdown: `![Alt text](https://example.com/image.jpg)`
- Or in frontmatter: `imageURL: "https://example.com/image.jpg"`

### Navigation
Previous/next post navigation is automatically generated based on post order (by pinned status, then date).

## Adding New Posts

1. Create directory: `/content/blog/your-post-slug/`
2. Create file: `index.md` with frontmatter
3. Write content in Markdown
4. Run `npm run build`
5. Preview with `npm run serve`

## Modifying Styles

Edit `/public/css/main.css` directly. Changes require rebuild to appear in `/dist`.

## Modifying Templates

Edit the template functions in `build.js`:
- Page layout: `layout()` function
- Bio section: `generateBio()` function
- Homepage: `generateIndex()` function
- Blog posts: `generatePost()` function

## Why This Approach?

This site was converted from Gatsby to a custom build system for:
- **Simplicity**: No framework lock-in, no complex dependencies
- **Speed**: Builds in <1 second (vs 30+ seconds with Gatsby)
- **Maintainability**: One file, plain JavaScript, easy to understand
- **Flexibility**: Full control over HTML output, no abstractions
- **Longevity**: No dependency churn, no framework upgrades

The entire build system is ~250 lines of readable Node.js code.
