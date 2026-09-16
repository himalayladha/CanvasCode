import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Trash2, Edit2, FilePlus, FolderPlus } from 'lucide-react';
import { getFileIcon } from '../editor/TabBar';

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: Record<string, TreeNode>;
}

interface FileTreeNodeProps {
  node: TreeNode;
  activeFilePath: string | null;
  onSelectFile: (path: string) => void;
  onDelete: (path: string, type: 'file' | 'folder') => void;
  onRename: (oldPath: string, newPath: string) => void;
  onAddNew: (parentPath: string, type: 'file' | 'folder') => void;
  depth?: number;
}

export const FileTreeNode: React.FC<FileTreeNodeProps> = ({
  node,
  activeFilePath,
  onSelectFile,
  onDelete,
  onRename,
  onAddNew,
  depth = 0,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);

  const isFolder = node.type === 'folder';
  const isActive = node.path === activeFilePath;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node.path);
    }
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== node.name) {
      const parentDir = node.path.includes('/') ? node.path.substring(0, node.path.lastIndexOf('/')) : '';
      const newPath = parentDir ? `${parentDir}/${trimmed}` : trimmed;
      onRename(node.path, newPath);
    }
    setIsRenaming(false);
  };

  const childNodes = isFolder && node.children ? Object.values(node.children) : [];
  // Sort folders first, then alphabetically
  childNodes.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'folder' ? -1 : 1;
  });

  return (
    <div>
      <div
        onClick={handleToggle}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        className={`group flex items-center justify-between py-1 pr-2 text-xs cursor-pointer select-none transition-colors ${
          isActive
            ? 'bg-[#37373d] text-white font-medium'
            : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white'
        }`}
      >
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {isFolder ? (
            <>
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              {isOpen ? (
                <FolderOpen className="w-4 h-4 text-yellow-400 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-400 shrink-0" />
              )}
            </>
          ) : (
            <span className="shrink-0 ml-3.5">{getFileIcon(node.path)}</span>
          )}

          {isRenaming ? (
            <form onSubmit={handleRenameSubmit} onClick={(e) => e.stopPropagation()} className="flex-1">
              <input
                type="text"
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={handleRenameSubmit}
                className="w-full bg-[#1e1e1e] text-white border border-[#007acc] rounded px-1 py-0.5 text-xs outline-none"
              />
            </form>
          ) : (
            <span className="truncate">{node.name}</span>
          )}
        </div>

        {/* Hover action buttons */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
          {isFolder && (
            <>
              <button
                title="New File in Folder"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddNew(node.path, 'file');
                }}
                className="p-1 hover:bg-[#3f3f46] rounded text-gray-400 hover:text-white"
              >
                <FilePlus className="w-3 h-3" />
              </button>
              <button
                title="New Subfolder"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddNew(node.path, 'folder');
                }}
                className="p-1 hover:bg-[#3f3f46] rounded text-gray-400 hover:text-white"
              >
                <FolderPlus className="w-3 h-3" />
              </button>
            </>
          )}
          <button
            title="Rename"
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
            }}
            className="p-1 hover:bg-[#3f3f46] rounded text-gray-400 hover:text-white"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.path, node.type);
            }}
            className="p-1 hover:bg-[#3f3f46] hover:text-red-400 rounded text-gray-400"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {isFolder && isOpen && (
        <div>
          {childNodes.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              activeFilePath={activeFilePath}
              onSelectFile={onSelectFile}
              onDelete={onDelete}
              onRename={onRename}
              onAddNew={onAddNew}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
