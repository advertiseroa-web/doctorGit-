import React, { useState } from 'react';
import { Folder, FileJson, FileCode2, FileText, ChevronRight, ChevronDown, Search, Plus, MoreVertical, Trash2, FolderPlus, X } from 'lucide-react';

const initialFileTree = [
  { id: '1', name: 'src', type: 'directory', children: [
    { id: '1-0', name: 'engine', type: 'directory', children: [
        { id: '1-agents', name: 'agents', type: 'directory', children: [
           { id: 'a1', name: 'AgentEngine.ts', type: 'file', lang: 'typescript' },
           { id: 'a2', name: 'SwarmRouter.ts', type: 'file', lang: 'typescript' },
           { id: 'a3', name: 'LangGraph_RAG.py', type: 'file', lang: 'python' },
           { id: 'a4', name: 'CrewAI_Orchestrator.py', type: 'file', lang: 'python' },
           { id: 'a5', name: 'PydanticAI_Workflows.py', type: 'file', lang: 'python' },
           { id: 'a6', name: 'HybridMemory_Agent.ts', type: 'file', lang: 'typescript' },
           { id: 'a7', name: 'SmolAgents_Fleet.py', type: 'file', lang: 'python' },
        ]},
        { id: '1-ml', name: 'ml', type: 'directory', children: [
           { id: 'm1', name: 'ZenML_Pipeline.py', type: 'file', lang: 'python' },
           { id: 'm2', name: 'CuPy_Kernels.py', type: 'file', lang: 'python' },
           { id: 'm3', name: 'JAX_Equinox.py', type: 'file', lang: 'python' },
           { id: 'm4', name: 'DuckDB_Analytics.py', type: 'file', lang: 'python' },
           { id: 'm5', name: 'SHAP_Explainability.py', type: 'file', lang: 'python' },
           { id: 'm6', name: 'Scanpy_RNA.py', type: 'file', lang: 'python' },
        ]},
        { id: '1-llm', name: 'llm', type: 'directory', children: [
           { id: 'l1', name: 'LLMCompressor.py', type: 'file', lang: 'python' },
           { id: 'l2', name: 'Qwen3_MoE_Router.ts', type: 'file', lang: 'typescript' },
           { id: 'l3', name: 'Tinygrad_MiniGPT.py', type: 'file', lang: 'python' },
           { id: 'l4', name: 'NVIDIA_KVPress.py', type: 'file', lang: 'python' },
           { id: 'l5', name: 'TRL_DPO_Tuning.py', type: 'file', lang: 'python' },
           { id: 'l6', name: 'Crawl4AI_Extractor.py', type: 'file', lang: 'python' },
           { id: 'l7', name: 'HF_Model_Downloader.py', type: 'file', lang: 'python' },
           { id: 'l8', name: 'Universal_API_Gateway.py', type: 'file', lang: 'python' },
        ]},
        { id: '1-projects', name: 'projects', type: 'directory', children: [
           { id: 'p1', name: 'DQN_TradingBot.py', type: 'file', lang: 'python' },
           { id: 'p2', name: 'BioPython_Agent.py', type: 'file', lang: 'python' },
           { id: 'p3', name: 'VoiceAI_Assistant.py', type: 'file', lang: 'python' },
           { id: 'p4', name: 'WebScraper_Gemini.py', type: 'file', lang: 'python' },
        ]},
        { id: '1-0-3', name: 'ExecutionEngineer.ts', type: 'file', lang: 'typescript' },
    ]},
    { id: '1-1', name: 'components', type: 'directory', children: [
        { id: '1-1-1', name: 'CanvasGrid.tsx', type: 'file', lang: 'typescript' },
        { id: '1-1-2', name: 'FileExplorer.tsx', type: 'file', lang: 'typescript' },
    ]},
    { id: '1-2', name: 'App.tsx', type: 'file', lang: 'typescript' },
    { id: '1-3', name: 'main.tsx', type: 'file', lang: 'typescript' },
    { id: '1-4', name: 'index.css', type: 'file', lang: 'css' },
  ]},
  { id: '2', name: 'src-tauri', type: 'directory', children: [
    { id: '2-1', name: 'src', type: 'directory', children: [
        { id: '2-1-1', name: 'main.rs', type: 'file', lang: 'rust' }
    ]},
    { id: '2-2', name: 'Cargo.toml', type: 'file', lang: 'toml' },
  ]},
  { id: '3', name: 'package.json', type: 'file', lang: 'json' },
  { id: '4', name: 'YOURAI.md', type: 'file', lang: 'markdown' },
];

