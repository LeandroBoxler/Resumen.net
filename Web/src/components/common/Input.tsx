import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="font-semibold text-gray-800 text-sm">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(100,108,255,0.1)] ${
          error ? 'border-danger focus:shadow-[0_0_0_3px_rgba(211,47,47,0.1)]' : 'border-gray-200'
        }`}
        {...props}
      />
      {hint && !error && <small className="text-gray-600 text-xs">{hint}</small>}
      {error && <small className="text-danger text-xs">{error}</small>}
    </div>
  );
}
