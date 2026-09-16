# Technical Specification: KompoZer-Level WYSIWYG Authoring & Layout Suite

## 1. Executive Summary
This specification defines the architecture, UI/UX components, and data workflows for upgrading WebStudio into a **KompoZer-class visual web composer**. It introduces 5 major authoring subsystems:
1. **WYSIWYG Rich-Text Ribbon & Inline Formatting Engine**
2. **Interactive Component, Form, & Table Inserter Palette**
3. **HTML DOM Breadcrumb Status Bar (Ancestor Hierarchy Selector)**
4. **4-Way View Switcher (Design, Split, Source, Interact)**
5. **Interactive DOM Outline Tree Sidebar**

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                          Top Navigation & 4-Way View Switcher                               │
│  [Project Name]  [🎨 Design | ◫ Split | 📄 Source | ▶ Interact]  [Insert ▾] [Export ZIP]    │
├──────────────┬───────────────────────────────┬──────────────────────────────────────────────┤
│ Left Sidebar │ Monaco Code Editor            │ Live WYSIWYG Preview & Canvas                │
│ [Files|DOM]  │                               │ ┌──────────────────────────────────────────┐ │
│ 🌲 DOM Tree  │ (Visible in Split & Source)   │ │ WYSIWYG Ribbon: [B][I][U][H1▾][Font▾][🎨]│ │
│  body        │                               │ ├──────────────────────────────────────────┤ │
│  └ header    │                               │ │                                          │ │
│    └ nav     │                               │ │   Canvas Website Content                 │ │
│  └ section   │                               │ │   (Direct Editing & Click Inspection)    │ │
│    └ h1      │                               │ │                                          │ │
│              │                               │ └──────────────────────────────────────────┘ │
│              │                               │ 🧭 DOM Breadcrumbs: body > div > section > h1│
├──────────────┴───────────────────────────────┴──────────────────────────────────────────────┤
│ Visual Inspector / Stylesheet Sync / Console Stream                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Subsystem Breakdown

### A. WYSIWYG Rich-Text Formatting Engine (`src/components/wysiwyg/WysiwygToolbar.tsx`)
1. **Formatting Tools**:
   - **Text Formats**: Paragraph (`<p>`), Heading 1–6 (`<h1>`–`<h6>`), Blockquote (`<blockquote>`), Code (`<pre>`).
   - **Inline Formatting**: Bold (`<b>`), Italic (`<i>`), Underline (`<u>`), Strikethrough (`<s>`), Subscript (`<sub>`), Superscript (`<sup>`).
   - **Font Families**: Sans-Serif, Serif, Monospace, Inter, Roboto, Arial, Times New Roman, JetBrains Mono, System UI.
   - **Colors**: Direct Text Foreground Color and Text Background Highlight.
   - **Alignment**: Left, Center, Right, Justify.
   - **Lists & Indentation**: Bullet list (`<ul><li>`), Numbered list (`<ol><li>`), Indent, Outdent.
   - **Links**: Create/Edit Hyperlink modal with URL and target options.
   - **Clear Formatting**: Strips inline styling and formatting spans.
2. **Iframe Bridge Communication**:
   - Dispatches `WEBSTUDIO_FORMAT_TEXT` (`{ command: string, value?: string }`) to iframe contentWindow.
   - Iframe bridge applies command via `document.execCommand` on active selection, then emits `WEBSTUDIO_CANVAS_TEXT_EDITED` to synchronize raw HTML into the VFS.

---

### B. Component & Table Inserter Palette (`src/components/wysiwyg/InsertPaletteModal.tsx`)
1. **Insert Menu Items**:
   - **Table**: Interactive grid generator:
     - Configurable Rows × Columns (e.g. 3×3, 5×4).
     - Options for Header Row (`<th>`), Header Column, Border Width, Cell Padding, Striped Rows.
   - **Media**: Image dialog (browse project images from VFS or enter URL, alt text, width/height), Video, Audio, `<hr>` Horizontal Rule.
   - **Forms & Inputs**: `<form>` container, `<input type="text">`, `<input type="password">`, `<textarea>`, `<input type="checkbox">`, `<input type="radio">`, `<select>` dropdown, `<button type="submit">`.
   - **Layout Containers & Blocks**: 2-Column flexbox layout, 3-Column responsive grid, Hero section banner, Feature Card with icon, Navbar, Footer, Button badge.
