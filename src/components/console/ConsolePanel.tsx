import React, { useState } from 'react';
import { Terminal, AlertTriangle, AlertCircle, Info, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { ConsoleLogMessage } from '../../types/vfs';

interface ConsolePanelProps {
  logs: ConsoleLogMessage[];
  isOpen: boolean;
  onClearLogs: () => void;
  onClose: () => void;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  logs,
  isOpen,
  onClearLogs,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'log' | 'info' | 'warn' | 'error'>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const errorCount = logs.filter((l) => l.level === 'error').length;
  const warnCount = logs.filter((l) => l.level === 'warn').length;

  const filteredLogs = logs.filter((log) => {
    if (filter !== 'all' && log.level !== filter) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-48 w-full bg-[#181818] border-t border-[#333333] flex flex-col select-none text-xs font-mono">
      {/* Console Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-gray-200">
            <Terminal className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Console</span>
          </div>

          <div className="flex items-center gap-1 bg-[#1e1e1e] rounded p-0.5 border border-[#333333]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                filter === 'all' ? 'bg-[#37373d] text-white font-medium' : 'text-gray-400 hover:text-white'
              }`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
                filter === 'error' ? 'bg-red-900/60 text-red-300 font-medium' : 'text-red-400 hover:text-red-300'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span>{errorCount}</span>
            </button>
            <button
              onClick={() => setFilter('warn')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
                filter === 'warn' ? 'bg-yellow-900/60 text-yellow-300 font-medium' : 'text-yellow-400 hover:text-yellow-300'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{warnCount}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1e1e1e] border border-[#333333] rounded px-2 py-0.5 text-[11px] text-gray-200 focus:outline-none focus:border-[#007acc] w-32"
          />
          <button
            title="Clear Console"
            onClick={onClearLogs}
            className="p-1 hover:bg-[#37373d] rounded text-gray-400 hover:text-white transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            title="Close Panel"
            onClick={onClose}
            className="p-1 hover:bg-[#37373d] rounded text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Output Stream */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500 py-4 text-center">No console output</div>
        ) : (
          filteredLogs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString();
            let icon = <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />;
            let bgClass = 'hover:bg-[#1e1e1e] text-gray-300';

            if (log.level === 'warn') {
              icon = <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />;
              bgClass = 'bg-yellow-950/20 text-yellow-200 hover:bg-yellow-950/30';
            } else if (log.level === 'error') {
              icon = <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />;
              bgClass = 'bg-red-950/20 text-red-200 hover:bg-red-950/30';
            }

            return (
              <div
                key={log.id}
                className={`flex items-start gap-2 px-2 py-1 rounded transition-colors ${bgClass}`}
              >
                {icon}
                <span className="text-[10px] text-gray-500 shrink-0 select-none pt-0.5">{timeStr}</span>
                <div className="flex-1 overflow-x-auto whitespace-pre-wrap break-all">
                  <span>{log.message}</span>
                  {log.stack && (
                    <pre className="text-[10px] text-red-400/80 mt-1 pl-2 border-l border-red-500/30 overflow-x-auto">
                      {log.stack}
                    </pre>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
