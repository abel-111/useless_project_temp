import React, { useEffect, useRef, useState } from 'react';

export default function OrbDetection({ file, onUpdate }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [orbCount, setOrbCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Draw random orbs on canvas
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    // Spawn a controlled number of orbs (typically 4 to 8 total during scan)
    const spawnOrb = () => {
      setOrbCount((prev) => {
        if (prev >= 8) return prev; // Keep orb count sensible
        const next = prev + 1;
        const x = 20 + Math.random() * (canvas.width - 40);
        const y = 20 + Math.random() * (canvas.height - 40);
        const radius = 16 + Math.random() * 24;
        drawOrb(ctx, x, y, radius);
        onUpdate(next);
        return next;
      });
    };

    spawnOrb();

    const interval = setInterval(() => {
      spawnOrb();
    }, 1800);

    return () => clearInterval(interval);
  }, [imageLoaded, onUpdate]);

  const imageUrl = file ? URL.createObjectURL(file) : '';

  return (
    <div className="spooky-card p-6 animate-slideUp">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-ghost-blue animate-pulse" />
        <h3 className="font-creepy text-xl text-ghost-blue text-glow-blue">
          Orb Detection Scanner
        </h3>
      </div>

      <div className="relative inline-block w-full max-w-lg mx-auto">
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Uploaded location photo"
          className="w-full rounded-lg opacity-70"
          onLoad={() => setImageLoaded(true)}
          style={{ display: 'block' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="font-typewriter text-sm text-ghost-mist/60">
          Scanning for orb activity...
        </p>
        <div className="flex items-center gap-2">
          <span className="text-ghost-blue font-mono text-lg font-bold">{orbCount}</span>
          <span className="text-xs text-ghost-mist/40">orbs detected</span>
        </div>
      </div>
    </div>
  );
}

function drawOrb(ctx, x, y, radius) {
  // Outer glow
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(150, 200, 255, 0.7)');
  gradient.addColorStop(0.4, 'rgba(100, 180, 255, 0.3)');
  gradient.addColorStop(0.7, 'rgba(80, 150, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(80, 150, 255, 0)');

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Inner bright core
  const innerGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.3);
  innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  innerGradient.addColorStop(1, 'rgba(200, 220, 255, 0)');

  ctx.beginPath();
  ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = innerGradient;
  ctx.fill();
}
