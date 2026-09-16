import { create } from 'zustand';
import { get, set } from 'idb-keyval';
import { ProjectState, VirtualFile, InspectedElementData, ConsoleLogMessage, ViewportMode, CanvasMode } from '../types/vfs';
import { normalizePath, getFileName, isImageFile } from '../utils/pathUtils';

const IDB_PROJECT_KEY = 'html_studio_active_project';

const DEFAULT_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Awesome Website</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <nav class="navbar">
    <div class="logo">✨ WebStudio</div>
    <div class="nav-links">
      <a href="index.html" class="active">Home</a>
      <a href="about.html">About</a>
      <button class="btn btn-primary" id="cta-btn">Get Started</button>
    </div>
  </nav>

  <header class="hero">
    <div class="badge">🚀 Real-time HTML Editor & Visual Studio</div>
    <h1 class="hero-title" id="main-heading">Design and build web projects in real-time.</h1>
    <p class="hero-subtitle">
      Experience instant live preview, multi-file code editing with Monaco, interactive visual styling, and effortless ZIP import/export.
    </p>
    <div class="hero-actions">
      <button class="btn btn-primary" id="explore-btn">Try Interactive Demo</button>
      <a href="about.html" class="btn btn-secondary">Learn More &rarr;</a>
    </div>
  </header>

  <section class="features">
    <div class="card">
      <div class="card-icon">⚡</div>
      <h3>Instant Live Preview</h3>
      <p>Edit HTML, CSS, and JS with zero delay and intelligent asset resolution.</p>
    </div>
    <div class="card">
      <div class="card-icon">🎨</div>
      <h3>Visual Element Inspector</h3>
      <p>Click elements directly in the preview to tweak typography, colors, and box spacing.</p>
    </div>
    <div class="card">
      <div class="card-icon">📦</div>
      <h3>Full ZIP & Folder Support</h3>
      <p>Drag and drop multi-page projects with nested folders and image assets effortlessly.</p>
    </div>
  </section>

  <footer>
    <p>&copy; 2026 WebStudio. Built with modern web standards.</p>
  </footer>

  <script src="js/app.js"></script>
</body>
</html>`;

const DEFAULT_ABOUT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About - WebStudio</title>
  <link rel="stylesheet" href="css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <nav class="navbar">
    <div class="logo">✨ WebStudio</div>
    <div class="nav-links">
      <a href="index.html">Home</a>
      <a href="about.html" class="active">About</a>
      <a href="index.html" class="btn btn-primary">Back to Home</a>
    </div>
  </nav>

  <main class="page-container">
    <h1 class="section-title">About WebStudio</h1>
    <p class="lead-text">
      WebStudio provides a browser-native creative environment for front-end developers, designers, and students.
    </p>
    <div class="card" style="margin-top: 2rem;">
      <h3>Multi-page navigation works right out of the box!</h3>
      <p>Clicking links inside the preview smoothly routes between your virtual project files.</p>
    </div>
  </main>

  <footer>
    <p>&copy; 2026 WebStudio. Built with modern web standards.</p>
  </footer>

  <script src="js/app.js"></script>
</body>
</html>`;

const DEFAULT_STYLE_CSS = `/* Modern CSS Reset & Theme */
:root {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --bg-dark: #0f172a;
  --card-bg: rgba(30, 41, 59, 0.7);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border: rgba(255, 255, 255, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--bg-dark);
  color: var(--text-main);
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2.5rem;
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-weight: 800;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--text-main);
}

.btn {
  padding: 0.65rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-main);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.hero {
  padding: 5rem 2rem 4rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin-bottom: 1.25rem;
  line-height: 1.15;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: var(--text-muted);
  margin-bottom: 2.25rem;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  max-width: 1080px;
  margin: 2rem auto;
  padding: 0 2rem;
  flex: 1;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  padding: 2rem;
  border-radius: 1rem;
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.4);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.card p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.page-container {
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 2rem;
  flex: 1;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.lead-text {
  font-size: 1.2rem;
  color: var(--text-muted);
}

footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  border-top: 1px solid var(--border);
  margin-top: auto;
}
`;

