import React, { useCallback } from 'react';
import FileUploadSlot from './FileUploadSlot';

export default function LandingScreen({ files, onFilesChange, onBeginScan }) {
  const hasAnyFile = files.photo || files.video || files.audio;

  const handleFileChange = useCallback(
    (type) => (file) => {
      onFilesChange({ ...files, [type]: file });
    },
    [files, onFilesChange]
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Top Paranormal Warning Banner */}
      <div className="mb-6 flex items-center gap-3 px-4 py-1.5 rounded-full border border-horror-red/40 bg-black/80 shadow-[0_0_20px_rgba(255,0,51,0.2)]">
        <span className="w-2.5 h-2.5 rounded-full bg-horror-red animate-ping" />
        <span className="text-[11px] sm:text-xs font-mono tracking-widest text-horror-red font-semibold uppercase">
          WARNING: REAL-TIME OPTICAL SEANCE TERMINAL ACTIVE
        </span>
      </div>

      {/* Header with Horror Glitch */}
      <div className="text-center mb-10 max-w-2xl">
        <h1
          className="font-creepy text-6xl sm:text-8xl text-horror-red text-glow-red tracking-widest mb-3 horror-glitch"
          data-text="GHOST DETECTOR"
        >
          GHOST DETECTOR
        </h1>
        <p className="font-typewriter text-ghost-mist/80 text-base sm:text-xl tracking-wide max-w-xl mx-auto leading-relaxed">
          Upload real photo, video, or audio evidence. The optical engine will dissect spectral frequencies to expose the truth.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="w-24 h-px bg-gradient-to-r from-transparent to-horror-red/60" />
          <span className="text-horror-red text-xs font-mono">REC ● [CH-06: 00:00:66]</span>
          <div className="w-24 h-px bg-gradient-to-l from-transparent to-horror-red/60" />
        </div>
      </div>

      {/* Upload slots */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full mb-10">
        <FileUploadSlot
          type="photo"
          label="Location or Subject Photograph"
          accept="image/*"
          file={files.photo}
          onFileChange={handleFileChange('photo')}
        />
        <FileUploadSlot
          type="video"
          label="Surveillance / Cold-Spot Video"
          accept="video/*"
          file={files.video}
          onFileChange={handleFileChange('video')}
        />
        <FileUploadSlot
          type="audio"
          label="EVP Acoustic Tape Recording"
          accept="audio/*"
          file={files.audio}
          onFileChange={handleFileChange('audio')}
        />
      </div>

      {/* Scan button */}
      <div className="flex flex-col items-center gap-3">
        <button
          id="begin-scan-btn"
          className="btn-scan"
          disabled={!hasAnyFile}
          onClick={onBeginScan}
        >
          ☠ INITIATE PARANORMAL SCAN ☠
        </button>
        {!hasAnyFile && (
          <p className="text-xs text-horror-red/60 font-mono tracking-wider animate-pulse">
            [AWAITING EVIDENCE INPUT: UPLOAD AT LEAST ONE MEDIA SAMPLE]
          </p>
        )}
      </div>

      {/* Footer warning */}
      <div className="mt-14 text-center opacity-60">
        <p className="text-[11px] font-mono text-ghost-mist/50 tracking-wider">
          CLASSIFIED PARANORMAL DIVISION • OMEN & IRIS RESEARCH LABS
        </p>
      </div>
    </div>
  );
}
