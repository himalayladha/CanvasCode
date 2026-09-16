import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Layers,
  X,
  MousePointerClick,
  Code2,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileCode,
  Check,
  Link2,
  Sparkles,
} from 'lucide-react';
import { InspectedElementData } from '../../types/vfs';
import { ColorPickerInput } from './ColorPickerInput';
import { BoxModelControl } from './BoxModelControl';
import { ClassManager } from './ClassManager';
import { AttributeEditor } from './AttributeEditor';
import { LayoutControl } from './LayoutControl';
import { useProjectStore } from '../../store/useProjectStore';

interface VisualInspectorProps {
  selectedElement: InspectedElementData | null;
  onUpdateStyle: (property: string, value: string) => void;
  onUpdateText: (newText: string) => void;
  onUpdateAttribute?: (name: string, value: string) => void;
  onAddClass?: (className: string) => void;
  onRemoveClass?: (className: string) => void;
  onChangeTag?: (newTag: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicateElement?: () => void;
  onDeleteElement?: () => void;
  onJumpToCode?: () => void;
  onJumpToCss?: (selector: string) => void;
  onJumpToJs?: (idOrSelector: string) => void;
  onSaveStylesToCss?: (
    cssFilePath: string,
    selector: string,
    styles: Record<string, string>,
    removeInlineStylesFromElement?: boolean
  ) => void;
  onInjectResource?: (resourceType: 'css' | 'js', resourcePath: string) => void;
  onClose: () => void;
}

export const VisualInspector: React.FC<VisualInspectorProps> = ({
  selectedElement,
  onUpdateStyle,
  onUpdateText,
  onUpdateAttribute,
  onAddClass,
  onRemoveClass,
  onChangeTag,
  onMoveUp,
  onMoveDown,
  onDuplicateElement,
  onDeleteElement,
  onJumpToCode,
  onJumpToCss,
  onJumpToJs,
  onSaveStylesToCss,
  onInjectResource,
  onClose,
}) => {
  const { files, previewCurrentPath } = useProjectStore();

  const [targetCssFile, setTargetCssFile] = useState<string>('css/style.css');
  const [cssSelectorInput, setCssSelectorInput] = useState<string>('');
  const [clearInlinesOnSave, setClearInlinesOnSave] = useState<boolean>(true);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  // Available CSS files in project
  const cssFiles = Object.keys(files).filter((k) => k.endsWith('.css'));

  // Update default CSS selector input when selectedElement changes
  useEffect(() => {
    if (selectedElement) {
      if (selectedElement.classList.length > 0) {
        setCssSelectorInput(`.${selectedElement.classList[0]}`);
      } else if (selectedElement.id) {
        setCssSelectorInput(`#${selectedElement.id}`);
      } else {
        setCssSelectorInput(`.${selectedElement.tagName.toLowerCase()}-custom`);
      }
    }
  }, [selectedElement?.id, selectedElement?.classList]);

  if (!selectedElement) {
    return (
      <div className="w-80 h-full bg-[#181818] border-l border-[#333333] flex flex-col items-center justify-center p-6 text-center text-xs text-gray-500 select-none">
        <MousePointerClick className="w-10 h-10 mb-3 text-gray-600 opacity-60" />
        <h4 className="font-semibold text-gray-300 mb-1">No element selected</h4>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Enable <strong className="text-blue-400">Inspect Mode</strong> in the preview toolbar and click any element to inspect & edit its styles visually.
        </p>
      </div>
    );
  }

  const { tagName, id, classList, selector, innerText, attributes, computedStyles, boxModel, rect } = selectedElement;

  const fontSizeNum = parseInt(computedStyles.fontSize || '16', 10) || 16;
  const borderRadiusNum = parseInt(computedStyles.borderRadius || '0', 10) || 0;

  const handleSaveToCss = () => {
    if (!onSaveStylesToCss || !cssSelectorInput.trim()) return;

    // Extract non-empty custom / computed styles
    const stylesToSave: Record<string, string> = {};
    if (computedStyles.color) stylesToSave['color'] = computedStyles.color;
    if (computedStyles.backgroundColor && computedStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' && computedStyles.backgroundColor !== 'transparent') {
      stylesToSave['background-color'] = computedStyles.backgroundColor;
    }
    if (computedStyles.fontSize) stylesToSave['font-size'] = computedStyles.fontSize;
    if (computedStyles.fontWeight) stylesToSave['font-weight'] = computedStyles.fontWeight;
    if (computedStyles.textAlign && computedStyles.textAlign !== 'start') stylesToSave['text-align'] = computedStyles.textAlign;
    if (computedStyles.borderRadius && computedStyles.borderRadius !== '0px') stylesToSave['border-radius'] = computedStyles.borderRadius;
    if (computedStyles.display && computedStyles.display !== 'block') stylesToSave['display'] = computedStyles.display;
    if (computedStyles.gap && computedStyles.gap !== '0px') stylesToSave['gap'] = computedStyles.gap;

    onSaveStylesToCss(targetCssFile, cssSelectorInput.trim(), stylesToSave, clearInlinesOnSave);

    setSavedFeedback(`Saved to ${targetCssFile}!`);
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  // Check if active HTML links css/style.css or js/app.js
  const activeHtmlContent = files[previewCurrentPath]?.content || '';
  const hasCssLink = activeHtmlContent.includes('style.css') || activeHtmlContent.includes('.css');
  const hasJsLink = activeHtmlContent.includes('app.js') || activeHtmlContent.includes('.js');

  return (
    <div className="w-80 h-full bg-[#181818] border-l border-[#333333] flex flex-col select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#333333]">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sliders className="w-3.5 h-3.5 text-[#007acc] shrink-0" />
          <span className="font-semibold text-white text-xs">Visual Inspector</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#333333] rounded text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tri-target Jump to Code Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1f1f20] border-b border-[#333333] text-[11px]">
        <span className="text-gray-400 flex items-center gap-1 font-medium">
          <Code2 className="w-3 h-3 text-[#007acc]" />
          <span>Jump to:</span>
        </span>
        <div className="flex items-center gap-1">
          {onJumpToCode && (
            <button
              title="Jump to element in active HTML file"
              onClick={onJumpToCode}
              className="px-1.5 py-0.5 bg-[#2a2a2b] hover:bg-[#37373d] text-blue-300 rounded border border-[#3f3f46] transition-colors font-medium text-[10px]"
            >
              📄 HTML
            </button>
          )}
          {onJumpToCss && (
            <button
              title="Jump to matching class/ID rule in stylesheet"
              onClick={() => onJumpToCss(classList[0] ? `.${classList[0]}` : (id ? `#${id}` : tagName))}
              className="px-1.5 py-0.5 bg-[#2a2a2b] hover:bg-[#37373d] text-purple-300 rounded border border-[#3f3f46] transition-colors font-medium text-[10px]"
            >
              🎨 CSS
            </button>
          )}
          {onJumpToJs && (
            <button
              title="Jump to element ID reference in JavaScript"
              onClick={() => onJumpToJs(id || classList[0] || tagName)}
              className="px-1.5 py-0.5 bg-[#2a2a2b] hover:bg-[#37373d] text-amber-300 rounded border border-[#3f3f46] transition-colors font-medium text-[10px]"
            >
              ⚡ JS
            </button>
          )}
        </div>
      </div>

      <div className="p-3 space-y-4 text-xs">
        {/* Element Tag & Identity */}
        <div className="bg-[#252526] border border-[#333333] rounded p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            {onChangeTag ? (
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 font-semibold">TAG:</span>
                <select
                  value={tagName.toLowerCase()}
                  onChange={(e) => onChangeTag(e.target.value)}
                  className="bg-[#007acc] hover:bg-[#0069aa] text-white font-mono font-bold px-1.5 py-0.5 rounded text-[11px] cursor-pointer outline-none uppercase"
                  title="Change Element HTML Tag"
                >
                  <option value="h1">h1</option>
                  <option value="h2">h2</option>
                  <option value="h3">h3</option>
                  <option value="h4">h4</option>
                  <option value="h5">h5</option>
                  <option value="h6">h6</option>
                  <option value="p">p</option>
                  <option value="span">span</option>
                  <option value="div">div</option>
                  <option value="section">section</option>
                  <option value="article">article</option>
                  <option value="header">header</option>
                  <option value="footer">footer</option>
                  <option value="nav">nav</option>
                  <option value="main">main</option>
                  <option value="button">button</option>
                  <option value="a">a</option>
                  <option value="ul">ul</option>
                  <option value="li">li</option>
                  <option value="blockquote">blockquote</option>
                  <option value="img">img</option>
                </select>
              </div>
            ) : (
              <span className="bg-[#007acc] text-white font-mono px-1.5 py-0.5 rounded text-[11px] font-bold">
                {tagName}
              </span>
            )}
            {id && (
              <span className="bg-purple-950/60 text-purple-300 font-mono px-1.5 py-0.5 rounded text-[11px] border border-purple-500/30">
                #{id}
              </span>
            )}
            <span className="text-[10px] text-gray-500 font-mono ml-auto">
              {Math.round(rect.width)} × {Math.round(rect.height)} px
            </span>
          </div>

          <div className="text-[10px] text-gray-500 font-mono truncate mt-1 pt-1 border-t border-[#333333]">
            {selector}
          </div>

          {/* Quick DOM Actions */}
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#333333] flex-wrap">
            {onMoveUp && (
              <button
                title="Move Element Up in DOM"
                onClick={onMoveUp}
                className="flex items-center gap-1 px-2 py-1 bg-[#1e1e1e] hover:bg-[#2e2e2e] border border-[#3f3f46] text-gray-200 rounded text-[11px] transition-colors"
              >
                <ArrowUp className="w-3 h-3 text-emerald-400" />
                <span>Up</span>
              </button>
            )}
            {onMoveDown && (
              <button
                title="Move Element Down in DOM"
                onClick={onMoveDown}
                className="flex items-center gap-1 px-2 py-1 bg-[#1e1e1e] hover:bg-[#2e2e2e] border border-[#3f3f46] text-gray-200 rounded text-[11px] transition-colors"
              >
                <ArrowDown className="w-3 h-3 text-emerald-400" />
                <span>Down</span>
              </button>
            )}
            {onDuplicateElement && (
              <button
                title="Duplicate Element"
                onClick={onDuplicateElement}
                className="flex items-center gap-1 px-2 py-1 bg-[#1e1e1e] hover:bg-[#2e2e2e] border border-[#3f3f46] text-gray-200 rounded text-[11px] transition-colors"
              >
                <Copy className="w-3 h-3 text-blue-400" />
                <span>Duplicate</span>
              </button>
            )}
            {onDeleteElement && (
              <button
                title="Delete Element"
                onClick={onDeleteElement}
                className="flex items-center gap-1 px-2 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded text-[11px] transition-colors ml-auto"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Text Content Editor */}
        {innerText !== undefined && innerText !== '' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
              <Type className="w-3 h-3 text-orange-400" />
              <span>Text Content</span>
            </div>
            <textarea
              value={innerText}
              rows={2}
              onChange={(e) => onUpdateText(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#333333] focus:border-[#007acc] rounded p-2 text-xs text-white font-sans outline-none resize-none"
            />
          </div>
        )}

        {/* Class Manager */}
        {onAddClass && onRemoveClass && (
          <ClassManager
            classList={classList}
            onAddClass={onAddClass}
            onRemoveClass={onRemoveClass}
          />
        )}

        {/* HTML Attributes */}
        {onUpdateAttribute && (
          <AttributeEditor
            tagName={tagName}
            attributes={attributes}
            onUpdateAttribute={onUpdateAttribute}
          />
        )}

        {/* Typography Section */}
        <div className="space-y-2.5 pt-2 border-t border-[#333333]">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
            <Type className="w-3 h-3 text-blue-400" />
            <span>Typography</span>
          </div>

          {/* Text Color */}
          <ColorPickerInput
            label="Text Color"
            value={computedStyles.color}
            onChange={(val) => onUpdateStyle('color', val)}
          />

          {/* Font Size */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[11px]">Font Size</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="8"
                max="96"
                value={fontSizeNum}
                onChange={(e) => onUpdateStyle('fontSize', `${e.target.value}px`)}
                className="w-20 accent-[#007acc] cursor-pointer"
              />
              <span className="w-12 text-right font-mono text-[11px] text-gray-200">
                {computedStyles.fontSize}
              </span>
            </div>
          </div>

          {/* Font Weight */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[11px]">Font Weight</span>
            <select
              value={computedStyles.fontWeight}
              onChange={(e) => onUpdateStyle('fontWeight', e.target.value)}
              className="bg-[#1e1e1e] border border-[#333333] rounded px-2 py-0.5 text-[11px] text-white font-mono outline-none"
            >
              <option value="300">Light (300)</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">SemiBold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">ExtraBold (800)</option>
            </select>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[11px]">Alignment</span>
            <div className="flex items-center bg-[#1e1e1e] rounded p-0.5 border border-[#333333]">
              <button
                onClick={() => onUpdateStyle('textAlign', 'left')}
                className={`p-1 rounded ${computedStyles.textAlign === 'left' ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <AlignLeft className="w-3 h-3" />
              </button>
              <button
                onClick={() => onUpdateStyle('textAlign', 'center')}
                className={`p-1 rounded ${computedStyles.textAlign === 'center' ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <AlignCenter className="w-3 h-3" />
              </button>
              <button
                onClick={() => onUpdateStyle('textAlign', 'right')}
                className={`p-1 rounded ${computedStyles.textAlign === 'right' ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <AlignRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => onUpdateStyle('textAlign', 'justify')}
                className={`p-1 rounded ${computedStyles.textAlign === 'justify' ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <AlignJustify className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Background & Borders */}
        <div className="space-y-2.5 pt-2 border-t border-[#333333]">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
            <Layers className="w-3 h-3 text-purple-400" />
            <span>Background & Border</span>
          </div>

          {/* Background Color */}
          <ColorPickerInput
            label="Background"
            value={computedStyles.backgroundColor}
            onChange={(val) => onUpdateStyle('backgroundColor', val)}
          />

          {/* Border Radius */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[11px]">Corner Radius</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="48"
                value={borderRadiusNum}
                onChange={(e) => onUpdateStyle('borderRadius', `${e.target.value}px`)}
                className="w-20 accent-[#007acc] cursor-pointer"
              />
              <span className="w-12 text-right font-mono text-[11px] text-gray-200">
                {computedStyles.borderRadius}
              </span>
            </div>
          </div>
        </div>

        {/* Box Model (Margin & Padding) */}
        <div className="space-y-1.5 pt-2 border-t border-[#333333]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
              Box Model Spacing
            </span>
            <span className="text-[10px] text-gray-500">Margin / Padding</span>
          </div>

          <BoxModelControl boxModel={boxModel} onUpdateStyle={onUpdateStyle} />
        </div>

        {/* Layout & Display (Flexbox, Grid, Opacity) */}
        <LayoutControl
          display={computedStyles.display}
          flexDirection={computedStyles.flexDirection}
          alignItems={computedStyles.alignItems}
          justifyContent={computedStyles.justifyContent}
          gap={computedStyles.gap}
          opacity={computedStyles.opacity}
          onUpdateStyle={onUpdateStyle}
        />

        {/* Save to CSS Stylesheet Section */}
        {onSaveStylesToCss && (
          <div className="space-y-2.5 pt-2 border-t border-[#333333] bg-[#222224] p-2.5 rounded border border-[#38383a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                <span>Save to CSS File</span>
              </div>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>

            {/* Target Stylesheet File */}
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400">Target Stylesheet:</span>
              <select
                value={targetCssFile}
                onChange={(e) => setTargetCssFile(e.target.value)}
                className="w-full bg-[#181818] border border-[#3f3f46] focus:border-[#007acc] rounded px-2 py-1 text-[11px] text-white font-mono outline-none"
              >
                {cssFiles.length > 0 ? (
                  cssFiles.map((path) => (
                    <option key={path} value={path}>
                      {path}
                    </option>
                  ))
                ) : (
                  <option value="css/style.css">css/style.css (new)</option>
                )}
              </select>
            </div>

            {/* Target Selector / Class Name */}
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400">CSS Selector / Class:</span>
              <input
                type="text"
                value={cssSelectorInput}
                onChange={(e) => setCssSelectorInput(e.target.value)}
                placeholder=".my-custom-class"
                className="w-full bg-[#181818] border border-[#3f3f46] focus:border-[#007acc] rounded px-2 py-1 text-[11px] text-white font-mono outline-none"
              />
            </div>

            {/* Clear inline styles checkbox */}
            <label className="flex items-center gap-1.5 text-[10px] text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={clearInlinesOnSave}
                onChange={(e) => setClearInlinesOnSave(e.target.checked)}
                className="accent-[#007acc] rounded cursor-pointer"
              />
              <span>Clear inline style attribute after saving</span>
            </label>

            {/* Save Button */}
            <button
              onClick={handleSaveToCss}
              className="w-full py-1.5 bg-gradient-to-r from-[#007acc] to-indigo-600 hover:from-[#0069aa] hover:to-indigo-700 text-white font-semibold rounded text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Extract & Save to Stylesheet</span>
            </button>

            {savedFeedback && (
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 p-1.5 rounded border border-emerald-500/30 animate-in fade-in">
                <Check className="w-3 h-3" />
                <span>{savedFeedback}</span>
              </div>
            )}
          </div>
        )}

        {/* Quick Resource Linking (if missing) */}
        {onInjectResource && (!hasCssLink || !hasJsLink) && (
          <div className="pt-2 border-t border-[#333333] space-y-1.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Link2 className="w-3 h-3 text-blue-400" />
              <span>Resource Linking</span>
            </span>

            {!hasCssLink && (
              <button
                onClick={() => onInjectResource('css', 'css/style.css')}
                className="w-full text-left px-2 py-1 bg-[#1e1e1e] hover:bg-[#2e2e2e] border border-blue-500/30 text-blue-300 rounded text-[10px] transition-colors flex items-center justify-between"
              >
                <span>+ Link <code>css/style.css</code> to &lt;head&gt;</span>
              </button>
            )}

            {!hasJsLink && (
              <button
                onClick={() => onInjectResource('js', 'js/app.js')}
                className="w-full text-left px-2 py-1 bg-[#1e1e1e] hover:bg-[#2e2e2e] border border-amber-500/30 text-amber-300 rounded text-[10px] transition-colors flex items-center justify-between"
              >
                <span>+ Link <code>js/app.js</code> to &lt;body&gt;</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
