/**
 * Path and file utility functions for the Virtual File System
 */

export function normalizePath(path: string): string {
  if (!path) return '';
  // Replace backslashes with forward slashes
  let normalized = path.replace(/\\/g, '/');
  // Remove leading slashes and ./
  normalized = normalized.replace(/^(\.\/|\/)+/, '');
  // Collapse multiple consecutive slashes
  normalized = normalized.replace(/\/+/g, '/');
  // Remove trailing slashes
  normalized = normalized.replace(/\/$/, '');
  return normalized;
}

export function getFileName(path: string): string {
  const normalized = normalizePath(path);
  const parts = normalized.split('/');
  return parts[parts.length - 1] || '';
}

export function getDirectoryPath(path: string): string {
  const normalized = normalizePath(path);
  const parts = normalized.split('/');
  if (parts.length <= 1) return '';
  return parts.slice(0, parts.length - 1).join('/');
}

export function getFileExtension(path: string): string {
  const fileName = getFileName(path);
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1 || lastDot === 0) return '';
  return fileName.substring(lastDot + 1).toLowerCase();
}

export function getLanguageFromPath(path: string): string {
  const ext = getFileExtension(path);
  switch (ext) {
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
    case 'scss':
    case 'less':
      return 'css';
    case 'js':
    case 'mjs':
    case 'cjs':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'json':
      return 'json';
    case 'svg':
    case 'xml':
      return 'xml';
    case 'md':
    case 'markdown':
      return 'markdown';
    default:
      return 'plaintext';
  }
}

export function isImageFile(path: string): boolean {
  const ext = getFileExtension(path);
  return ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp', 'avif'].includes(ext);
}

export function isTextFile(path: string): boolean {
  const ext = getFileExtension(path);
  return ['html', 'htm', 'css', 'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'svg', 'xml', 'md', 'txt', 'csv'].includes(ext);
}

export function resolveRelativePath(baseFilePath: string, relativePath: string): string {
  const cleanRelative = relativePath.trim().replace(/^['"]|['"]$/g, '');
  
  // External URLs or root-relative paths that are protocols or data URLs
  if (/^(https?:|\/\/|data:|blob:|mailto:|tel:)/i.test(cleanRelative)) {
    return cleanRelative;
  }

  const baseDir = getDirectoryPath(baseFilePath);
  const baseParts = baseDir ? baseDir.split('/') : [];
  const relParts = cleanRelative.replace(/\\/g, '/').split('/');

  // If path starts with root '/', treat as project root relative
  if (cleanRelative.startsWith('/')) {
    return normalizePath(cleanRelative);
  }

  const resultParts = [...baseParts];

  for (const part of relParts) {
    if (!part || part === '.') {
      continue;
    } else if (part === '..') {
      if (resultParts.length > 0) {
        resultParts.pop();
      }
    } else {
      resultParts.push(part);
    }
  }

  return resultParts.join('/');
}
