import React, { useEffect, useRef, useState, useCallback } from 'react';
import OrbDetection from './OrbDetection';
import ColdSpotDetection from './ColdSpotDetection';
import EVPDetection from './EVPDetection';
import { analyzeImageContent } from '../utils/imageAnalysis';

const SCAN_DURATION = 12000; // 12 seconds
const COMPILE_DURATION = 2500;

export default function ScanScreen({ files, onScanComplete }) {
  const [phase, setPhase] = useState('scanning'); // scanning | compiling
  const [elapsed, setElapsed] = useState(0);
  const resultsRef = useRef({
    orbCount: 0,
    photoObservation: null,
    coldSpotCount: 0,
    emfSpikeCount: 0,
    evpCount: 0,
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
      // After compile delay, send results
      setTimeout(() => {
        onScanComplete({ ...resultsRef.current });
      }, COMPILE_DURATION);
    }, SCAN_DURATION);
    return () => clearTimeout(timer);
  }, [onScanComplete]);

  // Start photo analysis in background (Pixel Analyzer + Vision fallback)
  useEffect(() => {
    if (!files.photo) return;
    const analyzePhoto = async () => {
      try {
        // Run deep client-side pixel & metadata analysis immediately
        const analysis = await analyzeImageContent(files.photo);
        resultsRef.current.photoObservation = analysis.observation;
        resultsRef.current.suggestedGhostType = analysis.customGhostType;

        // Also try backend Vision API if available
        const reader = new FileReader();
        reader.onload = async () => {
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
            // Keep the client-side pixel analysis observation
          }
        };
        reader.readAsDataURL(files.photo);
      } catch {
        resultsRef.current.photoObservation = 'Optical distortion detected radiating around the subject.';
      }
    };
    analyzePhoto();
  }, [files.photo]);

  const updateResults = useCallback((key, value) => {
    resultsRef.current[key] = value;
  }, []);

  const progress = Math.min((elapsed / SCAN_DURATION) * 100, 100);

  if (phase === 'compiling') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center screen-enter">
          <div className="mb-6">
            <svg className="animate-spin mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="15" />
            </svg>
          </div>
          <h2 className="font-creepy text-3xl text-ghost-green text-glow-green mb-2">
            Compiling Report
          </h2>
          <p className="font-typewriter text-ghost-mist/50 loading-dots">
            Contacting the other side
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-creepy text-3xl sm:text-4xl text-ghost-green text-glow-green animate-flicker mb-2">
          PARANORMAL SCAN IN PROGRESS
        </h2>
        <p className="font-typewriter text-ghost-mist/50 text-sm">
          Do not disturb the equipment
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="h-1 bg-ghost-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-ghost-green to-ghost-blue transition-all duration-100 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs text-ghost-mist/30 mt-1 font-mono">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Detection panels */}
      <div className="w-full max-w-4xl grid grid-cols-1 gap-8">
        {files.photo && (
          <OrbDetection
            file={files.photo}
            onUpdate={(count) => updateResults('orbCount', count)}
          />
        )}
        {files.video && (
          <ColdSpotDetection
            file={files.video}
            onColdSpotUpdate={(count) => updateResults('coldSpotCount', count)}
            onEmfUpdate={(count) => updateResults('emfSpikeCount', count)}
          />
        )}
        {files.audio && (
          <EVPDetection
            file={files.audio}
            onUpdate={(count) => updateResults('evpCount', count)}
          />
        )}
      </div>
    </div>
  );
}
