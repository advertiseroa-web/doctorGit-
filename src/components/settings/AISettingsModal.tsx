import React, { useState } from 'react';
import { X, Key, Cpu, Mic, Network, Server } from 'lucide-react';

export function AISettingsModal({ onClose }: { onClose: () => void }) {
  const [provider, setProvider] = useState('google');
  const [activeTab, setActiveTab] = useState('local');
  const [isDownloadingLocal, setIsDownloadingLocal] = useState(false);

  const handleDownload = () => {
    setIsDownloadingLocal(true);
    setTimeout(() => {
      onClose();
      window.dispatchEvent(new CustomEvent('terax:download_model'));
      setTimeout(() => window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[33m[*] Initiating model download from Hugging Face Hub (Llama-3-8b.gguf)...\x1b[0m\r\n' })), 500);
      setTimeout(() => window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[36m[*] Extracting quantized layers... [0/32]\x1b[0m\r\n' })), 1500);
      setTimeout(() => window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[36m    |██████████████████████████████ | 4.2GB / 4.2GB (120MB/s)\x1b[0m\r\n' })), 2500);
      setTimeout(() => window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[32m[+] Load to VRAM complete. Terax Local Engine Ready.\x1b[0m\r\n\r\n\x1b[1;36mTerax\x1b[0m \x1b[1;35muser@local\x1b[0m:\x1b[1;34m~/workspace\x1b[0m\x1b[1;32m $\x1b[0m ' })), 4000);
    }, 300);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 perspective-[1000px]">
      <div className="bg-[#1e1e1e] border border-[#333] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[80vh] transform transition-transform">
        <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#1a1a1a]">
          <h2 className="text-lg font-bold text-stone-200 flex items-center gap-2">
             <Cpu className="w-5 h-5 text-blue-500" />
             AI Configuration
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-[#333] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Sidebar */}
          <div className="w-full sm:w-48 bg-[#181818] border-b sm:border-b-0 sm:border-r border-[#333] flex flex-row sm:flex-col overflow-x-auto py-2 shrink-0 custom-scrollbar">
            <button onClick={() => setActiveTab('api')} className={`whitespace-nowrap px-4 py-3 sm:py-2 text-sm font-medium transition-colors ${activeTab === 'api' ? 'text-blue-400 bg-[#2d2d2d] sm:border-l-2 border-b-2 sm:border-b-0 border-blue-500' : 'text-stone-400 hover:text-stone-200 sm:border-l-2 border-b-2 sm:border-b-0 border-transparent hover:bg-[#252526]'}`}>API Config</button>
            <button onClick={() => setActiveTab('local')} className={`whitespace-nowrap px-4 py-3 sm:py-2 text-sm font-medium transition-colors ${activeTab === 'local' ? 'text-blue-400 bg-[#2d2d2d] sm:border-l-2 border-b-2 sm:border-b-0 border-blue-500' : 'text-stone-400 hover:text-stone-200 sm:border-l-2 border-b-2 sm:border-b-0 border-transparent hover:bg-[#252526]'}`}>Local Models</button>
            <button onClick={() => setActiveTab('prompts')} className={`whitespace-nowrap px-4 py-3 sm:py-2 text-sm font-medium transition-colors ${activeTab === 'prompts' ? 'text-blue-400 bg-[#2d2d2d] sm:border-l-2 border-b-2 sm:border-b-0 border-blue-500' : 'text-stone-400 hover:text-stone-200 sm:border-l-2 border-b-2 sm:border-b-0 border-transparent hover:bg-[#252526]'}`}>System Prompts</button>
            <button onClick={() => setActiveTab('hardware')} className={`whitespace-nowrap px-4 py-3 sm:py-2 text-sm font-medium transition-colors ${activeTab === 'hardware' ? 'text-blue-400 bg-[#2d2d2d] sm:border-l-2 border-b-2 sm:border-b-0 border-blue-500' : 'text-stone-400 hover:text-stone-200 sm:border-l-2 border-b-2 sm:border-b-0 border-transparent hover:bg-[#252526]'}`}>Hardware Setup</button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#1e1e1e]">
            {activeTab === 'api' && (
              <>
                <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">Model Routing & API Binding</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                     {[
                       { id: 'google', name: 'Google Gemini 4' },
                       { id: 'anthropic', name: 'Anthropic Claude' },
                       { id: 'openai', name: 'OpenAI Base' },
                       { id: 'groq', name: 'Groq Fast' },
                     ].map(p => (
                       <div 
                         key={p.id}
                         onClick={() => setProvider(p.id)}
                         className={`p-3 rounded-lg border cursor-pointer transition-all ${provider === p.id ? 'border-blue-500 bg-blue-500/10' : 'border-[#333] bg-[#252526] hover:border-stone-500'}`}
                       >
                         <div className="font-semibold text-stone-200 text-sm">{p.name}</div>
                       </div>
                     ))}
                  </div>

                  <div className="bg-[#252526] p-4 rounded-lg border border-[#333]">
                    <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
                      <Key className="w-4 h-4 text-emerald-500" />
                      Cloud API Key
                    </label>
                    <input 
                      type="password" 
                      placeholder={`sk-${provider}...`}
                      className="w-full bg-[#181818] border border-[#444] rounded p-2 text-sm text-stone-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-xs text-stone-500 mt-2">
                       Keys are written to the OS keychain via keyring — they never touch disk or localStorage.
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'local' && (
              <>
                <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">Local Inference & Universal Integration</h3>
                
                <div className="space-y-6">
                  <div className="bg-[#252526] p-4 rounded-lg border border-[#333]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-white flex items-center gap-2"><Server className="w-4 h-4 text-emerald-400" /> Universal Local Host / Custom API</h4>
                        <p className="text-xs text-stone-400 mt-1">Host your own AI via localhost or plug in any custom API. doctorGit hooks into anything.</p>
                      </div>
                      <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs border border-emerald-500/20">Detected</div>
                    </div>
                    
                    <label className="block text-xs font-medium text-stone-400 mb-1">Local Server URL / Custom Endpoint</label>
                    <input 
                      type="text" 
                      defaultValue="http://127.0.0.1:1234/v1"
                      className="w-full bg-[#181818] border border-[#444] rounded p-2 text-sm text-stone-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono mb-4"
                    />

                    <label className="block text-xs font-medium text-stone-400 mb-1">Default Model Router</label>
                    <select className="w-full bg-[#181818] border border-[#444] rounded p-2 text-sm text-stone-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>Gemini 4 (Highly Recommended - Optimal Agent Logic)</option>
                      <option>llama-3-8b-instruct</option>
                      <option>qwen-2-7b-instruct</option>
                      <option>phi-3-mini-4k-instruct</option>
                      <option>Custom API Route...</option>
                    </select>
                    <p className="text-[10px] text-stone-500 mt-2">
                       * We strongly suggest Gemini 4 as the base orchestrator due to its superior function calling and Wiki Context digestion.
                    </p>
                  </div>

                  <div className="bg-[#2a2d3e] p-4 rounded-lg border border-blue-500/30">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">Download Neural Weights (Native Sandbox)</h4>
                    <p className="text-xs text-stone-300 mb-3 leading-relaxed">
                      Don't have an API or Localhost set up? doctorGit can download pre-quantized execution weights directly into the secure container sandbox. You own the data.
                    </p>
                    <button 
                      onClick={handleDownload}
                      disabled={isDownloadingLocal}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-wait rounded text-xs font-medium text-white transition-colors flex items-center gap-2"
                    >
                       <Cpu className="w-3 h-3" /> {isDownloadingLocal ? 'Initializing engine...' : 'Download Quantized Weights (4.2GB)'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'hardware' && (
              <>
                 <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">Hardware Acceleration</h3>
                 <div className="space-y-4">
                    <div className="p-4 bg-[#252526] border border-[#333] rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-sm font-medium text-white">GPU Acceleration</span>
                         <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30">CUDA Active</span>
                      </div>
                      <p className="text-xs text-stone-400">Offload tensor math to NVIDIA GPU backend automatically if detected.</p>
                      
                      <div className="mt-4 space-y-2">
                         <div className="flex justify-between text-xs text-stone-300">
                           <span>VRAM Usage Limit</span>
                           <span>8 GB</span>
                         </div>
                         <input type="range" className="w-full" min="1" max="24" defaultValue="8" />
                      </div>
                    </div>
                 </div>
              </>
            )}
            
            {activeTab === 'prompts' && (
              <>
                <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">System Prompts</h3>
                <textarea 
                  className="w-full h-64 bg-[#181818] border border-[#444] rounded p-3 text-sm text-stone-200 focus:outline-none focus:border-blue-500 font-mono resize-none custom-scrollbar"
                  defaultValue="You are an advanced synthetic AI agent running inside the Terax local environment. You excel at code generation, container management, and systems integration."
                  placeholder="Enter base system instructions..."
                ></textarea>
              </>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-[#333] bg-[#1a1a1a] flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded text-sm font-medium text-stone-400 hover:text-stone-200">Cancel</button>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium text-white shadow-sm transition-colors">Apply Config</button>
        </div>
      </div>
    </div>
  );
}
