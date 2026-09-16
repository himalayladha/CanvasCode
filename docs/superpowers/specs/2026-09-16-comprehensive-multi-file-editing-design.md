# Technical Specification: Comprehensive Multi-File Visual & Code Editing Suite

## 1. Overview
This specification defines the architecture, data models, and user experience for extending WebStudio's visual inspection, real-time live editing, and code navigation capabilities across **every file** in the project ecosystem—spanning all HTML pages (`index.html`, `about.html`, `contact.html`, etc.), CSS stylesheets (`css/style.css`, custom stylesheets), JavaScript files (`js/app.js`, modules), and external asset links.

---

## 2. Core Pillars

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                           Comprehensive Multi-File Editing Architecture                     │
├──────────────────────────────┬───────────────────────────────┬──────────────────────────────┤
│ 1. CSS Rule Sync             │ 2. Multi-Page Synchronization │ 3. Cross-File Jump to Code   │
│                              │                               │                              │
│ • "Save Styles to CSS"       │ • Preview page dropdown       │ • Jump to HTML Element line  │
│ • Create/Update CSS rule     │ • Bi-directional nav clicks   │ • Jump to CSS Class selector │
│ • Target selected .css file  │ • Active Monaco tab sync      │ • Jump to JS ID reference    │
│ • Clear duplicate inlines    │ • Works on all .html pages    │ • Multi-target jump buttons  │
├──────────────────────────────┴───────────────────────────────┴──────────────────────────────┤
│ 4. Quick Resource & Asset Injector                                                          │
│ • One-click link stylesheet `<link rel="stylesheet">` or script `<script src="...">`       │
│ • Instant multi-page asset linking and template creation                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Specifications

### A. CSS Stylesheet Rule Generation & Sync Engine
Allows users to apply styles either as inline HTML styles or extract/write them directly into any CSS file in the project (e.g. `css/style.css`).

1. **Store Action: `saveStylesToCssFile(cssFilePath: string, selector: string, styles: Record<string, string>, removeInlineStylesFromElement?: boolean): void`**:
   - Parses the target CSS file (`css/style.css` or chosen file).
   - If a rule for `selector` (e.g. `.hero-title` or `#cta-btn` or `.card-highlight`) already exists, merges the new CSS properties into the existing block.
   - If the rule does not exist, appends a neatly formatted CSS rule block:
     ```css
     .hero-title {
       color: #6366f1;
       font-size: 2.5rem;
       font-weight: 700;
     }
     ```
   - Updates `files[cssFilePath]` in VFS and pushes to Undo/Redo history.
   - If `removeInlineStylesFromElement` is true, removes the extracted inline style properties from the HTML element to keep markup pristine and let CSS stylesheet classes drive the styling.

2. **Visual Inspector UI Controls**:
   - In `VisualInspector.tsx`, add a "Save to CSS Stylesheet" action section:
     - Dropdown selecting the target CSS file (defaults to `css/style.css` or first `.css` file found).
     - Input field for CSS Selector/Class name (defaults to first class or `#id` or `.custom-style`).
     - "Save Styles to Stylesheet" action button with visual feedback badge.

---

### B. Seamless Multi-Page Synchronization
Ensures that visual inspection and code editing are fully synchronized across all HTML pages in the project.

1. **Active Page & Preview Synchronization**:
   - When the user selects a page in the Preview dropdown (e.g. `about.html`), `previewCurrentPath` updates to `about.html`.
   - The editor workspace automatically opens or switches to `about.html` in the Monaco editor tabs.
   - When the user clicks an internal link (e.g. `<a href="about.html">`) in Interact Mode:
     - `WEBSTUDIO_NAVIGATE_TO` updates both `previewCurrentPath` and `activeFilePath`.
     - Opens the corresponding tab in Monaco.
   - When inspecting elements in Design Mode on `about.html`, all edits write directly to `files['about.html']`.

2. **Fallback & Multi-Page Template Creation**:
   - Any newly created HTML file (`pricing.html`, `contact.html`) is immediately available in the preview page selector and fully editable via Design Mode and Monaco.

---

### C. Cross-File Smart "Jump to Code"
Extends the existing "Jump to Code" feature into a multi-target navigator:

1. **HTML Target**:
   - Locates the element by `id`, `classList[0]`, or tag in the active HTML file (`files[previewCurrentPath]`).
   - Switches active tab to the HTML file and scrolls Monaco to the exact line.

2. **CSS Target**:
   - Searches all `.css` files in the project for rules matching `.${class}` or `#${id}` or tag name.
   - Switches active tab to the matching CSS file (e.g. `css/style.css`) and scrolls Monaco directly to the CSS rule.

3. **JS Target**:
   - Searches all `.js` files for references to `id` (e.g. `getElementById('${id}')`, `querySelector('#${id}')`, or event listeners).
   - Switches active tab to `js/app.js` and positions cursor on the relevant JavaScript logic line.

4. **UI Integration**:
   - In the Visual Inspector header, render dedicated jump buttons:
     - `Jump to HTML` (HTML code line)
     - `Jump to CSS` (CSS rule line)
     - `Jump to JS` (JS reference line)

---

### D. Quick Resource & Link Injector
1. **Inject Link Action**:
   - When editing any HTML file, if `css/style.css` or `js/app.js` is not referenced in `<head>` or `<body>`, provide 1-click helper buttons:
     - "Link `css/style.css` to this page"
     - "Link `js/app.js` to this page"
   - Automatically inserts standard `<link rel="stylesheet" href="css/style.css">` inside `<head>` or `<script src="js/app.js"></script>` before `</body>`.

---

## 4. State & Interface Changes

```typescript
// src/types/vfs.ts & src/store/useProjectStore.ts

export interface ProjectStoreActions {
  // CSS Stylesheet Sync
  saveStylesToCssFile: (
    cssFilePath: string,
    selector: string,
    styles: Record<string, string>,
    removeInlineStylesFromElement?: boolean
  ) => void;

  // Cross-file navigation
  jumpToCssRuleInCode: (selector: string) => void;
  jumpToJsReferenceInCode: (idOrSelector: string) => void;

  // Resource injection
  injectResourceLinkToActiveHtml: (resourceType: 'css' | 'js', resourcePath: string) => void;
}
```

---

## 5. Verification Plan

### Automated Tests (`npx vitest run`)
1. **CSS Stylesheet Rule Generation**:
   - Test creating a new rule in `css/style.css`.
   - Test merging/updating an existing rule in `css/style.css`.
   - Test optional inline style removal from HTML upon CSS extraction.
2. **Multi-Page Sync & Editing**:
   - Test inspecting and updating elements on `about.html` and custom `.html` pages.
   - Test page switching and auto-tab opening.
3. **Cross-File Jump to Code**:
   - Test locating CSS rule lines in `css/style.css`.
   - Test locating JS reference lines in `js/app.js`.
4. **Resource Injection**:
   - Test injecting `<link>` and `<script>` tags into arbitrary HTML documents.

### Build Verification (`npm run build`)
- Zero TypeScript errors and clean production asset bundling.
