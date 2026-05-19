import React, { useState, useEffect } from 'react';
import { Database, Terminal, Key, HardDrive, Zap, Cpu, Search, Plus, Trash2, X, RefreshCw, Layers, Code, Play, Activity, Menu, Box, Lock, BookOpen } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

export default function AppBaseDashboard() {
  const [activeTab, setActiveTab] = useState<'tables' | 'api' | 'sql' | 'storage' | 'functions' | 'ai' | 'ai-code' | 'telemetry' | 'containers' | 'secrets' | 'notebooks'>('tables');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tables, setTables] = useState<any[]>([]);
  const [activeTable, setActiveTable] = useState<string>('users');
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableSchema, setTableSchema] = useState<any[]>([]);
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM users LIMIT 10;');
  const [sqlResult, setSqlResult] = useState<any>(null);

  // Telemetry Stream State
  const [telemetryLogs, setTelemetryLogs] = useState<any[]>([]);

  useEffect(() => {
    // Connect to WebSocket Telemetry
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // When running in Dev server, port 3000 is for ws as well
    const wsUrl = `${protocol}//${window.location.host}/_telemetry`;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
       try {
           const log = JSON.parse(event.data);
           setTelemetryLogs(prev => [log, ...prev].slice(0, 100)); // Keep last 100 logs
       } catch(e) {}
    };
    
    return () => ws.close();
  }, []);

  // Code Generation State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiCustomKey, setAiCustomKey] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('// Generated code will appear here');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');
  
  const generateCode = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError('');
    try {
      const res = await fetch('/api/admin/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, customApiKey: aiCustomKey })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGeneratedCode(data.code);
    } catch (e: any) {
      setAiError(e.message);
    } finally {
      setIsGenerating(false);
    }
  };
  
  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (activeTable && activeTab === 'tables') {
      fetchTableSchema(activeTable);
      fetchTableData(activeTable);
    }
  }, [activeTable, activeTab]);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/admin/tables');
      const data = await res.json();
      if (data.tables) setTables(data.tables);
    } catch (e) { console.error(e); }
  };

  const fetchTableSchema = async (name: string) => {
    try {
      const res = await fetch(`/api/admin/tables/${name}/schema`);
      const data = await res.json();
      if (data.schema) setTableSchema(data.schema);
    } catch (e) { console.error(e); }
  };

  const fetchTableData = async (name: string) => {
    try {
      const res = await fetch(`/api/admin/sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `SELECT * FROM ${name} LIMIT 100` })
      });
      const data = await res.json();
      if (data.rows) setTableData(data.rows);
    } catch (e) { console.error(e); }
  };

  const executeSql = async () => {
    try {
      const res = await fetch(`/api/admin/sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery })
      });
      const data = await res.json();
      setSqlResult(data);
    } catch (e: any) { 
        setSqlResult({ error: e.message }); 
    }
  };

  return (
    <div className="w-screen h-[100dvh] bg-zinc-950 text-zinc-300 font-sans flex flex-col pt-0">
      {/* Top Navbar */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 shrink-0 z-30 relative">
        <div className="flex items-center gap-2">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden mr-2 p-1 text-zinc-400 hover:text-white rounded bg-zinc-900 border border-zinc-800">
               <Menu className="w-5 h-5" />
            </button>
            <Layers className="w-5 h-5 text-emerald-500 hidden md:block" />
            <span className="font-bold text-white tracking-wide">AppBase <span className="text-emerald-500">Studio</span></span>
        </div>
        
        <div className="ml-4 md:ml-8 flex-1 max-w-md hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 focus-within:border-emerald-500/50 transition-colors">
           <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
           <input type="text" placeholder="Search database tables, functions, or logs..." className="bg-transparent border-none outline-none text-sm w-full text-zinc-200 placeholder-zinc-600" />
        </div>
        
        {/* Mobile Search Toggle */}
        <div className="ml-auto flex items-center gap-2 md:gap-4">
            <button 
                onClick={() => {
                    const search = prompt('Enter search query for DB tables or logs:');
                    if (search) alert(`Search for "${search}" initiated via Engine Query Resolver.`);
                }}
                className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded bg-zinc-900 border border-zinc-800"
            >
               <Search className="w-4 h-4" />
            </button>
            <button onClick={() => window.history.back()} className="text-zinc-400 hover:text-white px-2 py-1.5 md:px-3 text-xs md:text-sm rounded bg-zinc-900 border border-zinc-800 transition-colors whitespace-nowrap">
                Exit Dashboard
            </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        {isSidebarOpen && (
           <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 absolute md:static top-0 left-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0 overflow-y-auto custom-scrollbar z-30 transition-transform duration-200 ease-in-out`}>
          <div className="p-4 flex flex-col gap-1">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-2">Project Overview</div>
            
            <button onClick={() => setActiveTab('tables')} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'tables' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}>
               <Database className="w-4 h-4" /> Table Editor
            </button>
            <button onClick={() => setActiveTab('sql')} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'sql' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}>
               <Terminal className="w-4 h-4" /> SQL Editor
            </button>
            <button onClick={() => setActiveTab('api')} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'api' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}>
               <Key className="w-4 h-4" /> API Settings
            </button>

            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-6">Infrastructure</div>
            
            <button onClick={() => setActiveTab('containers')} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'containers' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}>
               <Box className="w-4 h-4" /> Containers
            </button>
            <button onClick={() => setActiveTab('secrets')} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'secrets' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}>
               <Lock className="w-4 h-4" /> Secrets
            </button>
            <button onClick={() => setActiveTab('storage')} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'storage' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}>
               <HardDrive className="w-4 h-4" /> Storage
            </button>
            <button onClick={() => setActiveTab('notebooks')} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'notebooks' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}>
               <BookOpen className="w-4 h-4" /> Notebooks
            </button>
            <button onClick={() => setActiveTab('functions')} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'functions' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}>
               <Zap className="w-4 h-4" /> Edge Functions
            </button>

            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-6">AI Agents</div>
            
            <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'ai' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}>
               <Cpu className="w-4 h-4" /> Autonomous Executions
            </button>
            <button onClick={() => setActiveTab('ai-code')} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'ai-code' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}>
               <Code className="w-4 h-4" /> AI Code Generation
            </button>
            <button onClick={() => setActiveTab('telemetry')} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'telemetry' ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'}`}>
               <Activity className="w-4 h-4" /> Telemetry Stream
            </button>

            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-6 flex items-center justify-between">
                DATABASE TABLES
                <button className="hover:text-emerald-400"><Plus className="w-3.5 h-3.5"/></button>
            </div>
            <div className="flex flex-col gap-0.5">
                {tables.map(t => (
                    <button 
                       key={t.name}
                       onClick={() => { setActiveTab('tables'); setActiveTable(t.name); }}
                       className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-all ${activeTable === t.name && activeTab === 'tables' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}
                    >
                       <Database className="w-3.5 h-3.5 opacity-50" /> {t.name}
                    </button>
                ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-zinc-950 overflow-y-auto relative flex flex-col min-w-0">
          
          {activeTab === 'tables' && (
            <div className="flex-1 flex flex-col relative h-full">
               <div className="h-12 border-b border-zinc-800 flex items-center px-4 justify-between bg-zinc-900/50">
                  <div className="font-mono text-sm font-bold">{activeTable}</div>
                  <div className="flex gap-2">
                     <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Insert row</button>
                  </div>
               </div>
               <div className="flex-1 overflow-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-max">
                     <thead className="bg-zinc-900/80 sticky top-0 backdrop-blur-md z-10 font-mono text-[11px] text-zinc-400">
                        <tr>
                          {tableSchema.map(col => (
                              <th key={col.name} className="py-2.5 px-4 font-normal border-b border-zinc-800 border-r border-zinc-800/50 truncate max-w-[200px]">
                                {col.name} <span className="opacity-50 ml-1">{col.type}</span>
                              </th>
                          ))}
                        </tr>
                     </thead>
                     <tbody className="text-xs font-mono text-zinc-300">
                        {tableData.length === 0 ? (
                            <tr><td colSpan={tableSchema.length} className="py-8 text-center text-zinc-600">This table is empty</td></tr>
                        ) : (
                            tableData.map((row, i) => (
                                <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-900/40">
                                   {tableSchema.map(col => (
                                      <td key={col.name} className="py-2 px-4 border-r border-zinc-800/50 truncate max-w-[250px] whitespace-nowrap overflow-hidden">
                                         {row[col.name] !== null ? String(row[col.name]) : <span className="text-zinc-600 italic">NULL</span>}
                                      </td>
                                   ))}
                                </tr>
                            ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="flex-1 flex flex-col p-4 gap-4 h-full">
                <div className="flex flex-col gap-2 h-1/3">
                   <div className="flex justify-between items-center">
                       <h2 className="text-xl font-bold">SQL Editor</h2>
                       <button onClick={executeSql} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-md text-sm transition-colors active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                          <Zap className="w-4 h-4" /> Run Query
                       </button>
                   </div>
                   <textarea 
                     className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-300 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none resize-none custom-scrollbar"
                     value={sqlQuery}
                     onChange={(e) => setSqlQuery(e.target.value)}
                     placeholder="SELECT * FROM users;"
                   />
                </div>
                <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
                   <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 text-xs font-mono text-zinc-400 flex items-center justify-between">
                       RESULTS
                   </div>
                   <div className="flex-1 overflow-auto custom-scrollbar p-0">
                      {sqlResult?.error ? (
                          <div className="text-red-400 font-mono text-sm p-4 bg-red-950/20">{sqlResult.error}</div>
                      ) : sqlResult?.rows && sqlResult.rows.length > 0 ? (
                          <table className="w-full text-left border-collapse">
                             <thead className="bg-zinc-950 sticky top-0 font-mono text-[11px] text-zinc-500">
                                <tr>
                                  {Object.keys(sqlResult.rows[0]).map(key => (
                                      <th key={key} className="py-2.5 px-4 font-normal border-b border-zinc-800">{key}</th>
                                  ))}
                                </tr>
                             </thead>
                             <tbody className="text-xs font-mono text-zinc-300">
                                {sqlResult.rows.map((row: any, i: number) => (
                                    <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/40">
                                       {Object.values(row).map((val: any, j: number) => (
                                          <td key={j} className="py-2 px-4 whitespace-nowrap">{String(val)}</td>
                                       ))}
                                    </tr>
                                ))}
                             </tbody>
                          </table>
                      ) : sqlResult?.result ? (
                          <div className="p-4 text-emerald-400 font-mono text-sm">Query executed successfully. Rows modified: {sqlResult.result.changes}</div>
                      ) : (
                          <div className="p-4 text-zinc-600 text-sm">Run a query to see results.</div>
                      )}
                   </div>
                </div>
            </div>
          )}

          {activeTab === 'api' && (
             <div className="p-8 max-w-4xl max-h-full overflow-y-auto">
                 <h2 className="text-2xl font-bold mb-6">Project API Keys</h2>
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-8">
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                        <span className="font-medium text-sm">Active Secret Keys</span>
                        <button className="flex items-center gap-2 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-md text-sm transition-colors"><Plus className="w-4 h-4"/> Generate new key</button>
                    </div>
                    <table className="w-full text-left">
                       <thead className="bg-zinc-950 text-[11px] text-zinc-500 font-mono">
                          <tr><th className="p-4 font-normal">NAME</th><th className="p-4 font-normal">TOKEN</th></tr>
                       </thead>
                       <tbody className="text-sm">
                          <tr className="border-t border-zinc-800">
                            <td className="p-4 flex items-center gap-3"><Key className="w-4 h-4 text-emerald-500"/> service_role</td>
                            <td className="p-4 font-mono text-emerald-400 truncate max-w-[200px]">ab-66vpxpqkzd7u8mctuy1r</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>

                 <h3 className="text-lg font-bold mb-4">Connecting to your database</h3>
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="bg-zinc-950 px-4 py-3 flex gap-2 border-b border-zinc-800">
                       <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                       <span className="ml-4 font-mono text-[11px] text-zinc-500">REST API Request</span>
                    </div>
                    <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-zinc-300">
<pre><code><span className="text-zinc-500">// Example code to fetch data from a table</span>
<span className="text-pink-400">const</span> response = <span className="text-blue-400">await</span> fetch(<span className="text-yellow-300">`https://appbase.local/api/v1/users`</span>, {'{'}
  headers: {'{'}
    <span className="text-yellow-300">'Authorization'</span>: <span className="text-emerald-400">'Bearer ab-66vpxpqkzd7u8mctuy1r'</span>
  {'}'}
{'}'});

<span className="text-pink-400">const</span> data = <span className="text-blue-400">await</span> response.json();
console.log(data);</code></pre>
                    </div>
                 </div>
             </div>
          )}

          {activeTab === 'storage' && (
              <div className="p-8 max-w-4xl max-h-full overflow-y-auto">
                 <h2 className="text-3xl font-bold mb-2">Storage</h2>
                 <p className="text-zinc-400 text-sm mb-6 max-w-xs">Persist and communicate data created or processed by your Apps.</p>
                 
                 <div className="flex items-center gap-2 mb-6 text-sm overflow-x-auto">
                     <button className="flex items-center gap-2 bg-zinc-800 border-b-2 border-emerald-500 text-white px-4 py-2 hover:bg-zinc-700 whitespace-nowrap">
                        <HardDrive className="w-4 h-4 text-emerald-500" /> Volumes <span className="bg-zinc-900 rounded px-1.5 py-0.5 text-[10px]">0</span>
                     </button>
                     <button className="flex items-center gap-2 text-zinc-400 px-4 py-2 hover:bg-zinc-800 hover:text-white whitespace-nowrap">
                        <Layers className="w-4 h-4" /> Queues <span className="bg-zinc-900 rounded px-1.5 py-0.5 text-[10px]">0</span>
                     </button>
                     <button className="flex items-center gap-2 text-zinc-400 px-4 py-2 hover:bg-zinc-800 hover:text-white whitespace-nowrap">
                        <Database className="w-4 h-4" /> Dicts <span className="bg-zinc-900 rounded px-1.5 py-0.5 text-[10px]">1</span>
                     </button>
                 </div>
                 
                 <p className="text-zinc-300 text-sm mb-4">Total volumes in the environment: 0 B. Volume size refreshes once per day.</p>

                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-12">
                     <table className="w-full text-left">
                       <thead className="bg-zinc-950 text-[11px] text-zinc-500 font-mono tracking-wider">
                          <tr><th className="p-4 font-normal">NAME</th><th className="p-4 font-normal">CREATED</th><th className="p-4 font-normal">SIZE</th></tr>
                       </thead>
                       <tbody className="text-sm border-t border-zinc-800">
                           <tr>
                               <td colSpan={3} className="p-8 text-center text-zinc-400">Once you create a Volume, it will appear here.</td>
                           </tr>
                       </tbody>
                     </table>
                 </div>

                 <h3 className="text-xl font-bold mb-4 border-t border-zinc-800 pt-8">External Storage Connections</h3>
                 <p className="text-zinc-400 text-sm mb-6">Connect to third-party storage providers for importing and exporting data.</p>
                 
                 <div className="flex flex-wrap gap-4 text-sm font-semibold pb-8">
                    <button className="bg-zinc-900/50 border border-zinc-800 flex items-center justify-between w-64 rounded-full pr-1.5 pl-4 py-1.5 hover:bg-zinc-900 transition-colors">
                        FTP/FTPS/SFTP <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"><Layers className="w-4 h-4"/></span>
                    </button>
                    <button className="bg-zinc-900/50 border border-zinc-800 flex items-center justify-between w-64 rounded-full pr-1.5 pl-4 py-1.5 hover:bg-zinc-900 transition-colors">
                        WebDAV <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg"><Activity className="w-4 h-4"/></span>
                    </button>
                    <button className="bg-zinc-900/50 border border-zinc-800 flex items-center justify-between w-64 rounded-full pr-1.5 pl-4 py-1.5 hover:bg-zinc-900 transition-colors">
                        Dropbox <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"><Box className="w-4 h-4"/></span>
                    </button>
                    <button className="bg-zinc-900/50 border border-zinc-800 flex items-center justify-between w-64 rounded-full pr-1.5 pl-4 py-1.5 hover:bg-zinc-900 transition-colors">
                        Google Drive <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"><Database className="w-4 h-4"/></span>
                    </button>
                    <button className="bg-zinc-900/50 border border-zinc-800 flex items-center justify-between w-64 rounded-full pr-1.5 pl-4 py-1.5 hover:bg-zinc-900 transition-colors">
                        OneDrive <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg"><HardDrive className="w-4 h-4"/></span>
                    </button>
                    <button className="bg-zinc-900/50 border border-zinc-800 flex items-center justify-between w-64 rounded-full pr-1.5 pl-4 py-1.5 hover:bg-zinc-900 transition-colors">
                        GitHub <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg"><Code className="w-4 h-4"/></span>
                    </button>
                    <button className="bg-zinc-900/50 border border-zinc-800 flex items-center justify-between w-64 rounded-full pr-1.5 pl-4 py-1.5 hover:bg-zinc-900 transition-colors">
                        GitLab <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg"><Terminal className="w-4 h-4"/></span>
                    </button>
                 </div>
              </div>
          )}

          {activeTab === 'containers' && (
              <div className="p-8 max-w-4xl">
                 <h2 className="text-3xl font-bold mb-4 flex items-center justify-between">
                     Containers
                 </h2>
                 <p className="text-zinc-400 text-sm mb-6 max-w-xs leading-relaxed">There are 0 containers running in environment main.</p>
                 
                 <div className="flex gap-2 mb-6">
                    <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full text-sm">
                       <Box className="w-4 h-4 text-emerald-500" /> All <span className="bg-zinc-900/80 border border-zinc-700 px-1.5 py-0.5 rounded text-[10px]">0</span>
                    </button>
                    <button className="flex items-center gap-2 hover:bg-zinc-800 text-zinc-400 px-3 py-1.5 rounded-full text-sm">
                       <Zap className="w-4 h-4" /> Functions <span className="bg-zinc-900/80 border border-zinc-700 px-1.5 py-0.5 rounded text-[10px]">0</span>
                    </button>
                    <button className="flex items-center gap-2 hover:bg-zinc-800 text-zinc-400 px-3 py-1.5 rounded-full text-sm">
                       <Box className="w-4 h-4" /> Sandboxes <span className="bg-zinc-900/80 border border-zinc-700 px-1.5 py-0.5 rounded text-[10px]">0</span>
                    </button>
                 </div>

                 <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-12 text-center flex flex-col items-center shadow-inner">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                        <Box className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No containers found</h3>
                    <p className="text-zinc-500">No running containers match the current filters.</p>
                 </div>
              </div>
          )}

          {activeTab === 'secrets' && (
              <div className="p-8 max-w-4xl max-h-full overflow-y-auto">
                 <h2 className="text-3xl font-bold mb-2">Choose type</h2>
                 <p className="text-zinc-400 text-sm mb-6">Select from our prebuilt library of integration templates, or create a custom secret.</p>
                 
                 <div className="flex flex-col gap-3 pb-12">
                     <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 flex gap-4 items-start hover:border-emerald-500/30 transition-colors cursor-pointer group">
                         <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/30 transition-colors"><Key className="w-5 h-5 text-emerald-500" /></div>
                         <div>
                             <h4 className="font-bold text-white mb-1">Custom</h4>
                             <p className="text-sm text-zinc-400">Custom environment variables for your engine functions</p>
                         </div>
                     </div>
                     <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 flex gap-4 items-start hover:border-emerald-500/30 transition-colors cursor-pointer group">
                         <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 group-hover:bg-green-500/30 transition-colors"><Layers className="w-5 h-5 text-green-500" /></div>
                         <div>
                             <h4 className="font-bold text-white mb-1">Copy from another environment</h4>
                             <p className="text-sm text-zinc-400">Copy a secret you've already created in another environment</p>
                         </div>
                     </div>
                     <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 flex gap-4 items-start hover:border-emerald-500/30 transition-colors cursor-pointer">
                         <div className="w-10 h-10 rounded text-amber-500 bg-amber-950 flex items-center justify-center shrink-0 font-bold">AI</div>
                         <div>
                             <h4 className="font-bold text-white mb-1">Anthropic</h4>
                             <p className="text-sm text-zinc-400">Access Anthropic's powerful language and multimodal models</p>
                         </div>
                     </div>
                     <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 flex gap-4 items-start hover:border-emerald-500/30 transition-colors cursor-pointer">
                         <div className="w-10 h-10 rounded text-amber-500 bg-amber-950 flex items-center justify-center shrink-0 font-bold">AWS</div>
                         <div>
                             <h4 className="font-bold text-white mb-1">AWS</h4>
                             <p className="text-sm text-zinc-400">Access your existing resources in AWS, such as S3 buckets</p>
                         </div>
                     </div>
                     <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 flex gap-4 items-start hover:border-emerald-500/30 transition-colors cursor-pointer">
                         <div className="w-10 h-10 rounded text-indigo-400 bg-indigo-950 flex items-center justify-center shrink-0 font-bold">DC</div>
                         <div>
                             <h4 className="font-bold text-white mb-1">Discord</h4>
                             <p className="text-sm text-zinc-400">Receive interactions and send messages using Discord</p>
                         </div>
                     </div>
                     <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 flex gap-4 items-start hover:border-emerald-500/30 transition-colors cursor-pointer">
                         <div className="w-10 h-10 rounded bg-white text-black flex items-center justify-center shrink-0"><Code className="w-5 h-5"/></div>
                         <div>
                             <h4 className="font-bold text-white mb-1">GitHub</h4>
                             <p className="text-sm text-zinc-400">Access the GitHub API or private Git repositories</p>
                         </div>
                     </div>
                     <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 flex gap-4 items-start hover:border-emerald-500/30 transition-colors cursor-pointer">
                         <div className="w-10 h-10 rounded text-blue-500 bg-blue-950 flex items-center justify-center shrink-0 font-bold">GC</div>
                         <div>
                             <h4 className="font-bold text-white mb-1">Google Cloud</h4>
                             <p className="text-sm text-zinc-400">Use Google Cloud products like BigQuery and Cloud Storage</p>
                         </div>
                     </div>
                 </div>
              </div>
          )}

          {activeTab === 'notebooks' && (
              <div className="p-8 max-w-4xl max-h-full overflow-y-auto">
                 <div className="flex items-center gap-4 mb-4">
                     <h2 className="text-3xl font-bold flex items-center gap-3"><BookOpen className="w-8 h-8 text-emerald-500" /> Notebooks</h2>
                 </div>
                 
                 <div className="flex gap-4 mb-8">
                     <button className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-4 py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                        <HardDrive className="w-4 h-4 text-emerald-500" /> Import notebook
                     </button>
                     <button className="flex-1 bg-zinc-900/50 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/20 px-4 py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Create notebook
                     </button>
                 </div>

                 <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-2xl">
                     High-performance notebooks, backed by Engine's GPU cloud. Launch in seconds. Use custom images, collaborate in real time, and attach petabyte-scale storage.
                 </p>

                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 mb-8 text-center flex flex-col items-center">
                    <h3 className="text-2xl font-bold mb-4">Welcome to Engine Notebooks</h3>
                    <p className="text-zinc-400 max-w-lg mb-8 text-sm leading-relaxed">You don't have any notebooks yet. Start with these production-ready examples to see what's possible with GPU cloud.</p>
                    
                    <div className="bg-black/50 border border-zinc-800 rounded-xl p-6 text-left max-w-md w-full hover:border-emerald-500/30 transition-colors shadow-inner">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs"><Activity className="w-4 h-4"/></div>
                            <div className="flex gap-2">
                                <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full text-xs">Transcription</span>
                                <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full text-xs">Whisper</span>
                                <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full text-xs">Audio</span>
                            </div>
                        </div>
                        <h4 className="text-xl font-bold mb-2">Whisper Audio Analysis</h4>
                        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Transcribe audio with OpenAI's Whisper, and visualize how it attends to different parts of the...</p>
                        
                        <div className="flex items-center justify-between">
                            <div className="text-yellow-500 text-xs flex items-center gap-1 font-bold"><Zap className="w-3.5 h-3.5"/> 2 min setup</div>
                            <button className="bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 px-4 py-1.5 rounded-lg text-sm border border-emerald-900/50 transition-colors">Try this example</button>
                        </div>
                    </div>
                 </div>
              </div>
          )}

          {activeTab === 'functions' && (
              <div className="p-8 max-w-4xl">
                 <h2 className="text-2xl font-bold mb-2">Edge Functions</h2>
                 <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-2xl">Deploy server-side logic that works seamlessly with your database via raw JS injection.</p>

                 <div className="flex items-center gap-4 mb-6">
                    <input type="text" placeholder="Function name (e.g. process-payment)" className="bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-lg flex-1 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm transition-colors active:scale-95 flex items-center gap-2">
                       <Plus className="w-4 h-4" /> Deploy a function
                    </button>
                 </div>

                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                     <table className="w-full text-left">
                       <thead className="bg-zinc-950 text-[11px] text-zinc-500 font-mono tracking-wider">
                          <tr><th className="p-4 font-normal">NAME</th><th className="p-4 font-normal">STATUS</th><th className="p-4 font-normal">CREATED AT</th></tr>
                       </thead>
                       <tbody>
                           <tr>
                               <td colSpan={3} className="p-8 text-center text-zinc-500 text-sm">No edge functions deployed yet.</td>
                           </tr>
                       </tbody>
                     </table>
                 </div>
              </div>
          )}

          {activeTab === 'ai' && (
              <div className="p-8 max-w-4xl">
                 <h2 className="text-2xl font-bold mb-2 text-emerald-400 flex items-center gap-3"><Cpu className="w-6 h-6"/> AI Autonomous Execution</h2>
                 <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-2xl">Provide instructions to the AI agent to learn from logic, execute operations, or process data autonomously.</p>

                 <div className="bg-zinc-900 border border-emerald-900/30 rounded-xl p-6 mb-8 w-full mx-auto relative overflow-hidden shadow-2xl shadow-emerald-900/10">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                     <h3 className="text-lg font-bold mb-4">Create New Execution Task</h3>
                     
                     <div className="space-y-4">
                         <div>
                            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Task Title <span className="text-red-400">*</span></label>
                            <input type="text" placeholder="e.g. Data classification" className="w-full bg-zinc-950 border border-zinc-800 px-4 py-2.5 rounded-lg focus:border-emerald-500/50 focus:outline-none" />
                         </div>
                         <div>
                            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Execution Logic & Instructions <span className="text-red-400">*</span></label>
                            <textarea placeholder="Provide contextual instructions, logical rules, or data for the AI to process..." className="w-full h-32 bg-zinc-950 border border-zinc-800 px-4 py-3 rounded-lg focus:border-emerald-500/50 focus:outline-none resize-none custom-scrollbar text-sm font-mono"></textarea>
                         </div>
                         <div className="flex justify-end pt-2">
                             <button className="bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-600/30 hover:text-emerald-400 px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                                <Plus className="w-4 h-4"/> Queue Execution
                             </button>
                         </div>
                     </div>
                 </div>

                 <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-lg">Execution History</h3>
                     <button className="flex items-center gap-2 text-xs font-mono bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-3 py-1.5 rounded transition-colors text-zinc-400"><RefreshCw className="w-3.5 h-3.5"/> Refresh</button>
                 </div>
                 
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                     <table className="w-full text-left">
                       <thead className="bg-zinc-950 text-[11px] text-zinc-500 font-mono tracking-wider">
                          <tr><th className="p-4 font-normal">TASK</th><th className="p-4 font-normal">STATUS</th><th className="p-4 font-normal">CREATED AT</th></tr>
                       </thead>
                       <tbody>
                           <tr>
                               <td colSpan={3} className="p-8 text-center text-zinc-500 text-sm">No tasks in queue.</td>
                           </tr>
                       </tbody>
                     </table>
                 </div>
              </div>
          )}

          {activeTab === 'ai-code' && (
              <div className="flex-1 flex flex-col p-4 gap-4 h-full relative">
                 <div className="flex flex-col gap-4">
                     <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-3"><Code className="w-6 h-6"/> AI Code Generation</h2>
                     <p className="text-zinc-400 text-sm">Describe the function or component you want to generate. The AI will output TypeScript/JavaScript code.</p>
                     
                     <div className="flex gap-4">
                        <textarea 
                          placeholder="e.g. Write a React component for a multi-step form..." 
                          className="flex-1 h-24 bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-lg focus:border-emerald-500/50 focus:outline-none resize-none custom-scrollbar text-sm font-mono"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                        />
                        <div className="flex flex-col gap-2 w-64">
                            <input 
                              type="password" 
                              placeholder="Local AI API Key (Optional)" 
                              className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg focus:border-emerald-500/50 focus:outline-none text-xs"
                              value={aiCustomKey}
                              onChange={(e) => setAiCustomKey(e.target.value)}
                            />
                            <button 
                               onClick={generateCode}
                               disabled={isGenerating || !aiPrompt.trim()}
                               className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 font-bold shadow-lg shadow-emerald-900/20"
                            >
                               {isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin"/> Generating...</> : <><Play className="w-4 h-4"/> Generate Code</>}
                            </button>
                        </div>
                     </div>
                 </div>
                 
                 {aiError && (
                     <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
                         <X className="w-4 h-4" /> {aiError}
                     </div>
                 )}

                 <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col relative h-[calc(100%-180px)]">
                    <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 text-xs font-mono text-zinc-400 flex items-center justify-between">
                        GENERATED OUTPUT
                    </div>
                    <div className="flex-1 overflow-auto bg-[#1e1e1e]">
                       <CodeMirror
                          value={generatedCode}
                          height="100%"
                          theme={vscodeDark}
                          extensions={[javascript({ jsx: true, typescript: true })]}
                          onChange={(val) => setGeneratedCode(val)}
                          className="h-full text-sm font-mono custom-cm"
                       />
                    </div>
                 </div>
              </div>
          )}

          {activeTab === 'telemetry' && (
              <div className="flex-1 flex flex-col p-4 gap-4 h-full">
                  <div className="flex flex-col gap-1 mb-2">
                     <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-3"><Activity className="w-6 h-6"/> WebSocket Telemetry</h2>
                     <p className="text-zinc-400 text-sm">Live cluster event stream. Monitor Edge Sandbox, HTTP API rate mitigations, and Cache misses in real-time.</p>
                  </div>
                  
                  <div className="flex-1 bg-black border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
                      <div className="bg-zinc-950/80 px-4 py-2 border-b border-zinc-800 text-[11px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                         LIVE STREAM (ws://) connected to Engine v2.0.0-turbo
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5 custom-scrollbar font-mono text-xs">
                          {telemetryLogs.map((log, idx) => (
                             <div key={idx} className="flex items-start gap-4 hover:bg-zinc-900/50 p-1 rounded">
                                 <span className="text-zinc-600 shrink-0">{new Date(log.timestamp).toISOString().split('T')[1].replace('Z', '')}</span>
                                 <span className={`shrink-0 font-bold ${
                                     log.type === 'HTTP' ? 'text-blue-400' :
                                     log.type === 'CACHE' ? 'text-purple-400' :
                                     log.type === 'SECURITY' ? 'text-red-400' :
                                     log.type === 'WORKER' ? 'text-yellow-400' :
                                     log.type === 'SQL' ? 'text-orange-400' :
                                     log.type === 'EDGE' ? 'text-cyan-400' :
                                     log.type === 'EDGE_ERR' ? 'text-red-500' :
                                     log.type === 'EDGE_LOG' ? 'text-zinc-300' :
                                     'text-emerald-500'
                                 }`}>[{log.type}]</span>
                                 <span className="text-zinc-300 break-all">{log.message}</span>
                             </div>
                          ))}
                          {telemetryLogs.length === 0 && (
                             <div className="text-zinc-500 text-center py-8">Waiting for telemetry events...</div>
                          )}
                      </div>
                  </div>
              </div>
          )}

        </main>
      </div>
    </div>
  );
}
