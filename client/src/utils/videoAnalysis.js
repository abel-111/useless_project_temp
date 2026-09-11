/**
 * Sample a video frame and return average brightness.
 * @param {HTMLVideoElement} video
 * @param {HTMLCanvasElement} canvas
 * @returns {number} Average brightness 0-255
 */
export function sampleFrameBrightness(video, canvas) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = 160;
  canvas.height = 120;
  ctx.drawImage(video, 0, 0, 160, 120);
  const imageData = ctx.getImageData(0, 0, 160, 120);
  const data = imageData.data;
  let totalBrightness = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    // Perceived brightness: 0.299R + 0.587G + 0.114B
    totalBrightness += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
  }

  return totalBrightness / pixelCount;
}
