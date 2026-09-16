# Technical Specification: Real-Time HTML Project Editor (Web Studio)

## Overview
A high-performance, client-side, browser-based web application for editing and previewing complete multi-file HTML/CSS/JS projects in real time. Features Monaco Code Editor, Virtual File System (VFS) with drag-and-drop ZIP and folder imports/exports, sandboxed live iframe preview with relative path resolution, and an interactive Visual Element Inspector.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Top Navigation & Toolbar                           │
│  [Project Name] [Template Picker] [Upload ZIP/Folder] [Export ZIP] [Theme]  │
├──────────────┬───────────────────────────────┬──────────────────────────────┤
│ File Tree    │ Monaco Code Editor & Tabs     │ Live Preview Viewport        │
│              │                               │                              │
│ 📁 my-proj   │ ┌───────────────────────────┐ │ [Desktop | Tablet | Mobile]  │
│  📄 index.html│ │ index.html | style.css  ×│ │ [Reload] [Inspect Mode: ON]  │
│  📄 about.html│ ├───────────────────────────┤ │ ┌──────────────────────────┐ │
│  📁 css/     │ │ 1 <!DOCTYPE html>         │ │ │                          │ │
│   📄 style.css│ │ 2 <html>                  │ │ │   Live Website           │ │
│  📁 js/      │ │ 3   <body>                │ │ │   (Sandboxed Iframe)     │ │
│   📄 app.js  │ │ 4     <h1>Hello</h1>      │ │ │                          │ │
│  📁 assets/  │ │ 5   </body>               │ │ │                          │ │
│   🖼️ hero.png│ │ 6 </html>                 │ │ └──────────────────────────┘ │
│              │ └───────────────────────────┘ ├──────────────────────────────┤
│ [+ File/Dir] │                               │ Visual Inspector / Styles    │
│              ├───────────────────────────────┤                              │
│              │ Bottom Panel: Console / Errors│ Tag: <h1>  Class: .hero-title│
│              │ [Logs] [Warnings] [Errors]    │ Text / Colors / Spacing / Font│
└──────────────┴───────────────────────────────┴──────────────────────────────┘
```

### 1. Technology Stack
- **Framework & Bundler**: React 18, TypeScript, Vite, Tailwind CSS.
- **Code Editor**: `@monaco-editor/react` (Monaco Editor).
- **Icons & UI**: `lucide-react`, `clsx`, `tailwind-merge`.
- **State Management**: `zustand` with IndexedDB persistence (`idb-keyval`).
- **File & Archive Processing**: `jszip`, Browser File System Access API, Drag-and-Drop API.
- **Testing**: `vitest`, `@testing-library/react`, `jsdom`.

### 2. Core Modules

#### A. Virtual File System (VFS) & Store (`src/store/useProjectStore.ts`)
- In-memory hierarchical map of `VirtualFile`:
  ```typescript
  export interface VirtualFile {
    id: string;
    path: string; // e.g. "index.html", "css/style.css", "images/logo.png"
    name: string;
    type: 'file' | 'directory';
    content: string; // text content for text files
    isBinary: boolean;
    binaryBlob?: Blob;
    blobUrl?: string; // ephemeral URL for media assets
    updatedAt: number;
  }
  ```
- Store actions:
  - `addFile(path, content, isBinary, blob)`
  - `updateFile(path, content)`
  - `renameFile(oldPath, newPath)`
  - `deleteFile(path)`
  - `createFolder(path)`
  - `setActiveFile(path)`
  - `closeTab(path)`
  - `loadProject(files, projectName)`
  - `resetToTemplate(templateId)`

#### B. Live Preview Bundler & Resolver (`src/services/previewBundler.ts`)
- Resolves all local assets relative to the current active HTML page:
  - `<link rel="stylesheet" href="...">` inlined or resolved from VFS.
  - `<script src="...">` inlined with VFS script content.
  - `<img src="...">`, `<video src="...">`, `<audio src="...">`, `<source srcset="...">` substituted with `blob:` URLs generated from VFS binary assets.
  - Intercepts internal `<a href="...">` clicks to navigate multi-page projects without breaking out of the sandbox.
  - Injects Iframe Bridge (`src/services/iframeBridge.ts`) to capture:
    - Console logs (`log`, `warn`, `error`).
    - Unhandled runtime errors.
    - Live hover and selection telemetry for the Visual Inspector.

#### C. Visual Element Inspector (`src/components/inspector/VisualInspector.tsx`)
- Inspect mode toggle in preview toolbar.
- Iframe bridge handles `pointerover` and `click` events, measuring element bounds, tag name, classes, computed styles, and selector path.
- Inspector properties:
  - Inner text content editor.
  - Typography (font size, weight, line height, text align, color).
  - Box model (margin, padding, background color, border width, border color, border radius).
  - "Jump to Code" action that opens the active HTML file in Monaco and moves cursor to the target element.
  - Bi-directional sync: modifications update the corresponding HTML/CSS file in the VFS immediately.

#### D. Project Import & Export (`src/services/zipService.ts`)
- **Import ZIP**: Unpacks all files, detects text vs binary mime types, constructs directory tree, and sets `index.html` as the default active file.
- **Import Folder**: Native directory picker or drag & drop directory reader recursively traverses webkitEntries.
- **Export ZIP**: Compiles current VFS files and binary blobs into a downloadable `.zip` archive.
- **Built-in Starter Templates**:
  1. *Modern Landing Page* (Hero, features, responsive grid, multi-page links).
  2. *Portfolio / Resume* (Interactive theme switcher, projects gallery).
  3. *Boilerplate Minimal* (Clean HTML5 + CSS3 + JS starter).

## Verification & Quality Plan
- Unit tests for VFS state operations, path utilities, asset resolving, and ZIP serialization.
- Production build validation with `npm run build`.
