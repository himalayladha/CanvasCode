import React from 'react';
import { X, LayoutTemplate, ArrowRight } from 'lucide-react';
import { STARTER_TEMPLATES, ProjectTemplate } from '../../data/starterTemplates';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ProjectTemplate) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#252526] border border-[#3f3f46] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#333333]">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-[#007acc]" />
            <h3 className="text-base font-bold text-white">Starter Templates</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#333333] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Cards Grid */}
        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-xs text-gray-400">
            Choose a starter project to load into the workspace. Note: this will replace your current workspace files.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STARTER_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="group bg-[#1e1e1e] border border-[#333333] hover:border-[#007acc] rounded-lg p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                onClick={() => {
                  onSelectTemplate(tpl);
                  onClose();
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/20">
                      {tpl.category}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                      {tpl.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors mb-1.5">
                    {tpl.name}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {tpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2d2d2d] flex items-center justify-between text-xs text-[#007acc] font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Load Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
