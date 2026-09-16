import React from 'react';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-[#cccccc]">
      <header className="h-10 bg-[#252526] border-b border-[#333333] flex items-center px-4">
        <h1 className="text-sm font-semibold text-white">HTML Project Studio</h1>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading workspace...</p>
      </main>
    </div>
  );
}
