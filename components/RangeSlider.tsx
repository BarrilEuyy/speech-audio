
import React from 'react';

interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({ label, value, className, ...props }) => {
  const displayValue = `${Number(value).toFixed(1)}x`;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={props.id || label} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
        <span className="text-sm font-mono text-slate-400 bg-slate-700 px-2 py-0.5 rounded-md">
          {displayValue}
        </span>
      </div>
      <input
        id={props.id || label}
        type="range"
        value={value}
        {...props}
        className={`
          w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500
          disabled:cursor-not-allowed disabled:opacity-50
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:bg-sky-500
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:transition-all
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:bg-sky-500
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:transition-all
          ${className}
        `}
      />
    </div>
  );
};
