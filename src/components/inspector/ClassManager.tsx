import React, { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';

interface ClassManagerProps {
  classList: string[];
  onAddClass: (className: string) => void;
  onRemoveClass: (className: string) => void;
}

export const ClassManager: React.FC<ClassManagerProps> = ({
  classList,
  onAddClass,
  onRemoveClass,
}) => {
  const [newClass, setNewClass] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newClass.trim().replace(/^\./, '');
    if (trimmed) {
      onAddClass(trimmed);
      setNewClass('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-2 pt-2 border-t border-[#333333]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
          <Tag className="w-3 h-3 text-blue-400" />
          <span>Classes ({classList.length})</span>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-[10px] text-[#007acc] hover:underline font-medium"
          >
            <Plus className="w-3 h-3" />
            <span>Add Class</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="flex items-center gap-1">
          <input
            type="text"
            autoFocus
            placeholder="class-name (e.g. shadow-lg)"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            className="flex-1 bg-[#1e1e1e] border border-[#007acc] text-white px-2 py-0.5 rounded text-[11px] font-mono outline-none"
          />
          <button
            type="submit"
            className="px-2 py-0.5 bg-[#007acc] text-white rounded text-[10px] font-medium"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-1 hover:bg-[#333333] rounded text-gray-400"
          >
            <X className="w-3 h-3" />
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
        {classList.length === 0 ? (
          <span className="text-[11px] text-gray-500 italic">No CSS classes</span>
        ) : (
          classList.map((cls) => (
            <span
              key={cls}
              className="inline-flex items-center gap-1 bg-[#1e1e1e] text-blue-300 font-mono px-2 py-0.5 rounded text-[11px] border border-[#3f3f46] hover:border-blue-500 transition-colors"
            >
              <span>.{cls}</span>
              <button
                onClick={() => onRemoveClass(cls)}
                title={`Remove .${cls}`}
                className="hover:text-red-400 hover:bg-[#2d2d2d] rounded p-0.5 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
};