const DEFAULT_APP_JS = `// Interactive logic for WebStudio live preview
console.log("🚀 WebStudio live preview initialized!");

const ctaBtn = document.getElementById('cta-btn');
const exploreBtn = document.getElementById('explore-btn');

if (exploreBtn) {
  exploreBtn.addEventListener('click', () => {
    alert("🎉 Live interactive JavaScript works perfectly inside the preview!");
    console.log("Interactive button clicked at", new Date().toLocaleTimeString());
  });
}

if (ctaBtn) {
  ctaBtn.addEventListener('click', () => {
    console.info("CTA button triggered.");
  });
}
`;

function createDefaultFiles(): Record<string, VirtualFile> {
  const now = Date.now();
  return {
    'index.html': {
      id: 'file-index-html',
      path: 'index.html',
      name: 'index.html',
      type: 'file',
      content: DEFAULT_INDEX_HTML,
      isBinary: false,
      updatedAt: now,
    },
    'about.html': {
      id: 'file-about-html',
      path: 'about.html',
      name: 'about.html',
      type: 'file',
      content: DEFAULT_ABOUT_HTML,
      isBinary: false,
      updatedAt: now,
    },
    'css/style.css': {
      id: 'file-style-css',
      path: 'css/style.css',
      name: 'style.css',
      type: 'file',
      content: DEFAULT_STYLE_CSS,
      isBinary: false,
      updatedAt: now,
    },
    'js/app.js': {
      id: 'file-app-js',
      path: 'js/app.js',
      name: 'app.js',
      type: 'file',
      content: DEFAULT_APP_JS,
      isBinary: false,
      updatedAt: now,
    },
  };
}

