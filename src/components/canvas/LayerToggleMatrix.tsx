import React, { useState } from 'react';

export function LayerToggleMatrix() {
  const [layers, setLayers] = useState([
    { id: 'ui', name: 'UI Layer', enabled: true },
    { id: 'backend', name: 'Backend Logic', enabled: true },
    { id: 'adalat', name: 'Adalat Judges', enabled: false },
  ]);

  return (
    <div className="bg-[#1e1e1e] border border-stone-800 p-4 rounded-lg flex flex-col gap-2 min-w-[200px]">
      <h3 className="text-xs font-mono text-stone-400 mb-2 uppercase tracking-wider">Layer Matrix</h3>
      {layers.map(layer => (
        <label key={layer.id} className="flex items-center gap-2 text-sm text-stone-300 font-mono cursor-pointer hover:text-white transition-colors">
          <input 
            type="checkbox" 
            checked={layer.enabled}
            onChange={() => {
              setLayers(l => l.map(x => x.id === layer.id ? { ...x, enabled: !x.enabled } : x));
            }}
            className="accent-blue-500 bg-stone-900 border-stone-700" 
          />
          {layer.name}
        </label>
      ))}
    </div>
  );
}
