'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { copyKit, frameworkAlignment } from '@/lib/copy-kit';
import { VICTORIAN_FRAMEWORKS } from '@/types/projects';

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* Page Header */}
      <PageHeader
        tagline={copyKit.settings.tagline}
        subheading={copyKit.settings.subheading}
        description={copyKit.settings.description}
        actions={
          <>
            <Button variant="secondary" size="md">
              Export Settings
            </Button>
            <Button variant="primary" size="md">
              Save Changes
            </Button>
          </>
        }
      />

      {/* Framework Alignment Methodology */}
      <Card className="bg-white border-neutral-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-900">Policy Context & Framework Alignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">{frameworkAlignment.tagline}</h3>
            <p className="text-neutral-700 leading-relaxed mb-4">
              {frameworkAlignment.description}
            </p>
            
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="font-semibold text-neutral-900 mb-2">Key Benefits:</h4>
              <ul className="space-y-1 text-sm text-neutral-700">
                {frameworkAlignment.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-impact-600 mr-2">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Victorian Government Priorities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(VICTORIAN_FRAMEWORKS).map(([key, config]) => (
                <div key={key} className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge
                      variant="victorian"
                      victorianFramework={key as keyof typeof VICTORIAN_FRAMEWORKS}
                      size="sm"
                    >
                      {config.badgeLabel}
                    </Badge>
                  </div>
                  <h5 className="font-medium text-neutral-900 mb-1">{config.label}</h5>
                  <p className="text-sm text-neutral-600">{config.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">UN Sustainable Development Goals</h4>
            <p className="text-sm text-neutral-600 mb-3">
              The 17 UN SDGs provide a global framework for addressing the world's most pressing challenges. 
              Aligning your projects with relevant SDGs demonstrates global impact and connects local outcomes to international priorities.
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {['SDG-1', 'SDG-4', 'SDG-8', 'SDG-10', 'SDG-11', 'SDG-13', 'SDG-15', 'SDG-16'].map((sdg) => (
                <Badge key={sdg} variant="sdg" sdgCode={sdg} size="sm" className="text-xs">
                  {sdg}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border-neutral-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">Impact Measurement Framework</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Default Impact Types
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Social Impact</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Environmental Impact</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Community Impact</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Framework Alignment Preferences
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Show Victorian framework alignment</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Show UN SDG alignment</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Require framework alignment for new projects</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-neutral-900">Reporting & Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Dashboard Metrics
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Show framework alignment snapshot</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Show SDG alignment summary</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Show impact analytics</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Export Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Include framework alignment in reports</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Include SDG mapping in exports</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Generate policy alignment summaries</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team & Access Management */}
      <Card className="bg-white border-neutral-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-900">Team & Access Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div>
                <h4 className="font-medium text-neutral-900">Admin Access</h4>
                <p className="text-sm text-neutral-600">Full platform access and configuration</p>
              </div>
              <Badge variant="primary" size="sm">Current User</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div>
                <h4 className="font-medium text-neutral-900">Project Manager</h4>
                <p className="text-sm text-neutral-600">Create and manage impact projects</p>
              </div>
              <Button variant="ghost" size="sm">Invite</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div>
                <h4 className="font-medium text-neutral-900">Impact Analyst</h4>
                <p className="text-sm text-neutral-600">View analytics and generate reports</p>
              </div>
              <Button variant="ghost" size="sm">Invite</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card className="bg-white border-neutral-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-900">Data & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-neutral-900">Data Export</h4>
              <p className="text-sm text-neutral-600">Download your organisation's impact data</p>
            </div>
            <Button variant="secondary" size="sm">Export Data</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-neutral-900">Privacy Settings</h4>
              <p className="text-sm text-neutral-600">Manage data sharing and privacy preferences</p>
            </div>
            <Button variant="secondary" size="sm">Configure</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-neutral-900">Backup & Recovery</h4>
              <p className="text-sm text-neutral-600">Manage data backups and recovery options</p>
            </div>
            <Button variant="secondary" size="sm">Manage</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 