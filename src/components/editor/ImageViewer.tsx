import React from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import { VirtualFile } from '../../types/vfs';

interface ImageViewerProps {
  file: VirtualFile;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ file }) => {
  const imageUrl = file.blobUrl || (file.binaryBlob ? URL.createObjectURL(file.binaryBlob) : '');

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = file.name;
    a.click();
  };

  return (
    <div className="flex-1 h-full bg-[#1e1e1e] flex flex-col items-center justify-center p-6 select-none overflow-auto">
      <div className="bg-[#252526] border border-[#333333] rounded-lg p-6 max-w-lg flex flex-col items-center shadow-xl">
        <div className="w-full max-h-[400px] flex items-center justify-center bg-[#181818] rounded-md p-4 mb-4 border border-[#2d2d2d] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={file.name}
              className="max-h-[360px] max-w-full object-contain rounded"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-500 py-12">
              <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
              <span>Image preview unavailable</span>
            </div>
          )}
        </div>
        
        <div className="w-full flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#333333]">
          <div>
            <span className="font-medium text-gray-200">{file.name}</span>
            <span className="ml-2 text-gray-500">{file.path}</span>
          </div>
          {imageUrl && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
