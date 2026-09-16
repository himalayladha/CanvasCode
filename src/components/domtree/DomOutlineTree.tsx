import React, { useMemo, useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Search,
  Layers,
  Trash2,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { InspectedElementData } from '../../types/vfs';

interface TreeNodeData {
  id: string;
  tagName: string;
  elementId: string;
  classList: string[];
  textContent: string;
  selector: string;
  dataWebstudioId?: string;
  children: TreeNodeData[];
  depth: number;
}

const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template']);

function buildDomTree(el: Element, depth = 0, indexInParent = 0): TreeNodeData | null {
  const tagName = el.tagName.toLowerCase();
  if (SKIP_TAGS.has(tagName)) return null;

  const elementId = el.getAttribute('id') || '';
  const classList = Array.from(el.classList);
  const dataWebstudioId = el.getAttribute('data-webstudio-id') || undefined;

  // Direct text content preview (exclude child node texts)
  let directText = '';
  for (let i = 0; i < el.childNodes.length; i++) {
    const node = el.childNodes[i];
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        directText = text.length > 24 ? text.substring(0, 24) + '…' : text;
        break;
      }
    }
  }

  // Compute CSS selector
  let selector = tagName;
  if (elementId) {
    selector += `#${elementId}`;
  } else if (classList.length > 0) {
    selector += `.${classList.slice(0, 2).join('.')}`;
  }

  const childNodes: TreeNodeData[] = [];
  let childIdx = 0;
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i];
    const childTree = buildDomTree(child, depth + 1, childIdx++);
    if (childTree) {
      childNodes.push(childTree);
    }
  }

  const uniqueTreeId = dataWebstudioId || `${tagName}-${depth}-${indexInParent}-${elementId}`;

  return {
    id: uniqueTreeId,
    tagName,
    elementId,
    classList,
    textContent: directText,
    selector,
    dataWebstudioId,
    children: childNodes,
    depth,
  };
}

