import React, { useEffect, useRef, useState, useCallback } from 'react';
import OrbDetection from './OrbDetection';
import ColdSpotDetection from './ColdSpotDetection';
import EVPDetection from './EVPDetection';
import { analyzeImageContent } from '../utils/imageAnalysis';

const SCAN_DURATION = 10000; // 10 seconds
const COMPILE_DURATION = 2500;

export default function ScanScreen({ files, onScanComplete }) {
  const [phase, setPhase] = useState('scanning'); // scanning | compiling
  const [elapsed, setElapsed] = useState(0);
  const [imageAnalysis, setImageAnalysis] = useState(null);

  const resultsRef = useRef({
    orbCount: 0,
    photoObservation: null,
    suggestedGhostType: null,
    coldSpotCount: 0,
    emfSpikeCount: 0,
    evpCount: 0,
    isNormal: false,
    paranormalProbability: 0.5,
    suggestedSeverity: null,
  });

  // Progress bar
  useEffect(() => {
    if (phase !== 'scanning') return;
    const interval = setInterval(() => {
      setElapsed((prev) => Math.min(prev + 100, SCAN_DURATION));
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  // Main scan timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('compiling');
      setTimeout(() => {
        onScanComplete({ ...resultsRef.current });
      }, COMPILE_DURATION);
    }, SCAN_DURATION);
    return () => clearTimeout(timer);
  }, [onScanComplete]);

  // Deep pixel & metadata analysis
  useEffect(() => {
    if (!files.photo) return;
    let isCancelled = false;

    const runAnalysis = async () => {
      try {
        const analysis = await analyzeImageContent(files.photo);
        if (isCancelled) return;

        setImageAnalysis(analysis);
        resultsRef.current.isNormal = analysis.isNormal;
        resultsRef.current.isReallyScary = analysis.isReallyScary;
        resultsRef.current.paranormalProbability = analysis.paranormalProbability;
        resultsRef.current.suggestedSeverity = analysis.suggestedSeverity;
        resultsRef.current.suggestedGhostType = analysis.customGhostType;
        resultsRef.current.photoObservation = analysis.observation;

        // Backend Claude Vision API integration if available
        const reader = new FileReader();
        reader.onload = async () => {
          if (isCancelled) return;
          const base64 = reader.result.split(',')[1];
          const mediaType = files.photo.type || 'image/jpeg';
          try {
            const response = await fetch('/api/analyze-photo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: base64, mediaType }),
            });
            if (response.ok) {
              const data = await response.json();
              if (data.observation) {
                resultsRef.current.photoObservation = data.observation;
              }
            }
          } catch {
            // Keep local computer vision observation
          }
        };
        reader.readAsDataURL(files.photo);
      } catch (err) {
        console.error('Image analysis error:', err);
      }
    };

    runAnalysis();
    return () => { isCancelled = true; };
  }, [files.photo]);

  const handleOrbUpdate = useCallback((count) => {
    resultsRef.current.orbCount = count;
  }, []);

  const handleColdSpotUpdate = useCallback((count) => {
    resultsRef.current.coldSpotCount = count;
  }, []);

  const handleEmfUpdate = useCallback((count) => {
    resultsRef.current.emfSpikeCount = count;
  }, []);

  const handleEvpUpdate = useCallback((count) => {
    resultsRef.current.evpCount = count;
  }, []);

  const progress = Math.min((elapsed / SCAN_DURATION) * 100, 100);
  const isHighThreat = imageAnalysis && imageAnalysis.isReallyScary;

  if (phase === 'compiling') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-horror-black">
        <div className="text-center screen-enter max-w-lg p-8 rounded-xl border border-horror-border/60 bg-black/80 shadow-[0_0_50px_rgba(255,0,51,0.2)]">
          <div className="mb-6 relative inline-block">
            <div className="w-16 h-16 rounded-full border-2 border-horror-red/40 border-t-horror-red animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center font-creepy text-horror-red text-xl animate-pulse">
              ☠
            </div>
          </div>
          <h2 className="font-creepy text-3xl sm:text-4xl text-horror-red text-glow-red mb-3 tracking-widest animate-flicker">
            TRANSCRIBING THE SEANCE
          </h2>
          <p className="font-typewriter text-ghost-mist/70 text-sm loading-dots">
            Decoding spectral frequencies and computing haunting severity
          </p>
          <div className="mt-6 text-[11px] font-mono text-horror-red/60 animate-pulse">
            [WARNING: DIMENSIONAL MEMBRANE COMPROMISED — DO NOT DISCONNECT]
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Horror Scan Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-horror-red/50 bg-black/60 text-horror-red text-xs font-mono mb-3 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-horror-red animate-ping" />
          <span>LIVE FORENSIC CONTAINMENT SCAN</span>
        </div>
        <h2 className={`font-creepy text-3xl sm:text-5xl tracking-widest mb-2 ${isHighThreat ? 'text-horror-red text-glow-red animate-flicker' : 'text-ghost-green text-glow-green'}`}>
          {isHighThreat ? '⚠️ CRITICAL PARANORMAL DETECTED' : 'INVESTIGATION IN PROGRESS'}
        </h2>
        <p className="font-typewriter text-ghost-mist/60 text-sm">
          {isHighThreat ? 'Entity detected. Maintain silence and observe telemetry.' : 'Calibrating environmental frequency meters...'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="h-2 bg-horror-black rounded-full overflow-hidden border border-horror-border/60 p-[1px]">
          <div
            className={`h-full transition-all duration-100 rounded-full ${isHighThreat ? 'bg-gradient-to-r from-horror-blood via-horror-red to-horror-crimson animate-pulse' : 'bg-gradient-to-r from-ghost-green to-ghost-blue'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-mono text-ghost-mist/40 mt-2">
          <span>STATUS: SCANNING SUB-FREQUENCIES</span>
          <span className={isHighThreat ? 'text-horror-red font-bold animate-pulse' : 'text-ghost-green'}>
            {Math.round(progress)}% COMPLETED
          </span>
        </div>
      </div>

      {/* Detection Panels */}
      <div className="w-full max-w-4xl grid grid-cols-1 gap-8">
        {files.photo && (
          <OrbDetection
            file={files.photo}
            analysis={imageAnalysis}
            onUpdate={handleOrbUpdate}
          />
        )}
        {files.video && (
          <ColdSpotDetection
            file={files.video}
            onColdSpotUpdate={handleColdSpotUpdate}
            onEmfUpdate={handleEmfUpdate}
          />
        )}
        {files.audio && (
          <EVPDetection
            file={files.audio}
            onUpdate={handleEvpUpdate}
          />
        )}
      </div>
    </div>
  );
}
