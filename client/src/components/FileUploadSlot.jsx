import React, { useRef, useState } from 'react';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ICONS = {
  photo: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  video: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  audio: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
};

export default function FileUploadSlot({ type, label, accept, file, onFileChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    setError(null);
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      setError('Evidence size exceeded (max 50MB)');
      return;
    }
    const expectedType = type === 'photo' ? 'image' : type;
    if (!f.type.startsWith(expectedType)) {
      setError(`Invalid evidence format. Please provide a ${type} file.`);
      return;
    }
    onFileChange(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const previewUrl = React.useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const preview = previewUrl ? renderPreview(type, previewUrl) : null;

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div
        className={`upload-slot relative w-full p-6 flex flex-col items-center justify-center min-h-[190px] transition-all rounded-xl ${
          file ? 'has-file border-horror-red/80 bg-horror-card shadow-[0_0_20px_rgba(255,0,51,0.15)]' : ''
        } ${dragOver ? 'border-horror-red bg-horror-red/10 scale-[1.02]' : ''}`}
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
          id={`upload-${type}`}
        />

        {file ? (
          <div className="relative w-full flex flex-col items-center gap-2">
            {preview}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-horror-red animate-ping" />
              <p className="text-xs text-horror-bone font-mono truncate max-w-[200px]">{file.name}</p>
            </div>
            <button
              onClick={handleRemove}
              className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-horror-red text-white text-xs flex items-center justify-center hover:bg-red-700 transition-colors shadow-md"
              title="Purge evidence"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <div className="text-horror-red/40 group-hover:text-horror-red mb-3 transition-colors">{ICONS[type]}</div>
            <p className="text-sm text-ghost-mist/80 text-center leading-relaxed font-typewriter">{label}</p>
            <p className="text-[11px] font-mono text-ghost-mist/40 mt-2">CLICK OR DROP TO LOAD EVIDENCE</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-horror-red mt-1 font-mono animate-fadeIn">[ERROR: {error}]</p>
      )}
    </div>
  );
}

function renderPreview(type, url) {
  if (type === 'photo') {
    return (
      <div className="relative w-full h-28 overflow-hidden rounded-lg border border-horror-border/80">
        <img
          src={url}
          alt="Uploaded photo preview"
          className="w-full h-full object-cover opacity-85 contrast-110"
        />
        <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-horror-red">
          RAW EVIDENCE
        </div>
      </div>
    );
  }
  if (type === 'video') {
    return (
      <div className="relative w-full h-28 overflow-hidden rounded-lg border border-horror-border/80">
        <video
          src={url}
          className="w-full h-full object-cover opacity-85"
          muted
        />
        <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-horror-red">
          VIDEO STREAM
        </div>
      </div>
    );
  }
  if (type === 'audio') {
    return (
      <div className="flex items-center gap-2 text-horror-red py-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <span className="text-xs font-mono tracking-wider">EVP TAPE MOUNTED</span>
      </div>
    );
  }
  return null;
}
