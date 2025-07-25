'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project, IMPACT_TYPES, PROJECT_STATUSES } from '@/types/projects';
import { cn } from '@/lib/utils';

interface ImpactCardProps {
  project: Project;
  className?: string;
  showActions?: boolean;
}

export const ImpactCard: React.FC<ImpactCardProps> = ({
  project,
  className,
  showActions = true,
}) => {
  return (
    <Card className={cn(
      'bg-white border-neutral-200 hover:shadow-md transition-all duration-200 group',
      className
    )}>
      <CardContent className="p-6">
        {/* Header: Project Title + Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="neutral" 
                size="sm"
                className={PROJECT_STATUSES[project.status].color}
              >
                {PROJECT_STATUSES[project.status].label}
              </Badge>
              {project.impact_score && (
                <Badge variant="impact" size="sm">
                  Impact: {project.impact_score}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Impact Types */}
        {project.impact_types && project.impact_types.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.impact_types.map((impactType) => (
              <Badge
                key={impactType}
                variant="neutral"
                size="sm"
                className={IMPACT_TYPES[impactType].color}
              >
                {IMPACT_TYPES[impactType].label}
              </Badge>
            ))}
          </div>
        )}

        {/* SDG Tags */}
        {project.sdg_tags && project.sdg_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.sdg_tags.slice(0, 3).map((sdg) => (
              <Badge
                key={sdg}
                variant="sdg"
                sdgCode={sdg}
                size="sm"
                className="text-xs"
              >
                {sdg}
              </Badge>
            ))}
            {project.sdg_tags.length > 3 && (
              <Badge variant="neutral" size="sm" className="text-xs">
                +{project.sdg_tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Outcome Headline */}
        {project.outcome_text && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-neutral-700 mb-1">Outcome</h4>
            <p className="text-base text-neutral-900 font-medium leading-relaxed">
              {project.outcome_text}
            </p>
          </div>
        )}

        {/* Impact Statement */}
        {project.impact_statement && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-neutral-700 mb-1">Impact</h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {project.impact_statement}
            </p>
          </div>
        )}

        {/* Metrics Row */}
        <div className="flex items-center justify-between mb-4 pt-3 border-t border-neutral-100">
          <div className="flex items-center space-x-4 text-sm">
            {project.reach_count && (
              <div className="text-center">
                <div className="font-semibold text-neutral-900">{project.reach_count.toLocaleString()}</div>
                <div className="text-neutral-500">People Reached</div>
              </div>
            )}
            {project.team_size && (
              <div className="text-center">
                <div className="font-semibold text-neutral-900">{project.team_size}</div>
                <div className="text-neutral-500">Team Size</div>
              </div>
            )}
          </div>
          
          {/* Evidence Indicator */}
          {project.evidence_sources && (
            <div className="text-xs text-neutral-500">
              📊 Evidence Available
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <div className="text-xs text-neutral-500">
              Updated {new Date(project.updated_at).toLocaleDateString()}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/projects/${project.id}`}>
                  View Impact Profile
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Compact version for lists
export const ImpactCardCompact: React.FC<ImpactCardProps> = ({
  project,
  className,
}) => {
  return (
    <Card className={cn(
      'bg-white border-neutral-200 hover:shadow-md transition-all duration-200 group',
      className
    )}>
      <CardContent className="p-4">
        {/* Header: Title + Status */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
            {project.name}
          </h3>
          <Badge 
            variant="neutral" 
            size="sm"
            className={PROJECT_STATUSES[project.status].color}
          >
            {PROJECT_STATUSES[project.status].label}
          </Badge>
        </div>

        {/* Impact Types + SDGs */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.impact_types?.slice(0, 2).map((impactType) => (
            <Badge
              key={impactType}
              variant="neutral"
              size="sm"
              className={cn(IMPACT_TYPES[impactType].color, 'text-xs')}
            >
              {IMPACT_TYPES[impactType].label}
            </Badge>
          ))}
          {project.sdg_tags?.slice(0, 2).map((sdg) => (
            <Badge
              key={sdg}
              variant="sdg"
              sdgCode={sdg}
              size="sm"
              className="text-xs"
            >
              {sdg}
            </Badge>
          ))}
        </div>

        {/* Outcome */}
        {project.outcome_text && (
          <p className="text-sm text-neutral-700 mb-3 line-clamp-2">
            {project.outcome_text}
          </p>
        )}

        {/* Quick Metrics */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center space-x-3">
            {project.reach_count && (
              <span>{project.reach_count.toLocaleString()} reached</span>
            )}
            {project.impact_score && (
              <span>Impact: {project.impact_score}</span>
            )}
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/projects/${project.id}`}>
              View →
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 