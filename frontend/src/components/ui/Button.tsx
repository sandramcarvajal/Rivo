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
    primary: 'bg-primary text-white hover:bg-primary-600 shadow-lg shadow-primary/20 active:scale-[0.98]',
    secondary: 'bg-surface-soft text-body hover:bg-surface-strong shadow-sm active:scale-[0.98]',
    outline: 'border-2 border-border-primary text-body bg-surface hover:bg-surface-soft active:scale-[0.98]',
    ghost: 'text-text-secondary hover:bg-surface-soft active:scale-[0.98]',
    danger: 'bg-danger text-white hover:opacity-90 shadow-lg shadow-danger/20 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-sm font-bold uppercase tracking-wider',
    md: 'px-6 py-4 text-sm rounded-md font-bold',
    lg: 'px-8 py-5 text-base rounded-xl font-black tracking-tight',
    icon: 'p-3 rounded-md',
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
