import React, { useState, useRef, useCallback } from 'react';
import { ReactFlow, Background, Controls, addEdge, useNodesState, useEdgesState, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeConnector } from './NodeConnector';
import { LayerToggleMatrix } from './LayerToggleMatrix';
import { CustomNode } from './CustomNode';
import { Database, Server, Cpu, BoxSelect, Waypoints, KeySquare, MonitorPlay, Component, Play as ActionNodeIcon, Play, Brain, Search, SearchCode, Webhook, FileText, MemoryStick, TestTube, ArrowRightLeft } from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  { id: '1', position: { x: 50, y: 50 }, type: 'custom', data: { label: 'Query Analyzer', sublabel: 'Parses natural language', borderClass: 'border-fuchsia-500/50', textClass: 'text-fuchsia-400', bgClass: 'bg-fuchsia-950/20' } },
  { id: '2', position: { x: 300, y: 150 }, type: 'custom', data: { label: 'Vector Index', sublabel: 'Semantic matching', borderClass: 'border-blue-500/50', textClass: 'text-blue-400', bgClass: 'bg-blue-950/20' } },
  { id: '3', position: { x: 550, y: 250 }, type: 'custom', data: { label: 'Prompt Constructor', sublabel: 'Injects context block', borderClass: 'border-yellow-500/50', textClass: 'text-yellow-400', bgClass: 'bg-yellow-950/20' } },
  { id: '4', position: { x: 800, y: 350 }, type: 'custom', data: { label: 'Language Model', sublabel: 'Gemini 4', borderClass: 'border-green-500/50', textClass: 'text-green-400', bgClass: 'bg-green-950/20' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', animated: true, style: { stroke: '#eab308', strokeWidth: 2 } },
];

const NODE_SHOP = [
  { label: 'Neural Brain', icon: Brain, meta: { sublabel: 'Core Agent logic', borderClass: 'border-pink-500/50', textClass: 'text-pink-400', bgClass: 'bg-pink-950/20' } },
  { label: 'API Gateway', icon: Server, meta: { sublabel: 'Handles incoming HTTP', borderClass: 'border-purple-500/50', textClass: 'text-purple-400', bgClass: 'bg-purple-950/20' } },
  { label: 'Vector Store', icon: Database, meta: { sublabel: 'pgvector / Pinecone', borderClass: 'border-blue-500/50', textClass: 'text-blue-400', bgClass: 'bg-blue-950/20' } },
  { label: 'Embeddings', icon: ArrowRightLeft, meta: { sublabel: 'Text to vector', borderClass: 'border-teal-500/50', textClass: 'text-teal-400', bgClass: 'bg-teal-950/20' } },
  { label: 'LLM Node', icon: Cpu, meta: { sublabel: 'Inference logic', borderClass: 'border-emerald-500/50', textClass: 'text-emerald-400', bgClass: 'bg-emerald-950/20' } },
  { label: 'Web Scraper', icon: Search, meta: { sublabel: 'Crawls and extracts', borderClass: 'border-sky-500/50', textClass: 'text-sky-400', bgClass: 'bg-sky-950/20' } },
  { label: 'Agent Memory', icon: MemoryStick, meta: { sublabel: 'Short/Long term state', borderClass: 'border-indigo-500/50', textClass: 'text-indigo-400', bgClass: 'bg-indigo-950/20' } },
  { label: 'Evaluator', icon: TestTube, meta: { sublabel: 'Scores outputs', borderClass: 'border-yellow-500/50', textClass: 'text-yellow-400', bgClass: 'bg-yellow-950/20' } },
  { label: 'Document Parser', icon: FileText, meta: { sublabel: 'PDF/Word to text', borderClass: 'border-orange-500/50', textClass: 'text-orange-400', bgClass: 'bg-orange-950/20' } },
  { label: 'Auth Check', icon: KeySquare, meta: { sublabel: 'Validates JWT tokens', borderClass: 'border-red-500/50', textClass: 'text-red-400', bgClass: 'bg-red-950/20' } },
  { label: 'User Screen', icon: MonitorPlay, meta: { sublabel: 'Frontend interface', borderClass: 'border-cyan-500/50', textClass: 'text-cyan-400', bgClass: 'bg-cyan-950/20' } },
  { label: 'Execution Router', icon: Waypoints, meta: { sublabel: 'Conditional branch', borderClass: 'border-orange-500/50', textClass: 'text-orange-400', bgClass: 'bg-orange-950/20' } },
  { label: 'Context Builder', icon: Component, meta: { sublabel: 'LangChain prompt builder', borderClass: 'border-pink-500/50', textClass: 'text-pink-400', bgClass: 'bg-pink-950/20' } },
  { label: 'Tool Caller', icon: Webhook, meta: { sublabel: 'Auto-executes tools', borderClass: 'border-fuchsia-500/50', textClass: 'text-fuchsia-400', bgClass: 'bg-fuchsia-950/20' } },
  { label: 'Generic Node', icon: Component, meta: { sublabel: 'Empty block', borderClass: 'border-stone-500/50', textClass: 'text-stone-400', bgClass: 'bg-[#1a1a1a]' } },
];

function FlowEditor({ onNodeClick }: { onNodeClick?: (node: any) => void }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, getNode } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedShopItem, setSelectedShopItem] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const showError = useCallback((msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 3000);
  }, []);

  const onConnect = useCallback((params: any) => {
    const sourceNode = getNode(params.source);
    const targetNode = getNode(params.target);

    if (!sourceNode || !targetNode) return;

    if (sourceNode.id === targetNode.id) {
       showError("Invalid connection: A node cannot connect to itself.");
       return;
    }

    // Example logic rule
    if (sourceNode.data.label === 'User Screen') {
       showError("Invalid connection: User Screen cannot have outgoing connections.");
       return;
    }

    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#444', strokeWidth: 2 } }, eds));
  }, [getNode, setEdges, showError]);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleActivateShopItem = (item: any) => {
    const newNode = {
      id: `${Date.now()}`,
      position: screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 }),
      type: 'custom',
      data: { 
        label: item.label, 
        ...item.meta 
      },
    };
    setNodes((nds) => nds.concat(newNode));
    const fileName = item.label.replace(/\s+/g, '') + '.ts';
    window.dispatchEvent(new CustomEvent('terax:add_node_file', { 
      detail: { name: fileName, lang: 'typescript' } 
    }));
    setSelectedShopItem(null);
  };


  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const dataString = event.dataTransfer.getData('application/reactflow');
      if (!dataString) return;
      
      const { label, meta } = JSON.parse(dataString);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type: 'custom',
        position,
        data: { label, ...meta },
      };

      setNodes((nds) => nds.concat(newNode));
      
      const fileName = label.replace(/\s+/g, '') + '.ts';
      window.dispatchEvent(new CustomEvent('terax:add_node_file', { 
        detail: { 
          name: fileName, 
          lang: 'typescript' 
        } 
      }));

    },
    [screenToFlowPosition, setNodes]
  );

  const onDragStart = (event: any, label: string, meta: any) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ label, meta }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleRunPipeline = () => {
    window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\r\n\x1b[1;36m>> INITIATING LANGGRAPH PIPELINE TRACE...\x1b[0m' }));
    setTimeout(() => window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[35m[trace]\x1b[0m -> Execution Router evaluated path (Node A -> Node B)' })), 400);
    setTimeout(() => window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[34m[trace]\x1b[0m -> Document Retrieval (Semantic Search across pgvector)... matched 4 context chunks' })), 1200);
    setTimeout(() => window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[33m[trace]\x1b[0m -> Prompt Constructor injecting retrieved contexts into prompt template' })), 1900);
    setTimeout(() => window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[32m[trace]\x1b[0m -> LLM invocation (Gemini 4)... streaming responses' })), 2800);
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('kernel:write', { detail: '\x1b[1;32m>> PIPELINE COMPLETE \x1b[0m \r\n\x1b[1;34m~/workspace\x1b[0m $ ' }));
    }, 4500);
  };

  return (
    <div className="flex h-full w-full relative">
      <div className="w-[85px] md:w-48 bg-[#181818] border-r border-[#333] flex flex-col z-20 shadow-xl shrink-0 relative">
        <div className="p-2 md:p-3 border-b border-[#333] bg-[#111] flex flex-col md:flex-row items-center justify-between gap-1 md:gap-0">
          <h2 className="text-[9px] md:text-[11px] font-bold text-stone-300 font-mono flex flex-col md:flex-row items-center gap-1 md:gap-2 tracking-wider text-center md:text-left leading-tight">
            <BoxSelect className="w-3.5 h-3.5 text-blue-500 hidden md:block" />
            <span className="md:hidden text-blue-500">LAYER<br/>SHOP</span>
            <span className="hidden md:inline">LAYER SHOP</span>
          </h2>
          <span className="hidden md:inline text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono border border-blue-500/30">
            500+
          </span>
        </div>
        <div className="p-1 md:p-2 flex flex-col gap-1.5 md:gap-2 overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent pb-16">
          {NODE_SHOP.map(nt => (
            <div
              key={nt.label}
              onDragStart={(e) => onDragStart(e, nt.label, nt.meta)}
              onClick={() => setSelectedShopItem(nt)}
              draggable
              className={`p-1.5 md:p-2.5 rounded border text-[9px] md:text-[10px] font-mono cursor-grab shadow-sm flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-1 md:gap-2 transition-all hover:brightness-125 active:scale-95 border-stone-800 bg-[#222] text-stone-300 hover:border-stone-600 ${selectedShopItem?.label === nt.label ? 'border-blue-500 bg-blue-500/10' : ''}`}
              title={nt.label}
            >
              <nt.icon className="w-4 h-4 md:shrink-0" />
              <div className="flex flex-col truncate w-full">
                <span className="font-bold truncate hidden md:block">{nt.label}</span>
                <span className="font-bold truncate md:hidden text-[8px] leading-tight mt-0.5" style={{wordBreak:'break-word', whiteSpace:'normal'}}>{nt.label}</span>
                <span className="text-[9px] text-stone-500 truncate hidden md:block">{nt.meta.sublabel}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-1 md:p-3 bg-gradient-to-t from-[#181818] via-[#181818] text-center md:text-left to-transparent border-t border-[#333]/50">
           <button 
             onClick={handleRunPipeline}
             className="w-full flex items-center justify-center gap-1 md:gap-2 px-1 py-2 md:px-3 text-[10px] md:text-xs font-mono font-bold rounded transition-all bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30"
           >
             <ActionNodeIcon className="w-3.5 h-3.5" />
             <span className="hidden md:inline">EXECUTE</span>
           </button>
        </div>
      </div>

      {selectedShopItem && (
        <div className="absolute top-4 left-[95px] md:left-52 w-64 bg-[#1a1a1a] border border-stone-800 rounded-lg shadow-2xl flex flex-col z-[100] overflow-hidden">
           <div className={`p-3 border-b border-stone-800 flex items-center justify-between ${selectedShopItem.meta.bgClass || 'bg-stone-900'}`}>
              <div className="flex items-center gap-2">
                 <selectedShopItem.icon className={`w-4 h-4 ${selectedShopItem.meta.textClass || 'text-stone-300'}`} />
                 <span className={`text-xs font-bold font-mono ${selectedShopItem.meta.textClass || 'text-stone-300'}`}>
                   {selectedShopItem.label}
                 </span>
              </div>
              <button 
                onClick={() => setSelectedShopItem(null)}
                className="text-stone-500 hover:text-stone-300 p-1 rounded transition-colors bg-black/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>
           
           <div className="p-4 space-y-3">
              <p className="text-[10px] text-stone-400 font-mono mb-2">
                {selectedShopItem.meta.sublabel}
              </p>
              
              <div className="bg-[#111] p-2 rounded border border-stone-800 flex items-center gap-2">
                 <div className="flex-1 flex flex-col">
                    <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">Node Runtime</span>
                    <span className="text-[10px] text-stone-300 font-mono mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">src/pipeline/{selectedShopItem.label.replace(/\s+/g, '')}.ts</span>
                 </div>
              </div>
              
              <button 
                 onClick={() => handleActivateShopItem(selectedShopItem)}
                 className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-bold rounded border border-blue-500/30 transition-colors uppercase tracking-wider"
              >
                 ACTIVATE ON SURFACE
              </button>
           </div>
        </div>
      )}

      {errorMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-950/90 border border-red-500/50 text-red-200 px-4 py-2 rounded shadow-xl z-[100] font-mono text-xs animate-in slide-in-from-top-4 fade-in">
          {errorMsg}
        </div>
      )}

      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            setSelectedNode(node);
            onNodeClick?.(node);
          }}
          onPaneClick={() => setSelectedNode(null)}
          fitView
          colorMode="dark"
        >
          <Background gap={16} size={1} color="#333" />
          <Controls className="!bg-[#1e1e1e] !border-stone-700 !text-white fill-white" />
        </ReactFlow>
        
        {/* Node Properties Panel Overlay */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bottom-4 w-72 bg-[#1a1a1a] border border-stone-800 rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden translate-x-0 transition-transform">
            <div className={`p-3 border-b border-stone-800 flex items-center justify-between ${selectedNode.data.bgClass || 'bg-stone-900'}`}>
              <div className="flex flex-col">
                 <span className={`text-xs font-bold font-mono ${selectedNode.data.textClass || 'text-stone-300'}`}>
                   {selectedNode.data.label}
                 </span>
                 <span className="text-[10px] text-stone-500 font-mono mt-0.5">{selectedNode.id}</span>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-stone-500 hover:text-stone-300 p-1 rounded transition-colors bg-black/20"
              >
                <Database className="w-3.5 h-3.5 opacity-0 absolute" /> {/* placeholder for spacing */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 custom-scrollbar space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">Pipeline Role</label>
                  <p className="text-xs text-stone-300 bg-stone-900 border border-stone-800 p-2 rounded">
                    {selectedNode.data.sublabel || 'Component Node'}
                  </p>
               </div>

               <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">Binding Config</label>
                  <div className="space-y-2">
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-stone-400">Model Provider</span>
                        <select className="bg-[#111] border border-stone-800 text-stone-300 text-xs p-1.5 rounded focus:outline-none focus:border-stone-600">
                           <option>System Default</option>
                           <option>Gemini 4</option>
                           <option>Local (Llama-3)</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-1 mt-2">
                        <span className="text-[10px] text-stone-400">Timeout (ms)</span>
                        <input type="number" defaultValue={30000} className="bg-[#111] border border-stone-800 text-stone-300 text-xs p-1.5 rounded focus:outline-none focus:border-stone-600 font-mono" />
                     </div>
                  </div>
               </div>

               <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">Input Schema</label>
                  <div className="bg-[#111] border border-stone-800 rounded p-2 text-[10px] font-mono text-emerald-400/80">
<pre>{`{
  "query": "string",
  "context": "string[]"
}`}</pre>
                  </div>
               </div>

               <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">System Parameters</label>
                  <textarea 
                     className="w-full bg-[#111] border border-stone-800 rounded p-2 text-xs font-mono text-stone-300 focus:outline-none focus:border-stone-600 h-24 custom-scrollbar resize-none"
                     defaultValue="Extract intent and format response."
                     placeholder="Enter contextual overrides..."
                  />
               </div>
            </div>
            
            <div className="p-3 border-t border-stone-800 bg-[#111] flex gap-2">
               <button className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-bold rounded border border-blue-500/30 transition-colors">
                  Save Changes
               </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 z-10 space-y-4 shadow-xl hidden md:block">
          <LayerToggleMatrix />
        </div>
      </div>
      <NodeConnector />
    </div>
  );
}

export function CanvasGrid(props: { onNodeClick?: (node: any) => void }) {
  return (
    <ReactFlowProvider>
      <FlowEditor {...props} />
    </ReactFlowProvider>
  );
}
