'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  IMPACT_TYPES,
  PROJECT_STATUSES,
  VICTORIAN_FRAMEWORKS,
  ImpactType,
  ProjectStatus,
  VictorianFramework
} from '@/types/projects';

// SDG options for the form
const SDG_OPTIONS = [
  'SDG 1', 'SDG 2', 'SDG 3', 'SDG 4', 'SDG 5', 'SDG 6', 'SDG 7', 'SDG 8', 'SDG 9', 'SDG 10',
  'SDG 11', 'SDG 12', 'SDG 13', 'SDG 14', 'SDG 15', 'SDG 16', 'SDG 17'
];

export default function NewProjectPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as ProjectStatus,
    impact_types: [] as ImpactType[],
    framework_alignment: [] as VictorianFramework[],
    sdg_tags: [] as string[],
    reach_count: '',
    start_date: '',
    end_date: '',
    budget: '',
    location: '',
    contact_email: '',
    website: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: 'impact_types' | 'framework_alignment' | 'sdg_tags', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value as any)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value as any]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          reach_count: formData.reach_count ? parseInt(formData.reach_count) : null,
          budget: formData.budget ? parseFloat(formData.budget) : null,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '',
          description: '',
          status: 'planning',
          impact_types: [],
          framework_alignment: [],
          sdg_tags: [],
          reach_count: '',
          start_date: '',
          end_date: '',
          budget: '',
          location: '',
          contact_email: '',
          website: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to create project');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
        <Card className="bg-white border-neutral-200 max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-green-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Project Created Successfully!</h2>
            <p className="text-neutral-600 mb-6">
              Your impact project has been created and is now part of your portfolio.
            </p>
            <div className="space-x-4">
              <Button variant="primary" size="md" onClick={() => window.location.href = '/projects'}>
                View All Projects
              </Button>
              <Button variant="secondary" size="md" onClick={() => setSuccess(false)}>
                Create Another Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Create New Impact Project</h1>
        <p className="text-lg text-neutral-600 mt-2">
          Define your project's impact, align with Victorian frameworks, and track measurable outcomes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {/* Basic Project Information */}
        <Card className="bg-white border-neutral-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Project Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {Object.entries(PROJECT_STATUSES).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Project Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your project's goals, activities, and expected outcomes..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
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
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Melbourne, VIC"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Types */}
        <Card className="bg-white border-neutral-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">Impact Types</CardTitle>
            <p className="text-sm text-neutral-600">Select the primary types of impact your project will create</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(IMPACT_TYPES).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleArrayToggle('impact_types', key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.impact_types.includes(key as ImpactType)
                      ? config.color
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Victorian Framework Alignment */}
        <Card className="bg-white border-neutral-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">Victorian Framework Alignment</CardTitle>
            <p className="text-sm text-neutral-600">Align your project with Victorian government priorities and plans</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(VICTORIAN_FRAMEWORKS).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleArrayToggle('framework_alignment', key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors text-white ${
                    formData.framework_alignment.includes(key as VictorianFramework)
                      ? 'opacity-100'
                      : 'opacity-60 hover:opacity-80'
                  }`}
                  style={{ backgroundColor: config.color }}
                >
                  {config.badgeLabel}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* UN Sustainable Development Goals */}
        <Card className="bg-white border-neutral-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">UN Sustainable Development Goals</CardTitle>
            <p className="text-sm text-neutral-600">Select the SDGs your project contributes to</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {SDG_OPTIONS.map((sdg) => (
                <button
                  key={sdg}
                  type="button"
                  onClick={() => handleArrayToggle('sdg_tags', sdg)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.sdg_tags.includes(sdg)
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {sdg}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Metrics */}
        <Card className="bg-white border-neutral-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">Project Metrics</CardTitle>
            <p className="text-sm text-neutral-600">Define key metrics to track your project's impact</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  People Reached
                </label>
                <input
                  type="number"
                  value={formData.reach_count}
                  onChange={(e) => handleInputChange('reach_count', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Budget (AUD)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="50000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-white border-neutral-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">Contact Information</CardTitle>
            <p className="text-sm text-neutral-600">Additional contact details for your project</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="project@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => window.location.href = '/projects'}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
          >
            {loading ? 'Creating Project...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
} 