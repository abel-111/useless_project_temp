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
      const duration = 1.2;
      const sampleRate = ctx.sampleRate;
      const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
        // Add crackle pops
        if (Math.random() < 0.001) data[i] = (Math.random() > 0.5 ? 1 : -1) * 0.5;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 800;
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start();
      source.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Sound effect error:', e);
    }
  }, [soundEnabled, getCtx]);

  const playDrone = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 55;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);
      // Add subtle modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.3;
      lfoGain.gain.value = 5;
      lfo.connect(lfoGain).connect(osc.frequency);
      lfo.start();
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      droneOscRef.current = osc;
      droneGainRef.current = gain;
    } catch (e) {
      console.warn('Sound effect error:', e);
    }
  }, [soundEnabled, getCtx]);

  const stopDrone = useCallback(() => {
    try {
      if (droneGainRef.current && droneOscRef.current) {
        const ctx = getCtx();
        droneGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        droneOscRef.current.stop(ctx.currentTime + 0.6);
        droneOscRef.current = null;
        droneGainRef.current = null;
      }
    } catch (e) {
      console.warn('Sound effect error:', e);
    }
  }, [getCtx]);

  const playSting = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getCtx();
      // Dramatic reveal chord
      const freqs = [130.81, 155.56, 196.00, 261.63];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? 'sawtooth' : 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12 / (i + 1), ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + 2.5);
      });
    } catch (e) {
      console.warn('Sound effect error:', e);
    }
  }, [soundEnabled, getCtx]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
    // Initialize audio context on first enable (user gesture)
    if (!soundEnabled) {
      try { getCtx(); } catch (e) { /* ok */ }
    }
  }, [soundEnabled, getCtx]);

  return { soundEnabled, toggleSound, playStatic, playDrone, stopDrone, playSting };
}
