import { VirtualFile } from '../types/vfs';
import { resolveRelativePath, getFileExtension } from '../utils/pathUtils';
import { getIframeBridgeScript } from './iframeBridgeScript';

/**
 * Resolves and inlines or rewrites CSS urls to point to virtual file blobs
 */
export function resolveCssUrls(cssContent: string, cssFilePath: string, files: Record<string, VirtualFile>): string {
  // Replace url('...') or url("...") or url(...)
  return cssContent.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (match, _quote, urlPath) => {
    if (/^(https?:|\/\/|data:|blob:)/i.test(urlPath.trim())) {
      return match;
    }
    const resolvedPath = resolveRelativePath(cssFilePath, urlPath);
    const assetFile = files[resolvedPath];
    if (assetFile && assetFile.blobUrl) {
      return `url("${assetFile.blobUrl}")`;
    }
    return match;
  });
}

/**
 * Bundles the virtual files for the active HTML file and produces
 * a self-contained HTML document with inlined/blob-mapped assets and bridge scripts.
 */
export function bundleProjectForPreview(
  files: Record<string, VirtualFile>,
  activeHtmlPath: string = 'index.html',
  isInspectMode: boolean = true
): string {
  const htmlFile = files[activeHtmlPath];
  if (!htmlFile) {
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 40px 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #1e1e1e;
      color: #94a3b8;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      box-sizing: border-box;
    }
    .empty-card {
      background: #252526;
      border: 1px dashed #3f3f46;
      border-radius: 12px;
      padding: 32px;
      max-width: 400px;
    }
    h2 { color: #f8fafc; margin-top: 0; }
  </style>
</head>
<body>
  <div class="empty-card">
    <h2>No HTML file selected</h2>
    <p>Select or create an HTML file (e.g., <code>index.html</code>) in the explorer to preview your project.</p>
  </div>
</body>
</html>`;
  }

  // Parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlFile.content || '<!DOCTYPE html><html><head></head><body></body></html>', 'text/html');

  // 1. Resolve Stylesheets: <link rel="stylesheet" href="...">
  const linkTags = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
  linkTags.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || /^(https?:|\/\/|data:|blob:)/i.test(href)) return;

    const resolvedCssPath = resolveRelativePath(activeHtmlPath, href);
    const cssFile = files[resolvedCssPath];

    if (cssFile) {
      const resolvedCss = resolveCssUrls(cssFile.content, resolvedCssPath, files);
      const styleEl = doc.createElement('style');
      styleEl.setAttribute('data-vfs-source', resolvedCssPath);
      styleEl.textContent = resolvedCss;
      link.parentNode?.replaceChild(styleEl, link);
    }
  });

  // 2. Resolve Scripts: <script src="...">
  const scriptTags = Array.from(doc.querySelectorAll('script[src]'));
  scriptTags.forEach((script) => {
    const src = script.getAttribute('src');
    if (!src || /^(https?:|\/\/|data:|blob:)/i.test(src)) return;

    const resolvedJsPath = resolveRelativePath(activeHtmlPath, src);
    const jsFile = files[resolvedJsPath];

    if (jsFile) {
      const inlineScript = doc.createElement('script');
      inlineScript.setAttribute('data-vfs-source', resolvedJsPath);
      inlineScript.textContent = `try {\n${jsFile.content}\n} catch(err) { console.error("Error in ${resolvedJsPath}:", err); }`;
      script.parentNode?.replaceChild(inlineScript, script);
    }
  });

  // 3. Resolve Media & Images: <img src="...">, <source srcset="...">, <video src="...">, <audio src="...">, <link rel="icon">
  const mediaElements = Array.from(doc.querySelectorAll('img[src], source[srcset], video[src], audio[src], link[rel*="icon"]'));
  mediaElements.forEach((el) => {
    const attrName = el.hasAttribute('srcset') ? 'srcset' : (el.hasAttribute('href') ? 'href' : 'src');
    const assetPath = el.getAttribute(attrName);
    if (!assetPath || /^(https?:|\/\/|data:|blob:)/i.test(assetPath)) return;

    const resolvedPath = resolveRelativePath(activeHtmlPath, assetPath);
    const file = files[resolvedPath];

    if (file) {
      if (file.blobUrl) {
        el.setAttribute(attrName, file.blobUrl);
      } else if (file.isBinary && file.binaryBlob && typeof window !== 'undefined') {
        const url = URL.createObjectURL(file.binaryBlob);
        file.blobUrl = url;
        el.setAttribute(attrName, url);
      } else if (getFileExtension(resolvedPath) === 'svg' && file.content) {
        // SVG inline data URL
        const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(file.content)}`;
        el.setAttribute(attrName, dataUrl);
      }
    }
  });

  // 4. Resolve Inline Styles: style="background-image: url(...)"
  const elementsWithStyle = Array.from(doc.querySelectorAll('[style*="url("]'));
  elementsWithStyle.forEach((el) => {
    const styleAttr = el.getAttribute('style');
    if (styleAttr) {
      el.setAttribute('style', resolveCssUrls(styleAttr, activeHtmlPath, files));
    }
  });

  // 5. Assign deterministic data-webstudio-id index to all body elements for precision visual inspector & live-editing mapping
  if (doc.body) {
    let elementIndex = 0;
    const assignWebstudioIds = (el: Element) => {
      el.setAttribute('data-webstudio-id', String(elementIndex++));
      for (let i = 0; i < el.children.length; i++) {
        assignWebstudioIds(el.children[i]);
      }
    };
    assignWebstudioIds(doc.body);
  }

  // 6. Serialize HTML and inject Bridge Script
  const bridgeScript = getIframeBridgeScript(isInspectMode);
  let htmlResult = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

  if (htmlResult.includes('</body>')) {
    htmlResult = htmlResult.replace('</body>', `${bridgeScript}\n</body>`);
  } else if (htmlResult.includes('</html>')) {
    htmlResult = htmlResult.replace('</html>', `${bridgeScript}\n</html>`);
  } else {
    htmlResult += `\n${bridgeScript}`;
  }

  return htmlResult;
}
