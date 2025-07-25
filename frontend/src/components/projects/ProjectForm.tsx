'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ProjectFormData, 
  IMPACT_TYPES, 
  PROJECT_STATUSES,
  ImpactType,
  ProjectStatus 
} from '@/types/projects';

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  mode,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'planning',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || '',
    outcome_text: initialData?.outcome_text || '',
    impact_statement: initialData?.impact_statement || '',
    impact_types: initialData?.impact_types || [],
    sdg_tags: initialData?.sdg_tags || [],
    evidence_sources: initialData?.evidence_sources || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleImpactType = (impactType: ImpactType) => {
    setFormData(prev => ({
      ...prev,
      impact_types: prev.impact_types.includes(impactType)
        ? prev.impact_types.filter(t => t !== impactType)
        : [...prev.impact_types, impactType]
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
    <Card className="bg-white border-neutral-200 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-neutral-900">
          {mode === 'create' ? 'Create New Impact Project' : 'Edit Project'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {Object.entries(PROJECT_STATUSES).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
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
                placeholder="Describe your project"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <h3 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
              Impact Context
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Outcome Headline
                <span className="text-xs text-neutral-500 ml-2">
                  (Describe what changed as a result of this project, not just what was done)
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
                  (Why this matters - the broader significance)
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
                Impact Types
                <span className="text-xs text-neutral-500 ml-2">
                  (Social, Environmental, and Community impact categories can be combined)
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(IMPACT_TYPES).map(([key, config]) => (
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
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                SDG Alignment (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {['SDG-1', 'SDG-2', 'SDG-3', 'SDG-4', 'SDG-5', 'SDG-6', 'SDG-7', 'SDG-8', 'SDG-9', 'SDG-10', 'SDG-11', 'SDG-12', 'SDG-13', 'SDG-14', 'SDG-15', 'SDG-16', 'SDG-17'].map((sdg) => (
                  <button
                    key={sdg}
                    type="button"
                    onClick={() => toggleSDG(sdg)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      formData.sdg_tags?.includes(sdg)
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {sdg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Evidence Sources (Optional)
              </label>
              <textarea
                value={formData.evidence_sources}
                onChange={(e) => setFormData(prev => ({ ...prev, evidence_sources: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="List any evidence sources, surveys, or data collection methods"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-neutral-200">
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
              loading={loading}
            >
              {mode === 'create' ? 'Create Project' : 'Update Project'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 