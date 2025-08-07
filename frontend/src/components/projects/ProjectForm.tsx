'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Project, 
  ProjectFormData, 
  IMPACT_TYPES, 
  PROJECT_STATUSES, 
  VICTORIAN_FRAMEWORKS,
  ImpactType,
  ProjectStatus,
  VictorianFramework
} from '@/types/projects';
import { copyKit } from '@/lib/copy-kit';
import { sdgColors } from '@/lib/design-system';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'planning',
    start_date: project?.start_date || '',
    end_date: project?.end_date || '',
    outcome_text: project?.outcome_text || '',
    impact_statement: project?.impact_statement || '',
    impact_types: project?.impact_types || [],
    sdg_tags: project?.sdg_tags || [],
    framework_alignment: project?.framework_alignment || [],
    evidence_sources: project?.evidence_sources || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // SDG options
  const sdgOptions = [
    'SDG-1', 'SDG-2', 'SDG-3', 'SDG-4', 'SDG-5', 'SDG-6', 'SDG-7', 'SDG-8', 'SDG-9', 'SDG-10',
    'SDG-11', 'SDG-12', 'SDG-13', 'SDG-14', 'SDG-15', 'SDG-16', 'SDG-17'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (formData.impact_types.length === 0) {
      newErrors.impact_types = 'At least one impact type is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  const toggleImpactType = (impactType: ImpactType) => {
    setFormData(prev => ({
      ...prev,
      impact_types: prev.impact_types.includes(impactType)
        ? prev.impact_types.filter(t => t !== impactType)
        : [...prev.impact_types, impactType]
    }));
  };

  const toggleFramework = (framework: VictorianFramework) => {
    setFormData(prev => ({
      ...prev,
      framework_alignment: prev.framework_alignment?.includes(framework)
        ? prev.framework_alignment.filter(f => f !== framework)
        : [...(prev.framework_alignment || []), framework]
    }));
  };

  const toggleSDG = (sdg: string) => {
    setFormData(prev => ({
      ...prev,
      sdg_tags: prev.sdg_tags?.includes(sdg)
        ? prev.sdg_tags.filter(s => s !== sdg)
        : [...(prev.sdg_tags || []), sdg]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white border-neutral-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-neutral-900">
            {project ? 'Edit Impact Project' : 'Create New Impact Project'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Project Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900">Project Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.name ? 'border-red-300' : 'border-neutral-300'
                  }`}
                  placeholder="Enter project name..."
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your project..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {Object.entries(PROJECT_STATUSES || {}).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Impact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900">Impact & Outcomes</h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Outcome Headline
                  <span className="text-xs text-neutral-500 ml-2">
                    Describe the outcome, not just the output
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.outcome_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, outcome_text: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 82 seniors gained lasting digital confidence and independence"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Impact Statement
                  <span className="text-xs text-neutral-500 ml-2">
                    Why this matters
                  </span>
                </label>
                <textarea
                  value={formData.impact_statement}
                  onChange={(e) => setFormData(prev => ({ ...prev, impact_statement: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Improved digital inclusion for vulnerable populations, reducing social isolation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Impact Types *
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(IMPACT_TYPES || {}).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleImpactType(key as ImpactType)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.impact_types.includes(key as ImpactType)
                          ? config.color
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
                {errors.impact_types && <p className="text-red-600 text-sm mt-1">{errors.impact_types}</p>}
              </div>
            </div>

            {/* Framework Alignment */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900">Framework Alignment</h3>
              <p className="text-sm text-neutral-600">
                Framework alignment shows how your project supports Victorian, national, or global priorities
              </p>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Victorian Framework Alignment
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(VICTORIAN_FRAMEWORKS || {}).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleFramework(key as VictorianFramework)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors text-white ${
                        formData.framework_alignment?.includes(key as VictorianFramework)
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

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  UN Sustainable Development Goals
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {sdgOptions?.map((sdg) => (
                    <button
                      key={sdg}
                      type="button"
                      onClick={() => toggleSDG(sdg)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors text-white ${
                        formData.sdg_tags?.includes(sdg)
                          ? 'opacity-100'
                          : 'opacity-60 hover:opacity-80'
                      }`}
                      style={{ backgroundColor: sdgColors[sdg as keyof typeof sdgColors] }}
                    >
                      {sdg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Evidence & Sources */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900">Evidence & Sources</h3>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Evidence Sources
                </label>
                <textarea
                  value={formData.evidence_sources}
                  onChange={(e) => setFormData(prev => ({ ...prev, evidence_sources: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="List any evidence sources, reports, or data that support your impact claims..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 