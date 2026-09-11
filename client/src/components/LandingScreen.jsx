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
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-creepy text-5xl sm:text-7xl text-ghost-green animate-flicker text-glow-green tracking-wider mb-4">
          GHOST DETECTOR
        </h1>
        <p className="font-typewriter text-ghost-mist/60 text-lg sm:text-xl tracking-wide">
          Upload evidence. Uncover the truth.
        </p>
        <div className="mt-4 w-32 h-px bg-gradient-to-r from-transparent via-ghost-green/40 to-transparent mx-auto" />
      </div>

      {/* Upload slots */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full mb-12">
        <FileUploadSlot
          type="photo"
          label="Upload a photo of the location"
          accept="image/*"
          file={files.photo}
          onFileChange={handleFileChange('photo')}
        />
        <FileUploadSlot
          type="video"
          label="Upload a video clip"
          accept="video/*"
          file={files.video}
          onFileChange={handleFileChange('video')}
        />
        <FileUploadSlot
          type="audio"
          label="Upload an audio recording"
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
          ▶ BEGIN PARANORMAL SCAN
        </button>
        {!hasAnyFile && (
          <p className="text-xs text-ghost-mist/40 font-typewriter animate-fadeIn">
            Upload at least one file to begin
          </p>
        )}
      </div>

      {/* Footer badge */}
      <div className="mt-16 text-center opacity-40">
        <p className="text-xs font-typewriter text-ghost-mist/50">
          Team Omen & Iris — TinkerHub Useless Projects
        </p>
      </div>
    </div>
  );
}
