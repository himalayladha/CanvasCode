import React from 'react';
import { Settings2 } from 'lucide-react';

interface AttributeEditorProps {
  tagName: string;
  attributes: Record<string, string>;
  onUpdateAttribute: (name: string, value: string) => void;
}

export const AttributeEditor: React.FC<AttributeEditorProps> = ({
  tagName,
  attributes,
  onUpdateAttribute,
}) => {
  const getRelevantAttributes = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'a':
        return ['href', 'target', 'id', 'title'];
      case 'img':
        return ['src', 'alt', 'id', 'title'];
      case 'button':
        return ['id', 'type', 'disabled', 'title'];
      case 'input':
        return ['type', 'placeholder', 'value', 'id', 'name', 'disabled'];
      case 'form':
        return ['action', 'method', 'id'];
      default:
        return ['id', 'title'];
    }
  };

  const relevant = getRelevantAttributes(tagName);

  return (
    <div className="space-y-2.5 pt-2 border-t border-[#333333]">
      <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
        <Settings2 className="w-3 h-3 text-emerald-400" />
        <span>Attributes</span>
      </div>

      <div className="space-y-2">
        {relevant.map((attrName) => {
          const val = attributes[attrName] || '';
          return (
            <div key={attrName} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-gray-400 font-mono text-[11px] select-none w-20 truncate">
                {attrName}
              </span>
              <input
                type="text"
                value={val}
                placeholder={`Set ${attrName}...`}
                onChange={(e) => onUpdateAttribute(attrName, e.target.value)}
                className="flex-1 bg-[#1e1e1e] border border-[#3f3f46] focus:border-[#007acc] rounded px-2 py-0.5 text-[11px] text-white font-mono outline-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
