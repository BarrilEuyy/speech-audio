
import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, isLoading = false, disabled = false, className, ...props }) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center
        px-6 py-3 border border-transparent 
        text-base font-medium rounded-lg text-white 
        bg-sky-600 hover:bg-sky-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500
        transition-colors duration-200
        disabled:bg-slate-500 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading && <Spinner className="mr-2" />}
      {children}
    </button>
  );
};
