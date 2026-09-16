import React from 'react';
import { X, FileCode, FileText, Image as ImageIcon, FileJson, File } from 'lucide-react';
import { getFileName, getFileExtension, isImageFile } from '../../utils/pathUtils';

interface TabBarProps {
  openTabs: string[];
  activeFilePath: string | null;
  onSelectTab: (path: string) => void;
  onCloseTab: (path: string) => void;
}

export function getFileIcon(path: string) {
  const ext = getFileExtension(path);
  if (isImageFile(path)) {
    return <ImageIcon className="w-3.5 h-3.5 text-purple-400" />;
  }
  switch (ext) {
    case 'html':
    case 'htm':
      return <FileCode className="w-3.5 h-3.5 text-orange-400" />;
    case 'css':
      return <FileText className="w-3.5 h-3.5 text-blue-400" />;
    case 'js':
    case 'mjs':
      return <FileCode className="w-3.5 h-3.5 text-yellow-400" />;
    case 'json':
      return <FileJson className="w-3.5 h-3.5 text-green-400" />;
    default:
      return <File className="w-3.5 h-3.5 text-gray-400" />;
  }
}

export const TabBar: React.FC<TabBarProps> = ({
  openTabs,
  activeFilePath,
  onSelectTab,
  onCloseTab,
}) => {
  if (openTabs.length === 0) return null;

  return (
    <div className="flex items-center bg-[#252526] border-b border-[#333333] overflow-x-auto select-none no-scrollbar h-9">
      {openTabs.map((tabPath) => {
        const isActive = tabPath === activeFilePath;
        const fileName = getFileName(tabPath);

        return (
          <div
            key={tabPath}
            data-testid={`tab-${tabPath}`}
            onClick={() => onSelectTab(tabPath)}
            className={`group flex items-center gap-2 px-3 py-1.5 text-xs border-r border-[#333333] cursor-pointer transition-colors max-w-[180px] min-w-[100px] h-full ${
              isActive
                ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]'
                : 'text-[#969696] hover:bg-[#2a2d2e] hover:text-[#cccccc]'
            }`}
          >
            {getFileIcon(tabPath)}
            <span className="truncate flex-1 font-medium">{fileName}</span>
            <button
              data-testid={`close-tab-${tabPath}`}
              title="Close tab"
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tabPath);
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-[#37373d] p-0.5 rounded text-gray-400 hover:text-white transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
