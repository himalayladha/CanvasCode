import React from 'react';

interface ColorPickerInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function parseColorToHex(color: string): string {
  if (!color || color === 'transparent' || color.startsWith('rgba(0, 0, 0, 0)')) return '#000000';
  if (color.startsWith('#')) return color.substring(0, 7);

  // Parse rgb(r, g, b)
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#000000';
}

export const ColorPickerInput: React.FC<ColorPickerInputProps> = ({ label, value, onChange }) => {
  const hexVal = parseColorToHex(value);

  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-gray-400 select-none text-[11px]">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="relative w-5 h-5 rounded border border-[#3f3f46] overflow-hidden cursor-pointer shrink-0">
          <input
            type="color"
            value={hexVal}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-2 -left-2 w-9 h-9 cursor-pointer opacity-0"
          />
          <div
            className="w-full h-full rounded"
            style={{ backgroundColor: value || 'transparent' }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#ffffff"
          className="bg-[#1e1e1e] border border-[#3f3f46] focus:border-[#007acc] rounded px-2 py-0.5 text-[11px] text-gray-200 font-mono w-24 outline-none"
        />
      </div>
    </div>
  );
};
