import React, { useEffect, useState, useRef } from 'react';
import ReportCard from './ReportCard';
import { downloadReportAsImage, copyToClipboard } from '../utils/reportDownload';

export default function ResultsScreen({ scanResults, files, onReset }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const reportCardRef = useRef(null);

  // Fetch AI-generated report
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch('/api/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scanResults),
        });

        if (!response.ok) throw new Error('API error');

        const data = await response.json();
        setReport(data);
      } catch (err) {
        console.error('Report fetch error:', err);
        setError(true);
        // Fallback report
        setReport({
          verdict: generateFallbackReport(scanResults),
          severity: Math.min(Math.floor(Math.random() * 4) + 5, 10),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [scanResults]);

  const handleDownload = async () => {
    if (!reportCardRef.current) return;
    setDownloading(true);
    try {
      await downloadReportAsImage(reportCardRef.current);
    } catch {
      alert('Failed to generate image. Try again.');
    }
    setDownloading(false);
  };

  const handleCopy = async () => {
    if (!report) return;
    const text = `👻 GHOST DETECTOR REPORT\n\nHaunting Severity: ${report.severity}/10\n\n${report.verdict}\n\n— Scanned with Ghost Detector by Team Omen & Iris`;
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center screen-enter">
          <div className="mb-6">
            <svg className="animate-spin mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="15" />
            </svg>
          </div>
          <h2 className="font-creepy text-3xl text-ghost-green text-glow-green mb-2">
            Generating Paranormal Report
          </h2>
          <p className="font-typewriter text-ghost-mist/50 loading-dots">
            The spirits are speaking
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8 screen-enter">
        <h2 className="font-creepy text-4xl sm:text-5xl text-ghost-red text-glow-red mb-2">
          INVESTIGATION COMPLETE
        </h2>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-ghost-red/40 to-transparent mx-auto" />
      </div>

      {error && (
        <p className="text-sm text-yellow-500/70 font-typewriter mb-4 animate-fadeIn">
          ⚠ The spirits were uncooperative. Using backup channels...
        </p>
      )}

      {/* Stats row */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 animate-slideUp">
        {files.photo && (
          <StatBadge icon="👁" label="Orbs" value={scanResults.orbCount} color="blue" />
        )}
        {files.video && (
          <>
            <StatBadge icon="🌡" label="Cold Spots" value={scanResults.coldSpotCount} color="purple" />
            <StatBadge icon="⚡" label="EMF Spikes" value={scanResults.emfSpikeCount} color="yellow" />
          </>
        )}
        {files.audio && (
          <StatBadge icon="🎙" label="EVP Captures" value={scanResults.evpCount} color="green" />
        )}
      </div>

      {/* Report card */}
      <div ref={reportCardRef}>
        <ReportCard report={report} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
        <button
          id="download-report-btn"
          className="btn-secondary flex items-center gap-2"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? '⏳ Rendering...' : '📥 Download as Image'}
        </button>
        <button
          id="copy-report-btn"
          className="btn-secondary flex items-center gap-2"
          onClick={handleCopy}
        >
          {copied ? '✅ Copied!' : '📋 Copy Report Text'}
        </button>
        <button
          id="scan-again-btn"
          className="btn-secondary flex items-center gap-2 border-ghost-red/30 text-ghost-red hover:bg-ghost-red/10 hover:border-ghost-red"
          onClick={onReset}
        >
          🔄 Scan Again
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center opacity-30">
        <p className="text-xs font-typewriter text-ghost-mist/50">
          Ghost Detector — Team Omen & Iris — TinkerHub Useless Projects
        </p>
      </div>
    </div>
  );
}

function StatBadge({ icon, label, value, color }) {
  const colorMap = {
    blue: 'border-ghost-blue/30 text-ghost-blue',
    purple: 'border-purple-500/30 text-purple-400',
    yellow: 'border-yellow-500/30 text-yellow-400',
    green: 'border-ghost-green/30 text-ghost-green',
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border bg-ghost-dark/50 ${colorMap[color]}`}>
      <span className="text-lg">{icon}</span>
      <span className="font-mono text-lg font-bold">{value}</span>
      <span className="text-xs opacity-60">{label}</span>
    </div>
  );
}

function generateFallbackReport(results) {
  const lines = [
    'The instruments have spoken, and what they reveal... is deeply concerning.',
  ];

  if (results.orbCount > 0) {
    lines.push(`We detected ${results.orbCount} distinct orb manifestations — each one a potential spectral signature, lingering in the ether.`);
  }
  if (results.coldSpotCount > 0) {
    lines.push(`The thermal scans revealed ${results.coldSpotCount} cold spot anomalies, classic indicators of spiritual presence drawing energy from the environment.`);
  }
  if (results.emfSpikeCount > 0) {
    lines.push(`The EMF readings spiked ${results.emfSpikeCount} times — electromagnetic disturbances of this magnitude cannot be ignored.`);
  }
  if (results.evpCount > 0) {
    lines.push(`Our EVP analysis captured ${results.evpCount} unexplained voice phenomena embedded in the audio. Someone — or something — was trying to communicate.`);
  }
  if (results.evpCount === 0 && results.orbCount === 0 && results.coldSpotCount === 0) {
    lines.push('The readings are eerily quiet. Almost TOO quiet. In my experience, that is when they are watching most carefully.');
  }

  lines.push('I would not spend the night here. That is my professional recommendation.');

  return lines.join(' ');
}
