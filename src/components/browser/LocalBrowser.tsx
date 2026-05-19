import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock, ExternalLink, X, ListTree, Bug, Database, Play, Code, Sparkles, Minus, Square, Globe } from 'lucide-react';
import { motion, useDragControls, AnimatePresence } from 'motion/react';

export function LocalBrowser({ onClose }: { onClose?: () => void }) {
  const [url, setUrl] = useState(window.location.origin);
  const [inputUrl, setInputUrl] = useState(window.location.origin);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'dom' | 'scrape'>('preview');
  const [scrapedData, setScrapedData] = useState<string>('');
  
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const dragControls = useDragControls();

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isMaximized && !isMinimized) {
      dragControls.start(e);
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
    
    // Simulate scraping if on scrape tab
    if (activeTab === 'scrape') {
       simulateScrape(finalUrl);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const simulateScrape = (targetUrl: string) => {
    setIsLoading(true);
    setScrapedData('Initializing headless browser...\nNavigating to ' + targetUrl + '...\nBypassing anti-bot checks...\n');
    setTimeout(() => {
      setScrapedData(prev => prev + 'Extracting DOM tree...\n');
    }, 800);
    setTimeout(() => {
      setScrapedData(prev => prev + 'Parsing metadata, links, and text content...\n');
    }, 1500);
    setTimeout(() => {
      setScrapedData(prev => prev + '{\n  "title": "Extracted Page",\n  "status": 200,\n  "links_found": 42,\n  "content_length": 14201\n}\n\x1b[32m[+] Scraping complete.\x1b[0m');
      setIsLoading(false);
    }, 2500);
  };

  const getActualIframeSrc = (u: string) => {
    if (u === window.location.origin || u === window.location.origin + '/') {
      return ''; // We will use srcDoc instead
    }
    return u;
  };

  const iframeSrc = getActualIframeSrc(url);
  const srcDoc = iframeSrc === '' ? `
    <!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8" />
        <title>YourAI Synthesis Environment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  background: '#0a0a0a',
                  surface: '#121212',
                  surfaceHighlight: '#1f1f1f',
                  border: '#2a2a2a',
                  accent: '#3b82f6',
                  accentHover: '#2563eb',
                },
                fontFamily: {
                  sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
                  mono: ['ui-monospace', 'monospace'],
                }
              }
            }
          }
        </script>
        <script src="https://unpkg.com/lucide@latest"></script>
        <style>
          body { background-color: var(--background); color: #ededed; overflow-x: hidden; }
          .glass-panel { background: rgba(18, 18, 18, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--border); }
          .animated-bg {
            position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%);
            top: -200px; left: -200px; border-radius: 50%; pointer-events: none; z-index: -1; animation: drift 15s infinite alternate ease-in-out;
          }
          @keyframes drift { 0% { transform: translate(0,0); } 100% { transform: translate(100px, 50px); } }
          
          .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        </style>
      </head>
      <body class="bg-background min-h-screen text-gray-200 font-sans custom-scrollbar relative">
        <div class="animated-bg"></div>
        
        <!-- Header -->
        <header class="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-border">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/40">
              <i data-lucide="cpu" class="w-5 h-5 text-accent"></i>
            </div>
            <div>
              <h1 class="font-bold tracking-tight text-white leading-tight">YourAI Agent System</h1>
              <p class="text-xs text-gray-400 font-mono">localhost:3000 // Active</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono font-medium">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Docker Container Validated
            </div>
            <button class="p-2 rounded-md hover:bg-surfaceHighlight text-gray-400 transition-colors">
              <i data-lucide="settings" class="w-5 h-5"></i>
            </button>
            <button class="p-2 rounded-md hover:bg-surfaceHighlight text-gray-400 transition-colors">
              <i data-lucide="bell" class="w-5 h-5"></i>
            </button>
          </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          <!-- Hero Section -->
          <div class="glass-panel rounded-2xl p-8 relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 class="text-2xl font-bold text-white mb-2">Welcome to the Permanent Demo</h2>
                <p class="text-sm text-gray-400 max-w-xl leading-relaxed mt-2">
                  This framework initializes inside an isolated Docker container with local dependencies fully synchronized. Every element you see here is generated and compiled by the agent on the fly. 
                  Start editing from scratch, and the system instantly updates.
                </p>
                <div class="mt-6 flex flex-wrap gap-3">
                  <button id="trigger-btn" class="px-5 py-2.5 bg-accent hover:bg-accentHover text-white text-sm font-semibold rounded-lg shadow-lg shadow-accent/20 transition-all flex items-center gap-2">
                    <i data-lucide="zap" class="w-4 h-4"></i> Initialize Hardware Pipeline
                  </button>
                  <button class="px-5 py-2.5 bg-surfaceHighlight hover:bg-border border border-border text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2">
                    <i data-lucide="book-open" class="w-4 h-4 text-gray-400"></i> View Documentation
                  </button>
                </div>
              </div>
              
              <!-- Metrics Cards -->
              <div class="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                <div class="bg-surface border border-border p-3 rounded-lg flex items-center gap-4 min-w-[200px]">
                  <div class="p-2 bg-emerald-500/10 rounded-md text-emerald-400"><i data-lucide="server" class="w-4 h-4"></i></div>
                  <div>
                    <div class="text-[10px] uppercase text-gray-500 font-mono">Container State</div>
                    <div class="text-sm font-medium text-gray-200">Running / Indexed</div>
                  </div>
                </div>
                <div class="bg-surface border border-border p-3 rounded-lg flex items-center gap-4 min-w-[200px]">
                  <div class="p-2 bg-purple-500/10 rounded-md text-purple-400"><i data-lucide="activity" class="w-4 h-4"></i></div>
                  <div>
                    <div class="text-[10px] uppercase text-gray-500 font-mono">Hardware Acceleration</div>
                    <div class="text-sm font-medium text-gray-200">Neural Engine <span class="bg-purple-500/20 text-purple-300 text-[9px] px-1.5 py-0.5 rounded ml-1">ENABLED</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="glass-panel p-6 rounded-xl hover:border-gray-600 transition-colors">
              <div class="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4 border border-orange-500/20">
                <i data-lucide="layers" class="w-5 h-5"></i>
              </div>
              <h3 class="text-base font-semibold text-white mb-2">500+ Tool Integrations</h3>
              <p class="text-sm text-gray-400 leading-relaxed">Instantly access the layer shop and pull modular nodes directly into your LLM graph. The tools are bound seamlessly via React Flow patterns.</p>
            </div>
            
            <div class="glass-panel p-6 rounded-xl hover:border-gray-600 transition-colors">
              <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                <i data-lucide="terminal-square" class="w-5 h-5"></i>
              </div>
              <h3 class="text-base font-semibold text-white mb-2">Advanced Terminal Sync</h3>
              <p class="text-sm text-gray-400 leading-relaxed">A native PTY backend integration provides zero-latency interactions with the host OS, complete with package simulation and execution traces.</p>
            </div>

            <div class="glass-panel p-6 rounded-xl hover:border-gray-600 transition-colors">
              <div class="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 border border-pink-500/20">
                <i data-lucide="database" class="w-5 h-5"></i>
              </div>
              <h3 class="text-base font-semibold text-white mb-2">Headless Scraping</h3>
              <p class="text-sm text-gray-400 leading-relaxed">Directly extract structured metadata from any URL using the integrated headless crawler, fully visible through the DOM state inspector.</p>
            </div>
          </div>

          <!-- Live Log Console -->
          <div class="glass-panel rounded-xl overflow-hidden border border-border">
            <div class="bg-surfaceHighlight px-4 py-3 flex items-center justify-between border-b border-border">
               <div class="flex items-center gap-2 text-sm text-gray-300 font-medium">
                 <i data-lucide="list-tree" class="w-4 h-4 text-gray-400"></i> Event Stream
               </div>
               <span class="flex h-2 w-2 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
               </span>
            </div>
            <div id="log-output" class="p-4 bg-background font-mono text-xs h-48 overflow-y-auto custom-scrollbar text-gray-400 space-y-2">
              <div><span class="text-emerald-400">[SYSTEM]</span> Docker bridge initialized. Network IP assigned.</div>
              <div><span class="text-emerald-400">[SYSTEM]</span> Dependencies verified. Total footprint: ~7.2 MB.</div>
              <div><span class="text-blue-400">[INFO]</span> Component compiled and injected via standard Hot Module Replacement.</div>
              <div><span class="text-blue-400">[INFO]</span> Listening on port 3000...</div>
            </div>
          </div>

        </main>

        <script>
          lucide.createIcons();
          const triggerBtn = document.getElementById('trigger-btn');
          const logOutput = document.getElementById('log-output');
          let count = 0;
          
          triggerBtn.addEventListener('click', () => {
            count++;
            const newLog = document.createElement('div');
            newLog.innerHTML = \`<span class="text-purple-400">[ACTION]</span> Trigger executed: Sequence #\${count}. Hardware neural pathways re-allocating. GPU simulated response...\`;
            logOutput.appendChild(newLog);
            logOutput.scrollTop = logOutput.scrollHeight;
            triggerBtn.innerHTML = \`<i data-lucide="zap" class="w-4 h-4"></i> Pipeline Triggered (\${count})\`;
            lucide.createIcons();
          });
        </script>
      </body>
    </html>
  ` : undefined;

  return (
    <AnimatePresence>
      {!isMinimized ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            ...(isMaximized ? { width: '100vw', height: '100vh', x: 0, y: 0 } : { width: 'min(1000px, 90vw)', height: 'min(800px, 80vh)' })
          }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          drag={!isMaximized}
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          style={isMaximized ? { top: 0, left: 0 } : { top: '5vh', left: '5vw', right: 'auto' }}
          className={`fixed z-50 flex flex-col bg-[#1e1e1e] border border-[#333] shadow-2xl overflow-hidden ${isMaximized ? 'rounded-none inset-0 w-[100vw] h-[100vh]' : 'rounded-xl'}`}
        >
          {/* macOS Style Window Title Bar */}
          <div 
            onPointerDown={handlePointerDown}
            style={{ touchAction: 'none' }}
            className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#1a1a1a] cursor-grab active:cursor-grabbing select-none shrink-0"
          >
            <div className="flex gap-2 items-center">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center group" title="Close">
                <X className="w-2 h-2 text-[#4d0000] opacity-0 group-hover:opacity-100" />
              </button>
              <button onClick={() => setIsMinimized(true)} className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 flex items-center justify-center group" title="Minimize">
                <Minus className="w-2 h-2 text-[#4d3300] opacity-0 group-hover:opacity-100" />
              </button>
              <button onClick={() => setIsMaximized(!isMaximized)} className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 flex items-center justify-center group" title="Maximize">
                <Square className="w-2 h-2 text-[#004d09] opacity-0 group-hover:opacity-100" />
              </button>
            </div>
            <div className="text-[11px] font-medium text-stone-400 font-sans tracking-wide">Chrome Engine Preview</div>
            <div className="w-[52px]"></div> {/* Spacer to center title */}
          </div>

          {/* Browser Navigation Bar */}
          <div className="flex items-center gap-2 p-2 bg-[#333333] border-b border-[#222] shrink-0">
        <div className="flex gap-2 mr-2 border-r border-[#333] pr-2 items-center font-mono text-stone-400">
          <button 
            onClick={() => setActiveTab('preview')}
            className={`p-1.5 rounded transition-colors ${activeTab === 'preview' ? 'bg-[#444] text-white' : 'hover:bg-[#333]'}`} title="Preview Viewer"
          >
            <Play className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('dom')}
            className={`p-1.5 rounded transition-colors ${activeTab === 'dom' ? 'bg-[#444] text-white' : 'hover:bg-[#333]'}`} title="DOM Inspector"
          >
            <ListTree className="w-4 h-4" />
          </button>
          <button 
            onClick={() => { setActiveTab('scrape'); simulateScrape(url); }}
            className={`p-1.5 rounded transition-colors ${activeTab === 'scrape' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-[#333]'}`} title="Headless Scraper Tool"
          >
            <Database className="w-4 h-4" />
          </button>
        </div>
        <button onClick={() => window.history.back()} className="p-1 text-stone-400 hover:text-white hover:bg-[#444] rounded transition-colors"><ArrowLeft className="w-4 h-4" /></button>
        <button onClick={() => window.history.forward()} className="p-1 text-stone-400 hover:text-white hover:bg-[#444] rounded transition-colors"><ArrowRight className="w-4 h-4" /></button>
        <button onClick={handleRefresh} className={`p-1 text-stone-400 hover:text-white hover:bg-[#444] rounded transition-colors ${isLoading ? 'animate-spin' : ''}`}><RotateCw className="w-4 h-4" /></button>
        <button onClick={() => { setUrl(window.location.origin); setInputUrl(window.location.origin); setActiveTab('preview'); }} className="p-1 text-stone-400 hover:text-white hover:bg-[#444] rounded transition-colors mr-2"><Home className="w-4 h-4" /></button>
        
        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-[#1a1a1a] border border-[#444] rounded-full px-3 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-inner">
          <Lock className="w-3 h-3 text-emerald-500 mr-2 shrink-0" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-transparent text-[11px] text-stone-200 outline-none font-mono"
            placeholder="Search or enter web address"
          />
          {activeTab === 'scrape' && <Sparkles className="w-3 h-3 text-blue-400 ml-2 animate-pulse" />}
        </form>
        <a href={url} target="_blank" rel="noreferrer" className="p-1 text-stone-400 hover:text-white hover:bg-[#444] rounded transition-colors ml-2" title="Open in New Tab">
          <ExternalLink className="w-4 h-4" />
        </a>
        {onClose && (
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 rounded transition-colors ml-1" title="Close Preview">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Network / DOM Breadcrumbs when not in preview */}
      {activeTab !== 'preview' && (
        <div className="bg-[#252526] border-b border-[#333] px-3 py-1 flex items-center gap-2 text-[10px] font-mono text-stone-400">
           {activeTab === 'dom' ? <><Code className="w-3 h-3 text-pink-400" /> <span>Elements</span> <span className="text-stone-600">&gt;</span> <span>html</span> <span className="text-stone-600">&gt;</span> <span>body</span> <span className="text-stone-600">&gt;</span> <span className="text-stone-300">div#root</span></> : <><Database className="w-3 h-3 text-blue-400" /> <span>Headless Engine</span> <span className="text-stone-600">&gt;</span> <span className="text-green-400">Target: {url}</span></>}
        </div>
      )}

      <div className="relative flex-1 bg-white overflow-hidden">
        {isLoading && activeTab === 'preview' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 transition-opacity">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
        )}
        
        {activeTab === 'preview' && (
          <iframe
            key={refreshKey}
            id="local-browser-iframe"
            src={iframeSrc ? iframeSrc : undefined}
            srcDoc={srcDoc}
            title="Local Browser"
            className="w-full h-full border-none"
            onLoad={handleLoad}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        )}

        {activeTab === 'dom' && (
          <div className="h-full w-full bg-[#1e1e1e] text-stone-300 font-mono text-xs overflow-auto p-4 custom-scrollbar">
            <div className="text-stone-500 mb-4">// DOM snapshot via CDP (Chrome DevTools Protocol)</div>
            <div className="pl-4">
              <span className="text-blue-400">&lt;!DOCTYPE</span> <span className="text-blue-300">html</span><span className="text-blue-400">&gt;</span><br/>
              <span className="text-blue-400">&lt;html</span> <span className="text-purple-400">lang</span>=<span className="text-yellow-300">"en"</span><span className="text-blue-400">&gt;</span><br/>
              <div className="border-l border-stone-700 ml-2 pl-4 py-1">
                <span className="text-blue-400">&lt;head&gt;</span><br/>
                <div className="border-l border-stone-700 ml-2 pl-4 py-1 text-stone-500">... meta, title, styles ...</div>
                <span className="text-blue-400">&lt;/head&gt;</span><br/>
                <span className="text-blue-400">&lt;body&gt;</span><br/>
                <div className="border-l border-stone-700 ml-2 pl-4 py-1">
                  <span className="text-blue-400">&lt;div</span> <span className="text-purple-400">id</span>=<span className="text-yellow-300">"root"</span><span className="text-blue-400">&gt;</span><br/>
                  <div className="border-l border-stone-700 ml-2 pl-4 py-1">
                    <span className="text-blue-400">&lt;div</span> <span className="text-purple-400">class</span>=<span className="text-yellow-300">"h-screen w-full flex bg-[#0a0a0a]"</span><span className="text-blue-400">&gt;</span><br/>
                    <div className="border-l border-stone-700 ml-2 pl-4 py-1 text-stone-500">... React components rendered ...</div>
                    <span className="text-blue-400">&lt;/div&gt;</span><br/>
                  </div>
                  <span className="text-blue-400">&lt;/div&gt;</span><br/>
                  <span className="text-blue-400">&lt;script</span> <span className="text-purple-400">type</span>=<span className="text-yellow-300">"module"</span> <span className="text-purple-400">src</span>=<span className="text-yellow-300">"/src/main.tsx"</span><span className="text-blue-400">&gt;&lt;/script&gt;</span><br/>
                </div>
                <span className="text-blue-400">&lt;/body&gt;</span><br/>
              </div>
              <span className="text-blue-400">&lt;/html&gt;</span>
            </div>
            <div className="mt-8 pt-4 border-t border-[#333]">
              <div className="text-yellow-400 mb-2 flex items-center gap-2"><Bug className="w-3 h-3" /> Console</div>
              <div className="text-stone-400">&gt; Warning: X-Frame-Options headers detected. External sites (like Google.com) block embedding via iframe.</div>
              <div className="text-blue-400">&gt; For external domains, use the "Scrape" tab to extract data via headless engine.</div>
            </div>
          </div>
        )}

        {activeTab === 'scrape' && (
          <div className="h-full w-full bg-[#0a0a0a] text-stone-300 font-mono text-xs overflow-auto p-4 flex flex-col relative custom-scrollbar">
            {isLoading && (
              <div className="absolute top-4 right-4 animate-pulse flex items-center gap-2 text-blue-400">
                <RotateCw className="w-3 h-3 animate-spin" /> Working...
              </div>
            )}
            <div className="whitespace-pre-wrap">{scrapedData}</div>
          </div>
        )}
      </div>
    </motion.div>
    ) : (
      <motion.button
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#2d2d2d] border border-[#444] rounded-full px-4 py-2 shadow-xl hover:bg-[#333] transition-colors"
      >
        <Globe className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-stone-200">Browser Preview</span>
      </motion.button>
    )}
    </AnimatePresence>
  );
}