function FileIcon({ name, type }: { name: string, type: string }) {
  if (type === 'directory') return <Folder className="w-3.5 h-3.5 text-blue-400" />;
  if (name.endsWith('.tsx') || name.endsWith('.ts')) return <FileCode2 className="w-3.5 h-3.5 text-blue-500" />;
  if (name.endsWith('.rs')) return <FileCode2 className="w-3.5 h-3.5 text-orange-500" />;
  if (name.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-yellow-500" />;
  if (name.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-sky-300" />;
  return <FileCode2 className="w-3.5 h-3.5 text-stone-400" />;
}

export function FileExplorer({ activeFile, onSelectFile, onClose }: { activeFile: string, onSelectFile: (name: string, id: string) => void, onClose?: () => void }) {
  const [fileTree, setFileTree] = useState(initialFileTree);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ '1': true, '1-0': true, '1-1': true, '1-agents': true, '1-ml': true, '1-llm': true, '1-projects': true, 'p-pipeline': true, '2': false });
  const [search, setSearch] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);

  React.useEffect(() => {
    const handleAddNodeFile = (e: any) => {
      const { name, lang } = e.detail;
      const newId = `f-${Date.now()}`;
      const newFile = { id: newId, name, type: 'file', lang };
      
      setFileTree(prev => {
        // Find if we have a pipeline folder
        const hasPipeline = prev.find(p => p.id === '1')?.children?.find((c: any) => c.id === '1-pipeline');
        
        if (!hasPipeline) {
           const newTree = [...prev];
           const srcIdx = newTree.findIndex(p => p.id === '1');
           if (srcIdx >= 0) {
             const pipelineFolder = { id: '1-pipeline', name: 'pipeline', type: 'directory', children: [newFile] };
             newTree[srcIdx].children.unshift(pipelineFolder);
             setExpanded(ex => ({...ex, '1-pipeline': true}));
           }
           return newTree;
        } else {
           return prev.map(p => {
             if (p.id === '1') {
                return {
                  ...p,
                  children: p.children.map((c: any) => {
                     if (c.id === '1-pipeline') {
                        // avoid duplicate
                        if (c.children.find((f: any) => f.name === name)) return c;
                        return { ...c, children: [...c.children, newFile] };
                     }
                     return c;
                  })
                }
             }
             return p;
           });
        }
      });
      onSelectFile(name, newId);
    };

    window.addEventListener('terax:add_node_file', handleAddNodeFile);
    return () => window.removeEventListener('terax:add_node_file', handleAddNodeFile);
  }, [onSelectFile]);


  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      setShowNewFileInput(false);
      return;
    }

    const newId = `f-${Date.now()}`;
    const newFile = { id: newId, name: newFileName, type: 'file', lang: newFileName.split('.').pop() || 'text' };
    
    // Add to root
    setFileTree(prev => [newFile, ...prev]);
    onSelectFile(newFileName, newId);
    setNewFileName('');
    setShowNewFileInput(false);
  };

  const handleStartFromScratch = () => {
    if (confirm("Are you sure you want to clear the workspace?")) {
      const basicTree = [
        { id: 'src', name: 'src', type: 'directory', children: [
          { id: 'f-main', name: 'main.tsx', type: 'file', lang: 'tsx' },
        ]},
        { id: 'f-pkg', name: 'package.json', type: 'file', lang: 'json' }
      ];
      setFileTree(basicTree);
      setExpanded({ 'src': true });
      setShowOptionsPopup(false);
    }
  };

  const deleteNode = (id: string, currentNodes: any[]): any[] => {
    return currentNodes.filter(node => node.id !== id).map(node => {
      if (node.children) {
        return { ...node, children: deleteNode(id, node.children) };
      }
      return node;
    });
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this item?")) {
      setFileTree(prev => deleteNode(id, prev));
    }
  };

  const renderTree = (nodes: any[], depth = 0) => {
    return nodes.map(node => {
      const isDir = node.type === 'directory';
      const isExpanded = !!expanded[node.id];
      const isActive = activeFile.endsWith(node.name); // simplified check
      
      if (search && !node.name.toLowerCase().includes(search.toLowerCase()) && !isDir) return null;

      return (
        <div key={node.id} className="group flex flex-col">
          <div 
            className={`flex items-center py-1 gap-1.5 px-2 cursor-pointer hover:bg-[#2a2d2e] select-none text-[12px] font-mono transition-colors relative ${isActive && !isDir ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'}`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => isDir ? toggleExpand(node.id) : onSelectFile(node.name, node.id)}
          >
            {isDir ? (
              isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-[#cccccc]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#cccccc]" />
            ) : (
              <span className="w-3.5" />
            )}
            <FileIcon name={node.name} type={node.type} />
            <span className="truncate flex-1">{node.name}</span>
            <button 
              onClick={(e) => handleDelete(e, node.id)}
              className="opacity-0 group-hover:opacity-100 p-0.5 text-stone-500 hover:text-red-400 hover:bg-[#333] rounded transition-all mr-1"
              title="Delete item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          {isDir && isExpanded && node.children && (
             <div>{renderTree(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full bg-[#181818] border-r border-[#333] flex flex-col w-full md:w-64 shrink-0 overflow-hidden relative">
      <div className="p-2 border-b border-[#333] flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold tracking-widest text-[#cccccc] uppercase">Explorer</span>
        <div className="flex gap-1 relative items-center">
          <button onClick={() => setShowNewFileInput(true)} className="p-1 hover:bg-[#333] rounded text-[#cccccc]" title="New File"><Plus className="w-3.5 h-3.5" /></button>
          <button onClick={() => setShowOptionsPopup(!showOptionsPopup)} className="p-1 hover:bg-[#333] rounded text-[#cccccc]" title="Options"><MoreVertical className="w-3.5 h-3.5" /></button>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-red-500/20 rounded text-[#cccccc] hover:text-red-400 md:hidden ml-1"><X className="w-4 h-4" /></button>
          )}
          
          {showOptionsPopup && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-[#252526] border border-[#3c3c3c] rounded-md shadow-xl z-50 py-1">
              <button 
                onClick={handleStartFromScratch}
                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-[#333] flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" /> Clear Workspace
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-2 border-b border-[#333] shrink-0">
        <div className="flex items-center bg-[#252526] border border-[#3c3c3c] rounded px-2 py-1">
          <Search className="w-3 h-3 text-[#cccccc] mr-2" />
          <input 
            className="bg-transparent border-none outline-none text-[11px] text-[#cccccc] placeholder-[#666666] w-full"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {showNewFileInput && (
        <div className="p-2 border-b border-[#333] shrink-0 bg-[#252526]">
          <form onSubmit={handleAddFileSubmit} className="flex flex-col gap-2">
            <span className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Create New File</span>
            <input 
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="e.g. index.ts or README.md"
              autoFocus
              className="w-full bg-[#1e1e1e] border border-[#444] rounded text-xs text-stone-200 p-1.5 outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowNewFileInput(false)} className="text-[10px] text-stone-400 hover:text-stone-300">Cancel</button>
              <button type="submit" className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded">Create</button>
            </div>
          </form>
        </div>
      )}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-stone-700">
        {renderTree(fileTree)}
      </div>
    </div>
  );
}
