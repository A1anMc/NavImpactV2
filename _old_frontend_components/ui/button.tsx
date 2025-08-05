'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'impact';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  asChild = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border border-green-600 hover:border-green-700',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500 border border-gray-200 hover:border-gray-300',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border border-green-600 hover:border-green-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-red-600 hover:border-red-700',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 border border-transparent',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500 bg-white',
    impact: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white focus:ring-green-500 border border-transparent',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed shadow-none hover:shadow-sm' : 'cursor-pointer';

  const buttonClasses = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabledClasses,
    className
  );

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn(buttonClasses, (children as React.ReactElement).props.className),
      disabled: disabled || loading,
      ...props,
    });
  }

  return (
    <button
      type={props.type || 'button'}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// Icon Button component
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'impact';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'ghost',
  size = 'md',
  className,
  disabled = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md';
  
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
  };

  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border border-green-600 hover:border-green-700',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500 border border-gray-200 hover:border-gray-300',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border border-green-600 hover:border-green-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-red-600 hover:border-red-700',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 border border-transparent',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500 bg-white',
    impact: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white focus:ring-green-500 border border-transparent',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed shadow-none hover:shadow-sm' : 'cursor-pointer';

  return (
    <button
      type={props.type || 'button'}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        disabledClasses,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}; 