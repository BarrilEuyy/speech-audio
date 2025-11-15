import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, className, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id || props.name || label} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <input
        id={props.id || props.name || label}
        {...props}
        className={`
          block w-full bg-slate-700/50
          border border-slate-600 rounded-lg
          py-3 px-4 text-base text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 focus:border-sky-500
          transition-all duration-200
          disabled:bg-slate-700 disabled:cursor-not-allowed
          ${className}
        `}
      />
    </div>
  );
};