# ✨ CanvasCode

<div align="center">

[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-0.52-007ACC?logo=visual-studio-code&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![Vitest](https://img.shields.io/badge/Tests-48%20Passed-22C55E?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhimalayladha%2FCanvasCode)

**A modern, browser-native visual WYSIWYG HTML editor and IDE inspired by KompoZer & Dreamweaver.**  
*Craft multi-page web projects visually with instant live preview, Monaco code editing, component insertion, DOM hierarchy exploration, and one-click ZIP export—100% client-side with zero backend dependencies.*

</div>

---

## 📸 Overview & Workspace Architecture

CanvasCode combines the ease of a visual design surface with the precision of VS Code's Monaco editor.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ✨ CanvasCode  [Design | Split | Source | Interact]  [+ Insert ▾]  [Templates] [Export]│
├───────────────┬────────────────────────────────────────────┬───────────────────────────┤
│ [Files | DOM] │ 🔤 Headings | Bold | Italic | Lists | Color│ 🎨 Visual Inspector       │
│               ├────────────────────────────────────────────┤                           │
│ • index.html  │                                            │ • Tag / Class / ID        │
│ • about.html  │            Interactive Visual Canvas       │ • Typography & Box Model  │
│ • css/...     │          (Double-click live editing)       │ • Extract to CSS Sheet    │
│ • js/...      │                                            │ • Jump to HTML / CSS / JS │
│               ├────────────────────────────────────────────┤                           │
│               │ 🧭 body > header.hero > h1.hero-title [Wrap]                           │
└───────────────┴────────────────────────────────────────────┴───────────────────────────┘
```

---

## 🚀 Key Features

### 1. 🎛️ 4-Way Workspace Mode Switcher
- **🎨 Design Mode**: Full-width visual canvas with WYSIWYG ribbon and Visual Inspector (Code editor hidden for pure visual crafting).
- **◫ Split Mode**: 50/50 synchronized layout with Monaco code editor on the left and visual canvas on the right.
- **📄 Source Mode**: Full-width Monaco code editor with syntax highlighting, IntelliSense, multi-tab switching, and minimap.
- **▶ Interact Mode**: Live browser preview with canvas click interception disabled to test buttons, JavaScript alerts, navigation, and forms normally.

### 2. 🔤 KompoZer-Grade WYSIWYG Ribbon Toolbar
- **Block Formats**: Heading 1 (`<h1>`), Heading 2 (`<h2>`), Heading 3 (`<h3>`), Paragraph (`<p>`), Preformatted (`<pre>`), Blockquote (`<blockquote>`).
- **Typography**: 8 web-safe font families and 7 typographic size tiers (12px to 48px).
- **Inline Styling**: **Bold** (`Ctrl+B`), *Italic* (`Ctrl+I`), <u>Underline</u> (`Ctrl+U`), ~~Strikethrough~~.
- **Color & Highlights**: Color swatches and custom hex pickers for text color and background highlight color.
- **Lists & Indents**: Bulleted lists (`<ul>`), Numbered lists (`<ol>`), Indent and Outdent.
- **Alignment & Hyperlinks**: Align left/center/right/justify, Insert Link modal, and Clear Formatting.
- **Live Bidirectional Sync**: Instant `document.execCommand` execution inside sandboxed iframe synced directly to the virtual file system (VFS).

### 3. 🧩 Component & Table Inserter Palette
- **Configurable Tables**: Choose rows (1–12), columns (1–8), table headers (`<thead>`), borders, and striped rows.
- **Pre-styled Layout Blocks**: 2-Column responsive grid, 3-Column feature card grid, Hero jumbotrons, and Dividers (`<hr>`).
- **Form Controls & Inputs**: Text inputs, textareas, select dropdowns, checkboxes, radio buttons, buttons, and full contact form boilerplates.
- **Media & Images**: Direct URL image insertion or 1-click picker from uploaded project image assets.
- **Placement Control**: Insert *After Selected*, *Inside (Child)*, or *Before Selected* element.

### 4. 🧭 HTML DOM Breadcrumb Hierarchy Bar
- Displays the complete ancestor chain (e.g. `body > header.hero > div.hero-actions > button#explore-btn`).
- Click any ancestor tag to instantly highlight and inspect it in the Visual Inspector.
- 1-click quick-wrap dropdown to enclose the selected element in a `<div>`, `<section>`, `<article>`, `<aside>`, or `<main>`.

### 5. 🌲 Live DOM Outline Tree Sidebar
- Switch between **Files Explorer** and **DOM Tree** in the left sidebar.
- Expandable DOM tree parsing `doc.body` with color-coded badges for containers, headings, interactive elements, and tables.
- Live search filter to quickly find elements by tag name, ID, class, or text.
- Bi-directional selection sync with canvas and inspector.

### 6. 🎨 Visual Element Inspector & CSS Extractor
- **Direct Style Tweaks**: Font size, color, background, alignment, opacity, and box-model padding/margins.
- **Extract & Save to Stylesheet**: Automatically converts inline styles into clean CSS rules in `css/style.css` (or custom stylesheets) and clears inline `style="..."` attributes.
- **Smart Jump-to-Code**: 1-click jump to matching element declaration in HTML, CSS rule in stylesheet, or JavaScript ID reference.

### 7. 📦 Virtual File System (VFS) & Storage
- Multi-file project management with subfolder support.
- Multi-page navigation (e.g., `index.html`, `about.html`, `contact.html`).
- Drag-and-drop ZIP and folder imports.
- Instant ZIP project export with clean, unpolluted HTML, CSS, and JS files.
- 50-step global Undo/Redo (`Ctrl+Z`, `Ctrl+Y`) persistent via IndexedDB.

---

## 🛠️ Local Setup & Development

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher) or **pnpm** / **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/himalayladha/CanvasCode.git
cd CanvasCode
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) in your browser.

### 4. Run Test Suite
```bash
# Run all 48 unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### 5. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## ☁️ Deploy to Vercel

### Option 1: Deploy with Vercel Web UI (Recommended)

1. Push your code to your GitHub repository: `https://github.com/himalayladha/CanvasCode`.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** > **"Project"**.
3. Import the `CanvasCode` repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**. Your app will be live on a global CDN in under a minute!

---

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Log in and deploy from the project root:
   ```bash
   vercel
   ```
3. For production deployment:
   ```bash
   vercel --prod
   ```

---

## 🏗️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`) |
| **Styling** | [TailwindCSS 3](https://tailwindcss.com/) + Custom Design System |
| **State & Storage** | [Zustand 5](https://github.com/pmndrs/zustand) + [idb-keyval](https://github.com/jakearchibald/idb-keyval) (IndexedDB) |
| **Archive & Packaging** | [JSZip 3](https://stuk.github.io/jszip/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Testing** | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
