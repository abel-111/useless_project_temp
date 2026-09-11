import React, { useEffect, useRef, useState } from 'react';
import { sampleFrameBrightness } from '../utils/videoAnalysis';
import EMFMeter from './EMFMeter';

export default function ColdSpotDetection({ file, onColdSpotUpdate, onEmfUpdate }) {
  const videoRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const prevBrightnessRef = useRef(null);
  const [coldSpotCount, setColdSpotCount] = useState(0);
  const [emfSpikeCount, setEmfSpikeCount] = useState(0);
  const [emfLevel, setEmfLevel] = useState(0.2);
  const [spiking, setSpiking] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const videoUrl = file ? URL.createObjectURL(file) : '';

  // Frame brightness sampling for cold spots
  useEffect(() => {
    if (!videoReady || !videoRef.current || !hiddenCanvasRef.current) return;

    const interval = setInterval(() => {
      try {
        const brightness = sampleFrameBrightness(videoRef.current, hiddenCanvasRef.current);

        if (prevBrightnessRef.current !== null) {
          const diff = prevBrightnessRef.current - brightness;
          if (diff > 8) {
            // Brightness dropped = "cold spot"
            setColdSpotCount((prev) => {
              const next = prev + 1;
              onColdSpotUpdate(next);
              return next;
            });
          }
        }
        prevBrightnessRef.current = brightness;
      } catch {
        // Video might not be ready
      }
    }, 500);

    return () => clearInterval(interval);
  }, [videoReady, onColdSpotUpdate]);

  // EMF meter animation with random spikes
  useEffect(() => {
    const interval = setInterval(() => {
      const base = 0.15 + Math.random() * 0.35;
      setEmfLevel(base);
    }, 150);

    // Random spikes every 2-4 seconds
    const spikeInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        setSpiking(true);
        setEmfLevel(0.8 + Math.random() * 0.2);
        setEmfSpikeCount((prev) => {
          const next = prev + 1;
          onEmfUpdate(next);
          return next;
        });
        setTimeout(() => setSpiking(false), 600);
      }
    }, 2000 + Math.random() * 2000);

    return () => {
      clearInterval(interval);
      clearInterval(spikeInterval);
    };
  }, [onEmfUpdate]);

  return (
    <div className="spooky-card p-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-ghost-purple animate-pulse" />
        <h3 className="font-creepy text-xl text-purple-400" style={{ textShadow: '0 0 10px rgba(136,68,255,0.5)' }}>
          Thermal & EMF Analysis
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Video preview */}
        <div className="flex-1">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full max-h-48 rounded-lg opacity-70 object-cover"
            muted
            autoPlay
            loop
            playsInline
            onLoadedData={() => setVideoReady(true)}
          />
          <canvas ref={hiddenCanvasRef} className="hidden" />
        </div>

        {/* EMF Meter */}
        <div className="flex-shrink-0 w-32">
          <EMFMeter level={emfLevel} spiking={spiking} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <p className="font-typewriter text-sm text-ghost-mist/60">
          Analyzing footage for temperature anomalies...
        </p>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-mono text-lg font-bold">{coldSpotCount}</span>
            <span className="text-xs text-ghost-mist/40">cold spots</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-lg font-bold ${spiking ? 'text-ghost-red' : 'text-yellow-400'}`}>
              {emfSpikeCount}
            </span>
            <span className="text-xs text-ghost-mist/40">EMF spikes</span>
          </div>
        </div>
      </div>

      {spiking && (
        <div className="mt-2 text-center animate-fadeIn">
          <span className="text-ghost-red font-creepy text-sm text-glow-red">
            ⚠️ ANOMALY DETECTED ⚠️
          </span>
        </div>
      )}
    </div>
  );
}
