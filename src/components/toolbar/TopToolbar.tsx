import React, { useRef, useState } from 'react';
import {
  FolderOpen,
  FileArchive,
  Download,
  LayoutTemplate,
  Terminal,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Edit2,
  Check,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { exportProjectToZip, importProjectFromZip, importProjectFromFolder } from '../../services/zipService';
import { TemplateModal } from './TemplateModal';
import { ProjectTemplate } from '../../data/starterTemplates';
import { VirtualFile } from '../../types/vfs';

export const TopToolbar: React.FC = () => {
  const {
    projectName,
    setProjectName,
    files,
    loadProject,
    resetProject,
    consoleLogs,
    isBottomPanelOpen,
    setIsBottomPanelOpen,
  } = useProjectStore();

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(projectName);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const errorCount = consoleLogs.filter((l) => l.level === 'error').length;
  const warnCount = consoleLogs.filter((l) => l.level === 'warn').length;

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setProjectName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await importProjectFromZip(file);
      loadProject(result.files, result.projectName);
    } catch (err) {
      alert('Failed to unpack ZIP archive: ' + (err instanceof Error ? err.message : String(err)));
    }
    if (zipInputRef.current) zipInputRef.current.value = '';
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;

    try {
      const result = await importProjectFromFolder(filesList);
      loadProject(result.files, result.projectName);
    } catch (err) {
      alert('Failed to import folder: ' + (err instanceof Error ? err.message : String(err)));
    }
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  const handleExportZip = async () => {
    try {
      await exportProjectToZip(files, projectName);
    } catch (err) {
      alert('Failed to export ZIP: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSelectTemplate = (template: ProjectTemplate) => {
    const now = Date.now();
    const newFiles: Record<string, VirtualFile> = {};
    for (const [path, fileData] of Object.entries(template.files)) {
      newFiles[path] = {
        ...fileData,
        id: `file-${now}-${Math.random().toString(36).substring(2, 7)}`,
        updatedAt: now,
      };
    }
    loadProject(newFiles, template.name);
  };

  return (
    <header className="h-10 bg-[#252526] border-b border-[#333333] flex items-center justify-between px-3 text-xs select-none z-30">
      {/* Hidden file inputs */}
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip"
        onChange={handleZipUpload}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-ignore
        webkitdirectory=""
        directory=""
        onChange={handleFolderUpload}
        className="hidden"
      />

      {/* Brand & Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-extrabold text-white text-sm tracking-tight">
          <span className="text-[#007acc]">✨</span>
          <span>WebStudio</span>
        </div>

        <div className="h-4 w-[1px] bg-[#3f3f46]" />

        {isEditingName ? (
          <form onSubmit={handleNameSubmit} className="flex items-center gap-1">
            <input
              type="text"
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameSubmit}
              className="bg-[#1e1e1e] border border-[#007acc] text-white px-2 py-0.5 rounded text-xs outline-none"
            />
            <button type="submit" className="text-emerald-400 p-0.5 hover:bg-[#333333] rounded">
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <button
            onClick={() => {
              setNameInput(projectName);
              setIsEditingName(true);
            }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-[#333333] text-gray-200 font-medium group transition-colors"
          >
            <span>{projectName}</span>
            <Edit2 className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {/* Actions Toolbar */}
      <div className="flex items-center gap-1.5">
        {/* Templates */}
        <button
          onClick={() => setIsTemplateModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1e1e1e] border border-[#333333] hover:bg-[#2d2d30] text-gray-200 hover:text-white font-medium transition-colors"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-yellow-400" />
          <span>Templates</span>
        </button>

        {/* Upload Folder */}
        <button
          onClick={() => folderInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1e1e1e] border border-[#333333] hover:bg-[#2d2d30] text-gray-200 hover:text-white font-medium transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Open Folder</span>
        </button>

        {/* Upload ZIP */}
        <button
          onClick={() => zipInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1e1e1e] border border-[#333333] hover:bg-[#2d2d30] text-gray-200 hover:text-white font-medium transition-colors"
        >
          <FileArchive className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Upload ZIP</span>
        </button>

        {/* Export ZIP */}
        <button
          onClick={handleExportZip}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-semibold shadow transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export ZIP</span>
        </button>

        <div className="h-4 w-[1px] bg-[#3f3f46] mx-1" />

        {/* Reset Project */}
        <button
          title="Reset to default project"
          onClick={() => {
            if (confirm('Are you sure you want to reset the project? All unsaved changes will be lost.')) {
              resetProject();
            }
          }}
          className="p-1.5 hover:bg-[#333333] rounded text-gray-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Bottom Console toggle */}
        <button
          onClick={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-colors ${
            isBottomPanelOpen
              ? 'bg-[#37373d] border-[#007acc] text-white'
              : 'bg-[#1e1e1e] border-[#333333] text-gray-300 hover:bg-[#2d2d30]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-gray-400" />
          {errorCount > 0 && (
            <span className="flex items-center gap-0.5 text-red-400 font-bold text-[11px]">
              <AlertCircle className="w-3 h-3" />
              {errorCount}
            </span>
          )}
          {warnCount > 0 && (
            <span className="flex items-center gap-0.5 text-yellow-400 font-bold text-[11px]">
              <AlertTriangle className="w-3 h-3" />
              {warnCount}
            </span>
          )}
        </button>
      </div>

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </header>
  );
};