2. **Store Action `insertHtmlSnippetAtSelected(snippet: string, position: 'inside' | 'after' | 'before')`**:
   - If an element is currently selected, inserts snippet adjacent to or inside target element.
   - If no element is selected, appends inside `doc.body`.
   - Serializes clean HTML to VFS and records history snapshot for Undo/Redo.

---

### C. HTML DOM Breadcrumb Status Bar (`src/components/preview/DomBreadcrumbBar.tsx`)
1. **Live Ancestor Path**:
   - Extracted when an element is selected (e.g. `body > div#app.container > section.hero > h1.title`).
   - Displays interactive clickable pill buttons for each tag in the path.
2. **Interactive Selection & Quick Actions**:
   - Clicking any ancestor tag selects that container in the Visual Inspector and highlights it on canvas.
   - Quick action menu for each breadcrumb tag:
     - **Select Tag**
     - **Delete Tag**
     - **Duplicate Tag**
     - **Wrap With Tag** (`<div>`, `<section>`, `<a>`, etc.)
     - **Change Tag Name**

---

### D. 4-Way Workspace View Modes (`src/types/vfs.ts` & `src/App.tsx`)
1. **View Modes Definition**:
   - `export type WorkspaceViewMode = 'design' | 'split' | 'source' | 'interact';`
2. **Behavior**:
   - **Design Mode**: Preview + WYSIWYG Ribbon + Inspector (Editor hidden for full-canvas authoring).
   - **Split Mode**: 50/50 Split view with Monaco Editor on left and Preview on right.
   - **Source Mode**: Full-screen Monaco Code Editor (Preview hidden).
   - **Interact Mode**: Live interaction testing (clicks, forms, JavaScript alerts).

---

### E. Live DOM Outline Tree Sidebar (`src/components/domtree/DomOutlineTree.tsx`)
1. **Sidebar Mode Toggle**:
   - Left sidebar allows switching between **Files Explorer** (`📁 Files`) and **DOM Tree** (`🌲 DOM Tree`).
2. **Tree Hierarchy**:
   - Hierarchical tree representation of `doc.body` for the active HTML page.
   - Each node displays tag badge, `#id`, `.classes`, and text preview.
   - Clicking a node selects it in the Visual Inspector and highlights it on canvas.
   - Hover buttons for Move Up, Move Down, Duplicate, Delete.

---

## 4. State & Interface Changes

```typescript
// src/types/vfs.ts

export type WorkspaceViewMode = 'design' | 'split' | 'source' | 'interact';

export interface DomBreadcrumbNode {
  tagName: string;
  id: string;
  classList: string[];
  selector: string;
  dataWebstudioId?: string;
}

export interface InspectedElementData {
  // ... existing fields ...
  ancestorPath?: DomBreadcrumbNode[];
}

export interface ProjectState {
  // ... existing fields ...
  workspaceViewMode: WorkspaceViewMode;
  sidebarTab: 'files' | 'dom';
}

export interface ProjectStoreActions {
  // ... existing actions ...
  setWorkspaceViewMode: (mode: WorkspaceViewMode) => void;
  setSidebarTab: (tab: 'files' | 'dom') => void;
  insertHtmlSnippetAtSelected: (snippet: string, position?: 'inside' | 'after' | 'before') => void;
  wrapSelectedElement: (wrapperTag: string) => void;
}
```

---

## 5. Verification & Testing Plan

### Automated Tests (`npx vitest run`)
1. **HTML Snippet Insertion**:
   - Test inserting tables, form elements, and grid layouts at selected element and in `doc.body`.
2. **Wrapping Elements**:
   - Test `wrapSelectedElement` creating parent container around target node.
3. **Workspace View Modes**:
   - Test toggling between `'design'`, `'split'`, `'source'`, and `'interact'`.
4. **DOM Breadcrumb Extraction**:
   - Test bridge script extracting accurate ancestor chain from child to `body`.
5. **WYSIWYG Rich-Text Commands**:
   - Test bold, italic, headings, links, and list commands.

### Build Verification (`npm run build`)
- Zero TypeScript errors and clean production bundle.
