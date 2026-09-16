import React from 'react';
import {
  Sliders,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Layers,
  X,
  Sparkles,
  MousePointerClick,
} from 'lucide-react';
import { InspectedElementData } from '../../types/vfs';
import { ColorPickerInput } from './ColorPickerInput';
import { BoxModelControl } from './BoxModelControl';

interface VisualInspectorProps {
  selectedElement: InspectedElementData | null;
  onUpdateStyle: (property: string, value: string) => void;
  onUpdateText: (newText: string) => void;
  onClose: () => void;
}

export const VisualInspector: React.FC<VisualInspectorProps> = ({
  selectedElement,
  onUpdateStyle,
  onUpdateText,
  onClose,
}) => {
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

  const { tagName, id, classList, selector, innerText, computedStyles, boxModel, rect } = selectedElement;

  const fontSizeNum = parseInt(computedStyles.fontSize || '16', 10) || 16;
  const borderRadiusNum = parseInt(computedStyles.borderRadius || '0', 10) || 0;

  return (
    <div className="w-80 h-full bg-[#181818] border-l border-[#333333] flex flex-col select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#333333]">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sliders className="w-3.5 h-3.5 text-[#007acc] shrink-0" />
          <span className="font-semibold text-white text-xs">Visual Inspector</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#333333] rounded text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-4 text-xs">
        {/* Element Tag & Identity */}
        <div className="bg-[#252526] border border-[#333333] rounded p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="bg-[#007acc] text-white font-mono px-1.5 py-0.5 rounded text-[11px] font-bold">
              {tagName}
            </span>
            {id && (
              <span className="bg-purple-950/60 text-purple-300 font-mono px-1.5 py-0.5 rounded text-[11px] border border-purple-500/30">
                #{id}
              </span>
            )}
            <span className="text-[10px] text-gray-500 font-mono ml-auto">
              {Math.round(rect.width)} × {Math.round(rect.height)} px
            </span>
          </div>

          {classList.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {classList.map((cls) => (
                <span
                  key={cls}
                  className="bg-[#1e1e1e] text-blue-300 font-mono px-1.5 py-0.2 rounded text-[10px] border border-[#3f3f46]"
                >
                  .{cls}
                </span>
              ))}
            </div>
          )}

          <div className="text-[10px] text-gray-500 font-mono truncate mt-1 pt-1 border-t border-[#333333]">
            {selector}
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
      </div>
    </div>
  );
};
