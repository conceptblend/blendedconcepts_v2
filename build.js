const fs = require("fs-extra")
const path = require("path")
const matter = require("gray-matter")
const markdownIt = require("markdown-it")
const md = markdownIt({ html: true, linkify: true, typographer: true })

// Directories
const CONTENT_DIR = "./content/blog"
const OUTPUT_DIR = "./dist"
const ASSETS_DIR = "./content/assets"
const STATIC_DIR = "./static"

// Site metadata
const SITE = {
  title: "Andrew J Wright",
  author: "Andrew J Wright",
  description:
    "Andrew J Wright is a user experience design and product leader based in Calgary, Alberta, Canada.",
  url: "https://ajw.design",
  twitter: "andrewjwright",
}

// Read and parse all blog posts
async function getPosts() {
  const postDirs = await fs.readdir(CONTENT_DIR)
  const posts = []

  for (const dir of postDirs) {
    const postPath = path.join(CONTENT_DIR, dir)
    const stat = await fs.stat(postPath)

    if (stat.isDirectory()) {
      const mdFiles = ["index.md", "index.mdx"]
      let content
      let mdFile

      for (const file of mdFiles) {
        const filePath = path.join(postPath, file)
        if (await fs.pathExists(filePath)) {
          content = await fs.readFile(filePath, "utf8")
          mdFile = file
          break
        }
      }

      if (content) {
        const { data, content: markdown } = matter(content)
        const html = md.render(markdown)

        posts.push({
          slug: dir,
          title: data.title || dir,
          description: data.description || "",
          date: data.date || "",
          dateObj: data.date ? new Date(data.date) : new Date(),
          pinned: data.pinned || false,
          imageURL: data.imageURL || "",
          tags: data.tags || [],
          editorsNote: data.editorsNote || "",
          html,
          // Calculate reading time (rough estimate: 200 words per minute)
          timeToRead: Math.ceil(markdown.split(/\s+/).length / 200),
        })
      }
    }
  }

  // Sort: pinned first, then by date (newest first)
  posts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return b.dateObj - a.dateObj
  })

  return posts
}

// Generate HTML from template
function layout(title, content, seoDescription = "", seoImage = "") {
  const siteTitle = title === SITE.title ? title : `${title} | ${SITE.title}`
  const description = seoDescription || SITE.description

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteTitle}</title>
  <meta name="description" content="${description}">

  <!-- Open Graph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  ${seoImage ? `<meta property="og:image" content="${seoImage}">` : ""}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:creator" content="@${SITE.twitter}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  ${seoImage ? `<meta name="twitter:image" content="${seoImage}">` : ""}

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Patua+One&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
  <link rel="stylesheet" href="/css/main.css">

  <!-- Favicon -->
  <link rel="icon" href="/apple-touch-icon.png">
</head>
<body>
  <div style="margin-left: auto; margin-right: auto; max-width: 600px; padding: 2rem;">
    ${content}
    <footer>
      <small>© ${new Date().getFullYear()} Andrew J Wright. Built with a custom static site generator.</small>
    </footer>
  </div>
</body>
</html>`
}

// Generate bio section
function generateBio() {
  return `<header style="margin-bottom: 4rem;">
  <section style="text-align: center;" itemscope itemtype="http://schema.org/Person">
    <img src="/assets/profile-pic.jpg" alt="Andrew J Wright" class="profileImageWrapper" style="width: 120px; height: 120px; border-radius: 100%;">
    <h1 itemprop="name" id="name">Andrew J Wright</h1>
    <h3 itemprop="jobTitle" id="job-title">
      Product and User Experience (UX) Design Leader with expertise in
      human-centered Interaction Design, Information Architecture, Content
      Strategy, and <span style="white-space: nowrap;">Product Management.</span>
    </h3>
    <meta itemprop="description" content="${SITE.description}">
    <p id="contact">
      <a href="https://ca.linkedin.com/in/wrightaj" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      &middot; <a href="https://www.slideshare.net/andr3wjwright" target="_blank" rel="noopener noreferrer">SlideShare</a>
      &middot; <a href="https://x.com/andrewjwright" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
    </p>
  </section>
  <p id="mission">
    <strong>Interacting with technology shouldn't be complicated.</strong>
    My mission is to create digital experiences that people find simple,
    meaningful, and pleasurable. I do this by understanding and designing
    for their needs, behaviours, and mental model.
  </p>
  <hr>
  <p>Some of the companies I've worked with include:</p>
  <ul>
    <li><a href="https://symend.com" target="_blank" rel="noopener noreferrer">Symend</a> – Behavioral Science-based customer engagement platform (current role)</li>
    <li><a href="https://www.hibrightside.ca/" target="_blank" rel="noopener noreferrer">Brightside by ATB</a> – Fintech startup</li>
    <li><a href="https://www.atb.com/" target="_blank" rel="noopener noreferrer">ATB Financial</a></li>
    <li><a href="https://www.yvr.ca/" target="_blank" rel="noopener noreferrer">YVR (Vancouver International Airport)</a></li>
    <li><a href="https://www.bmo.com/" target="_blank" rel="noopener noreferrer">BMO Bank of Montreal</a></li>
    <li><a href="https://www.cpr.ca/" target="_blank" rel="noopener noreferrer">Canadian Pacific (CP)</a></li>
  </ul>
  <hr>
