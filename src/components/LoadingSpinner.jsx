import React from 'react';

export default function LoadingSpinner({
  label = 'Loading',
  fullPage = false,
  showLabel = true,
  className = '',
}) {
  return (
    <div
      className={`flex items-center justify-center px-6 ${fullPage ? 'loading-shell min-h-screen text-white' : 'py-12'} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="loading-dots" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        {showLabel && <p className={`text-sm font-black uppercase tracking-[0.25em] ${fullPage ? 'text-sky-100' : 'text-slate-500'}`}>{label}</p>}
      </div>
    </div>
  );
}
