import React, { useEffect, useState } from 'react';

export function VectorStoreView() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Generate initial logs for realism
    const initialLogs = Array.from({ length: 15 }).map(() => {
      const hashes = ['0x' + Math.random().toString(16).slice(2, 10), '0x' + Math.random().toString(16).slice(2, 10)];
      return `[INDEXER] Mapped ${hashes[0]} -> ${hashes[1]} (distance: ${(Math.random() * 0.1).toFixed(4)})`;
    });
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const hashes = ['0x' + Math.random().toString(16).slice(2, 10), '0x' + Math.random().toString(16).slice(2, 10)];
      setLogs(prev => [...prev.slice(1), `[INDEXER] Mapped ${hashes[0]} -> ${hashes[1]} (distance: ${(Math.random() * 0.1).toFixed(4)})`]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full bg-[#151515] p-4 overflow-auto font-mono text-xs text-stone-300">
      <div className="text-purple-400 mb-4">&gt;&gt; Vector Store Memory-Mapped Allocations</div>
      {logs.map((log, i) => (
        <div key={i} className="mb-1 text-stone-400 opacity-80 hover:opacity-100 transition-opacity cursor-default">{log}</div>
      ))}
    </div>
  );
}