export const DomOutlineTree: React.FC = () => {
  const {
    files,
    previewCurrentPath,
    selectedElement,
    setSelectedElement,
    deleteSelectedElement,
  } = useProjectStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const htmlContent = files[previewCurrentPath]?.content || '';

  const rootNodes = useMemo(() => {
    if (!htmlContent) return [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const body = doc.body;
      if (!body) return [];

      const bodyTree = buildDomTree(body, 0, 0);
      return bodyTree ? [bodyTree] : [];
    } catch {
      return [];
    }
  }, [htmlContent]);

  const toggleCollapse = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleSelectNode = (node: TreeNodeData) => {
    // Construct synthetic InspectedElementData to activate inspector
    const inspected: InspectedElementData = {
      dataWebstudioId: node.dataWebstudioId,
      tagName: node.tagName,
      id: node.elementId,
      classList: node.classList,
      selector: node.selector,
      innerText: node.textContent,
      attributes: {
        ...(node.elementId ? { id: node.elementId } : {}),
        ...(node.classList.length ? { class: node.classList.join(' ') } : {}),
      },
      computedStyles: {
        color: 'rgb(248, 250, 252)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        fontSize: '14px',
        fontWeight: '400',
        textAlign: 'start',
        margin: '0px',
        padding: '0px',
        border: '0px',
        borderRadius: '0px',
        width: 'auto',
        height: 'auto',
        display: ['div', 'section', 'p', 'main', 'header', 'footer', 'h1', 'h2', 'h3'].includes(node.tagName)
          ? 'block'
          : 'inline',
      },
      boxModel: {
        marginTop: '0px',
        marginRight: '0px',
        marginBottom: '0px',
        marginLeft: '0px',
        paddingTop: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingLeft: '0px',
      },
      rect: {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      },
    };

    setSelectedElement(inspected);
  };

  const isNodeSelected = (node: TreeNodeData) => {
    if (!selectedElement) return false;
    if (node.dataWebstudioId && selectedElement.dataWebstudioId) {
      return node.dataWebstudioId === selectedElement.dataWebstudioId;
    }
    if (selectedElement.tagName.toLowerCase() !== node.tagName.toLowerCase()) return false;
    if (selectedElement.id && node.elementId && selectedElement.id === node.elementId) return true;
    return selectedElement.selector === node.selector;
  };

  const matchesSearch = (node: TreeNodeData, query: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (node.tagName.toLowerCase().includes(q)) return true;
    if (node.elementId.toLowerCase().includes(q)) return true;
    if (node.classList.some((c) => c.toLowerCase().includes(q))) return true;
    if (node.textContent.toLowerCase().includes(q)) return true;
    return node.children.some((child) => matchesSearch(child, query));
  };

  const renderNode = (node: TreeNodeData) => {
    if (searchQuery && !matchesSearch(node, searchQuery)) {
      return null;
    }

    const hasChildren = node.children.length > 0;
    const isCollapsed = Boolean(collapsedNodes[node.id]);
    const selected = isNodeSelected(node);

    // Tag color accents
    const isContainer = ['div', 'section', 'article', 'main', 'header', 'footer', 'nav', 'aside'].includes(node.tagName);
    const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName);
    const isInteractive = ['button', 'a', 'input', 'form', 'select'].includes(node.tagName);
    const isTable = ['table', 'tr', 'td', 'th', 'tbody', 'thead'].includes(node.tagName);

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => handleSelectNode(node)}
          style={{ paddingLeft: `${node.depth * 14 + 6}px` }}
          className={`flex items-center gap-1 py-1 pr-2 rounded text-xs cursor-pointer group transition-colors ${
            selected
              ? 'bg-[#094771] text-white font-medium'
              : 'text-gray-300 hover:bg-[#2a2d2e] hover:text-white'
          }`}
        >
          {/* Expand/Collapse Toggle */}
          {hasChildren ? (
            <button
              onClick={(e) => toggleCollapse(node.id, e)}
              className="p-0.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
            >
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {/* Tag Name Badge */}
          <span
            className={`px-1 rounded text-[11px] font-mono font-semibold ${
              isContainer
                ? 'bg-blue-950/80 text-blue-300 border border-blue-800/40'
                : isHeading
                ? 'bg-purple-950/80 text-purple-300 border border-purple-800/40'
                : isInteractive
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                : isTable
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                : 'bg-zinc-800 text-gray-300 border border-zinc-700/50'
            }`}
          >
            {node.tagName}
          </span>

          {/* ID */}
          {node.elementId && (
            <span className="text-amber-400 font-mono text-[11px] truncate max-w-[80px]">
              #{node.elementId}
            </span>
          )}

          {/* Classes */}
          {node.classList.length > 0 && (
            <span className="text-teal-400 font-mono text-[11px] truncate max-w-[90px]">
              .{node.classList.slice(0, 2).join('.')}
            </span>
          )}

          {/* Text preview */}
          {node.textContent && (
            <span className="text-gray-400 text-[11px] truncate max-w-[100px] italic ml-auto pl-1">
              "{node.textContent}"
            </span>
          )}

          {/* Actions on hover */}
          {selected && (
            <button
              title="Delete element"
              onClick={(e) => {
                e.stopPropagation();
                deleteSelectedElement();
              }}
              className="p-0.5 hover:bg-red-500/20 text-red-400 rounded ml-auto"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Children */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col">
            {node.children.map((child) => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-200">
      {/* Header & Filter */}
      <div className="p-2 border-b border-[#333333] flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 px-1">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Layers className="w-3.5 h-3.5 text-[#007acc]" />
            DOM Outline
          </span>
          <span className="text-[10px] text-gray-400">{previewCurrentPath}</span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-gray-500" />
          <input
            type="text"
            placeholder="Filter tag, #id, .class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#252526] border border-[#3c3c3c] rounded pl-7 pr-2 py-1 text-xs text-white placeholder-gray-500 outline-none focus:border-[#007acc]"
          />
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-1.5 font-sans">
        {rootNodes.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500">
            No DOM elements found in {previewCurrentPath}
          </div>
        ) : (
          rootNodes.map((root) => renderNode(root))
        )}
      </div>
    </div>
  );
};
