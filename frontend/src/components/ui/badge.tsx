'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { sdgColors } from '@/lib/design-system';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'sdg';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  sdgCode?: string; // For SDG-specific styling
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  sdgCode,
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-neutral-100 text-neutral-800',
    sdg: sdgCode && sdgColors[sdgCode as keyof typeof sdgColors] 
      ? `text-white` 
      : 'bg-neutral-100 text-neutral-800',
  };

  const sdgStyle = variant === 'sdg' && sdgCode && sdgColors[sdgCode as keyof typeof sdgColors]
    ? { backgroundColor: sdgColors[sdgCode as keyof typeof sdgColors] }
    : {};

  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={sdgStyle}
    >
      {children}
    </span>
  );
};

// SDG Badge component
interface SDGBadgeProps {
  sdgCode: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SDGBadge: React.FC<SDGBadgeProps> = ({
  sdgCode,
  children,
  size = 'md',
  className,
}) => {
  const sdgName = children || `SDG ${sdgCode.split('-')[1]}`;
  
  return (
    <Badge
      variant="sdg"
      size={size}
      sdgCode={sdgCode}
      className={className}
    >
      {sdgName}
    </Badge>
  );
};

// Status Badge component
interface StatusBadgeProps {
  status: 'active' | 'completed' | 'pending' | 'draft' | 'cancelled';
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  size = 'md',
  className,
}) => {
  const statusConfig = {
    active: { variant: 'success' as const, text: 'Active' },
    completed: { variant: 'primary' as const, text: 'Completed' },
    pending: { variant: 'warning' as const, text: 'Pending' },
    draft: { variant: 'neutral' as const, text: 'Draft' },
    cancelled: { variant: 'danger' as const, text: 'Cancelled' },
  };

  const config = statusConfig[status];
  const displayText = children || config.text;

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={className}
    >
      {displayText}
    </Badge>
  );
}; 