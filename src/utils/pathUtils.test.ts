import { describe, it, expect } from 'vitest';
import {
  normalizePath,
  getFileName,
  getDirectoryPath,
  getFileExtension,
  getLanguageFromPath,
  isImageFile,
  isTextFile,
  resolveRelativePath,
} from './pathUtils';

describe('pathUtils', () => {
  it('normalizes paths properly', () => {
    expect(normalizePath('css\\style.css')).toBe('css/style.css');
    expect(normalizePath('/index.html')).toBe('index.html');
    expect(normalizePath('///sub/dir//file.js')).toBe('sub/dir/file.js');
    expect(normalizePath('./assets/logo.png')).toBe('assets/logo.png');
  });

  it('gets file name and directory', () => {
    expect(getFileName('css/theme/dark.css')).toBe('dark.css');
    expect(getFileName('index.html')).toBe('index.html');
    expect(getDirectoryPath('css/theme/dark.css')).toBe('css/theme');
    expect(getDirectoryPath('index.html')).toBe('');
  });

  it('detects extensions and languages', () => {
    expect(getFileExtension('index.html')).toBe('html');
    expect(getFileExtension('style.css')).toBe('css');
    expect(getFileExtension('app.js')).toBe('js');
    expect(getFileExtension('data.json')).toBe('json');
    expect(getFileExtension('icon.svg')).toBe('svg');
    expect(getLanguageFromPath('index.html')).toBe('html');
    expect(getLanguageFromPath('style.css')).toBe('css');
    expect(getLanguageFromPath('app.js')).toBe('javascript');
    expect(getLanguageFromPath('data.json')).toBe('json');
    expect(getLanguageFromPath('image.svg')).toBe('xml');
  });

  it('identifies image and text files', () => {
    expect(isImageFile('logo.png')).toBe(true);
    expect(isImageFile('photo.jpg')).toBe(true);
    expect(isImageFile('icon.svg')).toBe(true);
    expect(isImageFile('hero.webp')).toBe(true);
    expect(isImageFile('index.html')).toBe(false);

    expect(isTextFile('index.html')).toBe(true);
    expect(isTextFile('style.css')).toBe(true);
    expect(isTextFile('app.js')).toBe(true);
    expect(isTextFile('logo.png')).toBe(false);
  });

  it('resolves relative paths accurately from a base file path', () => {
    expect(resolveRelativePath('index.html', 'css/style.css')).toBe('css/style.css');
    expect(resolveRelativePath('pages/about.html', '../css/style.css')).toBe('css/style.css');
    expect(resolveRelativePath('pages/deep/contact.html', '../../images/logo.png')).toBe('images/logo.png');
    expect(resolveRelativePath('index.html', './script.js')).toBe('script.js');
  });
});
