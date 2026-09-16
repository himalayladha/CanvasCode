import React, { useState } from 'react';
import { X, FilePlus, FolderPlus } from 'lucide-react';

interface NewItemModalProps {
  isOpen: boolean;
  type: 'file' | 'folder';
  initialPath?: string;
  onClose: () => void;
  onSubmit: (path: string, type: 'file' | 'folder') => void;
}

export const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  type,
  initialPath = '',
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name cannot be empty');
      return;
    }
    if (trimmed.includes('\\') || trimmed.startsWith('/')) {
      setError('Use forward slashes without leading slash');
      return;
    }

    const fullPath = initialPath ? `${initialPath}/${trimmed}` : trimmed;
    onSubmit(fullPath, type);
    setName('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#252526] border border-[#3f3f46] rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#333333]">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            {type === 'file' ? (
              <FilePlus className="w-4 h-4 text-blue-400" />
            ) : (
              <FolderPlus className="w-4 h-4 text-yellow-400" />
            )}
            <span>{type === 'file' ? 'New File' : 'New Folder'}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#333333]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              {type === 'file' ? 'File Name (e.g., about.html, css/custom.css)' : 'Folder Name (e.g., components, assets)'}
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder={type === 'file' ? 'index.html' : 'images'}
              className="w-full bg-[#1e1e1e] border border-[#3f3f46] focus:border-[#007acc] focus:outline-none rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 font-mono"
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-gray-300 hover:bg-[#333333] rounded font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs bg-[#007acc] hover:bg-[#0062a3] text-white rounded font-medium transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
