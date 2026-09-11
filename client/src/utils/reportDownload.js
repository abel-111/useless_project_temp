import { toPng } from 'html-to-image';

/**
 * Render a DOM element as a PNG and trigger download.
 * @param {HTMLElement} element - The DOM element to capture
 * @param {string} filename - Download filename
 */
export async function downloadReportAsImage(element, filename = 'ghost-report.png') {
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#0a0a0c',
      pixelRatio: 2,
      quality: 0.95,
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to generate report image:', err);
    throw err;
  }
}

/**
 * Copy text to clipboard.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}
