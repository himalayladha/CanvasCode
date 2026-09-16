# Real-Time HTML Project Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-performance browser-based multi-file HTML project editor with Monaco code editor, live sandboxed iframe preview with asset resolution, interactive visual element inspector, and ZIP/folder import/export.

**Architecture:** React + TypeScript client-side SPA with Zustand VFS store, IndexedDB persistence, Monaco editor tabs, AST/regex asset bundling for live iframe preview with postMessage bridge, and responsive UI panels using Tailwind CSS.

**Tech Stack:** React 18/19, TypeScript, Vite, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Zustand, idb-keyval, JSZip, Lucide-React, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-16-html-project-editor-design.md`

## Global Constraints
- Pure client-side application compatible with Vercel Edge/CDN static hosting.
- Safe sandboxed iframe execution (`sandbox="allow-scripts allow-modals allow-forms"`).
- Multi-file relative asset mapping (CSS, JS, images, links).
- Zero-loss export/import round-trips via JSZip.
- Full test coverage with Vitest for VFS, bundler, and ZIP services.

---

### Task 1: Project Scaffolding & Testing Setup
**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/index.css`, `src/App.tsx`, `src/main.tsx`, `vitest.config.ts`, `src/test/setup.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: Running Vite dev server, Vitest test suite runner, Tailwind CSS environment.

- [ ] **Step 1: Write package.json and project configuration**
- [ ] **Step 2: Install dependencies (React, Vite, Tailwind, Monaco, Zustand, JSZip, Lucide, Vitest)**
- [ ] **Step 3: Create base App and test setup**
- [ ] **Step 4: Run test to verify scaffolding**
- [ ] **Step 5: Commit scaffolding**

---

### Task 2: VFS Core Store, Path Utilities & Local Persistence
**Files:**
- Create: `src/types/vfs.ts`
- Create: `src/utils/pathUtils.ts`
- Create: `src/store/useProjectStore.ts`
- Test: `src/store/useProjectStore.test.ts`, `src/utils/pathUtils.test.ts`

**Interfaces:**
- Consumes: Zustand, idb-keyval
- Produces: `useProjectStore` hook with `files`, `activeFilePath`, `openTabs`, `addFile`, `updateFile`, `renameFile`, `deleteFile`, `createFolder`, `setActiveFile`, `closeTab`.

- [ ] **Step 1: Write failing unit tests for path utilities and VFS store**
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement pathUtils.ts and useProjectStore.ts**
- [ ] **Step 4: Run tests to verify PASS**
- [ ] **Step 5: Commit VFS module**

---

### Task 3: Live Preview Bundler, Asset Resolver & Iframe Bridge
**Files:**
- Create: `src/services/iframeBridgeScript.ts`
- Create: `src/services/previewBundler.ts`
- Test: `src/services/previewBundler.test.ts`

**Interfaces:**
- Consumes: `VirtualFile` map from `useProjectStore`
- Produces: `bundleProjectForPreview(files, currentHtmlPath): string` returning executable sandboxed HTML with inlined/blob-mapped assets and injected bridge script.

- [ ] **Step 1: Write failing unit tests for preview bundling and relative path resolution**
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement iframeBridgeScript and previewBundler**
- [ ] **Step 4: Run tests to verify PASS**
- [ ] **Step 5: Commit Preview Bundler**

---

### Task 4: Monaco Code Editor, Tabs & Image Viewer
**Files:**
- Create: `src/components/editor/TabBar.tsx`
- Create: `src/components/editor/ImageViewer.tsx`
- Create: `src/components/editor/CodeEditor.tsx`
- Create: `src/components/editor/EditorWorkspace.tsx`
- Test: `src/components/editor/TabBar.test.tsx`

**Interfaces:**
- Consumes: `@monaco-editor/react`, `useProjectStore`
- Produces: `EditorWorkspace` component with multi-tab switching, Monaco language detection, and binary image viewer.

- [ ] **Step 1: Write failing test for TabBar**
- [ ] **Step 2: Verify test fails**
- [ ] **Step 3: Implement TabBar, ImageViewer, CodeEditor, and EditorWorkspace**
- [ ] **Step 4: Verify test passes**
- [ ] **Step 5: Commit Editor components**

---

### Task 5: File Explorer Tree & Context Operations
**Files:**
- Create: `src/components/filetree/FileTreeNode.tsx`
- Create: `src/components/filetree/FileTree.tsx`
- Create: `src/components/filetree/NewItemModal.tsx`
- Test: `src/components/filetree/FileTree.test.tsx`

**Interfaces:**
- Consumes: `useProjectStore`
- Produces: Hierarchical `FileTree` with expand/collapse, file icons, inline/modal create, rename, delete actions.

- [ ] **Step 1: Write failing test for FileTree**
- [ ] **Step 2: Verify test fails**
- [ ] **Step 3: Implement FileTreeNode, FileTree, and NewItemModal**
- [ ] **Step 4: Verify test passes**
- [ ] **Step 5: Commit FileTree components**

---

### Task 6: Live Preview Pane, Viewport Switcher & Console Panel
**Files:**
- Create: `src/components/preview/PreviewPane.tsx`
- Create: `src/components/console/ConsolePanel.tsx`
- Test: `src/components/console/ConsolePanel.test.tsx`

**Interfaces:**
- Consumes: `previewBundler`, `useProjectStore`
- Produces: Responsive iframe viewport (desktop, tablet, mobile), reload/inspect controls, and structured console/error stream viewer.

- [ ] **Step 1: Write failing test for ConsolePanel**
- [ ] **Step 2: Verify test fails**
- [ ] **Step 3: Implement PreviewPane and ConsolePanel**
- [ ] **Step 4: Verify test passes**
- [ ] **Step 5: Commit Preview and Console components**

---

### Task 7: Visual Element Inspector & Live Style/Text Sync
**Files:**
- Create: `src/components/inspector/VisualInspector.tsx`
- Create: `src/components/inspector/ColorPickerInput.tsx`
- Create: `src/components/inspector/BoxModelControl.tsx`
- Test: `src/components/inspector/VisualInspector.test.tsx`

**Interfaces:**
- Consumes: `useProjectStore`, `selectedElement` bridge state
- Produces: Real-time visual inspector sidebar with tag/class editor, text content modification, typography, color pickers, and box model spacing sync.

- [ ] **Step 1: Write failing test for VisualInspector**
- [ ] **Step 2: Verify test fails**
- [ ] **Step 3: Implement VisualInspector and controls**
- [ ] **Step 4: Verify test passes**
- [ ] **Step 5: Commit Visual Inspector components**

---

### Task 8: ZIP Import/Export, Folder Upload & Starter Templates
**Files:**
- Create: `src/services/zipService.ts`
- Create: `src/data/starterTemplates.ts`
- Create: `src/components/toolbar/TopToolbar.tsx`
- Create: `src/components/toolbar/TemplateModal.tsx`
- Test: `src/services/zipService.test.ts`

**Interfaces:**
- Consumes: `jszip`, `useProjectStore`
- Produces: ZIP export, ZIP upload/drag & drop, folder upload, template loader, and top navigation toolbar.

- [ ] **Step 1: Write failing test for zipService**
- [ ] **Step 2: Verify test fails**
- [ ] **Step 3: Implement zipService, starterTemplates, TopToolbar, TemplateModal**
- [ ] **Step 4: Verify test passes**
- [ ] **Step 5: Commit Import/Export and Templates**

---

### Task 9: Main App Layout, Resizable Panels & Verification
**Files:**
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: All UI components
- Produces: Complete responsive studio layout with resizable split panes, drag-and-drop overlay, keyboard shortcuts, and verified production build.

- [ ] **Step 1: Assemble main studio layout in App.tsx**
- [ ] **Step 2: Run all test suites across the repository**
- [ ] **Step 3: Verify production build (`npm run build`)**
- [ ] **Step 4: Commit and finalize**
