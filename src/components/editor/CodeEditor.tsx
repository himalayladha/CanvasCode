import React, { useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { getLanguageFromPath } from '../../utils/pathUtils';
import { VirtualFile } from '../../types/vfs';

interface CodeEditorProps {
  file: VirtualFile;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ file, onChange }) => {
  const editorRef = useRef<any>(null);
  const language = getLanguageFromPath(file.path);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Configure Monaco HTML / CSS / JS formatting & emmet options
    if (monaco.languages.html?.htmlDefaults) {
      monaco.languages.html.htmlDefaults.setOptions({
        format: {
          wrapLineLength: 120,
          unformatted: 'b, em, i, span',
          tabSize: 2,
          insertSpaces: true,
          contentUnformatted: 'pre, code',
          indentInnerHtml: false,
          preserveNewLines: true,
          maxPreserveNewLines: 2,
          indentHandlebars: false,
          endWithNewline: false,
          extraLiners: 'head, body, /html',
          wrapAttributes: 'auto',
        },
        suggest: {
          html5: true,
        },
      });
    }

    // Add format command shortcut Shift+Alt+F
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run();
    });
  };

  return (
    <div className="flex-1 h-full w-full relative bg-[#1e1e1e]">
      <Editor
        height="100%"
        path={file.path}
        language={language}
        value={file.content || ''}
        theme="vs-dark"
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontLigatures: true,
          minimap: { enabled: true, maxColumn: 80 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          bracketPairColorization: { enabled: true },
          padding: { top: 12, bottom: 12 },
        }}
        loading={
          <div className="flex items-center justify-center h-full text-xs text-gray-400">
            <span>Loading Monaco Editor...</span>
          </div>
        }
      />
    </div>
  );
};
