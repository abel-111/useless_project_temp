import React, { useState, useCallback } from 'react';
import LandingScreen from './components/LandingScreen';
import ScanScreen from './components/ScanScreen';
import ResultsScreen from './components/ResultsScreen';
import SoundToggle from './components/SoundToggle';
import GhostAtmosphere from './components/GhostAtmosphere';
import { useSoundEffects } from './hooks/useSoundEffects';

const SCREENS = {
  LANDING: 'landing',
  SCAN: 'scan',
  RESULTS: 'results',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LANDING);
  const [files, setFiles] = useState({ photo: null, video: null, audio: null });
  const [scanResults, setScanResults] = useState(null);
  const { soundEnabled, toggleSound, playStatic, playDrone, playSting, stopDrone } = useSoundEffects();

  const handleFilesReady = useCallback((uploadedFiles) => {
    setFiles(uploadedFiles);
  }, []);

  const handleBeginScan = useCallback(() => {
    playStatic();
    setScreen(SCREENS.SCAN);
    setTimeout(() => playDrone(), 400);
  }, [playStatic, playDrone]);

  const handleScanComplete = useCallback((results) => {
    stopDrone();
    setScanResults(results);
    setScreen(SCREENS.RESULTS);
    setTimeout(() => playSting(results?.isNormal), 400);
  }, [stopDrone, playSting]);

  const handleReset = useCallback(() => {
    setScreen(SCREENS.LANDING);
    setFiles({ photo: null, video: null, audio: null });
    setScanResults(null);
  }, []);

  return (
    <div className="relative min-h-screen bg-horror-black overflow-hidden">
      {/* Horror Overlays & Ghost Animations */}
      <GhostAtmosphere />
      <div className="horror-vignette" />
      <div className="crt-overlay" />
      <div className="noise-overlay" />
      <div className="fog-layer" />

      {/* Sound toggle */}
      <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />

      {/* Screen content */}
      <main className="relative z-10">
        {screen === SCREENS.LANDING && (
          <div className="screen-enter">
            <LandingScreen
              files={files}
              onFilesChange={handleFilesReady}
              onBeginScan={handleBeginScan}
            />
          </div>
        )}

        {screen === SCREENS.SCAN && (
          <div className="screen-enter">
            <ScanScreen
              files={files}
              onScanComplete={handleScanComplete}
            />
          </div>
        )}

        {screen === SCREENS.RESULTS && (
          <div className="screen-enter">
            <ResultsScreen
              scanResults={scanResults}
              files={files}
              onReset={handleReset}
            />
          </div>
        )}
      </main>
    </div>
  );
}
