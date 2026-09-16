import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from './useProjectStore';

describe('useProjectStore VFS', () => {
  beforeEach(() => {
    useProjectStore.getState().resetProject();
  });

  it('initializes with default starter project', () => {
    const state = useProjectStore.getState();
    expect(state.files['index.html']).toBeDefined();
    expect(state.files['css/style.css']).toBeDefined();
    expect(state.files['js/app.js']).toBeDefined();
    expect(state.activeFilePath).toBe('index.html');
    expect(state.openTabs).toContain('index.html');
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
});
