import React, { useState, useEffect } from 'react';
import { RefreshCw, LayoutTemplate } from 'lucide-react';

export function LivePreviewView() {
  const [count, setCount] = useState(0);
  const [reloading, setReloader] = useState(false);

  useEffect(() => {
    const handleSave = () => {
      setReloader(true);
      setTimeout(() => setReloader(false), 500);
    };
    
    // Simulate hot reload
    const intervalId = setInterval(() => {
       if (Math.random() > 0.8) {
         handleSave();
       }
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-full w-full bg-[#f3f4f6] flex flex-col text-black">
      <div className="bg-white border-b border-stone-200 p-2 text-xs font-mono text-stone-500 shrink-0 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex gap-1.5 px-2">
             <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
          </div>
          <div className="bg-stone-100 border border-stone-200 px-3 py-1 rounded-md flex-1 max-w-sm flex items-center justify-between ml-2">
            <span className="text-stone-600 truncate">http://localhost:3000/preview</span>
            <RefreshCw className={`w-3 h-3 text-stone-400 ${reloading ? 'animate-spin text-blue-500' : ''}`} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            HMR Active
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {reloading && (
          <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
             <div className="font-mono text-sm font-bold text-blue-600">VITE v6.4.2 building...</div>
          </div>
        )}
        
        <div className="bg-white border border-stone-200 shadow-xl rounded-xl p-8 max-w-md w-full mx-4 flex flex-col items-center text-center space-y-4">
           <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
             <LayoutTemplate className="w-6 h-6 text-blue-600" />
           </div>
           <div>
             <h3 className="text-lg font-bold text-stone-800">Agentic UI Synthesizer</h3>
             <p className="text-sm text-stone-500 mt-1">Component compiled and rendered via React Flow matrix.</p>
           </div>
           
           <div className="pt-4 border-t border-stone-100 w-full mt-2">
              <button 
                onClick={() => setCount(c => c + 1)}
                className="w-full px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Trigger State Change <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs text-zinc-300 font-mono">{count}</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
