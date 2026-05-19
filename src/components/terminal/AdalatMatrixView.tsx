import React from 'react';
import { useAdalatStream } from '../../hooks/useAdalatStream';

export function AdalatMatrixView() {
  const { telemetry } = useAdalatStream();
  
  return (
    <div className="h-full w-full bg-[#151515] p-4 overflow-auto font-mono text-xs">
      <div className="text-green-400 mb-4">&gt;&gt; Adalat Judges Telemetry Stream</div>
      {telemetry.length === 0 && <div className="text-stone-500 animate-pulse">Waiting for stream...</div>}
      {telemetry.map((t, i) => (
        <div key={i} className="flex items-center gap-4 mb-2">
          <span className="text-stone-400">[{new Date().toLocaleTimeString()}]</span>
          <span className="text-blue-300 w-24">{t.layer}</span>
          <span className={t.status === 'passed' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
            [{t.status.toUpperCase()}]
          </span>
          <span className="text-yellow-400">Score: {t.score}</span>
        </div>
      ))}
    </div>
  );
}
