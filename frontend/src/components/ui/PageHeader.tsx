import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  tagline: string;
  subheading: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  tagline,
  subheading,
  description,
  actions,
  className,
}) => {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Tagline - Big, bold, impactful */}
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {tagline}
          </h1>
          
          {/* Subheading - Smaller, supporting text */}
          <p className="text-lg text-neutral-600 mb-3">
            {subheading}
          </p>
          
          {/* Description - Optional, longer explanation */}
          {description && (
            <p className="text-sm text-neutral-500 max-w-3xl">
              {description}
            </p>
          )}
        </div>
        
        {/* Actions - Right-aligned buttons/controls */}
        {actions && (
          <div className="flex items-center space-x-3 ml-6">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// Page Header with breadcrumbs
interface PageHeaderWithBreadcrumbsProps extends PageHeaderProps {
  breadcrumbs: Array<{
    name: string;
    href?: string;
  }>;
}

export const PageHeaderWithBreadcrumbs: React.FC<PageHeaderWithBreadcrumbsProps> = ({
  tagline,
  subheading,
  description,
  actions,
  breadcrumbs,
  className,
}) => {
  return (
    <div className={cn('mb-8', className)}>
      {/* Breadcrumbs */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.name} className="flex items-center">
              {index > 0 && (
                <svg
                  className="h-5 w-5 text-neutral-300 mx-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
              )}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  {crumb.name}
                </a>
              ) : (
                <span className="text-sm text-neutral-900 font-medium">
                  {crumb.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      {/* Main header content */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {tagline}
          </h1>
          <p className="text-lg text-neutral-600 mb-3">
            {subheading}
          </p>
          {description && (
            <p className="text-sm text-neutral-500 max-w-3xl">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-3 ml-6">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}; 