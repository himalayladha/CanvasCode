import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from './useProjectStore';

describe('useProjectStore VFS', () => {
  beforeEach(() => {
    useProjectStore.getState().resetProject();
  });

  it('initializes with default starter project in design mode', () => {
    const state = useProjectStore.getState();
    expect(state.files['index.html']).toBeDefined();
    expect(state.files['css/style.css']).toBeDefined();
    expect(state.files['js/app.js']).toBeDefined();
    expect(state.activeFilePath).toBe('index.html');
    expect(state.openTabs).toContain('index.html');
    expect(state.canvasMode).toBe('design');
    expect(state.isInspectorPanelOpen).toBe(true);
  });

  it('adds and updates files', () => {
    const { addFile, updateFile } = useProjectStore.getState();
    addFile('about.html', '<h1>About Us</h1>', false);
    
    let state = useProjectStore.getState();
    expect(state.files['about.html']).toBeDefined();
    expect(state.files['about.html'].content).toBe('<h1>About Us</h1>');
    
    updateFile('about.html', '<h1>About Us Updated</h1>');
    state = useProjectStore.getState();
    expect(state.files['about.html'].content).toBe('<h1>About Us Updated</h1>');
  });

  it('renames a file and updates open tabs and active file', () => {
    const { addFile, setActiveFile, renameFile } = useProjectStore.getState();
    addFile('old-name.js', 'console.log("hello");', false);
    setActiveFile('old-name.js');

    renameFile('old-name.js', 'new-name.js');

    const state = useProjectStore.getState();
    expect(state.files['old-name.js']).toBeUndefined();
    expect(state.files['new-name.js']).toBeDefined();
    expect(state.activeFilePath).toBe('new-name.js');
    expect(state.openTabs).toContain('new-name.js');
    expect(state.openTabs).not.toContain('old-name.js');
  });

  it('deletes a file and manages open tabs correctly', () => {
    const { addFile, setActiveFile, deleteFile } = useProjectStore.getState();
    addFile('temp.css', 'body { color: red; }', false);
    setActiveFile('temp.css');

    deleteFile('temp.css');

    const state = useProjectStore.getState();
    expect(state.files['temp.css']).toBeUndefined();
    expect(state.openTabs).not.toContain('temp.css');
  });

  it('deletes a folder and all its descendant files', () => {
    const { addFile, deleteFolder } = useProjectStore.getState();
    addFile('components/header.html', '<header></header>', false);
    addFile('components/footer.html', '<footer></footer>', false);

    deleteFolder('components');

    const state = useProjectStore.getState();
    expect(state.files['components/header.html']).toBeUndefined();
    expect(state.files['components/footer.html']).toBeUndefined();
  });

  it('switches and closes tabs properly', () => {
    const { openTab, closeTab, setActiveFile } = useProjectStore.getState();
    openTab('css/style.css');
    setActiveFile('css/style.css');

    expect(useProjectStore.getState().activeFilePath).toBe('css/style.css');

    closeTab('css/style.css');
    const state = useProjectStore.getState();
    expect(state.openTabs).not.toContain('css/style.css');
    expect(state.activeFilePath).toBe('index.html');
  });

  it('modifies element attributes and classes via store actions', () => {
    const { setSelectedElement, updateSelectedElementAttribute, addClassToSelectedElement, removeClassFromSelectedElement } = useProjectStore.getState();

    setSelectedElement({
      tagName: 'h1',
      id: 'main-heading',
      classList: ['hero-title'],
      selector: '#main-heading',
      innerText: 'Design and build web projects in real-time.',
      attributes: { id: 'main-heading', class: 'hero-title' },
      computedStyles: {
        color: '',
        backgroundColor: '',
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: '',
        margin: '',
        padding: '',
        border: '',
        borderRadius: '',
        width: '600px',
        height: '60px',
        display: 'block',
      },
      boxModel: {
        marginTop: '0px',
        marginRight: '0px',
        marginBottom: '0px',
        marginLeft: '0px',
        paddingTop: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingLeft: '0px',
      },
      rect: { top: 0, left: 0, width: 600, height: 60 },
    });

    updateSelectedElementAttribute('title', 'Awesome Heading');
    let state = useProjectStore.getState();
    expect(state.files['index.html'].content).toContain('title="Awesome Heading"');

    addClassToSelectedElement('shadow-lg');
    state = useProjectStore.getState();
    expect(state.files['index.html'].content).toContain('class="hero-title shadow-lg"');

    removeClassFromSelectedElement('hero-title');
    state = useProjectStore.getState();
    expect(state.files['index.html'].content).toContain('class="shadow-lg"');
  });

  it('changes selected element tag name in DOM and store', () => {
    const { setSelectedElement, changeSelectedElementTag } = useProjectStore.getState();

    setSelectedElement({
      tagName: 'h1',
      id: 'main-heading',
      classList: ['hero-title'],
      selector: '#main-heading',
      innerText: 'Design and build web projects in real-time.',
      attributes: { id: 'main-heading', class: 'hero-title' },
      computedStyles: {
        color: '',
        backgroundColor: '',
        fontSize: '3rem',
        fontWeight: '800',
        textAlign: '',
        margin: '',
        padding: '',
        border: '',
        borderRadius: '',
        width: '600px',
        height: '60px',
        display: 'block',
      },
      boxModel: {
        marginTop: '0px',
        marginRight: '0px',
        marginBottom: '0px',
        marginLeft: '0px',
        paddingTop: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingLeft: '0px',
      },
      rect: { top: 0, left: 0, width: 600, height: 60 },
    });

    changeSelectedElementTag('h2');
    const state = useProjectStore.getState();
    expect(state.files['index.html'].content).toContain('<h2');
    expect(state.selectedElement?.tagName).toBe('h2');
  });

  it('reorders elements with move up and move down', () => {
    const { setSelectedElement, moveSelectedElementDown, moveSelectedElementUp } = useProjectStore.getState();

    setSelectedElement({
      tagName: 'button',
      id: 'explore-btn',
      classList: ['btn', 'btn-primary'],
      selector: '#explore-btn',
      innerText: 'Try Interactive Demo',
      attributes: { id: 'explore-btn', class: 'btn btn-primary' },
      computedStyles: {
        color: '',
        backgroundColor: '',
        fontSize: '',
        fontWeight: '',
        textAlign: '',
        margin: '',
        padding: '',
        border: '',
        borderRadius: '',
        width: '100px',
        height: '30px',
        display: 'block',
      },
      boxModel: {
        marginTop: '0px',
        marginRight: '0px',
        marginBottom: '0px',
        marginLeft: '0px',
        paddingTop: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingLeft: '0px',
      },
      rect: { top: 0, left: 0, width: 100, height: 30 },
    });

    moveSelectedElementDown();
    let state = useProjectStore.getState();
    expect(state.files['index.html'].content).toBeDefined();

    moveSelectedElementUp();
    state = useProjectStore.getState();
    expect(state.files['index.html'].content).toBeDefined();
  });

  it('switches between design mode and interact mode correctly', () => {
    const { setCanvasMode, toggleCanvasMode, setSelectedElement } = useProjectStore.getState();

    // Start in design mode
    expect(useProjectStore.getState().canvasMode).toBe('design');
    expect(useProjectStore.getState().isInspectMode).toBe(true);

    // Mock selecting an element
    setSelectedElement({
      tagName: 'button',
      id: 'explore-btn',
      classList: ['btn'],
      selector: '#explore-btn',
      innerText: 'Demo',
      attributes: {},
      computedStyles: {
        color: '',
        backgroundColor: '',
        fontSize: '',
        fontWeight: '',
        textAlign: '',
        margin: '',
        padding: '',
        border: '',
        borderRadius: '',
        width: '100px',
        height: '30px',
        display: 'block',
      },
      boxModel: {
        marginTop: '0px',
        marginRight: '0px',
        marginBottom: '0px',
        marginLeft: '0px',
        paddingTop: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingLeft: '0px',
      },
      rect: { top: 0, left: 0, width: 100, height: 30 },
    });
    expect(useProjectStore.getState().selectedElement).not.toBeNull();

    // Switch to interact mode
    setCanvasMode('interact');
    let state = useProjectStore.getState();
    expect(state.canvasMode).toBe('interact');
    expect(state.isInspectMode).toBe(false);
    expect(state.selectedElement).toBeNull();
    expect(state.isInspectorPanelOpen).toBe(false);

    // Switch back to design mode
    setCanvasMode('design');
    state = useProjectStore.getState();
    expect(state.canvasMode).toBe('design');
    expect(state.isInspectMode).toBe(true);
    expect(state.isInspectorPanelOpen).toBe(true);

    // Test toggleCanvasMode
    toggleCanvasMode();
    expect(useProjectStore.getState().canvasMode).toBe('interact');
    toggleCanvasMode();
    expect(useProjectStore.getState().canvasMode).toBe('design');
  });

  it('manages undo and redo history for file and styling changes', () => {
    const { updateFile, undo, redo, canUndo, canRedo } = useProjectStore.getState();

    // Initial state: cannot undo or redo
    expect(canUndo()).toBe(false);
    expect(canRedo()).toBe(false);

    // Make a change
    const initialContent = useProjectStore.getState().files['index.html'].content;
    updateFile('index.html', '<!DOCTYPE html><html><body><h1>Version 2</h1></body></html>');

    expect(canUndo()).toBe(true);
    expect(canRedo()).toBe(false);
    expect(useProjectStore.getState().files['index.html'].content).toContain('Version 2');

    // Make another change
    updateFile('index.html', '<!DOCTYPE html><html><body><h1>Version 3</h1></body></html>');
    expect(useProjectStore.getState().files['index.html'].content).toContain('Version 3');

    // Undo to Version 2
    undo();
    expect(useProjectStore.getState().files['index.html'].content).toContain('Version 2');
    expect(canUndo()).toBe(true);
    expect(canRedo()).toBe(true);

    // Undo to Version 1 (Initial)
    undo();
    expect(useProjectStore.getState().files['index.html'].content).toBe(initialContent);
    expect(canUndo()).toBe(false);
    expect(canRedo()).toBe(true);

    // Redo to Version 2
    redo();
    expect(useProjectStore.getState().files['index.html'].content).toContain('Version 2');

    // Redo to Version 3
    redo();
    expect(useProjectStore.getState().files['index.html'].content).toContain('Version 3');
    expect(canRedo()).toBe(false);
  });
});
