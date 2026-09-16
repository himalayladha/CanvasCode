import { describe, it, expect } from 'vitest';
import { bundleProjectForPreview } from './previewBundler';
import { VirtualFile } from '../types/vfs';

describe('previewBundler', () => {
  it('bundles HTML with inlined CSS and JS files', () => {
    const files: Record<string, VirtualFile> = {
      'index.html': {
        id: '1',
        path: 'index.html',
        name: 'index.html',
        type: 'file',
        content: `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <h1>Hello Test</h1>
  <script src="js/main.js"></script>
</body>
</html>`,
        isBinary: false,
        updatedAt: 1,
      },
      'css/style.css': {
        id: '2',
        path: 'css/style.css',
        name: 'style.css',
        type: 'file',
        content: 'h1 { color: purple; }',
        isBinary: false,
        updatedAt: 1,
      },
      'js/main.js': {
        id: '3',
        path: 'js/main.js',
        name: 'main.js',
        type: 'file',
        content: 'console.log("From main.js");',
        isBinary: false,
        updatedAt: 1,
      },
    };

    const bundled = bundleProjectForPreview(files, 'index.html', false);

    expect(bundled).toContain('h1 { color: purple; }');
    expect(bundled).toContain('console.log("From main.js");');
    expect(bundled).toContain('__WEBSTUDIO_BRIDGE__');
  });

  it('substitutes relative image sources with blob URLs', () => {
    const files: Record<string, VirtualFile> = {
      'index.html': {
        id: '1',
        path: 'index.html',
        name: 'index.html',
        type: 'file',
        content: '<img src="assets/logo.png" alt="Logo">',
        isBinary: false,
        updatedAt: 1,
      },
      'assets/logo.png': {
        id: '2',
        path: 'assets/logo.png',
        name: 'logo.png',
        type: 'file',
        content: '',
        isBinary: true,
        blobUrl: 'blob:http://localhost/mock-blob-logo',
        updatedAt: 1,
      },
    };

    const bundled = bundleProjectForPreview(files, 'index.html', false);

    expect(bundled).toContain('src="blob:http://localhost/mock-blob-logo"');
  });

  it('handles missing or fallback HTML gracefully', () => {
    const files: Record<string, VirtualFile> = {};
    const bundled = bundleProjectForPreview(files, 'index.html', false);

    expect(bundled).toContain('No HTML file selected');
  });

  it('embeds correct isInspectMode state inside the bundled bridge script', () => {
    const files: Record<string, VirtualFile> = {
      'index.html': {
        id: '1',
        path: 'index.html',
        name: 'index.html',
        type: 'file',
        content: '<h1>Hello</h1>',
        isBinary: false,
        updatedAt: 1,
      },
    };

    const bundledDesign = bundleProjectForPreview(files, 'index.html', true);
    expect(bundledDesign).toContain('var isInspectMode = true;');

    const bundledInteract = bundleProjectForPreview(files, 'index.html', false);
    expect(bundledInteract).toContain('var isInspectMode = false;');
  });
});
