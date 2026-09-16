export interface VirtualFile {
  id: string;
  path: string; // e.g. "index.html", "css/style.css", "images/logo.png"
  name: string;
  type: 'file' | 'directory';
  content: string;
  isBinary: boolean;
  binaryBlob?: Blob;
  blobUrl?: string;
  updatedAt: number;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile' | 'responsive';

export interface InspectedElementData {
  tagName: string;
  id: string;
  classList: string[];
  selector: string;
  innerText: string;
  attributes: Record<string, string>;
  computedStyles: {
    color: string;
    backgroundColor: string;
    fontSize: string;
    fontWeight: string;
    textAlign: string;
    margin: string;
    padding: string;
    border: string;
    borderRadius: string;
    width: string;
    height: string;
    display: string;
  };
  boxModel: {
    marginTop: string;
    marginRight: string;
    marginBottom: string;
    marginLeft: string;
    paddingTop: string;
    paddingRight: string;
    paddingBottom: string;
    paddingLeft: string;
  };
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface ConsoleLogMessage {
  id: string;
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
  stack?: string;
}

export interface ProjectState {
  projectName: string;
  files: Record<string, VirtualFile>;
  activeFilePath: string | null;
  openTabs: string[];
  entryHtmlPath: string;
  previewCurrentPath: string;
  isInspectMode: boolean;
  selectedElement: InspectedElementData | null;
  hoveredElementInfo: { selector: string; tagName: string; rect: { top: number; left: number; width: number; height: number } } | null;
  consoleLogs: ConsoleLogMessage[];
  viewportMode: ViewportMode;
  isBottomPanelOpen: boolean;
  bottomPanelTab: 'console' | 'problems';
  previewKey: number; // for forcing preview iframe reload
}
