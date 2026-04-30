import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 active:scale-[0.98]',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-lg shadow-slate-900/10 active:scale-[0.98]',
    outline: 'border-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 active:scale-[0.98]',
    ghost: 'text-slate-600 hover:bg-slate-100 active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-xl font-bold uppercase tracking-wider',
    md: 'px-6 py-4 text-sm rounded-2xl font-bold',
    lg: 'px-8 py-5 text-base rounded-[24px] font-black tracking-tight',
    icon: 'p-3 rounded-2xl',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center transition-all disabled:opacity-50 disabled:pointer-events-none focus:outline-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
};
