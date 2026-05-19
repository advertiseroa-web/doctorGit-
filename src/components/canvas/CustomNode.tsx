import React from 'react';
import { Handle, Position } from '@xyflow/react';

export function CustomNode({ data }: { data: any }) {
  return (
    <div className={`shadow-xl rounded-md border text-left ${data.borderClass || 'border-[#555]'} ${data.bgClass || 'bg-[#1a1a1a]'} px-4 py-3 min-w-[150px] max-w-[200px] relative overflow-hidden group hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer`}>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-stone-500 !border-stone-700 hover:!bg-white" />
      <Handle type="target" position={Position.Left} id="left" className="!w-2 !h-2 !bg-stone-500 !border-stone-700 hover:!bg-white" />
      
      <div className="relative z-10 flex flex-col justify-center">
        <span className={`text-[11px] font-bold uppercase font-mono tracking-wider ${data.textClass || 'text-stone-300'}`}>
          {data.label}
        </span>
        {data.sublabel && (
          <span className="text-[9px] text-stone-500 font-mono mt-0.5 block leading-tight">{data.sublabel}</span>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-stone-500 !border-stone-700 hover:!bg-white" />
      <Handle type="source" position={Position.Right} id="right" className="!w-2 !h-2 !bg-stone-500 !border-stone-700 hover:!bg-white" />
    </div>
  );
}