export interface ProjectStoreActions {
  // File operations
  addFile: (path: string, content?: string, isBinary?: boolean, blob?: Blob) => void;
  updateFile: (path: string, content: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
  deleteFile: (path: string) => void;
  deleteFolder: (folderPath: string) => void;
  createFolder: (folderPath: string) => void;
  
  // Navigation & tabs
  setActiveFile: (path: string | null) => void;
  openTab: (path: string) => void;
  closeTab: (path: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (keepPath: string) => void;
  setPreviewCurrentPath: (path: string) => void;
  setEntryHtmlPath: (path: string) => void;

  // Direct Visual Inspector
  setCanvasMode: (mode: CanvasMode) => void;
  toggleCanvasMode: () => void;
  setIsInspectMode: (enabled: boolean) => void;
  toggleInspectMode: () => void;
  setIsInspectorPanelOpen: (isOpen: boolean) => void;
  setSelectedElement: (element: InspectedElementData | null) => void;
  setHoveredElementInfo: (info: ProjectState['hoveredElementInfo']) => void;
  updateSelectedElementStyle: (property: string, value: string) => void;
  updateSelectedElementText: (newText: string) => void;
  updateSelectedElementAttribute: (name: string, value: string) => void;
  addClassToSelectedElement: (className: string) => void;
  removeClassFromSelectedElement: (className: string) => void;
  changeSelectedElementTag: (newTag: string) => void;
  duplicateSelectedElement: () => void;
  deleteSelectedElement: () => void;
  moveSelectedElementUp: () => void;
  moveSelectedElementDown: () => void;
  jumpToSelectedElementInCode: () => void;
  clearJumpToCodeTarget: () => void;

  // Preview & console
  setViewportMode: (mode: ViewportMode) => void;
  reloadPreview: () => void;
  addConsoleLog: (log: Omit<ConsoleLogMessage, 'id' | 'timestamp'>) => void;
  clearConsoleLogs: () => void;
  setIsBottomPanelOpen: (isOpen: boolean) => void;
  setBottomPanelTab: (tab: 'console' | 'problems') => void;

  // Project management
  setProjectName: (name: string) => void;
  loadProject: (files: Record<string, VirtualFile>, projectName?: string) => void;
  resetProject: () => void;
  persistToStorage: () => Promise<void>;
  restoreFromStorage: () => Promise<boolean>;
}

export const useProjectStore = create<ProjectState & ProjectStoreActions>((setStore, getStore) => ({
  projectName: 'My Web Project',
  files: createDefaultFiles(),
  activeFilePath: 'index.html',
  openTabs: ['index.html', 'css/style.css'],
  entryHtmlPath: 'index.html',
  previewCurrentPath: 'index.html',
  canvasMode: 'design',
  isInspectMode: true,
  selectedElement: null,
  hoveredElementInfo: null,
  consoleLogs: [],
  viewportMode: 'desktop',
  isBottomPanelOpen: false,
  bottomPanelTab: 'console',
  previewKey: 0,
  jumpToCodeTarget: null,
  isInspectorPanelOpen: true,

  addFile: (path: string, content = '', isBinary = false, blob?: Blob) => {
    const normalized = normalizePath(path);
    if (!normalized) return;

    const fileName = getFileName(normalized);
    const binary = isBinary || isImageFile(normalized);
    let blobUrl: string | undefined;

    if (binary && blob && typeof window !== 'undefined') {
      blobUrl = URL.createObjectURL(blob);
    }

    const newFile: VirtualFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      path: normalized,
      name: fileName,
      type: 'file',
      content,
      isBinary: binary,
      binaryBlob: blob,
      blobUrl,
      updatedAt: Date.now(),
    };

    setStore((state) => {
      const files = { ...state.files, [normalized]: newFile };
      const openTabs = state.openTabs.includes(normalized) ? state.openTabs : [...state.openTabs, normalized];
      return {
        files,
        openTabs,
        activeFilePath: normalized,
      };
    });

    getStore().persistToStorage();
  },

  updateFile: (path: string, content: string) => {
    const normalized = normalizePath(path);
    const existing = getStore().files[normalized];
    if (!existing) return;

    setStore((state) => ({
      files: {
        ...state.files,
        [normalized]: {
          ...existing,
          content,
          updatedAt: Date.now(),
        },
      },
    }));

    getStore().persistToStorage();
  },

  renameFile: (oldPath: string, newPath: string) => {
    const oldNorm = normalizePath(oldPath);
    const newNorm = normalizePath(newPath);
    if (!oldNorm || !newNorm || oldNorm === newNorm) return;

    setStore((state) => {
      const file = state.files[oldNorm];
      if (!file) return state;

      const newFiles = { ...state.files };
      delete newFiles[oldNorm];
      newFiles[newNorm] = {
        ...file,
        path: newNorm,
        name: getFileName(newNorm),
        updatedAt: Date.now(),
      };

      const openTabs = state.openTabs.map((t) => (t === oldNorm ? newNorm : t));
      const activeFilePath = state.activeFilePath === oldNorm ? newNorm : state.activeFilePath;
      const previewCurrentPath = state.previewCurrentPath === oldNorm ? newNorm : state.previewCurrentPath;
      const entryHtmlPath = state.entryHtmlPath === oldNorm ? newNorm : state.entryHtmlPath;

      return {
        files: newFiles,
        openTabs,
        activeFilePath,
        previewCurrentPath,
        entryHtmlPath,
      };
    });

    getStore().persistToStorage();
  },

  deleteFile: (path: string) => {
    const normalized = normalizePath(path);
    setStore((state) => {
      const file = state.files[normalized];
      if (file?.blobUrl && typeof window !== 'undefined') {
        URL.revokeObjectURL(file.blobUrl);
      }

      const newFiles = { ...state.files };
      delete newFiles[normalized];

      const openTabs = state.openTabs.filter((t) => t !== normalized);
      let activeFilePath = state.activeFilePath;

      if (activeFilePath === normalized) {
        activeFilePath = openTabs.length > 0 ? openTabs[openTabs.length - 1] : Object.keys(newFiles)[0] || null;
      }

      return {
        files: newFiles,
        openTabs,
        activeFilePath,
      };
    });

    getStore().persistToStorage();
  },

  deleteFolder: (folderPath: string) => {
    const normalized = normalizePath(folderPath) + '/';
    setStore((state) => {
      const newFiles = { ...state.files };
      const deletedPaths: string[] = [];

      Object.keys(state.files).forEach((filePath) => {
        if (filePath.startsWith(normalized) || filePath === normalizePath(folderPath)) {
          const file = state.files[filePath];
          if (file?.blobUrl && typeof window !== 'undefined') {
            URL.revokeObjectURL(file.blobUrl);
          }
          delete newFiles[filePath];
          deletedPaths.push(filePath);
        }
      });

      const openTabs = state.openTabs.filter((t) => !deletedPaths.includes(t));
      let activeFilePath = state.activeFilePath;
      if (activeFilePath && deletedPaths.includes(activeFilePath)) {
        activeFilePath = openTabs.length > 0 ? openTabs[0] : Object.keys(newFiles)[0] || null;
      }

      return {
        files: newFiles,
        openTabs,
        activeFilePath,
      };
    });

    getStore().persistToStorage();
  },

  createFolder: (folderPath: string) => {
    const normalized = normalizePath(folderPath);
    if (!normalized) return;
    const placeholder = `${normalized}/.gitkeep`;
    getStore().addFile(placeholder, '', false);
  },

  setActiveFile: (path: string | null) => {
    if (!path) {
      setStore({ activeFilePath: null });
      return;
    }
    const normalized = normalizePath(path);
    setStore((state) => {
      const openTabs = state.openTabs.includes(normalized) ? state.openTabs : [...state.openTabs, normalized];
      return {
        activeFilePath: normalized,
        openTabs,
      };
    });
  },

  openTab: (path: string) => {
    const normalized = normalizePath(path);
    setStore((state) => {
      if (state.openTabs.includes(normalized)) return state;
      return { openTabs: [...state.openTabs, normalized] };
    });
  },

  closeTab: (path: string) => {
    const normalized = normalizePath(path);
    setStore((state) => {
      const openTabs = state.openTabs.filter((t) => t !== normalized);
      let activeFilePath = state.activeFilePath;
      if (activeFilePath === normalized) {
        activeFilePath = openTabs.length > 0 ? openTabs[openTabs.length - 1] : null;
      }
      return {
        openTabs,
        activeFilePath,
      };
    });
  },

  closeAllTabs: () => {
    setStore({ openTabs: [], activeFilePath: null });
  },

  closeOtherTabs: (keepPath: string) => {
    const normalized = normalizePath(keepPath);
    setStore({ openTabs: [normalized], activeFilePath: normalized });
  },

  setPreviewCurrentPath: (path: string) => {
    const normalized = normalizePath(path);
    setStore({ previewCurrentPath: normalized });
  },

  setEntryHtmlPath: (path: string) => {
    const normalized = normalizePath(path);
    setStore({ entryHtmlPath: normalized, previewCurrentPath: normalized });
  },

  setCanvasMode: (mode: CanvasMode) => {
    setStore({ canvasMode: mode, isInspectMode: mode === 'design' });
  },

  toggleCanvasMode: () => {
    const current = getStore().canvasMode;
    const next = current === 'design' ? 'interact' : 'design';
    setStore({ canvasMode: next, isInspectMode: next === 'design' });
  },

  setIsInspectMode: (enabled: boolean) => {
    setStore({ isInspectMode: enabled, canvasMode: enabled ? 'design' : 'interact' });
  },

  toggleInspectMode: () => {
    const next = !getStore().isInspectMode;
    setStore({ isInspectMode: next, canvasMode: next ? 'design' : 'interact' });
  },

  setIsInspectorPanelOpen: (isOpen: boolean) => {
    setStore({ isInspectorPanelOpen: isOpen });
  },

  setSelectedElement: (element: InspectedElementData | null) => {
    setStore({ selectedElement: element, isInspectorPanelOpen: element !== null ? true : getStore().isInspectorPanelOpen });
  },

  setHoveredElementInfo: (info) => {
    setStore({ hoveredElementInfo: info });
  },

  updateSelectedElementStyle: (property: string, value: string) => {
    const selected = getStore().selectedElement;
    if (!selected) return;

    const activeHtmlPath = getStore().previewCurrentPath;
    const htmlFile = getStore().files[activeHtmlPath];
    if (!htmlFile) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFile.content, 'text/html');

    let targetEl: Element | null = null;
    try {
      targetEl = doc.querySelector(selected.selector);
    } catch {
      if (selected.id) targetEl = doc.getElementById(selected.id);
    }

    if (targetEl) {
      const htmlEl = targetEl as HTMLElement;
      htmlEl.style.setProperty(property, value);
      const updatedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      getStore().updateFile(activeHtmlPath, updatedHtml);

      setStore((state) => ({
        selectedElement: state.selectedElement
          ? {
              ...state.selectedElement,
              computedStyles: {
                ...state.selectedElement.computedStyles,
                [property]: value,
              },
            }
          : null,
      }));
    }
  },

  updateSelectedElementText: (newText: string) => {
    const selected = getStore().selectedElement;
    if (!selected) return;

    const activeHtmlPath = getStore().previewCurrentPath;
    const htmlFile = getStore().files[activeHtmlPath];
    if (!htmlFile) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFile.content, 'text/html');

    let targetEl: Element | null = null;
    try {
      targetEl = doc.querySelector(selected.selector);
    } catch {
      if (selected.id) targetEl = doc.getElementById(selected.id);
    }

    if (targetEl) {
      targetEl.textContent = newText;
      const updatedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      getStore().updateFile(activeHtmlPath, updatedHtml);

      setStore((state) => ({
        selectedElement: state.selectedElement
          ? { ...state.selectedElement, innerText: newText }
          : null,
      }));
    }
  },

  updateSelectedElementAttribute: (name: string, value: string) => {
    const selected = getStore().selectedElement;
    if (!selected) return;

    const activeHtmlPath = getStore().previewCurrentPath;
    const htmlFile = getStore().files[activeHtmlPath];
    if (!htmlFile) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFile.content, 'text/html');

    let targetEl: Element | null = null;
    try {
      targetEl = doc.querySelector(selected.selector);
    } catch {
      if (selected.id) targetEl = doc.getElementById(selected.id);
    }

    if (targetEl) {
      if (value === '') {
        targetEl.removeAttribute(name);
      } else {
        targetEl.setAttribute(name, value);
      }
      const updatedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      getStore().updateFile(activeHtmlPath, updatedHtml);

      const updatedAttrs = { ...selected.attributes };
      if (value === '') {
        delete updatedAttrs[name];
      } else {
        updatedAttrs[name] = value;
      }

      setStore((state) => ({
        selectedElement: state.selectedElement
          ? {
              ...state.selectedElement,
              attributes: updatedAttrs,
              id: name === 'id' ? value : state.selectedElement.id,
            }
          : null,
      }));
    }
  },

