import React from 'react';

// Spectral avatar graphics corresponding to different ghost classes
const GHOST_AVATARS = {
  poltergeist: (
    <svg viewBox="0 0 100 100" className="w-20 h-20 filter drop-shadow-[0_0_15px_rgba(0,255,136,0.6)] animate-pulse">
      <defs>
        <radialGradient id="poltGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#00bb66" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0a0a0c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#poltGrad)" />
      <path d="M30 40 Q40 25 50 40 Q60 25 70 40 Q75 60 65 75 Q50 85 35 75 Q25 60 30 40 Z" fill="#00ff88" opacity="0.85" />
      <circle cx="42" cy="48" r="4" fill="#0a0a0c" />
      <circle cx="58" cy="48" r="4" fill="#0a0a0c" />
      <ellipse cx="50" cy="62" rx="6" ry="9" fill="#0a0a0c" />
      <path d="M25 75 Q35 90 45 78 Q55 90 65 78 Q75 90 85 75" stroke="#00ff88" strokeWidth="2.5" fill="none" opacity="0.7" />
    </svg>
  ),
  shadow: (
    <svg viewBox="0 0 100 100" className="w-20 h-20 filter drop-shadow-[0_0_15px_rgba(255,34,68,0.6)] animate-pulse">
      <defs>
        <radialGradient id="shadGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff2244" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#440011" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0a0a0c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#shadGrad)" />
      <path d="M32 30 Q50 15 68 30 Q78 50 72 75 Q50 88 28 75 Q22 50 32 30 Z" fill="#140206" stroke="#ff2244" strokeWidth="2" />
      <circle cx="43" cy="44" r="3.5" fill="#ff2244" className="animate-ping" />
      <circle cx="57" cy="44" r="3.5" fill="#ff2244" className="animate-ping" />
      <path d="M42 64 Q50 56 58 64" stroke="#ff2244" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  wraith: (
    <svg viewBox="0 0 100 100" className="w-20 h-20 filter drop-shadow-[0_0_15px_rgba(68,136,255,0.6)] animate-pulse">
      <defs>
        <radialGradient id="wraithGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4488ff" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#113388" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0a0a0c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#wraithGrad)" />
      <path d="M35 32 Q50 18 65 32 Q74 55 64 78 Q50 92 36 78 Q26 55 35 32 Z" fill="#4488ff" opacity="0.8" />
      <ellipse cx="44" cy="46" rx="3.5" ry="5" fill="#0a0a0c" />
      <ellipse cx="56" cy="46" rx="3.5" ry="5" fill="#0a0a0c" />
      <path d="M43 62 Q50 70 57 62" stroke="#0a0a0c" strokeWidth="3" fill="none" />
      <path d="M22 65 Q15 45 28 35" stroke="#4488ff" strokeWidth="2" strokeDasharray="3,3" fill="none" />
      <path d="M78 65 Q85 45 72 35" stroke="#4488ff" strokeWidth="2" strokeDasharray="3,3" fill="none" />
    </svg>
  ),
  champion: (
    <svg viewBox="0 0 100 100" className="w-20 h-20 filter drop-shadow-[0_0_18px_rgba(234,179,8,0.8)] animate-pulse">
      <defs>
        <radialGradient id="champGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eab308" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#854d0e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0a0a0c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#champGrad)" />
      {/* Crown */}
      <polygon points="32,35 40,20 50,30 60,20 68,35" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
      <path d="M35 38 Q50 25 65 38 Q74 60 64 80 Q50 92 36 80 Q26 60 35 38 Z" fill="#eab308" opacity="0.85" />
      <ellipse cx="44" cy="48" rx="3.5" ry="4.5" fill="#0a0a0c" />
      <ellipse cx="56" cy="48" rx="3.5" ry="4.5" fill="#0a0a0c" />
      <path d="M43 65 Q50 72 57 65" stroke="#0a0a0c" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Golden stars / aura */}
      <circle cx="22" cy="30" r="2" fill="#fef08a" className="animate-ping" />
      <circle cx="78" cy="30" r="2" fill="#fef08a" className="animate-ping" />
      <circle cx="50" cy="12" r="2.5" fill="#fef08a" />
    </svg>
  ),
  eldritch: (
    <svg viewBox="0 0 100 100" className="w-20 h-20 filter drop-shadow-[0_0_18px_rgba(168,85,247,0.7)] animate-pulse">
      <defs>
        <radialGradient id="eldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#581c87" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0a0a0c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#eldGrad)" />
      <circle cx="50" cy="50" r="26" fill="#2e1065" stroke="#c084fc" strokeWidth="2" />
      <circle cx="50" cy="50" r="12" fill="#a855f7" />
      <circle cx="50" cy="50" r="5" fill="#000" />
      {/* Eye rays / tentacles */}
      <path d="M20 50 Q10 30 25 15 M80 50 Q90 30 75 15 M50 20 Q30 5 50 2 M50 80 Q70 95 50 98" stroke="#c084fc" strokeWidth="2" fill="none" />
    </svg>
  ),
};

