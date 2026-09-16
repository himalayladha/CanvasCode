import JSZip from 'jszip';
import { VirtualFile } from '../types/vfs';
import { normalizePath, getFileName, isImageFile, isTextFile } from '../utils/pathUtils';

/**
 * Packs all project files into a ZIP archive and triggers browser download
 */
export async function exportProjectToZip(files: Record<string, VirtualFile>, projectName: string = 'web-project'): Promise<void> {
  const zip = new JSZip();

  for (const [path, file] of Object.entries(files)) {
    if (file.isBinary && file.binaryBlob) {
      zip.file(path, file.binaryBlob);
    } else {
      zip.file(path, file.content || '');
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  const safeName = projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  a.download = `${safeName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Unpacks an uploaded ZIP file into VirtualFiles
 */
export async function importProjectFromZip(zipFile: File): Promise<{ files: Record<string, VirtualFile>; projectName: string }> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(zipFile);
  const files: Record<string, VirtualFile> = {};
  const now = Date.now();

  const entries = Object.entries(loadedZip.files);

  for (const [rawPath, zipEntry] of entries) {
    if (zipEntry.dir) continue;

    const normalized = normalizePath(rawPath);
    if (!normalized || normalized.startsWith('__MACOSX/') || normalized.includes('.DS_Store')) {
      continue;
    }

    const fileName = getFileName(normalized);
    const isBinary = !isTextFile(normalized) || isImageFile(normalized);

    if (isBinary) {
      const blob = await zipEntry.async('blob');
      let blobUrl: string | undefined;
      if (typeof window !== 'undefined') {
        blobUrl = URL.createObjectURL(blob);
      }

      files[normalized] = {
        id: `file-${now}-${Math.random().toString(36).substring(2, 7)}`,
        path: normalized,
        name: fileName,
        type: 'file',
        content: '',
        isBinary: true,
        binaryBlob: blob,
        blobUrl,
        updatedAt: now,
      };
    } else {
      const textContent = await zipEntry.async('text');
      files[normalized] = {
        id: `file-${now}-${Math.random().toString(36).substring(2, 7)}`,
        path: normalized,
        name: fileName,
        type: 'file',
        content: textContent,
        isBinary: false,
        updatedAt: now,
      };
    }
  }

  const projectName = zipFile.name.replace(/\.zip$/i, '');
  return { files, projectName };
}

/**
 * Imports files from a directory selection (HTML5 input or drag & drop)
 */
export async function importProjectFromFolder(fileList: FileList | File[]): Promise<{ files: Record<string, VirtualFile>; projectName: string }> {
  const files: Record<string, VirtualFile> = {};
  const now = Date.now();
  let projectName = 'Imported Project';

  const filesArray = Array.from(fileList);

  for (const file of filesArray) {
    // webkitRelativePath contains the relative folder path e.g. "my-project/index.html"
    const rawPath = file.webkitRelativePath || file.name;
    const parts = rawPath.split('/');
    if (parts.length > 1 && projectName === 'Imported Project') {
      projectName = parts[0];
    }
    // Remove the leading root folder name from relative path
    const normalized = parts.length > 1 ? normalizePath(parts.slice(1).join('/')) : normalizePath(rawPath);

    if (!normalized || normalized.startsWith('__MACOSX/') || normalized.includes('.DS_Store')) {
      continue;
    }

    const fileName = getFileName(normalized);
    const isBinary = !isTextFile(normalized) || isImageFile(normalized);

    if (isBinary) {
      let blobUrl: string | undefined;
      if (typeof window !== 'undefined') {
        blobUrl = URL.createObjectURL(file);
      }

      files[normalized] = {
        id: `file-${now}-${Math.random().toString(36).substring(2, 7)}`,
        path: normalized,
        name: fileName,
        type: 'file',
        content: '',
        isBinary: true,
        binaryBlob: file,
        blobUrl,
        updatedAt: now,
      };
    } else {
      const textContent = await file.text();
      files[normalized] = {
        id: `file-${now}-${Math.random().toString(36).substring(2, 7)}`,
        path: normalized,
        name: fileName,
        type: 'file',
        content: textContent,
        isBinary: false,
        updatedAt: now,
      };
    }
  }

  return { files, projectName };
}