  addClassToSelectedElement: (className: string) => {
    const cleanClass = className.trim();
    if (!cleanClass) return;

    const selected = getStore().selectedElement;
    if (!selected) return;

    const currentClasses = selected.classList || [];
    if (currentClasses.includes(cleanClass)) return;

    const newClasses = [...currentClasses, cleanClass];
    const newClassAttr = newClasses.join(' ');

    getStore().updateSelectedElementAttribute('class', newClassAttr);

    setStore((state) => ({
      selectedElement: state.selectedElement
        ? {
            ...state.selectedElement,
            classList: newClasses,
          }
        : null,
    }));
  },

  removeClassFromSelectedElement: (className: string) => {
    const selected = getStore().selectedElement;
    if (!selected) return;

    const currentClasses = selected.classList || [];
    const newClasses = currentClasses.filter((c) => c !== className);
    const newClassAttr = newClasses.join(' ');

    getStore().updateSelectedElementAttribute('class', newClassAttr);

    setStore((state) => ({
      selectedElement: state.selectedElement
        ? {
            ...state.selectedElement,
            classList: newClasses,
          }
        : null,
    }));
  },

  changeSelectedElementTag: (newTag: string) => {
    const cleanTag = newTag.trim().toLowerCase();
    const selected = getStore().selectedElement;
    if (!selected || !cleanTag || cleanTag === selected.tagName) return;

    const activeHtmlPath = getStore().previewCurrentPath;
    const htmlFile = getStore().files[activeHtmlPath];
    if (!htmlFile) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFile.content, 'text/html');

