import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  RemoveFormatting,
  Palette,
  Highlighter,
  Indent,
  Outdent,
} from 'lucide-react';

interface WysiwygToolbarProps {
  onFormatCommand: (command: string, value?: string) => void;
  isInspectMode: boolean;
}

export const WysiwygToolbar: React.FC<WysiwygToolbarProps> = ({ onFormatCommand, isInspectMode }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [textColor, setTextColor] = useState('#ffffff');
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');

  if (!isInspectMode) return null;

  const handleApplyLink = () => {
    if (linkUrl && linkUrl !== 'https://') {
      onFormatCommand('createLink', linkUrl);
      setIsLinkModalOpen(false);
      setLinkUrl('https://');
    }
  };

  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 bg-[#252526] border-b border-[#333333] text-xs text-gray-300 overflow-x-auto select-none">
      {/* Heading Block Dropdown */}
      <div className="flex items-center mr-1">
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val) onFormatCommand('formatBlock', val);
          }}
          defaultValue=""
          className="bg-[#1e1e1e] hover:bg-[#2d2d2d] text-gray-200 border border-[#3f3f46] rounded px-2 py-0.5 text-[11px] font-medium outline-none cursor-pointer"
          title="Heading / Paragraph Format"
        >
          <option value="" disabled>Format...</option>
          <option value="<p>">Normal Paragraph</option>
          <option value="<h1>">Heading 1 (h1)</option>
          <option value="<h2>">Heading 2 (h2)</option>
          <option value="<h3>">Heading 3 (h3)</option>
          <option value="<h4>">Heading 4 (h4)</option>
          <option value="<blockquote>">Blockquote</option>
          <option value="<pre>">Code Block</option>
        </select>
      </div>

      {/* Font Family Dropdown */}
      <div className="flex items-center mr-1">
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val) onFormatCommand('fontName', val);
          }}
          defaultValue=""
          className="bg-[#1e1e1e] hover:bg-[#2d2d2d] text-gray-200 border border-[#3f3f46] rounded px-2 py-0.5 text-[11px] font-medium outline-none cursor-pointer"
          title="Font Family"
        >
          <option value="" disabled>Font...</option>
          <option value="system-ui, sans-serif">System UI</option>
          <option value="Inter, sans-serif">Inter</option>
          <option value="Roboto, sans-serif">Roboto</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
          <option value="Courier New, monospace">Courier New</option>
        </select>
      </div>

      <div className="w-px h-4 bg-[#3f3f46] mx-1" />

      {/* Basic Text Formats */}
      <button
        title="Bold (Ctrl+B)"
        onClick={() => onFormatCommand('bold')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        title="Italic (Ctrl+I)"
        onClick={() => onFormatCommand('italic')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>
      <button
        title="Underline (Ctrl+U)"
        onClick={() => onFormatCommand('underline')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <Underline className="w-3.5 h-3.5" />
      </button>
      <button
        title="Strikethrough"
        onClick={() => onFormatCommand('strikeThrough')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-[#3f3f46] mx-1" />

      {/* Color & Highlight */}
      <div className="relative flex items-center">
        <button
          title="Text Foreground Color"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors flex items-center gap-0.5"
        >
          <Palette className="w-3.5 h-3.5 text-blue-400" />
        </button>
        {showColorPicker && (
          <div className="absolute top-7 left-0 z-50 bg-[#1e1e1e] p-2 rounded shadow-xl border border-[#3f3f46] flex items-center gap-1.5">
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                onFormatCommand('foreColor', e.target.value);
              }}
              className="w-6 h-6 border-none cursor-pointer bg-transparent"
            />
            <button
              onClick={() => setShowColorPicker(false)}
              className="text-[10px] text-gray-400 hover:text-white px-1.5 py-0.5 bg-[#2d2d2d] rounded"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <div className="relative flex items-center">
        <button
          title="Text Background Highlight"
          onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
        >
          <Highlighter className="w-3.5 h-3.5 text-amber-400" />
        </button>
        {showHighlightPicker && (
          <div className="absolute top-7 left-0 z-50 bg-[#1e1e1e] p-2 rounded shadow-xl border border-[#3f3f46] flex items-center gap-1.5">
            <input
              type="color"
              value={highlightColor}
              onChange={(e) => {
                setHighlightColor(e.target.value);
                onFormatCommand('hiliteColor', e.target.value);
              }}
              className="w-6 h-6 border-none cursor-pointer bg-transparent"
            />
            <button
              onClick={() => setShowHighlightPicker(false)}
              className="text-[10px] text-gray-400 hover:text-white px-1.5 py-0.5 bg-[#2d2d2d] rounded"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-4 bg-[#3f3f46] mx-1" />

      {/* Alignment */}
      <button
        title="Align Left"
        onClick={() => onFormatCommand('justifyLeft')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <AlignLeft className="w-3.5 h-3.5" />
      </button>
      <button
        title="Align Center"
        onClick={() => onFormatCommand('justifyCenter')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <AlignCenter className="w-3.5 h-3.5" />
      </button>
      <button
        title="Align Right"
        onClick={() => onFormatCommand('justifyRight')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <AlignRight className="w-3.5 h-3.5" />
      </button>
      <button
        title="Justify"
        onClick={() => onFormatCommand('justifyFull')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <AlignJustify className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-[#3f3f46] mx-1" />

      {/* Lists & Indents */}
      <button
        title="Bulleted List (<ul>)"
        onClick={() => onFormatCommand('insertUnorderedList')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <List className="w-3.5 h-3.5 text-emerald-400" />
      </button>
      <button
        title="Numbered List (<ol>)"
        onClick={() => onFormatCommand('insertOrderedList')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <ListOrdered className="w-3.5 h-3.5 text-emerald-400" />
      </button>
      <button
        title="Indent"
        onClick={() => onFormatCommand('indent')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <Indent className="w-3.5 h-3.5" />
      </button>
      <button
        title="Outdent"
        onClick={() => onFormatCommand('outdent')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-gray-400 transition-colors"
      >
        <Outdent className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-[#3f3f46] mx-1" />

      {/* Link & Clear Format */}
      <button
        title="Insert Hyperlink"
        onClick={() => setIsLinkModalOpen(true)}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-blue-400 transition-colors"
      >
        <Link className="w-3.5 h-3.5" />
      </button>
      <button
        title="Clear Inline Formatting"
        onClick={() => onFormatCommand('removeFormat')}
        className="p-1 hover:bg-[#37373d] hover:text-white rounded text-rose-400 transition-colors"
      >
        <RemoveFormatting className="w-3.5 h-3.5" />
      </button>

      {/* Link Input Dialog Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-[#3f3f46] rounded-xl p-4 shadow-2xl max-w-sm w-full space-y-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
              <Link className="w-4 h-4 text-[#007acc]" />
              <span>Insert / Edit Hyperlink</span>
            </h3>
            <div className="space-y-1">
              <label className="text-[11px] text-gray-400 font-medium">Link Destination URL:</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-[#121212] border border-[#3f3f46] focus:border-[#007acc] rounded px-2.5 py-1.5 text-xs text-white outline-none font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#333333]">
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="px-3 py-1 bg-[#2a2a2b] hover:bg-[#37373d] text-gray-300 rounded text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyLink}
                className="px-3 py-1 bg-[#007acc] hover:bg-[#0069aa] text-white font-medium rounded text-xs transition-colors"
              >
                Apply Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
