import { useEffect, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useProjectStore } from './store/useProjectStore';
import { TopToolbar } from './components/toolbar/TopToolbar';
import { FileTree } from './components/filetree/FileTree';
import { EditorWorkspace } from './components/editor/EditorWorkspace';
import { PreviewPane } from './components/preview/PreviewPane';
import { VisualInspector } from './components/inspector/VisualInspector';
import { ConsolePanel } from './components/console/ConsolePanel';
import { importProjectFromZip, importProjectFromFolder } from './services/zipService';

export default function App() {
  const {
    files,
    activeFilePath,
    setActiveFile,
    addFile,
    deleteFile,
    deleteFolder,
    renameFile,
    createFolder,
    isInspectMode,
    selectedElement,
    setSelectedElement,
    updateSelectedElementStyle,
    updateSelectedElementText,
    updateSelectedElementAttribute,
    addClassToSelectedElement,
    removeClassFromSelectedElement,
    changeSelectedElementTag,
    moveSelectedElementUp,
    moveSelectedElementDown,
    duplicateSelectedElement,
    deleteSelectedElement,
    jumpToSelectedElementInCode,
    consoleLogs,
    clearConsoleLogs,
    isBottomPanelOpen,
    setIsBottomPanelOpen,
    loadProject,
    restoreFromStorage,
    undo,
    redo,
  } = useProjectStore();

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const [isSidebarResizing, setIsSidebarResizing] = useState(false);

  // Restore project from IndexedDB on initial mount
  useEffect(() => {
    restoreFromStorage();
  }, [restoreFromStorage]);

  // Global Undo / Redo keyboard shortcuts (Ctrl+Z / Cmd+Z / Ctrl+Y / Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow native undo inside text inputs, textareas, and contentEditables
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl && !e.altKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Handle global Drag & Drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // Only set false if leaving window
      if (e.clientX === 0 || e.clientY === 0) {
        setIsDraggingOver(false);
      }
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);

      if (!e.dataTransfer) return;

      const droppedFiles = e.dataTransfer.files;

      if (droppedFiles.length === 1 && droppedFiles[0].name.endsWith('.zip')) {
        try {
          const result = await importProjectFromZip(droppedFiles[0]);
          loadProject(result.files, result.projectName);
        } catch (err) {
          alert('Failed to load dropped ZIP: ' + (err instanceof Error ? err.message : String(err)));
        }
        return;
      }

      if (droppedFiles.length > 0) {
        try {
          const result = await importProjectFromFolder(droppedFiles);
          loadProject(result.files, result.projectName);
        } catch (err) {
          alert('Failed to load dropped files: ' + (err instanceof Error ? err.message : String(err)));
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [loadProject]);

  // Sidebar resizer mouse events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isSidebarResizing) return;
      const newWidth = Math.max(160, Math.min(420, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsSidebarResizing(false);
    };

    if (isSidebarResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSidebarResizing]);

  const showInspector = isInspectMode || selectedElement !== null;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden select-none relative">
      {/* Top Application Header / Toolbar */}
      <TopToolbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Left Sidebar: File Tree Explorer */}
        <div style={{ width: `${sidebarWidth}px` }} className="h-full shrink-0 relative">
          <FileTree
            files={files}
            activeFilePath={activeFilePath}
            onSelectFile={setActiveFile}
            onAddFile={addFile}
            onDeleteFile={deleteFile}
            onDeleteFolder={deleteFolder}
            onRenameFile={renameFile}
            onCreateFolder={createFolder}
          />
        </div>

        {/* Sidebar resize handle */}
        <div
          onMouseDown={() => setIsSidebarResizing(true)}
          className="w-1 hover:w-1.5 cursor-col-resize bg-[#333333] hover:bg-[#007acc] transition-colors z-20 shrink-0"
        />

        {/* Center / Left Pane: Monaco Code Editor Workspace */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          <EditorWorkspace />
        </div>

        {/* Center / Right Pane: Live Iframe Preview */}
        <div className="flex-1 flex flex-col h-full min-w-0 border-l border-[#333333]">
          <PreviewPane />
        </div>

        {/* Right Pane: Visual Element Inspector */}
        {showInspector && (
          <VisualInspector
            selectedElement={selectedElement}
            onUpdateStyle={updateSelectedElementStyle}
            onUpdateText={updateSelectedElementText}
            onUpdateAttribute={updateSelectedElementAttribute}
            onAddClass={addClassToSelectedElement}
            onRemoveClass={removeClassFromSelectedElement}
            onChangeTag={changeSelectedElementTag}
            onMoveUp={moveSelectedElementUp}
            onMoveDown={moveSelectedElementDown}
            onDuplicateElement={duplicateSelectedElement}
            onDeleteElement={deleteSelectedElement}
            onJumpToCode={jumpToSelectedElementInCode}
            onClose={() => setSelectedElement(null)}
          />
        )}
      </div>

      {/* Bottom Panel: Console & Error Stream */}
      <ConsolePanel
        logs={consoleLogs}
        isOpen={isBottomPanelOpen}
        onClearLogs={clearConsoleLogs}
        onClose={() => setIsBottomPanelOpen(false)}
      />

      {/* Global Drag & Drop Overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 border-4 border-dashed border-[#007acc] pointer-events-none animate-in fade-in duration-150">
          <div className="bg-[#1e1e1e] p-8 rounded-2xl shadow-2xl border border-blue-500/40 flex flex-col items-center text-center max-w-md">
            <UploadCloud className="w-16 h-16 text-[#007acc] mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-white mb-2">Drop Project to Open</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Drop a <strong className="text-blue-400">.zip</strong> file or your website folder to load all HTML, CSS, JS, and image files directly into WebStudio.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
