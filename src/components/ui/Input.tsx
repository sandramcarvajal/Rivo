import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-sm font-medium text-body ml-1">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full px-4 py-3 bg-surface-soft border border-border-primary rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-body placeholder:text-muted',
            icon && 'pl-10',
            error && 'border-danger focus:ring-danger/10 focus:border-danger',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger ml-1">{error}</p>}
    </div>
  );
};
