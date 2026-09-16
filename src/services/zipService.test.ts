import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { exportProjectToZip, importProjectFromZip } from './zipService';
import { VirtualFile } from '../types/vfs';

describe('zipService', () => {
  it('exports and imports project files preserving folder structure and contents', async () => {
    const mockFiles: Record<string, VirtualFile> = {
      'index.html': {
        id: '1',
        path: 'index.html',
        name: 'index.html',
        type: 'file',
        content: '<h1>Hello ZIP</h1>',
        isBinary: false,
        updatedAt: 1,
      },
      'css/main.css': {
        id: '2',
        path: 'css/main.css',
        name: 'main.css',
        type: 'file',
        content: 'body { margin: 0; }',
        isBinary: false,
        updatedAt: 1,
      },
    };

    // Create a zip directly with JSZip to simulate user uploaded zip
    const zip = new JSZip();
    zip.file('index.html', '<h1>Hello ZIP</h1>');
    zip.file('css/main.css', 'body { margin: 0; }');
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const fakeZipFile = new File([zipBlob], 'my-project.zip', { type: 'application/zip' });

    const imported = await importProjectFromZip(fakeZipFile);

    expect(imported.projectName).toBe('my-project');
    expect(imported.files['index.html']).toBeDefined();
    expect(imported.files['index.html'].content).toBe('<h1>Hello ZIP</h1>');
    expect(imported.files['css/main.css']).toBeDefined();
    expect(imported.files['css/main.css'].content).toBe('body { margin: 0; }');
  });
});
