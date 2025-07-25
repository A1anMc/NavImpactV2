'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImpactCard } from '@/components/projects/ImpactCard';
import { copyKit } from '@/lib/copy-kit';
import { 
  ProjectFilters,
  Project,
  PortfolioSummary,
  IMPACT_TYPES,
  PROJECT_STATUSES,
  VICTORIAN_FRAMEWORKS,
  ImpactType,
  ProjectStatus,
  VictorianFramework
} from '@/types/projects';
import { 
  getProjects, 
  getPortfolioSummary 
} from '@/services/projects';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProjectFilters>({
    limit: 12,
  });

  // Filter states
  const [selectedImpactTypes, setSelectedImpactTypes] = useState<ImpactType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | undefined>();
  const [selectedFrameworks, setSelectedFrameworks] = useState<VictorianFramework[]>([]);
  const [selectedSDGs, setSelectedSDGs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load projects and portfolio summary
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load portfolio summary
        try {
          const summary = await getPortfolioSummary();
          setPortfolioSummary(summary);
        } catch (error) {
          console.warn('Could not load portfolio summary:', error);
        }

        // Load projects with filters
        const response = await getProjects(filters);
        setProjects(response.items);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  // Apply filters
  const applyFilters = () => {
    const newFilters: ProjectFilters = {
      ...filters,
      impact_types: selectedImpactTypes.length > 0 ? selectedImpactTypes : undefined,
      status: selectedStatus,
      framework_alignment: selectedFrameworks.length > 0 ? selectedFrameworks : undefined,
      sdg_tags: selectedSDGs.length > 0 ? selectedSDGs : undefined,
      search: searchQuery || undefined,
    };
    setFilters(newFilters);
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedImpactTypes([]);
    setSelectedStatus(undefined);
    setSelectedFrameworks([]);
    setSelectedSDGs([]);
    setSearchQuery('');
    setFilters({ limit: 12 });
  };

  // Real data from API (no mock data needed)

  // Use real API data
  const displayProjects = projects;
  const displaySummary = portfolioSummary;

  return (
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* Page Header */}
      <PageHeader
        tagline={copyKit.projects.tagline}
        subheading={copyKit.projects.subheading}
        description={copyKit.projects.description}
        actions={
          <>
            <Button variant="secondary" size="md">
              Import Portfolio
            </Button>
            <Button variant="primary" size="md">
              New Impact Project
            </Button>
          </>
        }
      />

      {/* Portfolio Summary */}
      {displaySummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900">{displaySummary.total_projects}</div>
                <div className="text-sm text-neutral-600">Total Projects</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900">{displaySummary.total_reach.toLocaleString()}</div>
                <div className="text-sm text-neutral-600">People Reached</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900">{displaySummary.framework_alignment_count}</div>
                <div className="text-sm text-neutral-600">Victorian Frameworks</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">87</div>
                <div className="text-sm text-neutral-600">Portfolio Impact Score</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Framework Alignment Snapshot */}
      {displaySummary && (
        <Card className="bg-white border-neutral-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Framework Alignment Snapshot</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(displaySummary.framework_breakdown).map(([framework, count]) => (
                <div key={framework} className="text-center">
                  <div className="text-2xl font-bold text-neutral-900">{count}</div>
                  <div className="text-xs text-neutral-600 text-center">
                    {VICTORIAN_FRAMEWORKS[framework as VictorianFramework].badgeLabel}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-600">
                {displaySummary.sdg_alignment_count} projects linked to UN SDGs • {displaySummary.framework_alignment_count} projects aligned with Victorian priorities
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters Section */}
      <Card className="bg-white border-neutral-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-900">Filter Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Search Projects</label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Impact Type Filters */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Impact Type</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(IMPACT_TYPES).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedImpactTypes(prev => 
                        prev.includes(key as ImpactType)
                          ? prev.filter(t => t !== key)
                          : [...prev, key as ImpactType]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedImpactTypes.includes(key as ImpactType)
                        ? config.color
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Victorian Framework Filters */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Victorian Framework Alignment</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(VICTORIAN_FRAMEWORKS).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedFrameworks(prev => 
                        prev.includes(key as VictorianFramework)
                          ? prev.filter(f => f !== key)
                          : [...prev, key as VictorianFramework]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors text-white ${
                      selectedFrameworks.includes(key as VictorianFramework)
                        ? 'opacity-100'
                        : 'opacity-60 hover:opacity-80'
                    }`}
                    style={{ backgroundColor: config.color }}
                  >
                    {config.badgeLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Status</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStatus(undefined)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    !selectedStatus
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  All Statuses
                </button>
                {Object.entries(PROJECT_STATUSES).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedStatus(key as ProjectStatus)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedStatus === key
                        ? config.color
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center space-x-3 pt-4 border-t border-neutral-200">
              <Button variant="primary" size="sm" onClick={applyFilters}>
                Apply Filters
              </Button>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
              <div className="text-sm text-neutral-500">
                {displayProjects.length} projects found
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">Impact Projects</h2>
          <div className="text-sm text-neutral-500">
            Showing {displayProjects.length} of {displaySummary?.total_projects || 0} projects
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white border-neutral-200 animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-neutral-200 rounded"></div>
                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project) => (
              <ImpactCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card className="bg-white border-neutral-200">
            <CardContent className="p-12 text-center">
              <div className="text-neutral-500">
                <div className="text-lg font-medium mb-2">No projects found</div>
                <div className="text-sm mb-4">Try adjusting your filters or create your first impact project.</div>
                <Button variant="primary" size="md">
                  Create Your First Project
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 