import { VirtualFile } from '../types/vfs';

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  files: Record<string, Omit<VirtualFile, 'id' | 'updatedAt'>>;
}

export const STARTER_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'saas-landing',
    name: 'Modern SaaS Showcase',
    category: 'Landing Page',
    badge: 'Popular',
    description: 'Responsive multi-page SaaS landing page with animated gradients, glassmorphism cards, interactive tabs, and modern typography.',
    files: {
      'index.html': {
        path: 'index.html',
        name: 'index.html',
        type: 'file',
        isBinary: false,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PulseAI - Next-Gen Intelligence</title>
  <link rel="stylesheet" href="css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <nav class="navbar">
    <div class="logo">⚡ PulseAI</div>
    <div class="nav-menu">
      <a href="index.html" class="active">Home</a>
      <a href="features.html">Features</a>
      <a href="pricing.html">Pricing</a>
    </div>
    <button class="btn btn-primary" id="signup-btn">Start Free Trial</button>
  </nav>

  <header class="hero">
    <div class="badge">✨ Introducing PulseAI 3.0</div>
    <h1 class="hero-title">Automate your entire workflow with AI.</h1>
    <p class="hero-subtitle">
      Supercharge your productivity with intelligent agents, real-time analytics, and automated multi-channel workflows.
    </p>
    <div class="hero-cta">
      <button class="btn btn-primary btn-large" id="cta-action">Get Started Free &rarr;</button>
      <a href="features.html" class="btn btn-outline btn-large">Explore Features</a>
    </div>
  </header>

  <section class="grid-section">
    <div class="feature-card">
      <div class="icon">🚀</div>
      <h3>Lightning Speed</h3>
      <p>Sub-millisecond latency for real-time streaming AI completions.</p>
    </div>
    <div class="feature-card">
      <div class="icon">🔒</div>
      <h3>Enterprise Security</h3>
      <p>End-to-end encrypted storage with SOC2 and GDPR compliance.</p>
    </div>
    <div class="feature-card">
      <div class="icon">📊</div>
      <h3>Live Analytics</h3>
      <p>Comprehensive telemetry dashboards and instant actionable insights.</p>
    </div>
  </section>

  <footer>
    <p>&copy; 2026 PulseAI Technologies Inc. All rights reserved.</p>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>`,
      },
      'features.html': {
        path: 'features.html',
        name: 'features.html',
        type: 'file',
        isBinary: false,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Features - PulseAI</title>
  <link rel="stylesheet" href="css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <nav class="navbar">
    <div class="logo">⚡ PulseAI</div>
    <div class="nav-menu">
      <a href="index.html">Home</a>
      <a href="features.html" class="active">Features</a>
      <a href="pricing.html">Pricing</a>
    </div>
    <a href="index.html" class="btn btn-primary">Back to Home</a>
  </nav>

  <main class="container">
    <h1 class="hero-title" style="margin-top: 2rem;">Powerful Capabilities</h1>
    <p class="hero-subtitle">Designed from the ground up for modern high-velocity teams.</p>
    <div class="feature-card" style="margin-top: 2rem;">
      <h3>Multi-file HTML Preview</h3>
      <p>Explore full linking across your site with seamless state synchronization.</p>
    </div>
  </main>

  <footer>
    <p>&copy; 2026 PulseAI Technologies Inc.</p>
  </footer>
  <script src="js/main.js"></script>
</body>
</html>`,
      },
      'css/style.css': {
        path: 'css/style.css',
        name: 'style.css',
        type: 'file',
        isBinary: false,
        content: `:root {
  --bg: #090d16;
  --card: #131b2e;
  --primary: #3b82f6;
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --border: rgba(255, 255, 255, 0.08);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.6;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--border);
}
.logo { font-size: 1.25rem; font-weight: 800; color: #60a5fa; }
.nav-menu { display: flex; gap: 1.5rem; }
.nav-menu a { color: var(--text-muted); text-decoration: none; font-weight: 500; font-size: 0.9rem; }
.nav-menu a:hover, .nav-menu a.active { color: var(--text); }
.btn { padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; text-decoration: none; display: inline-block; font-size: 0.9rem; }
.btn-primary { background: #3b82f6; color: white; }
.btn-primary:hover { background: #2563eb; }
.btn-outline { background: transparent; border: 1px solid var(--border); color: white; }
.btn-outline:hover { background: rgba(255, 255, 255, 0.05); }
.btn-large { padding: 0.8rem 1.6rem; font-size: 1rem; }
.hero { text-align: center; padding: 4rem 1.5rem 3rem; max-width: 800px; margin: 0 auto; }
.badge { display: inline-block; padding: 0.3rem 0.8rem; background: rgba(59, 130, 246, 0.15); color: #60a5fa; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem; }
.hero-title { font-size: 3rem; font-weight: 800; line-height: 1.15; margin-bottom: 1rem; letter-spacing: -0.02em; }
.hero-subtitle { color: var(--text-muted); font-size: 1.15rem; margin-bottom: 2rem; }
.hero-cta { display: flex; justify-content: center; gap: 1rem; }
.grid-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 1040px; margin: 2rem auto; padding: 0 1.5rem; }
.feature-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; }
.feature-card .icon { font-size: 2rem; margin-bottom: 0.8rem; }
.feature-card h3 { font-size: 1.2rem; margin-bottom: 0.5rem; font-weight: 700; }
.feature-card p { color: var(--text-muted); font-size: 0.95rem; }
.container { max-width: 900px; margin: 0 auto; padding: 2rem; }
footer { text-align: center; padding: 3rem 1rem; color: var(--text-muted); font-size: 0.85rem; border-top: 1px solid var(--border); margin-top: 4rem; }`,
      },
      'js/main.js': {
        path: 'js/main.js',
        name: 'main.js',
        type: 'file',
        isBinary: false,
        content: `console.log("PulseAI template loaded successfully!");

const ctaAction = document.getElementById('cta-action');
if (ctaAction) {
  ctaAction.addEventListener('click', () => {
    alert("🚀 Welcome to PulseAI! You can edit this alert in js/main.js.");
  });
}`,
      },
    },
  },
  {
    id: 'portfolio',
    name: 'Developer Portfolio & Resume',
    category: 'Portfolio',
    badge: 'Clean',
    description: 'Minimalist, fast-loading personal developer portfolio featuring project cards, skills list, contact section, and dark aesthetic.',
    files: {
      'index.html': {
        path: 'index.html',
        name: 'index.html',
        type: 'file',
        isBinary: false,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alex Rivera - Senior Frontend Engineer</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="wrapper">
    <header class="header">
      <div class="avatar">👨‍💻</div>
      <h1 class="name">Alex Rivera</h1>
      <p class="role">Frontend Engineer & UI/UX Specialist</p>
      <div class="socials">
        <a href="#projects">Work</a> &bull;
        <a href="#skills">Skills</a> &bull;
        <a href="#contact">Contact</a>
      </div>
    </header>

    <section id="about" class="section">
      <h2>About Me</h2>
      <p>
        Building high-performance web applications, developer tooling, and delightful user interfaces with modern web standards.
      </p>
    </section>

    <section id="projects" class="section">
      <h2>Selected Projects</h2>
      <div class="project-list">
        <div class="project-item">
          <h3>⚡ HyperEditor</h3>
          <p>Browser-native visual code editor with live AST synchronization.</p>
        </div>
        <div class="project-item">
          <h3>📦 FastPack VFS</h3>
          <p>Ultra-fast client-side virtual file system with ZIP streaming.</p>
        </div>
      </div>
    </section>

    <footer id="contact" class="footer">
      <p>Available for freelance & full-time roles &bull; hello@alexrivera.dev</p>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      },
      'style.css': {
        path: 'style.css',
        name: 'style.css',
        type: 'file',
        isBinary: false,
        content: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Space Grotesk', sans-serif;
  background: #111;
  color: #eee;
  line-height: 1.6;
  padding: 3rem 1.5rem;
}
.wrapper { max-width: 680px; margin: 0 auto; }
.header { text-align: center; margin-bottom: 3rem; }
.avatar { font-size: 3rem; margin-bottom: 0.5rem; }
.name { font-size: 2.2rem; font-weight: 700; color: #fff; }
.role { color: #888; font-size: 1.1rem; margin-bottom: 1rem; }
.socials a { color: #4da6ff; text-decoration: none; font-weight: 500; }
.socials a:hover { text-decoration: underline; }
.section { margin-bottom: 2.5rem; }
.section h2 { font-size: 1.3rem; color: #fff; margin-bottom: 1rem; border-bottom: 1px solid #333; padding-bottom: 0.5rem; }
.project-list { display: flex; flex-direction: column; gap: 1rem; }
.project-item { background: #1a1a1a; padding: 1.25rem; border-radius: 8px; border: 1px solid #282828; }
.project-item h3 { color: #fff; font-size: 1.1rem; margin-bottom: 0.3rem; }
.project-item p { color: #aaa; font-size: 0.95rem; }
.footer { text-align: center; color: #666; font-size: 0.85rem; margin-top: 3rem; border-top: 1px solid #222; padding-top: 1.5rem; }`,
      },
      'script.js': {
        path: 'script.js',
        name: 'script.js',
        type: 'file',
        isBinary: false,
        content: `console.log("Portfolio template loaded!");`,
      },
    },
  },
  {
    id: 'minimal',
    name: 'Minimal Clean HTML5 Boilerplate',
    category: 'Boilerplate',
    badge: 'Starter',
    description: 'Barebones HTML5 + modern CSS reset + vanilla JavaScript starter template for rapid prototyping.',
    files: {
      'index.html': {
        path: 'index.html',
        name: 'index.html',
        type: 'file',
        isBinary: false,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minimal Web App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="box">
    <h1>Hello World</h1>
    <p>Start editing this file to see real-time updates.</p>
    <button id="click-me">Click Me</button>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      },
      'style.css': {
        path: 'style.css',
        name: 'style.css',
        type: 'file',
        isBinary: false,
        content: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f4f4f5;
  color: #18181b;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.box {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 400px;
}
h1 { font-size: 2rem; margin-bottom: 0.5rem; }
p { color: #71717a; margin-bottom: 1.5rem; }
button {
  background: #18181b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
}
button:hover { opacity: 0.85; }`,
      },
      'app.js': {
        path: 'app.js',
        name: 'app.js',
        type: 'file',
        isBinary: false,
        content: `document.getElementById('click-me').addEventListener('click', () => {
  alert('Button clicked!');
});`,
      },
    },
  },
];
