import React, { useState } from 'react';
import {
  X,
  Table,
  Image,
  Layers,
  FormInput,
  Columns,
  LayoutTemplate,
  PlusCircle,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';

interface InsertPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsertPaletteModal: React.FC<InsertPaletteModalProps> = ({ isOpen, onClose }) => {
  const { files, insertHtmlSnippetAtSelected } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'table' | 'layout' | 'form' | 'media'>('table');
  const [insertPosition, setInsertPosition] = useState<'after' | 'inside' | 'before'>('after');

  // Table State
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [hasHeaderRow, setHasHeaderRow] = useState(true);
  const [tableBorder, setTableBorder] = useState(true);
  const [tableStriped, setTableStriped] = useState(true);

  // Media State
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('Image description');
  const [imageWidth, setImageWidth] = useState('100%');

  if (!isOpen) return null;

  // Available image assets in VFS
  const vfsImageFiles = Object.keys(files).filter(
    (k) => k.endsWith('.png') || k.endsWith('.jpg') || k.endsWith('.jpeg') || k.endsWith('.svg') || k.endsWith('.webp')
  );

  const handleInsertTable = () => {
    let html = `<div style="overflow-x: auto; margin: 1.5rem 0;">\n<table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; ${tableBorder ? 'border: 1px solid #3f3f46;' : ''}">\n`;

    if (hasHeaderRow) {
      html += `  <thead>\n    <tr style="background: rgba(255, 255, 255, 0.08); border-bottom: 2px solid #3f3f46;">\n`;
      for (let c = 1; c <= tableCols; c++) {
        html += `      <th style="padding: 10px 14px; font-weight: 700; color: #f8fafc;">Header ${c}</th>\n`;
      }
      html += `    </tr>\n  </thead>\n`;
    }

    html += `  <tbody>\n`;
    for (let r = 1; r <= tableRows; r++) {
      const bg = tableStriped && r % 2 === 0 ? 'background: rgba(255, 255, 255, 0.03);' : '';
      html += `    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); ${bg}">\n`;
      for (let c = 1; c <= tableCols; c++) {
        html += `      <td style="padding: 10px 14px; color: #cbd5e1;">Data Row ${r}, Col ${c}</td>\n`;
      }
      html += `    </tr>\n`;
    }
    html += `  </tbody>\n</table>\n</div>`;

    insertHtmlSnippetAtSelected(html, insertPosition);
    onClose();
  };

  const handleInsertMedia = () => {
    const src = imageUrl.trim() || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80';
    const html = `<figure style="margin: 1.5rem 0; text-align: center;">\n  <img src="${src}" alt="${imageAlt}" style="width: ${imageWidth}; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />\n  <figcaption style="font-size: 0.85rem; color: #94a3b8; margin-top: 6px;">${imageAlt}</figcaption>\n</figure>`;
    insertHtmlSnippetAtSelected(html, insertPosition);
    onClose();
  };

  const handleInsertLayout = (type: string) => {
    let html = '';
    switch (type) {
      case '2-col':
        html = `<div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 2rem 0;">\n  <div style="flex: 1; min-width: 260px; padding: 1.5rem; background: rgba(255, 255, 255, 0.04); border: 1px solid #333; border-radius: 12px;">\n    <h3 style="margin-top: 0;">Column 1</h3>\n    <p style="color: #94a3b8;">Insert your content, images, or cards here.</p>\n  </div>\n  <div style="flex: 1; min-width: 260px; padding: 1.5rem; background: rgba(255, 255, 255, 0.04); border: 1px solid #333; border-radius: 12px;">\n    <h3 style="margin-top: 0;">Column 2</h3>\n    <p style="color: #94a3b8;">Insert secondary text, forms, or media here.</p>\n  </div>\n</div>`;
        break;
      case '3-col':
        html = `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin: 2rem 0;">\n  <div style="padding: 1.5rem; background: rgba(255, 255, 255, 0.04); border: 1px solid #333; border-radius: 12px;">\n    <h3>Feature One</h3>\n    <p style="color: #94a3b8;">High performance description.</p>\n  </div>\n  <div style="padding: 1.5rem; background: rgba(255, 255, 255, 0.04); border: 1px solid #333; border-radius: 12px;">\n    <h3>Feature Two</h3>\n    <p style="color: #94a3b8;">Interactive live preview.</p>\n  </div>\n  <div style="padding: 1.5rem; background: rgba(255, 255, 255, 0.04); border: 1px solid #333; border-radius: 12px;">\n    <h3>Feature Three</h3>\n    <p style="color: #94a3b8;">Direct source synchronization.</p>\n  </div>\n</div>`;
        break;
      case 'hero':
        html = `<section style="padding: 4rem 2rem; text-align: center; background: radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.15), transparent 70%); border-radius: 16px; margin: 2rem 0; border: 1px solid rgba(99, 102, 241, 0.25);">\n  <h1 style="font-size: 2.8rem; font-weight: 800; margin-bottom: 1rem; color: #fff;">Build Stunning Websites Fast</h1>\n  <p style="font-size: 1.15rem; color: #94a3b8; max-width: 600px; margin: 0 auto 2rem;">Visual WYSIWYG editing with zero setup. Everything updates in real time.</p>\n  <button style="padding: 10px 24px; background: #6366f1; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Get Started Now</button>\n</section>`;
        break;
      case 'card':
        html = `<div style="padding: 1.75rem; background: #252526; border: 1px solid #3f3f46; border-radius: 12px; margin: 1.5rem 0; box-shadow: 0 4px 16px rgba(0,0,0,0.2);">\n  <h3 style="margin-top: 0; color: #f8fafc; font-size: 1.25rem;">Interactive Card</h3>\n  <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.5;">This card was generated visually. You can double click this text to edit it on canvas.</p>\n  <a href="#" style="color: #60a5fa; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Learn More &rarr;</a>\n</div>`;
        break;
      case 'hr':
        html = `<hr style="border: 0; height: 1px; background: #3f3f46; margin: 2.5rem 0;" />`;
        break;
      default:
        break;
    }

    if (html) {
      insertHtmlSnippetAtSelected(html, insertPosition);
      onClose();
    }
  };

  const handleInsertForm = (type: string) => {
    let html = '';
    switch (type) {
      case 'form':
        html = `<form style="padding: 1.5rem; background: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 12px; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem;">\n  <div>\n    <label style="display: block; margin-bottom: 4px; font-size: 0.85rem; font-weight: 600;">Full Name</label>\n    <input type="text" placeholder="John Doe" style="width: 100%; padding: 8px 12px; background: #121212; border: 1px solid #3f3f46; border-radius: 6px; color: white;" />\n  </div>\n  <div>\n    <label style="display: block; margin-bottom: 4px; font-size: 0.85rem; font-weight: 600;">Email Address</label>\n    <input type="email" placeholder="john@example.com" style="width: 100%; padding: 8px 12px; background: #121212; border: 1px solid #3f3f46; border-radius: 6px; color: white;" />\n  </div>\n  <div>\n    <label style="display: block; margin-bottom: 4px; font-size: 0.85rem; font-weight: 600;">Message</label>\n    <textarea rows="3" placeholder="Your message here..." style="width: 100%; padding: 8px 12px; background: #121212; border: 1px solid #3f3f46; border-radius: 6px; color: white;"></textarea>\n  </div>\n  <button type="submit" style="padding: 10px; background: #007acc; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Submit Form</button>\n</form>`;
        break;
      case 'input':
        html = `<div style="margin: 0.75rem 0;">\n  <label style="display: block; margin-bottom: 4px; font-size: 0.85rem; font-weight: 600;">Input Label</label>\n  <input type="text" placeholder="Type text..." style="width: 100%; padding: 8px 12px; background: #121212; border: 1px solid #3f3f46; border-radius: 6px; color: white;" />\n</div>`;
        break;
      case 'textarea':
        html = `<div style="margin: 0.75rem 0;">\n  <label style="display: block; margin-bottom: 4px; font-size: 0.85rem; font-weight: 600;">Textarea Label</label>\n  <textarea rows="3" placeholder="Enter long text..." style="width: 100%; padding: 8px 12px; background: #121212; border: 1px solid #3f3f46; border-radius: 6px; color: white;"></textarea>\n</div>`;
        break;
      case 'select':
        html = `<div style="margin: 0.75rem 0;">\n  <label style="display: block; margin-bottom: 4px; font-size: 0.85rem; font-weight: 600;">Choose an Option</label>\n  <select style="width: 100%; padding: 8px 12px; background: #121212; border: 1px solid #3f3f46; border-radius: 6px; color: white;">\n    <option value="1">Option 1</option>\n    <option value="2">Option 2</option>\n    <option value="3">Option 3</option>\n  </select>\n</div>`;
        break;
      case 'button':
        html = `<button style="padding: 8px 18px; background: #007acc; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; margin: 0.5rem 0;">Button</button>`;
        break;
      default:
        break;
    }

    if (html) {
      insertHtmlSnippetAtSelected(html, insertPosition);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] border border-[#3f3f46] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#252526] border-b border-[#333333]">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#007acc]" />
            <h2 className="font-bold text-white text-sm">Insert HTML Component (KompoZer Inserter)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#37373d] text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Position Selector */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#181818] border-b border-[#333333] text-xs">
          <span className="text-gray-400 font-medium">Insert Location:</span>
          <div className="flex items-center gap-1 bg-[#252526] p-0.5 rounded border border-[#3f3f46]">
            <button
              onClick={() => setInsertPosition('after')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                insertPosition === 'after' ? 'bg-[#007acc] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              After Selected
            </button>
            <button
              onClick={() => setInsertPosition('inside')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                insertPosition === 'inside' ? 'bg-[#007acc] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Inside (Child)
            </button>
            <button
              onClick={() => setInsertPosition('before')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                insertPosition === 'before' ? 'bg-[#007acc] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Before Selected
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center border-b border-[#333333] bg-[#222224] px-4">
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'table' ? 'border-[#007acc] text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'layout' ? 'border-[#007acc] text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Layout Blocks</span>
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'form' ? 'border-[#007acc] text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <FormInput className="w-3.5 h-3.5" />
            <span>Forms & Inputs</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'media' ? 'border-[#007acc] text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Image & Media</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* 1. TABLE GENERATOR */}
          {activeTab === 'table' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Rows:</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={tableRows}
                    onChange={(e) => setTableRows(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-[#121212] border border-[#3f3f46] rounded px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Columns:</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={tableCols}
                    onChange={(e) => setTableCols(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-[#121212] border border-[#3f3f46] rounded px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#333333]">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHeaderRow}
                    onChange={(e) => setHasHeaderRow(e.target.checked)}
                    className="accent-[#007acc]"
                  />
                  <span>Include Header Row (&lt;thead&gt;)</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tableBorder}
                    onChange={(e) => setTableBorder(e.target.checked)}
                    className="accent-[#007acc]"
                  />
                  <span>Table Cell Borders</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tableStriped}
                    onChange={(e) => setTableStriped(e.target.checked)}
                    className="accent-[#007acc]"
                  />
                  <span>Zebra Striped Rows</span>
                </label>
              </div>

              <button
                onClick={handleInsertTable}
                className="w-full py-2 bg-[#007acc] hover:bg-[#0069aa] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Table className="w-4 h-4" />
                <span>Insert {tableRows} × {tableCols} Table</span>
              </button>
            </div>
          )}

          {/* 2. LAYOUT BLOCKS */}
          {activeTab === 'layout' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleInsertLayout('2-col')}
                className="p-3 bg-[#252526] hover:bg-[#2e2e30] border border-[#3f3f46] rounded-xl text-left transition-colors flex flex-col gap-1"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Columns className="w-4 h-4 text-blue-400" />
                  <span>2-Column Row</span>
                </div>
                <p className="text-[11px] text-gray-400">Side-by-side flexible 2-column section</p>
              </button>

              <button
                onClick={() => handleInsertLayout('3-col')}
                className="p-3 bg-[#252526] hover:bg-[#2e2e30] border border-[#3f3f46] rounded-xl text-left transition-colors flex flex-col gap-1"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Columns className="w-4 h-4 text-emerald-400" />
                  <span>3-Column Grid</span>
                </div>
                <p className="text-[11px] text-gray-400">Responsive 3-column features container</p>
              </button>

              <button
                onClick={() => handleInsertLayout('hero')}
                className="p-3 bg-[#252526] hover:bg-[#2e2e30] border border-[#3f3f46] rounded-xl text-left transition-colors flex flex-col gap-1"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <LayoutTemplate className="w-4 h-4 text-purple-400" />
                  <span>Hero Section</span>
                </div>
                <p className="text-[11px] text-gray-400">Hero title, subtitle, and CTA button</p>
              </button>

              <button
                onClick={() => handleInsertLayout('card')}
                className="p-3 bg-[#252526] hover:bg-[#2e2e30] border border-[#3f3f46] rounded-xl text-left transition-colors flex flex-col gap-1"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-orange-400" />
                  <span>Feature Card</span>
                </div>
                <p className="text-[11px] text-gray-400">Interactive card with heading and link</p>
              </button>

              <button
                onClick={() => handleInsertLayout('hr')}
                className="p-3 bg-[#252526] hover:bg-[#2e2e30] border border-[#3f3f46] rounded-xl text-left transition-colors flex flex-col gap-1 col-span-2"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>Horizontal Divider (&lt;hr&gt;)</span>
                </div>
                <p className="text-[11px] text-gray-400">Clean separating horizontal line</p>
              </button>
            </div>
          )}

          {/* 3. FORMS & INPUTS */}
          {activeTab === 'form' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleInsertForm('form')}
                className="p-3 bg-[#252526] hover:bg-[#2e2e30] border border-[#3f3f46] rounded-xl text-left transition-colors flex flex-col gap-1 col-span-2"
              >
                <div className="font-bold text-white flex items-center gap-1.5">
                  <FormInput className="w-4 h-4 text-blue-400" />
                  <span>Complete Contact Form</span>
                </div>
                <p className="text-[11px] text-gray-400">Form with Name, Email, Textarea, and Submit Button</p>
              </button>

              <button
                onClick={() => handleInsertForm('input')}
                className="p-3 bg-[#252526] hover:bg-[#2e2e30] border border-[#3f3f46] rounded-xl text-left transition-colors"
              >
                <div className="font-bold text-white">Text Input Field</div>
                <p className="text-[11px] text-gray-400">Label with &lt;input type="text"&gt;</p>
              </button>

              <button
                onClick={() => handleInsertForm('textarea')}
                className="p-3 bg-[#252526] hover:bg-[#2e2e30] border border-[#3f3f46] rounded-xl text-left transition-colors"
              >
                <div className="font-bold text-white">Multiline Textarea</div>
                <p className="text-[11px] text-gray-400">&lt;textarea&gt; input block</p>
              </button>

              <button
                onClick={() => handleInsertForm('select')}
                className="p-3 bg-[#252526] hover:bg-[#2e2e30] border border-[#3f3f46] rounded-xl text-left transition-colors"
              >
                <div className="font-bold text-white">Select Dropdown</div>
                <p className="text-[11px] text-gray-400">&lt;select&gt; with options</p>
              </button>

              <button
                onClick={() => handleInsertForm('button')}
                className="p-3 bg-[#252526] hover:bg-[#2e2e30] border border-[#3f3f46] rounded-xl text-left transition-colors"
              >
                <div className="font-bold text-white">Styled Button</div>
                <p className="text-[11px] text-gray-400">&lt;button&gt; action element</p>
              </button>
            </div>
          )}

          {/* 4. IMAGE & MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Image URL or Local Asset:</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or images/logo.png"
                  className="w-full bg-[#121212] border border-[#3f3f46] rounded px-3 py-1.5 text-white font-mono"
                />
              </div>

              {vfsImageFiles.length > 0 && (
                <div className="space-y-1">
                  <span className="text-gray-400 text-[11px]">Or select from project assets:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {vfsImageFiles.map((imgPath) => (
                      <button
                        key={imgPath}
                        onClick={() => setImageUrl(imgPath)}
                        className="px-2 py-1 bg-[#252526] hover:bg-[#333333] rounded border border-[#3f3f46] text-blue-300 text-[11px] font-mono"
                      >
                        {imgPath}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Alt Text:</label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full bg-[#121212] border border-[#3f3f46] rounded px-3 py-1.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Width:</label>
                  <input
                    type="text"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                    className="w-full bg-[#121212] border border-[#3f3f46] rounded px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleInsertMedia}
                className="w-full py-2 bg-[#007acc] hover:bg-[#0069aa] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <Image className="w-4 h-4" />
                <span>Insert Image</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
