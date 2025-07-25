'use client';

import React, { useState, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFocusMode } from '@/contexts/FocusModeContext';

interface CollapsibleCardProps {
  title: string;
  children: ReactNode;
  sectionId: string;
  defaultCollapsed?: boolean;
  badge?: {
    text: string;
    variant: 'overdue' | 'dueSoon' | 'inProgress' | 'completed' | 'neutral';
  };
  dense?: boolean;
  lowStim?: boolean;
  className?: string;
}

export function CollapsibleCard({
  title,
  children,
  sectionId,
  defaultCollapsed = false,
  badge,
  dense = false,
  lowStim = false,
  className = '',
}: CollapsibleCardProps) {
  const { preferences, isSectionCollapsed, toggleSection, getSpacing, getMotionDuration } = useFocusMode();
  
  // Use global collapsed state if available, otherwise fall back to local state
  const [localCollapsed, setLocalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = isSectionCollapsed(sectionId) ?? localCollapsed;
  
  const handleToggle = () => {
    if (sectionId) {
      toggleSection(sectionId);
    } else {
      setLocalCollapsed(!localCollapsed);
    }
  };

  // Apply ADHD-friendly styling
  const cardClasses = [
    'transition-all duration-200',
    preferences.focusMode ? 'focus-mode-card' : '',
    preferences.lowStimMode || lowStim ? 'low-stim-card' : '',
    dense ? 'dense-card' : '',
    'mb-4', // Add margin bottom instead of inline style
    className
  ].filter(Boolean).join(' ');

  // Badge styling based on variant
  const getBadgeClasses = (variant: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full transition-colors';
    const variants = {
      overdue: preferences.lowStimMode 
        ? 'bg-red-100 text-red-700 border border-red-200' 
        : 'bg-red-500 text-white',
      dueSoon: preferences.lowStimMode 
        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
        : 'bg-amber-500 text-white',
      inProgress: preferences.lowStimMode 
        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
        : 'bg-blue-500 text-white',
      completed: preferences.lowStimMode 
        ? 'bg-green-100 text-green-700 border border-green-200' 
        : 'bg-green-500 text-white',
      neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    };
    return `${baseClasses} ${variants[variant as keyof typeof variants] || variants.neutral}`;
  };

  const headerPadding = dense ? 'p-2' : 'p-4';
  const contentPadding = dense ? 'p-2' : 'p-4';

  return (
    <Card className={cardClasses}>
      <CardHeader 
        className={`cursor-pointer hover:bg-neutral-50 transition-colors rounded-t-lg ${headerPadding}`}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-semibold text-neutral-900">
              {title}
            </CardTitle>
            {badge && (
              <span className={getBadgeClasses(badge.variant)}>
                {badge.text}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Collapse/Expand button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-neutral-100 focus:ring-2 focus:ring-primary-500"
              aria-label={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
            >
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${
                  isCollapsed ? 'rotate-0' : 'rotate-180'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isCollapsed ? 'max-h-0' : 'max-h-none'
        }`}
      >
        <CardContent className={contentPadding}>
          {children}
        </CardContent>
      </div>
    </Card>
  );
}

// Preset components for common use cases
export function TodayCard({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <CollapsibleCard
      title="Today"
      sectionId="today"
      defaultCollapsed={false} // Always start open
      badge={count ? { text: `${count} items`, variant: 'dueSoon' } : undefined}
    >
      {children}
    </CollapsibleCard>
  );
}

export function InProgressCard({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <CollapsibleCard
      title="In Progress"
      sectionId="inProgress"
      defaultCollapsed={false} // Always start open
      badge={count ? { text: `${count} active`, variant: 'inProgress' } : undefined}
    >
      {children}
    </CollapsibleCard>
  );
}

export function CompletedCard({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <CollapsibleCard
      title="Completed"
      sectionId="completed"
      defaultCollapsed={true} // Start collapsed to reduce noise
      badge={count ? { text: `${count} done`, variant: 'completed' } : undefined}
    >
      {children}
    </CollapsibleCard>
  );
}

export function ThisWeekCard({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <CollapsibleCard
      title="This Week"
      sectionId="thisWeek"
      defaultCollapsed={false}
      badge={count ? { text: `${count} upcoming`, variant: 'neutral' } : undefined}
    >
      {children}
    </CollapsibleCard>
  );
} 