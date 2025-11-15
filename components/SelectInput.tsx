
import React from 'react';
import type { VoiceOption } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: VoiceOption[];
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, options, className, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id || label} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          id={props.id || label}
          {...props}
          className={`
            appearance-none block w-full bg-slate-700/50 
            border border-slate-600 rounded-lg 
            py-3 px-4 pr-10 text-base text-white 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 focus:border-sky-500
            transition-all duration-200
            disabled:bg-slate-700 disabled:cursor-not-allowed
            ${className}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-800">
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
