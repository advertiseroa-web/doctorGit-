import React, { useState } from 'react';
import { XtermCanvas } from './XtermCanvas';
import { AdalatMatrixView } from './AdalatMatrixView';
import { VectorStoreView } from './VectorStoreView';
import { Terminal, Cpu, Database, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function TabMultiplexer({ onClose }: { onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState('kernel');

  const tabs = [
    { id: 'kernel', label: 'Kernel Log', icon: Terminal },
    { id: 'adalat', label: 'Adalat Matrix', icon: Cpu },
    { id: 'vector', label: 'Vector Store', icon: Database },
  ];

  return (
    <div className="h-full flex flex-col bg-[#151515] border-t border-[#333]">
      <div className="flex bg-[#1e1e1e] border-b border-[#333] items-center justify-between">
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-xs flex items-center gap-2 font-mono border-r border-[#333] transition-colors",
                activeTab === tab.id 
                  ? "bg-[#151515] text-blue-400 border-b-transparent" 
                  : "bg-[#252526] text-stone-400 hover:text-stone-200"
              )}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>
        {onClose && (
          <div className="flex items-center px-2">
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[#333] text-stone-400 hover:text-stone-200 transition-colors"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 relative">
        {activeTab === 'kernel' && <XtermCanvas key="kernel" />}
        {activeTab === 'adalat' && <AdalatMatrixView key="adalat" />}
        {activeTab === 'vector' && <VectorStoreView key="vector" />}
      </div>
    </div>
  );
}
