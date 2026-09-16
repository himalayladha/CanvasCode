import React, { useState, useMemo } from 'react';
import { FilePlus, FolderPlus, FolderTree } from 'lucide-react';
import { VirtualFile } from '../../types/vfs';
import { FileTreeNode, TreeNode } from './FileTreeNode';
import { NewItemModal } from './NewItemModal';

interface FileTreeProps {
  files: Record<string, VirtualFile>;
  activeFilePath: string | null;
  onSelectFile: (path: string) => void;
  onAddFile: (path: string, content?: string, isBinary?: boolean, blob?: Blob) => void;
  onDeleteFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
  onDeleteFolder?: (folderPath: string) => void;
  onCreateFolder?: (folderPath: string) => void;
}

export function buildTreeFromFiles(files: Record<string, VirtualFile>): TreeNode {
  const root: TreeNode = {
    name: 'root',
    path: '',
    type: 'folder',
    children: {},
  };

  Object.keys(files).forEach((filePath) => {
    // Ignore internal placeholder files
    if (filePath.endsWith('.gitkeep') && filePath !== '.gitkeep') {
      const folderPath = filePath.replace('/.gitkeep', '');
      const parts = folderPath.split('/');
      let current = root;
      let currPath = '';

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currPath = currPath ? `${currPath}/${part}` : part;
        if (!current.children![part]) {
          current.children![part] = {
            name: part,
            path: currPath,
            type: 'folder',
            children: {},
          };
        }
        current = current.children![part];
      }
      return;
    }

    const parts = filePath.split('/');
    let current = root;
    let currPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currPath = currPath ? `${currPath}/${part}` : part;
      const isLast = i === parts.length - 1;

      if (isLast) {
        current.children![part] = {
          name: part,
          path: currPath,
          type: 'file',
        };
      } else {
        if (!current.children![part]) {
          current.children![part] = {
            name: part,
            path: currPath,
            type: 'folder',
            children: {},
          };
        }
        current = current.children![part];
      }
    }
  });

  return root;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  activeFilePath,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onRenameFile,
  onDeleteFolder,
  onCreateFolder,
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'file' | 'folder';
    parentPath: string;
  }>({
    isOpen: false,
    type: 'file',
    parentPath: '',
  });

  const tree = useMemo(() => buildTreeFromFiles(files), [files]);
  const rootChildren = tree.children ? Object.values(tree.children) : [];

  // Sort root nodes: folders first, then alphabetical
  rootChildren.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'folder' ? -1 : 1;
  });

  const handleCreateItem = (path: string, type: 'file' | 'folder') => {
    if (type === 'file') {
      onAddFile(path, '', false);
    } else {
      if (onCreateFolder) {
        onCreateFolder(path);
      } else {
        onAddFile(`${path}/.gitkeep`, '', false);
      }
    }
  };

  const handleDeleteItem = (path: string, type: 'file' | 'folder') => {
    if (type === 'folder') {
      if (onDeleteFolder) {
        onDeleteFolder(path);
      } else {
        onDeleteFile(path);
      }
    } else {
      onDeleteFile(path);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#181818] border-r border-[#333333] select-none">
      {/* File Explorer Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#333333] text-xs font-semibold text-gray-300">
        <div className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-gray-400">
          <FolderTree className="w-3.5 h-3.5 text-[#007acc]" />
          <span>Explorer</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            title="New File"
            onClick={() => setModalState({ isOpen: true, type: 'file', parentPath: '' })}
            className="p-1 hover:bg-[#2a2d2e] rounded text-gray-400 hover:text-white transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            title="New Folder"
            onClick={() => setModalState({ isOpen: true, type: 'folder', parentPath: '' })}
            className="p-1 hover:bg-[#2a2d2e] rounded text-gray-400 hover:text-white transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto py-1.5">
        {rootChildren.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-gray-500">
            <p>No files in project</p>
            <button
              onClick={() => setModalState({ isOpen: true, type: 'file', parentPath: '' })}
              className="mt-2 text-[#007acc] hover:underline"
            >
              + Create index.html
            </button>
          </div>
        ) : (
          rootChildren.map((node) => (
            <FileTreeNode
              key={node.path}
              node={node}
              activeFilePath={activeFilePath}
              onSelectFile={onSelectFile}
              onDelete={handleDeleteItem}
              onRename={onRenameFile}
              onAddNew={(parentPath, type) => setModalState({ isOpen: true, type, parentPath })}
            />
          ))
        )}
      </div>

      {/* New Item Modal */}
      <NewItemModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        initialPath={modalState.parentPath}
        onClose={() => setModalState({ isOpen: false, type: 'file', parentPath: '' })}
        onSubmit={handleCreateItem}
      />
    </div>
  );
};
