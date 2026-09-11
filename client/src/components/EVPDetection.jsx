import React, { useEffect, useRef, useState } from 'react';
import { analyzeAudioForEVP, getWaveformData } from '../utils/audioAnalysis';
import WaveformVisualizer from './WaveformVisualizer';

export default function EVPDetection({ file, onUpdate }) {
  const [evpCount, setEvpCount] = useState(0);
  const [waveformData, setWaveformData] = useState(null);
  const [analyzing, setAnalyzing] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!file) return;

    const analyzeFile = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        // Get waveform for visualization
        const waveform = getWaveformData(audioBuffer, 120);
        setWaveformData(waveform);

        // Analyze for EVP peaks
        const result = analyzeAudioForEVP(audioBuffer);
        setEvpCount(result.evpCount);
        onUpdate(result.evpCount);

        // Animate the count reveal
        const finalCount = result.evpCount;
        if (finalCount > 0) {
          let current = 0;
          const revealInterval = setInterval(() => {
            current++;
            setDisplayedCount(current);
            if (current >= finalCount) clearInterval(revealInterval);
          }, 800 / Math.max(finalCount, 1));
        }

        audioCtx.close();
      } catch (err) {
        console.warn('Audio analysis error:', err);
        setEvpCount(0);
        onUpdate(0);
      } finally {
        setAnalyzing(false);
      }
    };

    // Delay a bit for dramatic effect
    const timer = setTimeout(analyzeFile, 1500);
    return () => clearTimeout(timer);
  }, [file, onUpdate]);

  const audioUrl = file ? URL.createObjectURL(file) : '';

  return (
    <div className="spooky-card p-6 animate-slideUp" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-ghost-green animate-pulse" />
        <h3 className="font-creepy text-xl text-ghost-green text-glow-green">
          EVP Detection Scanner
        </h3>
      </div>

      {/* Audio player */}
      <audio ref={audioRef} src={audioUrl} className="w-full mb-4 opacity-70" controls />

      {/* Waveform visualizer */}
      <WaveformVisualizer data={waveformData} analyzing={analyzing} />

      <div className="mt-4 flex items-center justify-between">
        <p className="font-typewriter text-sm text-ghost-mist/60">
          {analyzing ? 'Scanning audio for electronic voice phenomena...' : 'EVP scan complete'}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-ghost-green font-mono text-lg font-bold">
            {analyzing ? '...' : displayedCount}
          </span>
          <span className="text-xs text-ghost-mist/40">voice anomalies</span>
        </div>
      </div>
    </div>
  );
}
