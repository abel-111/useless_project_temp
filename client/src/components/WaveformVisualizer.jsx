import React, { useEffect, useRef } from 'react';

export default function WaveformVisualizer({ data, analyzing }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      if (data && data.length > 0) {
        const barWidth = w / data.length;
        const gap = 1;

        data.forEach((val, i) => {
          // Add subtle animation
          const animatedVal = analyzing
            ? val * (0.7 + 0.3 * Math.sin((Date.now() / 200) + i * 0.3))
            : val;

          const barHeight = Math.max(animatedVal * h * 0.8, 1);
          const x = i * barWidth;
          const y = (h - barHeight) / 2;

          // Gradient color
          const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
          gradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)');
          gradient.addColorStop(0.5, 'rgba(68, 136, 255, 0.6)');
          gradient.addColorStop(1, 'rgba(136, 68, 255, 0.4)');

          ctx.fillStyle = gradient;
          ctx.fillRect(x + gap / 2, y, barWidth - gap, barHeight);
        });
      } else if (analyzing) {
        // Fake animated bars while loading
        const numBars = 60;
        const barWidth = w / numBars;
        for (let i = 0; i < numBars; i++) {
          const val = 0.1 + 0.4 * Math.sin((Date.now() / 300) + i * 0.4);
          const barHeight = val * h * 0.6;
          const x = i * barWidth;
          const y = (h - barHeight) / 2;

          ctx.fillStyle = `rgba(0, 255, 136, ${0.3 + val * 0.3})`;
          ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [data, analyzing]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-20 rounded-lg bg-ghost-black/50"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
