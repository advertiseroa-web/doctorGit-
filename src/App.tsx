/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { SplitPaneSynchronizer } from './components/editor/SplitPaneSynchronizer';
import { CanvasGrid } from './components/canvas/CanvasGrid';
import { TabMultiplexer } from './components/terminal/TabMultiplexer';
import { FileExplorer } from './components/explorer/FileExplorer';
import { AISettingsModal } from './components/settings/AISettingsModal';
import { CopilotSidebar } from './components/copilot/CopilotSidebar';
import { LocalBrowser } from './components/browser/LocalBrowser';
import { EngineDashboard } from './components/dashboard/EngineDashboard';
import { Rocket, BrainCircuit, Bot, Folders, MonitorPlay, TerminalSquare, Globe, Download, Menu, Activity } from 'lucide-react';

export default function App() {
  const [activeFile, setActiveFile] = useState('src/engine/AgentEngine.ts');
  const [publishing, setPublishing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCopilot, setShowCopilot] = useState(true);
  const [showExplorer, setShowExplorer] = useState(true);
  const [showVisuals, setShowVisuals] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);

  useEffect(() => {
    const handleDownload = () => setShowTerminal(true);
    window.addEventListener('terax:download_model', handleDownload);
    return () => window.removeEventListener('terax:download_model', handleDownload);
  }, []);

  const handlePublish = () => {
    if (publishing) return;
    setPublishing(true);
    
    // Switch to root terminal logic simulated
    if (!showTerminal) setShowTerminal(true);
    window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\r\n\x1b[1;35m>> INIT PUBLISH SEQUENCE...\x1b[0m' }));
    setTimeout(() => window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[33m[1/3]\x1b[0m Bundling React assets with Vite...' })), 500);
    setTimeout(() => window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[33m[2/3]\x1b[0m Compiling native Tauri targets via Cargo...' })), 1500);
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[32m[3/3] SUCCESS:\x1b[0m Application shipped and live across environments!' }));
        window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[1;34m~/workspace\x1b[0m $ ' }));
        setPublishing(false);
    }, 2800);
  };

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
      {showSettings && <AISettingsModal onClose={() => setShowSettings(false)} />}
      
      {/* Top Navbar */}
      <header className="h-14 border-b border-[#333] flex items-center shrink-0 bg-[#151515] overflow-x-auto no-scrollbar relative w-full">
        <div className="flex items-center justify-between w-full min-w-max px-3 sm:px-4 gap-6">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer transition-colors"></div>
            </div>
            <h1 className="font-mono text-xs font-bold text-stone-300 tracking-wider shrink-0 mr-2">YOURAI IDE</h1>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button 
               onClick={() => { setShowExplorer(!showExplorer); if (window.innerWidth < 768) { setShowVisuals(false); setShowCopilot(false); setShowBrowser(false); } }}
               className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded transition-colors shrink-0 ${showExplorer ? 'bg-[#333] text-white' : 'text-stone-400 hover:text-stone-200 hover:bg-[#222]'}`}
               title="Explorer"
            >
               <Folders className="w-4 h-4" /> <span className="hidden lg:inline">Explorer</span>
            </button>
            <button 
               onClick={() => { setShowVisuals(!showVisuals); if (window.innerWidth < 768) { setShowExplorer(false); setShowCopilot(false); setShowBrowser(false); setShowDashboard(false); } else { setShowBrowser(false); setShowDashboard(false); } }}
               className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded transition-colors shrink-0 ${showVisuals ? 'bg-[#333] text-white' : 'text-stone-400 hover:text-stone-200 hover:bg-[#222]'}`}
               title="Visual Panel"
            >
               <MonitorPlay className="w-4 h-4" /> <span className="hidden lg:inline">Visual Panel</span>
            </button>
            <button 
               onClick={() => { setShowDashboard(!showDashboard); if (window.innerWidth < 768) { setShowExplorer(false); setShowCopilot(false); setShowBrowser(false); setShowVisuals(false); } }}
               className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded transition-colors shrink-0 ${showDashboard ? 'bg-red-900/30 border border-red-900/50 text-red-500 shadow-sm' : 'text-stone-400 hover:text-stone-200 hover:bg-[#222]'}`}
               title="Engine Dashboard"
            >
               <Activity className="w-4 h-4" /> <span className="hidden lg:inline">Engine Dashboard</span>
            </button>
            <button 
               onClick={() => { setShowBrowser(!showBrowser); if (window.innerWidth < 768) { setShowExplorer(false); setShowCopilot(false); setShowVisuals(false); setShowDashboard(false); } }}
               className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded transition-colors shrink-0 ${showBrowser ? 'bg-blue-600 border-blue-500 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200 hover:bg-[#222]'}`}
               title="Browser Preview"
            >
               <Globe className="w-4 h-4" /> <span className="hidden lg:inline">Preview</span>
            </button>
            <button 
               onClick={() => setShowTerminal(!showTerminal)}
               className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded transition-colors shrink-0 ${showTerminal ? 'bg-[#333] text-white' : 'text-stone-400 hover:text-stone-200 hover:bg-[#222]'}`}
               title="Terminal"
            >
               <TerminalSquare className="w-4 h-4" /> <span className="hidden lg:inline">Terminal</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button 
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded hover:bg-[#333] text-stone-300 border border-stone-700 transition-colors shrink-0"
              onClick={() => {
                 window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[33m[*] Packaging project workspace into ZIP format...\x1b[0m' }));
                 setTimeout(() => { window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[32m[+] ZIP archive generated successfully. Browser download initiated.\x1b[0m' })); }, 1000);
              }}
              title="Export"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Export</span>
            </button>
            <button 
              onClick={() => { setShowCopilot(!showCopilot); if (window.innerWidth < 768) { setShowExplorer(false); setShowVisuals(false); } }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded transition-colors shrink-0 ${showCopilot ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'hover:bg-[#333] text-stone-300 border border-transparent'}`}
              title="YourAI Assistant"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">YourAI Assistant</span>
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded hover:bg-[#333] text-stone-300 transition-colors shrink-0 border border-transparent"
              title="AI Config"
            >
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span className="hidden xl:inline">AI Config</span>
            </button>
            <button 
              onClick={handlePublish}
              disabled={publishing}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded transition-all shadow-sm shrink-0 min-w-[36px] ${publishing ? 'bg-[#333] text-stone-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
              title="Publish"
            >
              <Rocket className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">{publishing ? 'PUBLISHING...' : 'PUBLISH'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {showExplorer && (
          <div className="w-[260px] sm:w-[300px] shrink-0 border-r border-[#333] absolute md:relative z-40 h-full bg-[#181818] transition-transform">
            <FileExplorer 
              activeFile={activeFile} 
              onClose={() => setShowExplorer(false)}
              onSelectFile={(f, id) => {
                if (window.innerWidth < 768) setShowExplorer(false);
                if (id.startsWith('a')) setActiveFile(`src/engine/agents/${f}`);
                else if (id.startsWith('m')) setActiveFile(`src/engine/ml/${f}`);
                else if (id.startsWith('l')) setActiveFile(`src/engine/llm/${f}`);
                else if (id.startsWith('p')) setActiveFile(`src/engine/projects/${f}`);
                else if (id.startsWith('1-0-')) setActiveFile(`src/engine/${f}`);
                else if (id.startsWith('f-') && f !== 'main.tsx' && f !== 'package.json') setActiveFile(`src/pipeline/${f}`);
                else if (f === 'YOURAI.md' || f === 'package.json') setActiveFile(f);
                else setActiveFile(`src/components/${f}`);
              }} 
            />
          </div>
        )}
        
        {/* Editor */}
        <div className={`${(showVisuals) && !showCopilot ? 'md:w-1/2 border-r border-[#333]' : 'flex-1'} flex flex-col h-full bg-[#1e1e1e] transition-all overflow-hidden min-w-0`}>
          {showDashboard ? (
            <EngineDashboard onClose={() => setShowDashboard(false)} />
          ) : (
            <SplitPaneSynchronizer activeFile={activeFile} />
          )}
        </div>

        {/* Right Side: Visual Canvas Grid */}
        {showVisuals && !showDashboard && (
          <div className="w-full md:w-1/2 shrink-0 h-full border-l border-[#333] bg-[#111] absolute md:relative z-30 transform transition-transform">
            <CanvasGrid onNodeClick={(node) => {
              const fileName = node.data.label.replace(/\s+/g, '');
              setActiveFile(`src/components/${fileName}.tsx`);
            }} />
          </div>
        )}

        {showBrowser && !showDashboard && (
           <LocalBrowser onClose={() => setShowBrowser(false)} />
        )}
        
        {/* Copilot Sidebar */}
        {showCopilot && (
          <div className="w-[300px] xl:w-[320px] shrink-0 border-l border-[#333] absolute md:relative right-0 z-50 h-full bg-[#1e1e1e]">
            <CopilotSidebar onClose={() => setShowCopilot(false)} />
          </div>
        )}
      </div>

      {/* Bottom Terminal Layer */}
      {showTerminal && (
        <div className="h-64 shrink-0 w-full z-10 border-t border-[#333] shadow-[0_-10px_20px_rgba(0,0,0,0.3)] relative">
          <TabMultiplexer onClose={() => setShowTerminal(false)} />
        </div>
      )}

      {/* Hologramic Status Bar */}
      <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 py-1.5 sm:py-0 sm:h-6 text-[9px] sm:text-[10px] font-mono border-t border-blue-900/40 shrink-0 bg-[#0A0A0A] relative z-[999] opacity-90 sm:opacity-80 hover:opacity-100 transition-opacity gap-1 sm:gap-2">
        <div className="flex items-center gap-2 text-stone-500 w-full sm:w-auto overflow-hidden">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0" />
          <span className="text-blue-400 font-bold tracking-widest uppercase shrink-0">System Locked</span>
          <span className="ml-0 sm:ml-2 hidden sm:inline shrink-0">|</span>
          <span className="truncate">128-bit Encrypted Local Container</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-emerald-600/80 tracking-wide sm:tracking-widest uppercase glow-text w-full sm:w-auto">
          <span className="shrink-0">{new Date().toISOString().split('T')[0]}</span>
          <span className="hidden sm:inline opacity-50">|</span>
          <span className="truncate">Machine Language Model Engineer</span>
          <span className="hidden sm:inline opacity-50">|</span>
          <span className="truncate">Studying CSE in Bangladesh</span>
        </div>
      </footer>
    </div>
  );
}
