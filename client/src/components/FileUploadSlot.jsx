import React, { useRef, useState } from 'react';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ICONS = {
  photo: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  video: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  audio: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      setError('File too large (max 50MB)');
      return;
    }
    // Basic type check
    const expectedType = type === 'photo' ? 'image' : type;
    if (!f.type.startsWith(expectedType)) {
      setError(`Please upload a valid ${type} file`);
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

  const preview = file ? renderPreview(type, file) : null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`upload-slot relative w-full max-w-xs p-6 flex flex-col items-center justify-center min-h-[180px] transition-all ${
          file ? 'has-file' : ''
        } ${dragOver ? 'border-ghost-green bg-ghost-green/5' : ''}`}
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
            <p className="text-xs text-ghost-green truncate max-w-full">{file.name}</p>
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ghost-red text-white text-xs flex items-center justify-center hover:bg-red-500 transition-colors"
              title="Remove file"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <div className="text-ghost-mist/40 mb-3">{ICONS[type]}</div>
            <p className="text-sm text-ghost-mist/60 text-center leading-relaxed">{label}</p>
            <p className="text-xs text-ghost-mist/30 mt-2">Click or drag to upload</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-ghost-red mt-1 animate-fadeIn">{error}</p>
      )}
    </div>
  );
}

function renderPreview(type, file) {
  const url = URL.createObjectURL(file);

  if (type === 'photo') {
    return (
      <img
        src={url}
        alt="Uploaded photo preview"
        className="w-full h-24 object-cover rounded-lg opacity-80"
      />
    );
  }
  if (type === 'video') {
    return (
      <video
        src={url}
        className="w-full h-24 object-cover rounded-lg opacity-80"
        muted
      />
    );
  }
  if (type === 'audio') {
    return (
      <div className="flex items-center gap-2 text-ghost-green">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <span className="text-sm">Audio ready</span>
      </div>
    );
  }
  return null;
}
