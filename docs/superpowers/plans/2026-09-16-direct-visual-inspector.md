# Direct Visual Inspector & Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the live preview canvas into a direct Webflow/Framer-style visual editor where elements are directly clickable and editable by default, with on-canvas inline typing, persistent docked inspector, tag switching, flex/grid layout controls, custom CSS rules, and DOM reordering.

**Architecture:** Default 'design' mode in iframe bridge with click-to-select and double-click contentEditable, bidirectional Zustand VFS updates with DOMParser synchronization, and a modular multi-section docked Visual Inspector panel.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Monaco Editor, Zustand, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-16-html-project-editor-design.md`

## Global Constraints
- Default canvas mode is 'design' (direct click-to-select and on-canvas editing active out of the box).
- No page reload when editing styles, attributes, classes, or text.
- 100% test coverage for new store operations and component logic.
- Clean production build with zero TypeScript errors.

---

### Task 1: Store Operations for Direct Visual Editing
- Add `canvasMode: 'design' | 'interact'` (default `'design'`).
- Add `changeSelectedElementTag(newTag: string)`.
- Add `moveSelectedElementUp()` and `moveSelectedElementDown()`.
- Add `addCustomStyleToSelectedElement(property: string, value: string)`.
- Write unit tests in `src/store/useProjectStore.test.ts`.

### Task 2: Iframe Bridge Direct Interaction Engine
- Update `src/services/iframeBridgeScript.ts` so design mode is active by default.
- Support single-click selection, hover outlines, double-click inline typing with selection preservation.
- Support 'interact' mode toggle for testing active links and forms.

### Task 3: Comprehensive Direct-Editable Visual Inspector Components
- Create `src/components/inspector/LayoutControl.tsx` (display, flexbox direction/align/justify/gap, grid).
- Create `src/components/inspector/CustomStyleList.tsx` (add/edit custom CSS properties).
- Update `src/components/inspector/VisualInspector.tsx` with tag changer, breadcrumb navigation, typography, layout, borders, box model, custom styles, attributes, and DOM move up/down.

### Task 4: Layout Integration & Docking
- Update `src/App.tsx` and `src/components/preview/PreviewPane.tsx` with persistent docked inspector panel, resizer, and Design / Interact mode toggle in the preview toolbar.

### Task 5: Full Verification
- Run Vitest test suites and `npm run build` to confirm 100% pass rate with zero errors.
