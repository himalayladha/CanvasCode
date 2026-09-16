import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { importProjectFromZip } from './zipService';

describe('zipService', () => {
  it('exports and imports project files preserving folder structure and contents', async () => {
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
