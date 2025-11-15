
import React from 'react';

interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ className, ...props }) => {
  return (
    <div>
      <label htmlFor="text-input" className="block text-sm font-medium text-slate-300 mb-1">
        Text to Synthesize
      </label>
      <textarea
        id="text-input"
        {...props}
        rows={5}
        className={`
          block w-full bg-slate-700/50
          border border-slate-600 rounded-lg
          py-3 px-4 text-base text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 focus:border-sky-500
          transition-all duration-200
          resize-none
          disabled:bg-slate-700 disabled:cursor-not-allowed
          ${className}
        `}
      />
    </div>
  );
};
