import React from 'react';

const SEGMENTS = 20;

export default function EMFMeter({ level, spiking }) {
  return (
    <div className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
      spiking
        ? 'border-ghost-red bg-ghost-red/5 emf-spike'
        : 'border-ghost-border bg-ghost-dark/50'
    }`}>
      <p className="font-creepy text-xs text-ghost-mist/50 mb-2 tracking-wider">EMF METER</p>

      {/* Vertical bar gauge */}
      <div className="flex gap-[2px] items-end h-28">
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const threshold = i / SEGMENTS;
          const active = level > threshold;
          let color;
          if (i / SEGMENTS > 0.75) color = spiking ? 'bg-ghost-red' : 'bg-red-500';
          else if (i / SEGMENTS > 0.5) color = 'bg-yellow-500';
          else color = 'bg-ghost-green';

          return (
            <div
              key={i}
              className={`w-2 rounded-sm transition-all duration-100 ${
                active ? color : 'bg-ghost-border/30'
              }`}
              style={{
                height: `${((i + 1) / SEGMENTS) * 100}%`,
                opacity: active ? (spiking && i / SEGMENTS > 0.75 ? 1 : 0.8) : 0.2,
              }}
            />
          );
        })}
      </div>

      <p className={`font-mono text-xs mt-2 ${spiking ? 'text-ghost-red font-bold' : 'text-ghost-mist/40'}`}>
        {(level * 10).toFixed(1)} mG
      </p>
    </div>
  );
}
