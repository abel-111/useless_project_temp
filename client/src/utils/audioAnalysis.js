/**
 * Analyze audio buffer for EVP (Electronic Voice Phenomena) peaks.
 * Looks for RMS amplitude spikes that exceed a threshold.
 * @param {AudioBuffer} audioBuffer - Decoded audio buffer
 * @returns {{ evpCount: number, peaks: Array<{ time: number, amplitude: number }> }}
 */
export function analyzeAudioForEVP(audioBuffer) {
  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const chunkSize = Math.floor(sampleRate * 0.1); // 100ms chunks
  const peaks = [];

  // Compute overall RMS for adaptive threshold
  let totalRms = 0;
  for (let i = 0; i < channelData.length; i++) {
    totalRms += channelData[i] * channelData[i];
  }
  totalRms = Math.sqrt(totalRms / channelData.length);

  // Threshold: mean RMS * multiplier (adaptive), but at least a minimum
  const threshold = Math.max(totalRms * 2.5, 0.05);

  for (let offset = 0; offset < channelData.length; offset += chunkSize) {
    const end = Math.min(offset + chunkSize, channelData.length);
    let sumSq = 0;
    for (let i = offset; i < end; i++) {
      sumSq += channelData[i] * channelData[i];
    }
    const rms = Math.sqrt(sumSq / (end - offset));

    if (rms > threshold) {
      const time = offset / sampleRate;
      // Don't count peaks that are too close together (within 0.5s)
      if (peaks.length === 0 || time - peaks[peaks.length - 1].time > 0.5) {
        peaks.push({ time: Math.round(time * 10) / 10, amplitude: Math.round(rms * 100) / 100 });
      }
    }
  }

  return {
    evpCount: peaks.length,
    peaks,
  };
}

/**
 * Get waveform data for visualization (downsampled).
 * @param {AudioBuffer} audioBuffer
 * @param {number} numBars - Number of bars to render
 * @returns {number[]} Array of normalized amplitude values [0-1]
 */
export function getWaveformData(audioBuffer, numBars = 100) {
  const channelData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(channelData.length / numBars);
  const bars = [];

  for (let i = 0; i < numBars; i++) {
    let sum = 0;
    const start = i * blockSize;
    for (let j = start; j < start + blockSize && j < channelData.length; j++) {
      sum += Math.abs(channelData[j]);
    }
    bars.push(sum / blockSize);
  }

  // Normalize to 0-1
  const max = Math.max(...bars, 0.01);
  return bars.map((v) => v / max);
}
