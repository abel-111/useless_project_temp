import React from 'react';

// Spectral avatar graphics corresponding to different ghost classes
const GHOST_AVATARS = {
  safe: (
    <svg viewBox="0 0 100 100" className="w-20 h-20 filter drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]">
      <defs>
        <radialGradient id="safeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#00552b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#040406" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#safeGrad)" />
      {/* Shield outline */}
      <path d="M50 20 L75 32 V55 C75 72 50 85 50 85 C50 85 25 72 25 55 V32 Z" fill="#0c1f14" stroke="#00ff88" strokeWidth="2.5" />
      {/* Friendly checkmark / living pulse */}
      <path d="M38 52 L46 60 L64 42" stroke="#00ff88" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  shadow_demon: (
    <svg viewBox="0 0 100 100" className="w-20 h-20 filter drop-shadow-[0_0_20px_rgba(255,0,51,0.9)] animate-pulse">
      <defs>
        <radialGradient id="demonGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff0033" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#660010" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#040406" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#demonGrad)" />
      {/* Demonic Horned Skull Silhouette */}
      <path d="M22 26 Q30 40 36 46 Q26 62 34 78 Q50 86 66 78 Q74 62 64 46 Q70 40 78 26 Q64 32 58 40 Q50 36 42 40 Q36 32 22 26 Z" fill="#120004" stroke="#ff0033" strokeWidth="2" />
      {/* Bleeding hollow eyes */}
      <circle cx="43" cy="54" r="4.5" fill="#ff0033" className="animate-ping" />
      <circle cx="57" cy="54" r="4.5" fill="#ff0033" className="animate-ping" />
      <circle cx="43" cy="54" r="2.5" fill="#ffffff" />
      <circle cx="57" cy="54" r="2.5" fill="#ffffff" />
      {/* Vicious screaming jaw */}
      <path d="M40 68 Q50 62 60 68 Q50 78 40 68 Z" fill="#000000" stroke="#ff0033" strokeWidth="1.5" />
      {/* Sharp teeth */}
      <path d="M42 66 L45 70 L48 66 L51 70 L54 66 L57 70 L59 66" stroke="#ffffff" strokeWidth="1.2" fill="none" />
    </svg>
  ),
  poltergeist: (
    <svg viewBox="0 0 100 100" className="w-20 h-20 filter drop-shadow-[0_0_18px_rgba(255,80,0,0.8)] animate-horror_shake">
      <defs>
        <radialGradient id="poltGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff5500" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#661a00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#040406" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#poltGrad)" />
      {/* Erratic ghost shape */}
      <path d="M28 36 Q40 18 52 36 Q64 18 72 36 Q80 58 68 76 Q50 90 32 76 Q20 58 28 36 Z" fill="#1c0700" stroke="#ff5500" strokeWidth="2" />
      <ellipse cx="42" cy="46" rx="4" ry="7" fill="#ff5500" />
      <ellipse cx="58" cy="46" rx="4" ry="7" fill="#ff5500" />
      <ellipse cx="50" cy="65" rx="8" ry="12" fill="#000000" stroke="#ff5500" strokeWidth="1.5" />
    </svg>
  ),
  cryo: (
    <svg viewBox="0 0 100 100" className="w-20 h-20 filter drop-shadow-[0_0_18px_rgba(0,180,255,0.7)] animate-pulse">
      <defs>
        <radialGradient id="cryoGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00b4ff" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#002244" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#040406" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#cryoGrad)" />
      <path d="M34 30 Q50 14 66 30 Q76 55 64 80 Q50 94 36 80 Q24 55 34 30 Z" fill="#051525" stroke="#00b4ff" strokeWidth="2" />
      <circle cx="44" cy="46" r="4" fill="#00b4ff" />
      <circle cx="56" cy="46" r="4" fill="#00b4ff" />
      {/* Frozen tears */}
      <path d="M44 52 L44 64 M56 52 L56 64" stroke="#70d8ff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M43 68 Q50 74 57 68" stroke="#00b4ff" strokeWidth="2" fill="none" />
    </svg>
  ),
  eldritch: (
    <svg viewBox="0 0 100 100" className="w-20 h-20 filter drop-shadow-[0_0_22px_rgba(168,85,247,0.8)] animate-pulse">
      <defs>
        <radialGradient id="eldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#450a75" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#040406" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#eldGrad)" />
      <circle cx="50" cy="50" r="26" fill="#1e053a" stroke="#c084fc" strokeWidth="2" />
      <circle cx="50" cy="50" r="14" fill="#a855f7" />
      <ellipse cx="50" cy="50" rx="4" ry="10" fill="#000000" />
      {/* Void Tendrils */}
      <path d="M18 50 Q8 28 24 14 M82 50 Q92 28 76 14 M50 18 Q28 4 50 2 M50 82 Q72 96 50 98" stroke="#c084fc" strokeWidth="2" fill="none" />
    </svg>
  ),
};

export default function ReportCard({ report }) {
  if (!report) return null;

  const { verdict, severity, ghostName, threatClass, spectralSignature, isBenign } = report;
  const severityNum = typeof severity === 'number' ? severity : parseInt(severity) || 5;

  const isSafe = isBenign || severityNum <= 3;
  const isExtreme = severityNum >= 8;

  // Pick avatar
  let avatar = GHOST_AVATARS.shadow_demon;
  let themeBorder = 'border-horror-red/80';
  let badgeTitle = ghostName || 'Apparition Unknown';
  let badgeThreat = threatClass || 'Class IV Entity';

  if (isSafe) {
    avatar = GHOST_AVATARS.safe;
    themeBorder = 'border-ghost-green/60';
  } else if (badgeTitle.toLowerCase().includes('poltergeist') || badgeTitle.toLowerCase().includes('kinetic')) {
    avatar = GHOST_AVATARS.poltergeist;
    themeBorder = 'border-orange-600/80';
  } else if (badgeTitle.toLowerCase().includes('cryo') || badgeTitle.toLowerCase().includes('specter') || badgeTitle.toLowerCase().includes('widow')) {
    avatar = GHOST_AVATARS.cryo;
    themeBorder = 'border-cyan-500/80';
  } else if (badgeTitle.toLowerCase().includes('eldritch') || badgeTitle.toLowerCase().includes('void') || severityNum >= 9) {
    avatar = GHOST_AVATARS.eldritch;
    themeBorder = 'border-purple-600/80';
  }

  return (
    <div className={`spooky-card max-w-2xl w-full p-8 animate-slideUp relative overflow-hidden border ${themeBorder} shadow-[0_0_50px_rgba(0,0,0,0.9)]`}>
      {/* Decorative corner hazard markings */}
      <div className="absolute top-3 left-3 font-mono text-xs opacity-40 text-horror-red">[01]</div>
      <div className="absolute top-3 right-3 font-mono text-xs opacity-40 text-horror-red">[SEC-9]</div>
      <div className="absolute bottom-3 left-3 font-mono text-xs opacity-40 text-horror-red">[ARCHIVE]</div>
      <div className="absolute bottom-3 right-3 font-mono text-xs opacity-40 text-horror-red">[TOP-SECRET]</div>

      {/* Header Dossier Stamp */}
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 mb-2 rounded border text-[10px] font-mono tracking-widest uppercase font-bold"
          style={{
            borderColor: isSafe ? '#00ff88' : '#ff0033',
            color: isSafe ? '#00ff88' : '#ff0033',
            backgroundColor: isSafe ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 0, 51, 0.1)',
          }}
        >
          {isSafe ? '✓ STATUS: 100% MORTAL / ZERO ENTITY PRESSURE' : '⚠️ STATUS: CRITICAL PARANORMAL CONTAMINATION'}
        </div>
        <h3 className={`font-creepy text-4xl sm:text-5xl tracking-widest ${isSafe ? 'text-ghost-green text-glow-green' : 'text-horror-red text-glow-red'}`}>
          {isSafe ? 'OFFICIAL CLEARANCE REPORT' : 'PARANORMAL FORENSIC DOSSIER'}
        </h3>
        <div className="mt-2 w-full h-px bg-gradient-to-r from-transparent via-horror-border to-transparent" />
      </div>

      {/* Entity Profile Card */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-5 rounded-xl bg-horror-card border border-horror-border mb-6">
        <div className="flex-shrink-0 flex items-center justify-center p-2 rounded-full bg-black/80 border border-horror-border">
          {avatar}
        </div>
        <div className="text-center sm:text-left flex-1">
          <p className="text-[10px] uppercase tracking-widest text-ghost-mist/50 font-mono">Forensic Classification</p>
          <h4 className={`text-xl sm:text-2xl font-creepy tracking-wider ${isSafe ? 'text-ghost-green' : 'text-horror-red'}`}>
            {badgeTitle}
          </h4>
          <p className="text-xs font-mono mt-1" style={{ color: isSafe ? '#00ff88' : '#ff5500' }}>
            {isSafe ? '● ' : '⚠️ '}{badgeThreat}
          </p>
          {spectralSignature && (
            <p className="text-[11px] text-ghost-mist/70 font-mono mt-1.5 leading-tight">
              Spectrometry: <span className="text-horror-bone">{spectralSignature}</span>
            </p>
          )}
        </div>
      </div>

      {/* Severity Badge & Gauge */}
      <div className="text-center mb-6">
        <p className="font-typewriter text-xs uppercase tracking-widest text-ghost-mist/60 mb-1">
          Haunting Severity Index
        </p>
        <div className={isSafe ? 'severity-badge-safe' : 'severity-badge'}>
          {severityNum}/10
        </div>

        {/* Severity Bar */}
        <div className="w-64 h-3 bg-black rounded-full mx-auto mt-2 overflow-hidden border border-horror-border p-[1px]">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isSafe
                ? 'bg-gradient-to-r from-ghost-green to-emerald-400'
                : severityNum >= 8
                  ? 'bg-gradient-to-r from-horror-blood via-horror-red to-orange-500 animate-pulse'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500'
            }`}
            style={{ width: `${Math.max(10, severityNum * 10)}%` }}
          />
        </div>

        <p className="font-creepy text-lg mt-2 tracking-widest"
          style={{ color: isSafe ? '#00ff88' : isExtreme ? '#ff0033' : '#eab308' }}
        >
          {isSafe
            ? '✓ NORMAL UNHAUNTED REALM (SAFE)'
            : severityNum >= 9
              ? '🔥 CLASS VI APEX HORROR: FATAL HAZARD'
              : severityNum >= 7
                ? '⚠️ EXTREME PARANORMAL INFESTATION'
                : '👁 MODERATE RESIDUAL SPIRITUAL ACTIVITY'}
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-horror-border/60" />
        <span className="text-horror-red/40 text-sm">☠ ☠ ☠</span>
        <div className="flex-1 h-px bg-horror-border/60" />
      </div>

      {/* Investigator Verdict Text */}
      <div className="p-5 rounded-lg bg-black/60 border border-horror-border/80 mb-4">
        <p className="font-typewriter text-ghost-mist leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
          {verdict}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-horror-border/40 text-center">
        <p className="font-mono text-[10px] text-ghost-mist/40 tracking-wider">
          CLASSIFIED EVIDENCE RECORD • TEAM OMEN & IRIS PARANORMAL DIVISION
        </p>
      </div>
    </div>
  );
}