</header>`
}

// Generate index page
function generateIndex(posts) {
  const postsHtml = posts
    .map((post) => {
      const pinnedClass = post.pinned ? ' class="pinned-post"' : ""
      const pinnedLabel = post.pinned
        ? '<div><span role="img" aria-label="Pinned post" class="pinned-label">★</span></div>'
        : ""

      return `<article${pinnedClass}>
  <header>
    <h3 class="article-title"><a href="/blog/${post.slug}/">${post.title}</a></h3>
    ${pinnedLabel}
  </header>
  <small class="article-metadata">${post.timeToRead} min read &middot; ${formatDate(post.date)}</small>
  <section>
    <p style="margin-top: 0.25rem; margin-bottom: 0.25rem;">${post.description}</p>
  </section>
</article>`
    })
    .join("\n")

  return layout(
    "Product and User Experience Design Leader",
    generateBio() + "<h2>Writings</h2>\n" + postsHtml
  )
}

// Generate blog post page
function generatePost(post, prevPost, nextPost) {
  const navigation = `<nav>
  <ul style="display: flex; flex-wrap: wrap; justify-content: space-between; list-style: none; padding: 0;">
    <li>${prevPost ? `<a href="/blog/${prevPost.slug}/" rel="prev">← ${prevPost.title}</a>` : ""}</li>
    <li>${nextPost ? `<a href="/blog/${nextPost.slug}/" rel="next">${nextPost.title} →</a>` : ""}</li>
  </ul>
</nav>`

  const content = `<h5 class="site-title"><a href="/">${SITE.title} &middot; Home</a></h5>
<article>
  <header>
    <h1 class="article-title">${post.title}</h1>
    <small class="article-metadata">${post.timeToRead} min read &middot; ${formatDate(post.date)}</small>
    ${post.description ? `<p class="article-description">${post.description}</p>` : ""}
  </header>
  <hr>
  ${post.html}
  <hr style="margin-bottom: 1rem;">
</article>
${navigation}`

  return layout(post.title, content, post.description, post.imageURL)
}

// Format date helper
function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Main build function
async function build() {
  console.log("🏗️  Building site...")

  // Clean output directory
  await fs.remove(OUTPUT_DIR)
  await fs.ensureDir(OUTPUT_DIR)

  // Get all posts
  const posts = await getPosts()
  console.log(`📝 Found ${posts.length} posts`)

  // Generate index page
  const indexHtml = generateIndex(posts)
  await fs.writeFile(path.join(OUTPUT_DIR, "index.html"), indexHtml)
  console.log("✅ Generated index page")

  // Generate individual post pages
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const prevPost = i < posts.length - 1 ? posts[i + 1] : null
    const nextPost = i > 0 ? posts[i - 1] : null

    const postHtml = generatePost(post, prevPost, nextPost)
    const postDir = path.join(OUTPUT_DIR, "blog", post.slug)
    await fs.ensureDir(postDir)
    await fs.writeFile(path.join(postDir, "index.html"), postHtml)

    // Copy all images and other files from the blog post directory
    const sourcePostDir = path.join(CONTENT_DIR, post.slug)
    const files = await fs.readdir(sourcePostDir)

    for (const file of files) {
      // Skip markdown files, only copy images and other assets
      if (!file.endsWith(".md") && !file.endsWith(".mdx")) {
        const sourceFile = path.join(sourcePostDir, file)
        const destFile = path.join(postDir, file)

        // Check if it's a file (not a directory)
        const stat = await fs.stat(sourceFile)
        if (stat.isFile()) {
          await fs.copy(sourceFile, destFile)
        }
      }
    }
  }
  console.log(`✅ Generated ${posts.length} blog post pages`)

  // Copy assets
  await fs.copy(ASSETS_DIR, path.join(OUTPUT_DIR, "assets"))
  console.log("✅ Copied assets")

  // Copy static files
  if (await fs.pathExists(STATIC_DIR)) {
    await fs.copy(STATIC_DIR, OUTPUT_DIR)
    console.log("✅ Copied static files")
  }

  console.log("✨ Build complete!")
}

// Run build
build().catch((err) => {
  console.error("❌ Build failed:", err)
  process.exit(1)
})