    let targetEl: Element | null = null;
    try {
      targetEl = doc.querySelector(selected.selector);
    } catch {
      if (selected.id) targetEl = doc.getElementById(selected.id);
    }

    if (targetEl && targetEl.parentNode) {
      const newEl = doc.createElement(cleanTag);
      // Copy attributes
      Array.from(targetEl.attributes).forEach((attr) => {
        newEl.setAttribute(attr.name, attr.value);
      });
      // Copy children
      while (targetEl.firstChild) {
        newEl.appendChild(targetEl.firstChild);
      }

      targetEl.parentNode.replaceChild(newEl, targetEl);
      const updatedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      getStore().updateFile(activeHtmlPath, updatedHtml);

      setStore((state) => ({
        selectedElement: state.selectedElement
          ? {
              ...state.selectedElement,
              tagName: cleanTag,
            }
          : null,
      }));
    }
  },

  duplicateSelectedElement: () => {
    const selected = getStore().selectedElement;
    if (!selected) return;

    const activeHtmlPath = getStore().previewCurrentPath;
    const htmlFile = getStore().files[activeHtmlPath];
    if (!htmlFile) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFile.content, 'text/html');

    let targetEl: Element | null = null;
    try {
      targetEl = doc.querySelector(selected.selector);
    } catch {
      if (selected.id) targetEl = doc.getElementById(selected.id);
    }

    if (targetEl && targetEl.parentNode) {
      const clone = targetEl.cloneNode(true) as Element;
      if (clone.id) {
        clone.id = `${clone.id}-copy`;
      }
      targetEl.parentNode.insertBefore(clone, targetEl.nextSibling);
      const updatedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      getStore().updateFile(activeHtmlPath, updatedHtml);
    }
  },

  deleteSelectedElement: () => {
    const selected = getStore().selectedElement;
    if (!selected) return;

    const activeHtmlPath = getStore().previewCurrentPath;
    const htmlFile = getStore().files[activeHtmlPath];
    if (!htmlFile) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFile.content, 'text/html');

    let targetEl: Element | null = null;
    try {
      targetEl = doc.querySelector(selected.selector);
    } catch {
      if (selected.id) targetEl = doc.getElementById(selected.id);
    }

    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.removeChild(targetEl);
      const updatedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      getStore().updateFile(activeHtmlPath, updatedHtml);
      setStore({ selectedElement: null });
    }
  },

  moveSelectedElementUp: () => {
    const selected = getStore().selectedElement;
    if (!selected) return;

    const activeHtmlPath = getStore().previewCurrentPath;
    const htmlFile = getStore().files[activeHtmlPath];
    if (!htmlFile) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFile.content, 'text/html');

    let targetEl: Element | null = null;
    try {
      targetEl = doc.querySelector(selected.selector);
    } catch {
      if (selected.id) targetEl = doc.getElementById(selected.id);
    }

    if (targetEl && targetEl.parentNode && targetEl.previousElementSibling) {
      targetEl.parentNode.insertBefore(targetEl, targetEl.previousElementSibling);
      const updatedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      getStore().updateFile(activeHtmlPath, updatedHtml);
    }
  },

  moveSelectedElementDown: () => {
    const selected = getStore().selectedElement;
    if (!selected) return;

    const activeHtmlPath = getStore().previewCurrentPath;
    const htmlFile = getStore().files[activeHtmlPath];
    if (!htmlFile) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFile.content, 'text/html');

    let targetEl: Element | null = null;
    try {
      targetEl = doc.querySelector(selected.selector);
    } catch {
      if (selected.id) targetEl = doc.getElementById(selected.id);
    }

    if (targetEl && targetEl.parentNode && targetEl.nextElementSibling) {
      targetEl.parentNode.insertBefore(targetEl.nextElementSibling, targetEl);
      const updatedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
      getStore().updateFile(activeHtmlPath, updatedHtml);
    }
  },

  jumpToSelectedElementInCode: () => {
    const selected = getStore().selectedElement;
    if (!selected) return;

    const activeHtmlPath = getStore().previewCurrentPath;
    const htmlFile = getStore().files[activeHtmlPath];
    if (!htmlFile) return;

    const lines = htmlFile.content.split('\n');
    let targetLine = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (selected.id && line.includes(`id="${selected.id}"`)) {
        targetLine = i + 1;
        break;
      }
      if (selected.classList.length > 0 && line.includes(selected.classList[0]) && line.includes(`<${selected.tagName}`)) {
        targetLine = i + 1;
        break;
      }
      if (line.includes(`<${selected.tagName}`)) {
        targetLine = i + 1;
      }
    }

    getStore().setActiveFile(activeHtmlPath);
    setStore({
      jumpToCodeTarget: {
        filePath: activeHtmlPath,
        line: targetLine,
        selector: selected.selector,
      },
    });
  },

  clearJumpToCodeTarget: () => {
    setStore({ jumpToCodeTarget: null });
  },

  setViewportMode: (mode: ViewportMode) => {
    setStore({ viewportMode: mode });
  },

  reloadPreview: () => {
    setStore((state) => ({ previewKey: state.previewKey + 1 }));
  },

  addConsoleLog: (log) => {
    const newLog: ConsoleLogMessage = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    setStore((state) => ({
      consoleLogs: [...state.consoleLogs.slice(-150), newLog],
    }));
  },

  clearConsoleLogs: () => {
    setStore({ consoleLogs: [] });
  },

  setIsBottomPanelOpen: (isOpen: boolean) => {
    setStore({ isBottomPanelOpen: isOpen });
  },

  setBottomPanelTab: (tab) => {
    setStore({ bottomPanelTab: tab });
  },

  setProjectName: (name: string) => {
    setStore({ projectName: name });
    getStore().persistToStorage();
  },

  loadProject: (files: Record<string, VirtualFile>, projectName = 'Imported Project') => {
    const fileKeys = Object.keys(files);
    let entryHtml = fileKeys.find((k) => k === 'index.html' || k.endsWith('index.html')) || fileKeys.find((k) => k.endsWith('.html')) || fileKeys[0];

    setStore({
      projectName,
      files,
      activeFilePath: entryHtml || null,
      openTabs: entryHtml ? [entryHtml] : fileKeys.slice(0, 3),
      entryHtmlPath: entryHtml || 'index.html',
      previewCurrentPath: entryHtml || 'index.html',
      consoleLogs: [],
      selectedElement: null,
      canvasMode: 'design',
      isInspectMode: true,
      isInspectorPanelOpen: true,
    });

    getStore().persistToStorage();
  },

  resetProject: () => {
    setStore({
      projectName: 'My Web Project',
      files: createDefaultFiles(),
      activeFilePath: 'index.html',
      openTabs: ['index.html', 'css/style.css'],
      entryHtmlPath: 'index.html',
      previewCurrentPath: 'index.html',
      canvasMode: 'design',
      isInspectMode: true,
      selectedElement: null,
      consoleLogs: [],
      isInspectorPanelOpen: true,
    });
  },

  persistToStorage: async () => {
    try {
      const state = getStore();
      const serializableFiles: Record<string, any> = {};
      
      for (const [path, file] of Object.entries(state.files)) {
        serializableFiles[path] = {
          id: file.id,
          path: file.path,
          name: file.name,
          type: file.type,
          content: file.content,
          isBinary: file.isBinary,
          updatedAt: file.updatedAt,
          binaryBlob: file.binaryBlob,
        };
      }

      await set(IDB_PROJECT_KEY, {
        projectName: state.projectName,
        files: serializableFiles,
        activeFilePath: state.activeFilePath,
        openTabs: state.openTabs,
        entryHtmlPath: state.entryHtmlPath,
      });
    } catch (e) {
      console.warn('Failed to persist project to IndexedDB:', e);
    }
  },

  restoreFromStorage: async () => {
    try {
      const saved = await get<any>(IDB_PROJECT_KEY);
      if (!saved || !saved.files || Object.keys(saved.files).length === 0) {
        return false;
      }

      const files: Record<string, VirtualFile> = {};
      for (const [path, file] of Object.entries<any>(saved.files)) {
        let blobUrl: string | undefined;
        if (file.isBinary && file.binaryBlob && typeof window !== 'undefined') {
          blobUrl = URL.createObjectURL(file.binaryBlob);
        }
        files[path] = {
          ...file,
          blobUrl,
        };
      }

      setStore({
        projectName: saved.projectName || 'Restored Project',
        files,
        activeFilePath: saved.activeFilePath || Object.keys(files)[0] || null,
        openTabs: saved.openTabs || Object.keys(files).slice(0, 3),
        entryHtmlPath: saved.entryHtmlPath || 'index.html',
        previewCurrentPath: saved.entryHtmlPath || 'index.html',
      });
      return true;
    } catch (e) {
      console.warn('Failed to restore project from IndexedDB:', e);
      return false;
    }
  },
}));
