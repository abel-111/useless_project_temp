import React from 'react';

export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      id="sound-toggle"
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full border border-ghost-border bg-ghost-dark flex items-center justify-center hover:border-ghost-green transition-colors"
      title={enabled ? 'Mute sound effects' : 'Enable sound effects'}
    >
      {enabled ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 010 7.07" />
          <path d="M19.07 4.93a10 10 0 010 14.14" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