export default function ReportCard({ report }) {
  if (!report) return null;

  const { verdict, severity, ghostName, threatClass, spectralSignature } = report;
  const severityNum = typeof severity === 'number' ? severity : parseInt(severity) || 7;

  // Choose corresponding ghost visual style
  let avatar = GHOST_AVATARS.poltergeist;
  let themeBorder = 'border-ghost-green/40';
  let badgeTitle = ghostName || 'Specter Apparition';
  let badgeThreat = threatClass || 'Class IV Kinetic Anomaly';

  if (badgeTitle.toLowerCase().includes('champion') || badgeTitle.toLowerCase().includes('athletic') || badgeTitle.toLowerCase().includes('arena')) {
    avatar = GHOST_AVATARS.champion;
    themeBorder = 'border-yellow-500/50';
  } else if (badgeTitle.toLowerCase().includes('shadow')) {
    avatar = GHOST_AVATARS.shadow;
    themeBorder = 'border-ghost-red/40';
  } else if (badgeTitle.toLowerCase().includes('widow') || badgeTitle.toLowerCase().includes('wraith')) {
    avatar = GHOST_AVATARS.wraith;
    themeBorder = 'border-blue-500/40';
  } else if (badgeTitle.toLowerCase().includes('eldritch') || severityNum >= 9) {
    avatar = GHOST_AVATARS.eldritch;
    themeBorder = 'border-purple-500/40';
  }

  // Color based on severity
  let barColor = 'from-ghost-green to-ghost-blue';
  if (severityNum >= 8) {
    barColor = 'from-ghost-red to-orange-500';
  } else if (severityNum >= 5) {
    barColor = 'from-yellow-500 to-orange-500';
  }

  return (
    <div className={`spooky-card max-w-2xl w-full p-8 animate-slideUp relative overflow-hidden border ${themeBorder}`}>
      {/* Decorative corner glyphs */}
      <div className="absolute top-3 left-3 text-ghost-green/30 font-creepy text-lg">☠</div>
      <div className="absolute top-3 right-3 text-ghost-green/30 font-creepy text-lg">☠</div>
      <div className="absolute bottom-3 left-3 text-ghost-green/30 font-creepy text-lg">☠</div>
      <div className="absolute bottom-3 right-3 text-ghost-green/30 font-creepy text-lg">☠</div>

      {/* Header */}
      <div className="text-center mb-6">
        <p className="font-typewriter text-xs text-ghost-mist/50 tracking-[0.3em] uppercase mb-1">
          Confidential Paranormal Dossier
        </p>
        <h3 className="font-creepy text-3xl text-ghost-green text-glow-green">
          GHOST DETECTOR VERDICT
        </h3>
        <div className="mt-2 w-full h-px bg-gradient-to-r from-transparent via-ghost-border to-transparent" />
      </div>

      {/* Ghost Identity Header with Visual Apparition Avatar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-xl bg-ghost-dark/70 border border-ghost-border mb-6">
        <div className="flex-shrink-0 flex items-center justify-center p-2 rounded-full bg-ghost-black/80 border border-ghost-border">
          {avatar}
        </div>
        <div className="text-center sm:text-left flex-1">
          <p className="text-xs uppercase tracking-widest text-ghost-mist/50 font-mono">Entity Identification</p>
          <h4 className="text-xl sm:text-2xl font-creepy text-ghost-green tracking-wide">{badgeTitle}</h4>
          <p className="text-xs text-purple-400 font-mono mt-1">⚠️ {badgeThreat}</p>
          {spectralSignature && (
            <p className="text-[11px] text-ghost-mist/60 font-mono mt-1">
              Sig: <span className="text-cyan-300">{spectralSignature}</span>
            </p>
          )}
        </div>
      </div>

      {/* Severity badge */}
      <div className="text-center mb-6">
        <p className="font-typewriter text-sm text-ghost-mist/50 mb-1">Haunting Severity Level</p>
        <div className="severity-badge">{severityNum}/10</div>

        {/* Severity bar */}
        <div className="w-56 h-2.5 bg-ghost-border rounded-full mx-auto mt-2 overflow-hidden shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-1000`}
            style={{ width: `${severityNum * 10}%` }}
          />
        </div>

        <p className="font-creepy text-base mt-2 tracking-wide" style={{ color: severityNum >= 8 ? '#ff2244' : severityNum >= 5 ? '#eab308' : '#00ff88' }}>
          {severityNum >= 9
            ? '🔥 CATASTROPHIC CATACLYSMIC INVASION'
            : severityNum >= 7
              ? '⚠️ EXTREME PARANORMAL INFESTATION'
              : severityNum >= 5
                ? '⚡ SIGNIFICANT SPECTRAL ACTIVITY'
                : '👁 RESIDUAL ENERGY TRACE'}
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-ghost-border" />
        <span className="text-ghost-mist/40 text-sm">✦ ✦ ✦</span>
        <div className="flex-1 h-px bg-ghost-border" />
      </div>

      {/* Verdict text */}
      <div className="p-5 rounded-lg bg-ghost-black/40 border border-ghost-border/40 mb-4">
        <p className="font-typewriter text-ghost-mist/90 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
          {verdict}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-ghost-border/50 text-center">
        <p className="font-typewriter text-xs text-ghost-mist/40">
          Scanned with Ghost Detector — Team Omen & Iris • Paranormal Division
        </p>
      </div>
    </div>
  );
}
