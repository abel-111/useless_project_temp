import React, { useEffect, useState, memo } from 'react';

/**
 * GhostAtmosphere — v2.0
 * Features:
 * 1. Drifting translucent spectral apparitions (3 ghosts)
 * 2. Periodic subliminal shadow manifestation / jumpscare gaze (2 variants)
 * 3. Ectoplasm ember particles (10)
 * 4. Blood drips from top of screen
 * 5. Candle-flicker ambient glow corners
 * 6. Auto-pause when tab is inactive
 */
function GhostAtmosphere() {
  const [jumpscareVisible, setJumpscareVisible] = useState(false);
  const [jumpscarePos, setJumpscarePos]         = useState({ top: '20%', left: '80%' });
  const [jumpscareVariant, setJumpscareVariant] = useState(0); // 0 = demon, 1 = hands
  const [isActive, setIsActive]                 = useState(!document.hidden);

  // Pause when tab is hidden
  useEffect(() => {
    const handler = () => setIsActive(!document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  // Periodic jumpscare (every 12–20 s)
  useEffect(() => {
    if (!isActive) return;
    let timeoutId;
    const schedule = () => {
      const delay = 12000 + Math.random() * 8000;
      timeoutId = setTimeout(() => {
        const positions = [
          { top: '15%', left: '82%' },
          { top: '65%', left: '8%'  },
          { top: '25%', left: '12%' },
          { top: '70%', left: '78%' },
          { top: '40%', left: '90%' },
        ];
        setJumpscarePos(positions[Math.floor(Math.random() * positions.length)]);
        setJumpscareVariant(Math.random() > 0.5 ? 0 : 1);
        setJumpscareVisible(true);
        setTimeout(() => { setJumpscareVisible(false); schedule(); }, 1800);
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, [isActive]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[2] select-none">

      {/* ── Candle glow corners ── */}
      <div className="candle-glow candle-glow-1" style={{ zIndex: 1 }} />
      <div className="candle-glow candle-glow-2" style={{ zIndex: 1 }} />

      {/* ── Blood drips from top ── */}
      <div className="blood-drip-container">
        <div className="blood-drip drip-1"  />
        <div className="blood-drip drip-2"  />
        <div className="blood-drip drip-3"  />
        <div className="blood-drip drip-4"  />
        <div className="blood-drip drip-5"  />
        <div className="blood-drip drip-6"  />
        <div className="blood-drip drip-7"  />
        <div className="blood-drip drip-8"  />
        <div className="blood-drip drip-9"  />
        <div className="blood-drip drip-10" />
      </div>

      {/* ── Floating Ghost 1 (The Drifting Wraith) ── */}
      <div className="ghost-apparition-1 absolute will-change-transform opacity-30 filter drop-shadow-[0_0_25px_rgba(0,255,136,0.3)]">
        <svg width="140" height="200" viewBox="0 0 100 150" fill="none">
          <defs>
            <linearGradient id="wraithGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="35%"  stopColor="#00ff88" stopOpacity="0.4" />
              <stop offset="70%"  stopColor="#042215" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0"   />
            </linearGradient>
          </defs>
          <path d="M50 15 C30 15 20 35 25 65 C18 80 12 110 16 145 Q30 125 40 145 Q50 125 60 145 Q70 125 84 145 C88 110 82 80 75 65 C80 35 70 15 50 15 Z" fill="url(#wraithGrad)" />
          <ellipse cx="42" cy="40" rx="3.5" ry="6"  fill="#040406" />
          <ellipse cx="58" cy="40" rx="3.5" ry="6"  fill="#040406" />
          <ellipse cx="50" cy="58" rx="4"   ry="7"  fill="#040406" />
        </svg>
      </div>

      {/* ── Floating Ghost 2 (The Crimson Shade) ── */}
      <div className="ghost-apparition-2 absolute will-change-transform opacity-25 filter drop-shadow-[0_0_30px_rgba(255,0,51,0.35)]">
        <svg width="180" height="240" viewBox="0 0 120 160" fill="none">
          <defs>
            <linearGradient id="shadeGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor="#ff1a4a" stopOpacity="0.75" />
              <stop offset="40%"  stopColor="#880017" stopOpacity="0.35" />
              <stop offset="85%"  stopColor="#1a0005" stopOpacity="0.1"  />
              <stop offset="100%" stopColor="#000000" stopOpacity="0"    />
            </linearGradient>
          </defs>
          <path d="M60 12 C35 12 24 38 28 72 C18 95 10 130 18 158 Q36 138 50 158 Q60 138 72 158 Q85 138 102 158 C110 130 102 95 92 72 C96 38 85 12 60 12 Z" fill="url(#shadeGrad)" />
          <circle cx="50" cy="45" r="4"  fill="#ffffff" />
          <circle cx="70" cy="45" r="4"  fill="#ffffff" />
          <circle cx="50" cy="45" r="2"  fill="#ff0033" />
          <circle cx="70" cy="45" r="2"  fill="#ff0033" />
          <path d="M52 65 Q60 58 68 65 Q60 76 52 65 Z" fill="#040406" />
        </svg>
      </div>

      {/* ── Floating Ghost 3 (Pale Phantom Wisp) ── */}
      <div className="ghost-apparition-3 absolute will-change-transform opacity-20 filter drop-shadow-[0_0_20px_rgba(68,136,255,0.3)]">
        <svg width="120" height="180" viewBox="0 0 100 140" fill="none">
          <defs>
            <radialGradient id="wispGrad" cx="50%" cy="30%" r="70%">
              <stop offset="0%"   stopColor="#aaccff" stopOpacity="0.8" />
              <stop offset="50%"  stopColor="#224488" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0"   />
            </radialGradient>
          </defs>
          <path d="M50 15 Q30 30 32 70 Q15 105 25 135 Q45 115 50 135 Q55 115 75 135 Q85 105 68 70 Q70 30 50 15 Z" fill="url(#wispGrad)" />
          <circle cx="43" cy="38" r="3" fill="#040406" />
          <circle cx="57" cy="38" r="3" fill="#040406" />
        </svg>
      </div>

      {/* ── Jumpscare Manifestation ── */}
      {jumpscareVisible && (
        <div
          className="absolute transition-opacity duration-200 pointer-events-none will-change-transform animate-flicker"
          style={{ top: jumpscarePos.top, left: jumpscarePos.left, transform: 'translate(-50%, -50%)', zIndex: 9990 }}
        >
          {jumpscareVariant === 0 ? (
            /* Demon gaze */
            <div className="relative flex flex-col items-center">
              <svg width="160" height="160" viewBox="0 0 100 100" className="filter drop-shadow-[0_0_25px_rgba(255,0,51,0.95)]">
                <path d="M20 50 Q50 10 80 50 Q90 85 80 95 Q50 85 20 95 Q10 85 20 50 Z" fill="#0a0002" stroke="#ff0033" strokeWidth="1.5" opacity="0.85" />
                <ellipse cx="38" cy="46" rx="6" ry="3" fill="#ff0033" className="animate-ping" />
                <ellipse cx="62" cy="46" rx="6" ry="3" fill="#ff0033" className="animate-ping" />
                <circle  cx="38" cy="46" r="3"  fill="#ffffff" />
                <circle  cx="62" cy="46" r="3"  fill="#ffffff" />
                <path d="M35 68 L40 64 L45 68 L50 64 L55 68 L60 64 L65 68" stroke="#ffffff" strokeWidth="1.5" fill="none" />
              </svg>
              <div className="text-[10px] font-mono text-horror-red tracking-widest bg-black/80 px-2 py-0.5 rounded border border-horror-red/60 animate-pulse mt-1">
                [THEY ARE WATCHING]
              </div>
            </div>
          ) : (
            /* Ghostly hands reaching up */
            <div className="relative flex flex-col items-center">
              <svg width="140" height="120" viewBox="0 0 140 120" className="filter drop-shadow-[0_0_20px_rgba(200,200,255,0.7)]">
                <defs>
                  <radialGradient id="handGrad" cx="50%" cy="100%" r="70%">
                    <stop offset="0%"   stopColor="#cce0ff" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#000010" stopOpacity="0"    />
                  </radialGradient>
                </defs>
                <path d="M30 110 Q28 80 26 60 Q24 40 28 35 Q30 32 32 35 Q34 25 36 35 Q38 22 40 35 Q42 28 44 38 Q46 50 44 70 Q42 90 40 110 Z" fill="url(#handGrad)" stroke="rgba(180,200,255,0.35)" strokeWidth="1"/>
                <path d="M96 110 Q98 80 100 60 Q102 40 98 35 Q96 32 94 35 Q92 25 90 35 Q88 22 86 35 Q84 28 82 38 Q80 50 82 70 Q84 90 86 110 Z" fill="url(#handGrad)" stroke="rgba(180,200,255,0.35)" strokeWidth="1"/>
              </svg>
              <div className="text-[10px] font-mono text-blue-300 tracking-widest bg-black/80 px-2 py-0.5 rounded border border-blue-400/40 animate-pulse mt-1">
                [IT REACHES FOR YOU]
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Ectoplasm Ember Particles (10) ── */}
      <div className="ectoplasm-particles">
        <div className="ember ember-1"  />
        <div className="ember ember-2"  />
        <div className="ember ember-3"  />
        <div className="ember ember-4"  />
        <div className="ember ember-5"  />
        <div className="ember ember-6"  />
        <div className="ember ember-7"  />
        <div className="ember ember-8"  />
        <div className="ember ember-9"  />
        <div className="ember ember-10" />
      </div>
    </div>
  );
}

export default memo(GhostAtmosphere);
