import React from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { TabBar } from './TabBar';
import { CodeEditor } from './CodeEditor';
import { ImageViewer } from './ImageViewer';
import { isImageFile } from '../../utils/pathUtils';
import { FileCode } from 'lucide-react';

export const EditorWorkspace: React.FC = () => {
  const {
    files,
    activeFilePath,
    openTabs,
    setActiveFile,
    closeTab,
    updateFile,
  } = useProjectStore();

  const activeFile = activeFilePath ? files[activeFilePath] : null;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] overflow-hidden border-r border-[#333333]">
      <TabBar
        openTabs={openTabs}
        activeFilePath={activeFilePath}
        onSelectTab={setActiveFile}
        onCloseTab={closeTab}
      />

      <div className="flex-1 relative overflow-hidden">
        {activeFile ? (
          isImageFile(activeFile.path) ? (
            <ImageViewer file={activeFile} />
          ) : (
            <CodeEditor
              key={activeFile.path}
              file={activeFile}
              onChange={(newContent) => updateFile(activeFile.path, newContent)}
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
            <FileCode className="w-12 h-12 opacity-40 text-gray-400" />
            <p className="text-sm">No file is currently open</p>
            <p className="text-xs text-gray-600">Select a file from the explorer on the left to start editing</p>
          </div>
        )}
      </div>
    </div>
  );
};
