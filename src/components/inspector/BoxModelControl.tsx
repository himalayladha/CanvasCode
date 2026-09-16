import React from 'react';
import { InspectedElementData } from '../../types/vfs';

interface BoxModelControlProps {
  boxModel: InspectedElementData['boxModel'];
  onUpdateStyle: (property: string, value: string) => void;
}

export const BoxModelControl: React.FC<BoxModelControlProps> = ({ boxModel, onUpdateStyle }) => {
  const cleanVal = (val: string) => (val || '0px').replace('px', '');

  return (
    <div className="flex flex-col items-center select-none text-[10px] font-mono my-2">
      {/* Margin Outer Box */}
      <div className="bg-amber-950/30 border border-amber-500/40 rounded p-2 text-center w-full relative">
        <span className="absolute top-0.5 left-1 text-[9px] uppercase tracking-wider text-amber-400 font-bold">
          margin
        </span>
        
        {/* Margin Top */}
        <input
          type="text"
          value={cleanVal(boxModel.marginTop)}
          onChange={(e) => onUpdateStyle('marginTop', `${e.target.value || 0}px`)}
          className="w-8 text-center bg-transparent border-b border-dashed border-amber-500/50 text-amber-200 outline-none mb-1 font-semibold"
        />

        <div className="flex items-center justify-between gap-1">
          {/* Margin Left */}
          <input
            type="text"
            value={cleanVal(boxModel.marginLeft)}
            onChange={(e) => onUpdateStyle('marginLeft', `${e.target.value || 0}px`)}
            className="w-7 text-center bg-transparent border-b border-dashed border-amber-500/50 text-amber-200 outline-none font-semibold"
          />

          {/* Padding Box */}
          <div className="flex-1 bg-emerald-950/30 border border-emerald-500/40 rounded p-2 text-center relative mx-1">
            <span className="absolute top-0.5 left-1 text-[9px] uppercase tracking-wider text-emerald-400 font-bold">
              padding
            </span>

            {/* Padding Top */}
            <input
              type="text"
              value={cleanVal(boxModel.paddingTop)}
              onChange={(e) => onUpdateStyle('paddingTop', `${e.target.value || 0}px`)}
              className="w-8 text-center bg-transparent border-b border-dashed border-emerald-500/50 text-emerald-200 outline-none mb-1 font-semibold"
            />

            <div className="flex items-center justify-between gap-1">
              {/* Padding Left */}
              <input
                type="text"
                value={cleanVal(boxModel.paddingLeft)}
                onChange={(e) => onUpdateStyle('paddingLeft', `${e.target.value || 0}px`)}
                className="w-7 text-center bg-transparent border-b border-dashed border-emerald-500/50 text-emerald-200 outline-none font-semibold"
              />

              <div className="bg-[#1e1e1e] border border-[#3f3f46] rounded px-2 py-1 text-gray-300 font-bold text-[10px]">
                ELEMENT
              </div>

              {/* Padding Right */}
              <input
                type="text"
                value={cleanVal(boxModel.paddingRight)}
                onChange={(e) => onUpdateStyle('paddingRight', `${e.target.value || 0}px`)}
                className="w-7 text-center bg-transparent border-b border-dashed border-emerald-500/50 text-emerald-200 outline-none font-semibold"
              />
            </div>

            {/* Padding Bottom */}
            <input
              type="text"
              value={cleanVal(boxModel.paddingBottom)}
              onChange={(e) => onUpdateStyle('paddingBottom', `${e.target.value || 0}px`)}
              className="w-8 text-center bg-transparent border-b border-dashed border-emerald-500/50 text-emerald-200 outline-none mt-1 font-semibold"
            />
          </div>

          {/* Margin Right */}
          <input
            type="text"
            value={cleanVal(boxModel.marginRight)}
            onChange={(e) => onUpdateStyle('marginRight', `${e.target.value || 0}px`)}
            className="w-7 text-center bg-transparent border-b border-dashed border-amber-500/50 text-amber-200 outline-none font-semibold"
          />
        </div>

        {/* Margin Bottom */}
        <input
          type="text"
          value={cleanVal(boxModel.marginBottom)}
          onChange={(e) => onUpdateStyle('marginBottom', `${e.target.value || 0}px`)}
          className="w-8 text-center bg-transparent border-b border-dashed border-amber-500/50 text-amber-200 outline-none mt-1 font-semibold"
        />
      </div>
    </div>
  );
};
