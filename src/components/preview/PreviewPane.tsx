import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  RotateCw,
  ExternalLink,
  ChevronDown,
  Globe,
  MousePointer,
  Play,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { bundleProjectForPreview, bundleProjectForStandalone } from '../../services/previewBundler';
import { ViewportMode, DomBreadcrumbNode } from '../../types/vfs';
import { WysiwygToolbar } from '../wysiwyg/WysiwygToolbar';
import { DomBreadcrumbBar } from './DomBreadcrumbBar';

export const PreviewPane: React.FC = () => {
  const {
    files,
    previewCurrentPath,
    setPreviewCurrentPath,
    setActiveFile,
    canvasMode,
    setCanvasMode,
    isInspectMode,
    setSelectedElement,
    updateSelectedElementText,
    addConsoleLog,
    viewportMode,
    setViewportMode,
    previewKey,
    reloadPreview,
  } = useProjectStore();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [debouncedHtml, setDebouncedHtml] = useState<string>('');
  const [isLandscape, setIsLandscape] = useState(false);

  // Collect all HTML files in project for page selector dropdown
  const htmlFiles = useMemo(() => {
    return Object.keys(files).filter((path) => path.endsWith('.html') || path.endsWith('.htm'));
  }, [files]);

  // Debounced preview generation (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const bundled = bundleProjectForPreview(files, previewCurrentPath, isInspectMode);
      setDebouncedHtml(bundled);
    }, 250);

    return () => clearTimeout(timer);
  }, [files, previewCurrentPath, previewKey, isInspectMode]);

  const sendInspectModeToIframe = (mode: boolean) => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'SET_INSPECT_MODE',
            payload: mode,
          },
          '*'
        );
      } catch (e) {
        console.warn('Failed to dispatch inspect mode to iframe:', e);
      }
    }
  };

  const sendFormatCommandToIframe = (command: string, value?: string) => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'WEBSTUDIO_FORMAT_TEXT',
            payload: { command, value },
          },
          '*'
        );
      } catch (e) {
        console.warn('Failed to dispatch format command to iframe:', e);
      }
    }
  };

  const sendSelectElementToIframe = (node: DomBreadcrumbNode) => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'SELECT_ELEMENT',
            payload: {
              dataWebstudioId: node.dataWebstudioId,
              selector: node.selector,
            },
          },
          '*'
        );
      } catch (e) {
        console.warn('Failed to dispatch select element to iframe:', e);
      }
    }
  };

  // Sync inspect mode to iframe
  useEffect(() => {
    sendInspectModeToIframe(isInspectMode);
  }, [isInspectMode, debouncedHtml]);

  // Listen to messages from the preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case 'WEBSTUDIO_IFRAME_READY':
          sendInspectModeToIframe(isInspectMode);
          break;

        case 'WEBSTUDIO_CONSOLE_LOG':
          if (data.payload) {
            addConsoleLog(data.payload);
          }
          break;

        case 'WEBSTUDIO_NAVIGATE_TO':
          if (data.payload?.path) {
            const cleanPath = data.payload.path.replace(/^\/+/, '');
            if (files[cleanPath]) {
              setPreviewCurrentPath(cleanPath);
              setActiveFile(cleanPath);
            }
          }
          break;

        case 'WEBSTUDIO_ELEMENT_SELECTED':
          if (data.payload) {
            setSelectedElement(data.payload);
          }
          break;

        case 'WEBSTUDIO_CANVAS_TEXT_EDITED':
          if (data.payload?.text !== undefined) {
            updateSelectedElementText(
              data.payload.text,
              data.payload.selector,
              data.payload.dataWebstudioId,
              data.payload.id,
              data.payload.tagName
            );
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [files, isInspectMode, addConsoleLog, setPreviewCurrentPath, setActiveFile, setSelectedElement, updateSelectedElementText]);

  const getViewportDimensions = (mode: ViewportMode, landscape: boolean) => {
    switch (mode) {
      case 'mobile':
        return landscape ? { width: '844px', height: '390px' } : { width: '390px', height: '844px' };
      case 'tablet':
        return landscape ? { width: '1024px', height: '768px' } : { width: '768px', height: '1024px' };
      case 'desktop':
        return { width: '1280px', height: '100%' };
      case 'responsive':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const dimensions = getViewportDimensions(viewportMode, isLandscape);

  const handleOpenInNewTab = () => {
    try {
      const standaloneHtml = bundleProjectForStandalone(files, previewCurrentPath);
      const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const newWin = window.open(url, '_blank');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Failed to open standalone preview:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#181818] overflow-hidden">
      {/* Top Preview Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333] text-xs select-none">
        {/* Page selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-gray-400 font-medium">
            <Globe className="w-3.5 h-3.5 text-[#007acc]" />
            <span className="hidden sm:inline">Preview:</span>
          </div>

          <div className="relative">
            <select
              value={previewCurrentPath}
              onChange={(e) => {
                setPreviewCurrentPath(e.target.value);
                setActiveFile(e.target.value);
              }}
              className="bg-[#1e1e1e] text-white border border-[#333333] hover:border-[#555] rounded px-2 py-1 pr-6 text-xs appearance-none font-medium cursor-pointer focus:outline-none focus:border-[#007acc]"
            >
              {htmlFiles.map((path) => (
                <option key={path} value={path}>
                  {path}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            title="Reload Preview"
            onClick={reloadPreview}
            className="p-1 hover:bg-[#37373d] rounded text-gray-400 hover:text-white transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center gap-1 bg-[#1e1e1e] p-0.5 rounded border border-[#333333]">
          <button
            title="Responsive (100%)"
            onClick={() => setViewportMode('responsive')}
            className={`p-1 rounded transition-colors ${
              viewportMode === 'responsive' ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            title="Desktop Viewport"
            onClick={() => setViewportMode('desktop')}
            className={`p-1 rounded transition-colors ${
              viewportMode === 'desktop' ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            title="Tablet Viewport"
            onClick={() => setViewportMode('tablet')}
            className={`p-1 rounded transition-colors ${
              viewportMode === 'tablet' ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            title="Mobile Viewport"
            onClick={() => setViewportMode('mobile')}
            className={`p-1 rounded transition-colors ${
              viewportMode === 'mobile' ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right action tools */}
        <div className="flex items-center gap-2">
          {(viewportMode === 'mobile' || viewportMode === 'tablet') && (
            <button
              title="Toggle Orientation"
              onClick={() => setIsLandscape(!isLandscape)}
              className="p-1 hover:bg-[#37373d] rounded text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
            >
              <RotateCw className="w-3 h-3" />
              <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
            </button>
          )}

          {/* Canvas Mode Toggle: Design (Direct Click-to-Edit) vs Interact */}
          <div className="flex items-center bg-[#1e1e1e] p-0.5 rounded border border-[#333333]">
            <button
              title="Design Mode: Click elements to visually inspect and edit; double-click text to live-type"
              onClick={() => setCanvasMode('design')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                canvasMode === 'design'
                  ? 'bg-[#007acc] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span>Design</span>
            </button>
            <button
              title="Interact Mode: Test button clicks, JS alerts, and form submissions normally"
              onClick={() => setCanvasMode('interact')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                canvasMode === 'interact'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Interact</span>
            </button>
          </div>

          <button
            title="Open in new window"
            onClick={handleOpenInNewTab}
            className="p-1 hover:bg-[#37373d] rounded text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* WYSIWYG Ribbon Toolbar (Active in Inspect/Design mode) */}
      <WysiwygToolbar onFormatCommand={sendFormatCommandToIframe} isInspectMode={isInspectMode} />

      {/* Viewport Frame Container */}
      <div className="flex-1 bg-[#121212] overflow-auto flex items-center justify-center p-2 relative">
        <div
          style={{
            width: dimensions.width,
            height: dimensions.height,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
          className={`relative bg-white transition-all duration-200 flex flex-col ${
            viewportMode !== 'responsive'
              ? 'shadow-2xl rounded-lg border-4 border-[#2d2d2d] overflow-hidden my-auto'
              : 'w-full h-full'
          }`}
        >
          {/* Iframe Viewport */}
          <iframe
            ref={iframeRef}
            key={previewKey}
            title="Live Preview"
            srcDoc={debouncedHtml}
            onLoad={() => sendInspectModeToIframe(isInspectMode)}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className="w-full h-full border-none bg-white"
          />
        </div>
      </div>

      {/* HTML DOM Breadcrumb Hierarchy Bar */}
      <DomBreadcrumbBar onSelectNode={sendSelectElementToIframe} />
    </div>
  );
};
