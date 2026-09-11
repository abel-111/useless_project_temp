import { useState, useRef, useCallback } from 'react';

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef(null);
  const droneOscRef = useRef(null);
  const droneGainRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playStatic = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getCtx();
      const duration = 1.4;
      const sampleRate = ctx.sampleRate;
      const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
        // Violent clicks & static pop anomalies
        if (Math.random() < 0.003) data[i] = (Math.random() > 0.5 ? 1 : -1) * 0.7;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 3;

      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start();
      source.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Sound effect error:', e);
    }
  }, [soundEnabled, getCtx]);

  // Terrifying low horror sub-bass drone with eerie dissonant tritone
  const playDrone = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getCtx();
      const masterDroneGain = ctx.createGain();
      masterDroneGain.gain.setValueAtTime(0, ctx.currentTime);
      masterDroneGain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 1.5);

      // Low ominous sub-bass
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sawtooth';
      subOsc.frequency.value = 42;

      // Tritone / Devil's chord interval (diminished 5th dissonance)
      const tritoneOsc = ctx.createOscillator();
      tritoneOsc.type = 'sine';
      tritoneOsc.frequency.value = 59.4; // 42 * sqrt(2)

      // Low pass filter for dark rumble
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 220;

      // Pulsing LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.25; // Slow heartbeat pulse
      lfoGain.gain.value = 8;
      lfo.connect(lfoGain).connect(subOsc.frequency);
      lfo.start();

      subOsc.connect(filter);
      tritoneOsc.connect(filter);
      filter.connect(masterDroneGain).connect(ctx.destination);

      subOsc.start();
      tritoneOsc.start();

      droneOscRef.current = [subOsc, tritoneOsc, lfo];
      droneGainRef.current = masterDroneGain;
    } catch (e) {
      console.warn('Sound effect error:', e);
    }
  }, [soundEnabled, getCtx]);

  const stopDrone = useCallback(() => {
    try {
      if (droneGainRef.current && droneOscRef.current) {
        const ctx = getCtx();
        droneGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        setTimeout(() => {
          if (Array.isArray(droneOscRef.current)) {
            droneOscRef.current.forEach((osc) => {
              try { osc.stop(); } catch {}
            });
          }
          droneOscRef.current = null;
          droneGainRef.current = null;
        }, 500);
      }
    } catch (e) {
      console.warn('Sound effect error:', e);
    }
  }, [getCtx]);

  // Jumpscare / Horror reveal sting vs Safe chime
  const playSting = useCallback((isSafe = false) => {
    if (!soundEnabled) return;
    try {
      const ctx = getCtx();

      if (isSafe) {
        // Peaceful resolving chime
        const safeFreqs = [261.63, 329.63, 392.00, 523.25];
        safeFreqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.08 / (i + 1), ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
          osc.connect(gain).connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + 2.5);
        });
      } else {
        // Blood-curdling horror stinger: heavy sub-drop thump + high-pitch screech chord
        // Sub-drop
        const subDrop = ctx.createOscillator();
        const subGain = ctx.createGain();
        subDrop.type = 'sine';
        subDrop.frequency.setValueAtTime(140, ctx.currentTime);
        subDrop.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.8);
        subGain.gain.setValueAtTime(0.4, ctx.currentTime);
        subGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        subDrop.connect(subGain).connect(ctx.destination);
        subDrop.start();
        subDrop.stop(ctx.currentTime + 1.2);

        // Piercing dissonant cluster
        const dissonantFreqs = [185.00, 246.94, 349.23, 493.88, 739.99];
        dissonantFreqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          // slight frequency wobble
          osc.frequency.linearRampToValueAtTime(freq * (1 + (idx % 2 === 0 ? 0.05 : -0.05)), ctx.currentTime + 0.4);

          gain.gain.setValueAtTime(0.18 / (idx + 1), ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);

          const filter = ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.value = 300;

          osc.connect(filter).connect(gain).connect(ctx.destination);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 2.8);
        });
      }
    } catch (e) {
      console.warn('Sound effect error:', e);
    }
  }, [soundEnabled, getCtx]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
    if (!soundEnabled) {
      try { getCtx(); } catch (e) { /* ok */ }
    }
  }, [soundEnabled, getCtx]);

  return { soundEnabled, toggleSound, playStatic, playDrone, stopDrone, playSting };
}
