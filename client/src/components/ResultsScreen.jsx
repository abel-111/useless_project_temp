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

  // Fetch report from backend
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
        const isSafe = scanResults?.isNormal ?? false;
        const isReallyScary = scanResults?.isReallyScary ?? false;
        const fallbackSeverity = isReallyScary
          ? Math.max(6, Math.min(10, scanResults?.suggestedSeverity || 8))
          : (isSafe ? Math.max(1, Math.min(3, scanResults?.suggestedSeverity || 2)) : Math.max(4, Math.min(5, scanResults?.suggestedSeverity || 4)));

        setReport({
          verdict: generateFallbackReport(scanResults, isSafe),
          severity: fallbackSeverity,
          ghostName: isSafe ? 'Living Mortal Realm' : (isReallyScary ? (scanResults?.suggestedGhostType || 'Class VI Void Entity') : 'Class III Residual Memory Wraith'),
          threatClass: isSafe ? 'Class 0 Harmless Non-Entity' : (isReallyScary ? 'Class VI Cataclysmic Horror' : 'Class III Residual Memory'),
          spectralSignature: isSafe ? 'Pure biological daylight photons' : (isReallyScary ? 'Absolute zero-point photon decay' : 'Subtle electromagnetic memory imprint'),
          isBenign: isSafe,
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
    const text = `👻 GHOST DETECTOR FORENSIC REPORT\n\nClassification: ${report.ghostName} (${report.threatClass})\nHaunting Severity: ${report.severity}/10\n\n${report.verdict}\n\n— Investigated with Ghost Detector by Team Omen & Iris`;
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-horror-black">
        <div className="text-center screen-enter">
          <div className="mb-6">
            <div className="w-14 h-14 rounded-full border-2 border-horror-red/40 border-t-horror-red animate-spin mx-auto" />
          </div>
          <h2 className="font-creepy text-3xl sm:text-4xl text-horror-red text-glow-red mb-2 animate-pulse">
            GENERATING FORENSIC DOSSIER
          </h2>
          <p className="font-typewriter text-ghost-mist/60 loading-dots">
            Calculating photon dispersion and spiritual severity
          </p>
        </div>
      </div>
    );
  }

  const isSafe = report?.isBenign || (report?.severity <= 3);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8 screen-enter">
        <h2 className={`font-creepy text-4xl sm:text-6xl tracking-widest mb-2 ${isSafe ? 'text-ghost-green text-glow-green' : 'text-horror-red text-glow-red animate-flicker'}`}>
          {isSafe ? 'INVESTIGATION RESOLVED' : 'CONTAINMENT ALERT'}
        </h2>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-horror-red/60 to-transparent mx-auto" />
      </div>

      {error && (
        <p className="text-xs text-yellow-500/80 font-mono mb-4 animate-fadeIn">
          [BACKUP CHANNELS ENGAGED: LOCAL SPECTRAL HEURISTICS DEPLOYED]
        </p>
      )}

      {/* Stats row */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 animate-slideUp">
        {files.photo && (
          <StatBadge
            icon="👁"
            label="Anomalies"
            value={scanResults.orbCount}
            color={isSafe ? 'green' : 'red'}
          />
        )}
        {files.video && (
          <>
            <StatBadge icon="🌡" label="Cold Spots" value={scanResults.coldSpotCount} color="purple" />
            <StatBadge icon="⚡" label="EMF Spikes" value={scanResults.emfSpikeCount} color="yellow" />
          </>
        )}
        {files.audio && (
          <StatBadge icon="🎙" label="EVP Audio" value={scanResults.evpCount} color="blue" />
        )}
      </div>

      {/* Report card */}
      <div ref={reportCardRef} className="w-full flex justify-center">
        <ReportCard report={report} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <button
          id="download-report-btn"
          className="btn-secondary flex items-center gap-2 text-sm"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? '⏳ Rendering...' : '📥 Download Dossier'}
        </button>
        <button
          id="copy-report-btn"
          className="btn-secondary flex items-center gap-2 text-sm"
          onClick={handleCopy}
        >
          {copied ? '✅ Copied!' : '📋 Copy Report Text'}
        </button>
        <button
          id="scan-again-btn"
          className="btn-secondary flex items-center gap-2 text-sm border-horror-red/50 text-horror-red hover:bg-horror-red/20 hover:border-horror-red"
          onClick={onReset}
        >
          🔄 New Investigation
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center opacity-40">
        <p className="text-[11px] font-mono text-ghost-mist/50">
          GHOST DETECTOR • CLASSIFIED RESEARCH PROJECT • TEAM OMEN & IRIS
        </p>
      </div>
    </div>
  );
}

function StatBadge({ icon, label, value, color }) {
  const colorMap = {
    red: 'border-horror-red/50 text-horror-red bg-black/60',
    green: 'border-ghost-green/40 text-ghost-green bg-black/60',
    purple: 'border-purple-500/40 text-purple-400 bg-black/60',
    yellow: 'border-yellow-500/40 text-yellow-400 bg-black/60',
    blue: 'border-blue-500/40 text-blue-400 bg-black/60',
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${colorMap[color]} shadow-lg`}>
      <span className="text-lg">{icon}</span>
      <span className="font-mono text-lg font-bold">{value}</span>
      <span className="text-xs opacity-70 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function generateFallbackReport(results, isSafe) {
  if (isSafe) {
    return 'Detailed optical spectroscopy and thermal profiling confirm that this photograph depicts a completely normal, mortal environment. Ambient daylight photons and balanced surface reflections register zero supernatural pressure. You are completely safe from paranormal disturbances.';
  }

  const lines = [
    'MAY GOD HAVE MERCY ON YOUR HOUSEHOLD. Our optical telemetry has confirmed a horrific, active Class VI supernatural entity within this perimeter.',
  ];

  if (results.orbCount > 0) {
    lines.push(`We locked onto ${results.orbCount} pulsating ectoplasmic anomalies radiating intense spiritual radiation.`);
  }
  if (results.coldSpotCount > 0) {
    lines.push(`Thermal scanners registered ${results.coldSpotCount} localized freezing vortexes draining ambient heat directly from the room.`);
  }
  if (results.emfSpikeCount > 0) {
    lines.push(`EMF meters redlined ${results.emfSpikeCount} times under high-frequency spectral excitation.`);
  }
  if (results.evpCount > 0) {
    lines.push(`Acoustic telemetry isolated ${results.evpCount} distinct disembodied vocalizations whispering in the static.`);
  }

  lines.push('⚠️ EMERGENCY PROTOCOL: Do not fall asleep in this room tonight. Keep all lights turned on. Do not look behind you.');

  return lines.join(' ');
}
