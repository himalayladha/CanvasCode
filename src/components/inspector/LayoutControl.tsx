import React from 'react';
import {
  LayoutGrid,
  ArrowRight,
  ArrowDown,
  Eye,
} from 'lucide-react';

interface LayoutControlProps {
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  opacity?: string;
  onUpdateStyle: (property: string, value: string) => void;
}

export const LayoutControl: React.FC<LayoutControlProps> = ({
  display = 'block',
  flexDirection = 'row',
  alignItems = 'stretch',
  justifyContent = 'flex-start',
  gap = '0px',
  opacity = '1',
  onUpdateStyle,
}) => {
  const currentDisplay = display.toLowerCase();
  const isFlex = currentDisplay.includes('flex');
  const isGrid = currentDisplay.includes('grid');

  const gapNum = parseInt(gap || '0', 10) || 0;
  const opacityVal = Math.round((parseFloat(opacity || '1') || 1) * 100);

  return (
    <div className="space-y-3 pt-2 border-t border-[#333333]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
          <LayoutGrid className="w-3 h-3 text-cyan-400" />
          <span>Layout & Display</span>
        </div>
      </div>

      {/* Display Selector */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-gray-400 text-[11px]">Display</span>
        <div className="flex items-center bg-[#1e1e1e] rounded p-0.5 border border-[#333333] text-[11px]">
          {(['block', 'flex', 'grid', 'inline-block'] as const).map((disp) => (
            <button
              key={disp}
              onClick={() => onUpdateStyle('display', disp)}
              className={`px-2 py-0.5 rounded transition-colors capitalize ${
                currentDisplay === disp
                  ? 'bg-[#007acc] text-white font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {disp === 'inline-block' ? 'inline' : disp}
            </button>
          ))}
        </div>
      </div>

      {/* Flex & Grid Layout Options */}
      {(isFlex || isGrid) && (
        <div className="space-y-2.5 bg-[#202022] p-2.5 rounded border border-[#333333]/80 animate-in fade-in duration-150">
          {/* Flex Direction */}
          {isFlex && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-400 text-[11px]">Direction</span>
              <div className="flex items-center bg-[#1e1e1e] rounded p-0.5 border border-[#333333]">
                <button
                  title="Row (Horizontal)"
                  onClick={() => onUpdateStyle('flexDirection', 'row')}
                  className={`p-1 rounded flex items-center gap-1 text-[11px] ${
                    flexDirection.startsWith('row')
                      ? 'bg-[#37373d] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>Row</span>
                </button>
                <button
                  title="Column (Vertical)"
                  onClick={() => onUpdateStyle('flexDirection', 'column')}
                  className={`p-1 rounded flex items-center gap-1 text-[11px] ${
                    flexDirection.startsWith('column')
                      ? 'bg-[#37373d] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ArrowDown className="w-3 h-3" />
                  <span>Col</span>
                </button>
              </div>
            </div>
          )}

          {/* Align Items */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[11px]">Align Items</span>
            <select
              value={alignItems}
              onChange={(e) => onUpdateStyle('alignItems', e.target.value)}
              className="bg-[#1e1e1e] border border-[#333333] rounded px-2 py-0.5 text-[11px] text-white font-mono outline-none"
            >
              <option value="stretch">stretch</option>
              <option value="flex-start">flex-start (start)</option>
              <option value="center">center</option>
              <option value="flex-end">flex-end (end)</option>
              <option value="baseline">baseline</option>
            </select>
          </div>

          {/* Justify Content */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[11px]">Justify Content</span>
            <select
              value={justifyContent}
              onChange={(e) => onUpdateStyle('justifyContent', e.target.value)}
              className="bg-[#1e1e1e] border border-[#333333] rounded px-2 py-0.5 text-[11px] text-white font-mono outline-none"
            >
              <option value="flex-start">flex-start (start)</option>
              <option value="center">center</option>
              <option value="flex-end">flex-end (end)</option>
              <option value="space-between">space-between</option>
              <option value="space-around">space-around</option>
              <option value="space-evenly">space-evenly</option>
            </select>
          </div>

          {/* Gap */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 text-[11px]">Item Gap</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                aria-label="Gap slider"
                min="0"
                max="64"
                value={gapNum}
                onChange={(e) => onUpdateStyle('gap', `${e.target.value}px`)}
                className="w-20 accent-[#007acc] cursor-pointer"
              />
              <span className="w-12 text-right font-mono text-[11px] text-gray-200">
                {gapNum}px
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Opacity Control */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-gray-400 text-[11px]">
          <Eye className="w-3 h-3 text-gray-400" />
          <span>Opacity</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            aria-label="Opacity slider"
            min="0"
            max="100"
            value={opacityVal}
            onChange={(e) => onUpdateStyle('opacity', (Number(e.target.value) / 100).toString())}
            className="w-20 accent-[#007acc] cursor-pointer"
          />
          <span className="w-12 text-right font-mono text-[11px] text-gray-200">
            {opacityVal}%
          </span>
        </div>
      </div>
    </div>
  );
};
