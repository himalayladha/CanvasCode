import React, { useState } from 'react';
import {
  ChevronRight,
  Layers,
  Box,
  Trash2,
  Copy,
  ChevronDown,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { DomBreadcrumbNode } from '../../types/vfs';

interface DomBreadcrumbBarProps {
  onSelectNode: (node: DomBreadcrumbNode) => void;
}

export const DomBreadcrumbBar: React.FC<DomBreadcrumbBarProps> = ({ onSelectNode }) => {
  const { selectedElement, wrapSelectedElement, deleteSelectedElement, duplicateSelectedElement } = useProjectStore();
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

  if (!selectedElement) {
    return (
      <div className="flex items-center px-3 py-1 bg-[#1e1e1e] border-t border-[#333333] text-[11px] text-gray-500 font-mono select-none">
        <span className="flex items-center gap-1">
          <Layers className="w-3 h-3 text-gray-600" />
          <span>No element selected</span>
        </span>
      </div>
    );
  }

  const ancestorPath = selectedElement.ancestorPath || [
    {
      tagName: selectedElement.tagName,
      id: selectedElement.id,
      classList: selectedElement.classList,
      selector: selectedElement.selector,
      dataWebstudioId: selectedElement.dataWebstudioId,
    },
  ];

  return (
    <div className="flex items-center px-3 py-1 bg-[#1e1e1e] border-t border-[#333333] text-[11px] text-gray-300 font-mono select-none overflow-x-auto relative">
      <span className="text-gray-500 mr-1.5 flex items-center gap-1 font-sans text-[10px] uppercase font-bold shrink-0">
        <Layers className="w-3 h-3 text-[#007acc]" />
        <span>DOM:</span>
      </span>

      <div className="flex items-center gap-1 shrink-0">
        {ancestorPath.map((node, index) => {
          const isLast = index === ancestorPath.length - 1;
          const classStr = node.classList.length > 0 ? `.${node.classList[0]}` : '';
          const idStr = node.id ? `#${node.id}` : '';

          return (
            <React.Fragment key={`${node.tagName}-${node.selector}-${index}`}>
              {index > 0 && <ChevronRight className="w-3 h-3 text-gray-600 shrink-0" />}

              <div className="relative flex items-center">
                <button
                  onClick={() => onSelectNode(node)}
                  className={`px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-colors font-semibold ${
                    isLast
                      ? 'bg-[#007acc] text-white shadow-sm'
                      : 'bg-[#2a2a2b] hover:bg-[#37373d] text-gray-300 hover:text-white'
                  }`}
                  title={`Click to select <${node.tagName}> in Inspector`}
                >
                  <span className="uppercase">{node.tagName}</span>
                  {(idStr || classStr) && (
                    <span className="text-[10px] opacity-75 font-normal">
                      {idStr || classStr}
                    </span>
                  )}
                </button>

                {isLast && (
                  <button
                    onClick={() => setActiveMenuIndex(activeMenuIndex === index ? null : index)}
                    className="p-0.5 hover:bg-[#0069aa] text-white rounded-r"
                    title="Tag Actions"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                )}

                {/* Tag Quick Actions Dropdown */}
                {activeMenuIndex === index && (
                  <div className="absolute bottom-6 left-0 z-50 bg-[#252526] border border-[#3f3f46] rounded-lg p-1.5 shadow-2xl flex flex-col gap-1 min-w-[150px] font-sans text-xs">
                    <button
                      onClick={() => {
                        wrapSelectedElement('div');
                        setActiveMenuIndex(null);
                      }}
                      className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#37373d] rounded text-gray-200 text-left"
                    >
                      <Box className="w-3.5 h-3.5 text-blue-400" />
                      <span>Wrap in &lt;div&gt;</span>
                    </button>
                    <button
                      onClick={() => {
                        wrapSelectedElement('section');
                        setActiveMenuIndex(null);
                      }}
                      className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#37373d] rounded text-gray-200 text-left"
                    >
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span>Wrap in &lt;section&gt;</span>
                    </button>
                    <button
                      onClick={() => {
                        duplicateSelectedElement();
                        setActiveMenuIndex(null);
                      }}
                      className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#37373d] rounded text-gray-200 text-left"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Duplicate Node</span>
                    </button>
                    <button
                      onClick={() => {
                        deleteSelectedElement();
                        setActiveMenuIndex(null);
                      }}
                      className="flex items-center gap-1.5 px-2 py-1 hover:bg-red-950/60 text-red-300 rounded text-left border-t border-[#3f3f46] mt-1 pt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      <span>Delete Node</span>
                    </button>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
