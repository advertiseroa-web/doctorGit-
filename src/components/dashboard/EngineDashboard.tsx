import { useState, useEffect, useRef } from 'react';
import { Activity, ShieldAlert, FileSearch, ShieldCheck, Database, Network, PowerOff, Shield, RotateCcw, PauseCircle, HeartPulse, Brain } from 'lucide-react';
import { globalEngine, LogEntry, WikiNode as EngineWikiNode } from '../../engine/AgentEngine';

interface WikiNode extends EngineWikiNode {
  agent: string;
  type: 'info' | 'warning' | 'critical';
}

export function EngineDashboard({ onClose }: { onClose?: () => void }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [wikiNodes, setWikiNodes] = useState<WikiNode[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [emergencyStop, setEmergencyStop] = useState(false);
  const [shieldMode, setShieldMode] = useState(false);
  const [neuralPaused, setNeuralPaused] = useState(false);
  const [heartbeat, setHeartbeat] = useState(true);
  const [cpuStats, setCpuStats] = useState('0.0');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Heartbeat & Neural OS wiring
  useEffect(() => {
    // Start global engine if it's not booted yet
    globalEngine.boot();

    const handleLog = (log: LogEntry) => {
      setLogs(prev => [...prev, log]);
    };

    const handleWikiUpdate = (nodes: EngineWikiNode[]) => {
      // Map global engine nodes to UI nodes
      const formattedNodes: WikiNode[] = nodes.map(n => ({
        ...n,
        agent: n.tag.includes('Passwd') ? 'Forensic-X' : 'Network-Watcher',
        type: 'critical'
      })).reverse();
      setWikiNodes(formattedNodes);
    };

    const handleHeartbeat = (status: { cpu: string; status: string }) => {
      setHeartbeat(h => !h);
      setCpuStats(status.cpu);
    };

    const handleStatusUpdate = (status: { locked?: boolean }) => {
      if (status.locked) {
        setEmergencyStop(true);
        setSimulating(false);
      }
    };

    globalEngine.on('log', handleLog);
    globalEngine.on('wikiUpdate', handleWikiUpdate);
    globalEngine.on('heartbeat', handleHeartbeat);
    globalEngine.on('statusUpdate', handleStatusUpdate);

    return () => {
      globalEngine.removeListener('log', handleLog);
      globalEngine.removeListener('wikiUpdate', handleWikiUpdate);
      globalEngine.removeListener('heartbeat', handleHeartbeat);
      globalEngine.removeListener('statusUpdate', handleStatusUpdate);
    };
  }, []);

  const runLiveFireTest = async () => {
    if (simulating || emergencyStop || neuralPaused) return;
    setSimulating(true);
    setLogs([]);
    setWikiNodes([]);

    await globalEngine.runForensic('SUSPICIOUS_PAYLOAD_X99');
    
    // Safety check fallback
    setTimeout(() => {
       setSimulating(false);
    }, 4000);
  };

  const triggerEmergencyStop = () => {
    globalEngine.triggerEmergencyBrake('Manual Dashboard Override');
  };

  const handleRewind = () => {
    globalEngine.rewindWiki();
  };

  const toggleShield = () => {
    const newState = !shieldMode;
    setShieldMode(newState);
    globalEngine.toggleShieldMode(newState);
  };

  const toggleNeural = () => {
    const newState = !neuralPaused;
    setNeuralPaused(newState);
    globalEngine.toggleNeuralFlow(newState);
  };

  return (
    <div className="flex flex-col h-full bg-[#111] text-stone-200 border-l border-[#333]">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between px-4 py-3 border-b border-[#333] bg-[#181818] gap-3">
        <div className="flex items-center justify-between w-full xl:w-auto gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="font-mono text-xs sm:text-sm font-bold tracking-wider truncate">DOCTORGIT WORKSPACE</h2>
          </div>
          
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0
            ${emergencyStop ? 'bg-red-900/30 text-red-500' : 
              neuralPaused ? 'bg-amber-900/30 text-amber-500' : 
              'bg-emerald-900/30 text-emerald-500'}`}>
            <HeartPulse className={`w-3.5 h-3.5 ${heartbeat ? 'opacity-100' : 'opacity-40'} transition-opacity duration-300`} />
            <span className="hidden sm:inline">{emergencyStop ? 'SYSTEM LOCKED' : neuralPaused ? 'NEURAL PAUSED' : `HEARTBEAT OK [${cpuStats}% CPU]`}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          {/* Manual Overrides */}
          <div className="flex items-center gap-1 md:mr-4 border-r border-[#333] pr-4">
            <button
               onClick={toggleShield}
               className={`p-1.5 rounded transition-colors title="Shield Mode" ${shieldMode ? 'bg-blue-900/30 text-blue-400 border border-blue-900/50' : 'text-stone-400 hover:text-stone-200 hover:bg-[#333]'}`}
               title="SHIELD MODE: Lock Wiki Folders"
            >
               <Shield className="w-4 h-4" />
            </button>
            <button
               onClick={toggleNeural}
               disabled={emergencyStop}
               className={`p-1.5 rounded transition-colors title="Pause Neural Flow" ${neuralPaused ? 'bg-amber-900/30 text-amber-400 border border-amber-900/50' : 'text-stone-400 hover:text-stone-200 hover:bg-[#333]'}`}
               title="PAUSE NEURAL FLOW"
            >
               <PauseCircle className="w-4 h-4" />
            </button>
            <button
               onClick={handleRewind}
               disabled={simulating || emergencyStop}
               className="p-1.5 rounded transition-colors text-stone-400 hover:text-stone-200 hover:bg-[#333]"
               title="REWIND WIKI"
            >
               <RotateCcw className="w-4 h-4" />
            </button>
            <button
               onClick={triggerEmergencyStop}
               disabled={emergencyStop}
               className="flex items-center gap-1 px-2 py-1 ml-1 rounded transition-colors bg-red-900/30 text-red-500 border border-red-900/50 hover:bg-red-900/50"
               title="EMERGENCY STOP"
            >
               <PowerOff className="w-3.5 h-3.5" />
               <span className="text-[10px] font-bold">KILL</span>
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button 
              onClick={runLiveFireTest}
              disabled={simulating || emergencyStop || neuralPaused}
              className={`px-3 py-1.5 font-mono text-[10px] sm:text-xs font-bold rounded flex items-center gap-2 transition-colors shrink-0 ${(simulating || emergencyStop || neuralPaused) ? 'bg-[#333] text-stone-500 cursor-not-allowed' : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-[#444]'}`}
            >
              <ShieldAlert className="w-4 h-4" />
              {simulating ? 'TEST RUNNING...' : <span className="hidden sm:inline">RUN FORENSIC SIMULATION</span>}
              {!simulating && <span className="sm:hidden">RUN TEST</span>}
            </button>
            {onClose && (
              <button onClick={onClose} className="p-1 hover:bg-[#333] rounded text-stone-400 shrink-0">
                &times;
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Logs Panel */}
        <div className="w-full md:w-2/3 flex flex-col h-3/5 md:h-full border-b md:border-b-0 md:border-r border-[#333]">
          <div className="px-4 py-2 border-b border-[#333] bg-[#151515] text-[10px] sm:text-xs font-mono text-stone-400 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            LIVE TELEMETRY STREAM
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] sm:text-xs">
            {logs.length === 0 && (
              <div className="text-stone-500 italic">No active simulations. Awaiting master command...</div>
            )}
            {logs.map(log => (
              <div key={log.id} className="flex flex-col sm:flex-row sm:gap-3">
                <div className="text-stone-500 shrink-0 w-auto sm:w-[80px] mb-1 sm:mb-0 opacity-70 sm:opacity-100">{log.timestamp}</div>
                <div className={`shrink-0 w-auto sm:w-[130px] font-bold flex items-center gap-1.5 mb-0.5 sm:mb-0
                  ${log.source === 'Master' ? 'text-purple-400' : ''}
                  ${log.source === 'Forensic-X' ? 'text-blue-400' : ''}
                  ${log.source === 'Network-Watcher' ? 'text-amber-400' : ''}
                  ${log.source === 'Antigravity' ? 'text-emerald-400' : ''}
                `}>
                  {[ 'Forensic-X' ].includes(log.source) && <FileSearch className="w-3 h-3" />}
                  {[ 'Network-Watcher' ].includes(log.source) && <Network className="w-3 h-3" />}
                  {[ 'Master' ].includes(log.source) && <ShieldCheck className="w-3 h-3" />}
                  {[ 'Antigravity' ].includes(log.source) && <Database className="w-3 h-3" />}
                  [{log.source.toUpperCase()}]
                </div>
                <div className={`flex-1 break-words
                  ${log.type === 'alert' ? 'text-red-400' : ''}
                  ${log.type === 'success' ? 'text-emerald-400' : ''}
                  ${log.type === 'action' ? 'text-stone-300' : 'text-stone-400'}
                `}>
                  {log.message}
                </div>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Wiki Graph & Learning Panel */}
        <div className="w-full md:w-1/3 flex flex-col h-2/5 md:h-full bg-[#131313]">
          <div className="px-4 py-2 border-b border-[#333] bg-[#151515] text-xs font-mono text-stone-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5" />
              DYNAMIC WIKI VAULT
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 bg-emerald-900/20 px-1.5 py-0.5 rounded">
              <Brain className="w-3 h-3" />
              COLLECTIVE ENGINE
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 relative">
            <div className="absolute left-[31px] top-6 bottom-4 w-px bg-[#333] pointer-events-none" />
            {wikiNodes.length === 0 && (
              <div className="text-stone-500 font-mono text-xs italic">Vault is synced. No new nodes generated.</div>
            )}
            {wikiNodes.map(node => (
              <div key={node.id} className="relative z-10 flex gap-4">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 bg-[#111]
                  ${node.type === 'critical' ? 'border-red-500 text-red-500' : 'border-emerald-500 text-emerald-500'}
                `}>
                  <Database className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-[#1a1a1a] border border-[#333] rounded p-2.5 shadow-sm">
                  <div className="text-xs font-mono font-bold text-stone-300 mb-1">{node.tag}</div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-stone-500">
                    <span>Generated by: {node.agent}</span>
                    <span>{node.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
