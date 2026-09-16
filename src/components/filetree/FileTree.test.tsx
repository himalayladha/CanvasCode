import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { FileTree } from './FileTree';
import { VirtualFile } from '../../types/vfs';

describe('FileTree component', () => {
  const mockFiles: Record<string, VirtualFile> = {
    'index.html': {
      id: '1',
      path: 'index.html',
      name: 'index.html',
      type: 'file',
      content: '<h1>Hello</h1>',
      isBinary: false,
      updatedAt: 1,
    },
    'css/style.css': {
      id: '2',
      path: 'css/style.css',
      name: 'style.css',
      type: 'file',
      content: 'body { color: red; }',
      isBinary: false,
      updatedAt: 1,
    },
  };

  it('renders files and folder hierarchy', () => {
    const onSelectFile = vi.fn();
    const onAddFile = vi.fn();
    const onDeleteFile = vi.fn();
    const onRenameFile = vi.fn();

    render(
      <FileTree
        files={mockFiles}
        activeFilePath="index.html"
        onSelectFile={onSelectFile}
        onAddFile={onAddFile}
        onDeleteFile={onDeleteFile}
        onRenameFile={onRenameFile}
      />
    );

    expect(screen.getByText('index.html')).toBeInTheDocument();
    expect(screen.getByText('css')).toBeInTheDocument();
    expect(screen.getByText('style.css')).toBeInTheDocument();

    fireEvent.click(screen.getByText('style.css'));
    expect(onSelectFile).toHaveBeenCalledWith('css/style.css');
  });
});
