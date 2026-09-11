import React, { useEffect, useRef, useState, useMemo } from 'react';

export default function OrbDetection({ file, analysis, onUpdate }) {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const imgRef       = useRef(null);
  const animFrameRef = useRef(null);
  const onUpdateRef  = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const [orbCount, setOrbCount]         = useState(0);
  const [imageLoaded, setImageLoaded]   = useState(false);
  const [scanTelemetry, setScanTelemetry] = useState('CALIBRATING SENSORS');
  const [debugInfo, setDebugInfo]       = useState('');

  const isReallyScary = analysis?.isReallyScary ?? false;
  const isNormal      = analysis?.isNormal      ?? false;
  const hotspots      = analysis?.anomalyHotspots || [];

  const imageUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);

  useEffect(() => {
    return () => { if (imageUrl) URL.revokeObjectURL(imageUrl); };
  }, [imageUrl]);

  // Show debug info in dev
  useEffect(() => {
    if (analysis?.metrics) {
      const m = analysis.metrics;
      setDebugInfo(
        `sat:${m.avgSat} dark:${m.darkRatio} flesh:${m.fleshRatio} hues:${m.distinctHues} score:${m.ghostScore}`
      );
    }
  }, [analysis]);

  // If image is already cached/complete, mark imageLoaded immediately
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [imageUrl]);

  // Main scan animation — starts once image is loaded AND canvas is mounted
  useEffect(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;

    const setupAndRun = () => {
      const rect = img.getBoundingClientRect();
      const cw   = rect.width  || img.offsetWidth  || img.naturalWidth  || 480;
      const ch   = rect.height || img.offsetHeight || img.naturalHeight || 320;
      canvas.width  = cw;
      canvas.height = ch;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const orbs = [];
      let scanY     = 0;
      let scanDir   = 1;
      const scanSpeed = 3.2;

      // How many orbs to spawn based on scariness
      const targetOrbs = isReallyScary
        ? Math.max(6, Math.min(12, hotspots.length > 0 ? hotspots.length * 2 + 5 : 8))
        : isNormal
          ? (hotspots.length > 0 && Math.random() > 0.75 ? 1 : 0)
          : Math.floor(Math.random() * 3) + 1;

      // Spawn orbs progressively
      const spawnInterval = setInterval(() => {
        if (orbs.length >= targetOrbs) return;

        const idx = orbs.length;
        let x, y;
        if (hotspots[idx % Math.max(1, hotspots.length)]) {
          const spot = hotspots[idx % hotspots.length];
          x = (spot.xPercent / 100) * cw;
          y = (spot.yPercent / 100) * ch;
        } else {
          x = 40 + Math.random() * (cw - 80);
          y = 40 + Math.random() * (ch - 80);
        }

        const radius = isReallyScary ? (18 + Math.random() * 24) : 9;
        orbs.push({
          x, y, radius,
          id: idx + 1,
          color: isReallyScary
            ? (Math.random() > 0.4 ? '#ff0033' : '#00ffaa')
            : '#4488ff',
        });

        setOrbCount(orbs.length);
        onUpdateRef.current(orbs.length);

        setScanTelemetry(
          isReallyScary
            ? `LOCK [${Math.round(x)}, ${Math.round(y)}] : HIGH DENSITY ANOMALY`
            : `SECTOR ${Math.round(x / 50)}-${Math.round(y / 50)} : AMBIENT CLEAR`
        );
      }, isReallyScary ? 950 : 2200);

      // 60fps render loop
      const render = () => {
        ctx.clearRect(0, 0, cw, ch);

        // Draw the uploaded subject image onto the canvas so it's guaranteed to be seen
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, 0, 0, cw, ch);
        }

        // ── Scanline beam ─────────────────────────────────────────────
        scanY += scanSpeed * scanDir;
        if (scanY >= ch) { scanY = ch; scanDir = -1; }
        else if (scanY <= 0) { scanY = 0; scanDir = 1; }

        const laserRGB = isReallyScary ? '255, 0, 51' : '0, 255, 136';
        const laserGrad = ctx.createLinearGradient(0, scanY - 28, 0, scanY + 28);
        laserGrad.addColorStop(0,   `rgba(${laserRGB}, 0)`);
        laserGrad.addColorStop(0.5, `rgba(${laserRGB}, 0.6)`);
        laserGrad.addColorStop(1,   `rgba(${laserRGB}, 0)`);
        ctx.fillStyle = laserGrad;
        ctx.fillRect(0, scanY - 28, cw, 56);

        // Sharp center line
        ctx.strokeStyle = `rgba(${laserRGB}, 0.95)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(cw, scanY);
        ctx.stroke();

        // ── Subtle grid ───────────────────────────────────────────────
        ctx.strokeStyle = `rgba(${laserRGB}, 0.07)`;
        ctx.lineWidth = 1;
        const gs = 40;
        for (let gx = 0; gx < cw; gx += gs) {
          ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, ch); ctx.stroke();
        }
        for (let gy = 0; gy < ch; gy += gs) {
          ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cw, gy); ctx.stroke();
        }

        // ── Orbs & reticles ───────────────────────────────────────────
        const t = Date.now() / 1000;
        orbs.forEach((orb) => {
          const pulse = 1 + 0.15 * Math.sin(t * 4 + orb.id);

          const isRed = orb.color === '#ff0033';
          const auraGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * pulse);
          auraGrad.addColorStop(0,   isRed ? 'rgba(255,0,51,0.85)' : 'rgba(0,255,170,0.75)');
          auraGrad.addColorStop(0.5, isRed ? 'rgba(180,0,30,0.35)' : 'rgba(0,180,120,0.25)');
          auraGrad.addColorStop(1,   'rgba(0,0,0,0)');

          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius * pulse, 0, Math.PI * 2);
          ctx.fillStyle = auraGrad;
          ctx.fill();

          // Bright core
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius * 0.25 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // Reticle crosshair for scary images
          if (isReallyScary) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255,0,51,0.85)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(orb.x, orb.y, orb.radius + 14, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            const arm = orb.radius;
            ctx.beginPath();
            ctx.moveTo(orb.x - arm - 18, orb.y); ctx.lineTo(orb.x - arm - 4, orb.y);
            ctx.moveTo(orb.x + arm + 4,  orb.y); ctx.lineTo(orb.x + arm + 18, orb.y);
            ctx.moveTo(orb.x, orb.y - arm - 18); ctx.lineTo(orb.x, orb.y - arm - 4);
            ctx.moveTo(orb.x, orb.y + arm + 4);  ctx.lineTo(orb.x, orb.y + arm + 18);
            ctx.stroke();
            ctx.fillStyle = '#ff0033';
            ctx.font = 'bold 10px monospace';
            ctx.fillText(`ENT-#${orb.id}`, orb.x + arm + 16, orb.y - 8);
            ctx.restore();
          }
        });

        animFrameRef.current = requestAnimationFrame(render);
      };

      render();

      canvas._cleanup = () => {
        clearInterval(spawnInterval);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    };

    const animId = requestAnimationFrame(setupAndRun);
    window.addEventListener('resize', setupAndRun);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', setupAndRun);
      if (canvasRef.current?._cleanup) canvasRef.current._cleanup();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [imageLoaded, isReallyScary, isNormal, hotspots]);

  return (
    <div className={`spooky-card p-6 animate-slideUp border ${isReallyScary ? 'border-horror-red/80 bg-horror-card shadow-[0_0_40px_rgba(255,0,51,0.25)]' : 'border-ghost-green/40'}`}>
      {/* HUD Header */}
      <div className="flex items-center justify-between mb-4 border-b border-horror-border/40 pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isReallyScary ? 'bg-horror-red animate-ping' : 'bg-ghost-green animate-pulse'}`} />
          <h3 className={`font-creepy text-xl tracking-wider ${isReallyScary ? 'text-horror-red text-glow-red' : 'text-ghost-green text-glow-green'}`}>
            {isReallyScary ? '⚠️ CRITICAL: PARANORMAL ANOMALY SCANNER' : 'OPTICAL SPECTRUM SCANNER'}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-ghost-mist/60">
          <span className="text-horror-red animate-pulse font-bold">REC ●</span>
          <span>LIVE SENSOR FEED</span>
        </div>
      </div>

        {/* Viewport & Live Canvas Scan */}
        <div
          ref={containerRef}
          className="relative block w-full max-w-lg mx-auto rounded-lg overflow-hidden border-2 border-horror-red/80 shadow-[0_0_35px_rgba(255,0,51,0.3)] bg-[#050508] min-h-[260px] flex items-center justify-center"
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Subject scan frame"
            className="relative z-10 w-full block object-contain max-h-[460px] opacity-100 contrast-110"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Interactive Dynamic Canvas Layer (Orbs, Reticles, Digital Grid) */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          />

          {/* Guaranteed CSS High-Intensity Laser Sweep Beam (Dual-Layer) */}
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            <div className={`scanner-laser-bar ${isReallyScary ? 'laser-red' : 'laser-green'}`} />
            <div className="scanner-grid-overlay" />
          </div>

          {/* Viewfinder corner brackets */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-horror-red/90 pointer-events-none z-30" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-horror-red/90 pointer-events-none z-30" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-horror-red/90 pointer-events-none z-30" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-horror-red/90 pointer-events-none z-30" />

          {/* Live Telemetry HUD Bar */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/90 border border-horror-border px-2.5 py-1.5 rounded text-[11px] font-mono pointer-events-none z-40">
            <span className={isReallyScary ? 'text-horror-red font-bold animate-pulse' : 'text-ghost-green font-bold animate-pulse'}>
              ▶ {scanTelemetry}
            </span>
            <span className="text-ghost-mist/70 font-bold">
              {orbCount} {isReallyScary ? 'ENTITIES LOCKED' : 'ANOMALIES DETECTED'}
            </span>
          </div>
        </div>

      {/* Bottom Status Bar */}
      <div className="mt-4 flex items-center justify-between">
        <p className="font-typewriter text-sm text-ghost-mist/80">
          {isReallyScary ? (
            <span className="text-horror-red animate-flicker font-semibold">
              ⚠️ HAZARD DETECTED: Spectral matter is actively manifesting across photographic emulsion
            </span>
          ) : (
            <span className="text-ghost-green">
              ✓ Optical spectrum stable. No supernatural distortion registered.
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <span className={`font-mono text-2xl font-bold ${isReallyScary ? 'text-horror-red text-glow-red' : 'text-ghost-green'}`}>
            {orbCount}
          </span>
          <span className="text-xs text-ghost-mist/50">
            {isReallyScary ? 'spectral orbs' : 'ambient dust'}
          </span>
        </div>
      </div>
    </div>
  );
}
