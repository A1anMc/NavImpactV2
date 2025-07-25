'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VICTORIAN_FRAMEWORKS } from '@/types/projects';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Configure your platform preferences and team access</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="text-gray-600 border-gray-300">Export Settings</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Save Changes</Button>
          </div>
        </div>

        {/* Framework Alignment Methodology */}
        <Card className="bg-white border border-gray-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Policy Context & Framework Alignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Strategic Impact Alignment</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Align your impact projects with Victorian Government priorities and UN Sustainable Development Goals 
                to demonstrate strategic value and maximise funding opportunities.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Key Benefits:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Enhanced funding eligibility and grant applications
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Strategic alignment with government priorities
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Improved stakeholder engagement and reporting
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Global impact measurement and benchmarking
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Victorian Government Priorities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(VICTORIAN_FRAMEWORKS).map(([key, config]) => (
                  <div key={key} className="p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge
                        variant="victorian"
                        victorianFramework={key as keyof typeof VICTORIAN_FRAMEWORKS}
                        size="sm"
                      >
                        {config.badgeLabel}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-gray-900 mb-1">{config.label}</h5>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">UN Sustainable Development Goals</h4>
              <p className="text-sm text-gray-600 mb-3">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Impact Measurement Framework</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Impact Types
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Social Impact</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Environmental Impact</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Community Impact</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Framework Alignment Preferences
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Show Victorian framework alignment</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Show UN SDG alignment</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Require framework alignment for new projects</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Reporting & Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dashboard Metrics
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Show framework alignment snapshot</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Show SDG alignment summary</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Show impact analytics</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Include framework alignment in reports</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Include SDG mapping in exports</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-700">Generate policy alignment summaries</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team & Access Management */}
        <Card className="bg-white border border-gray-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Team & Access Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                <div>
                  <h4 className="font-medium text-gray-900">Admin Access</h4>
                  <p className="text-sm text-gray-600">Full platform access and configuration</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">Current User</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                <div>
                  <h4 className="font-medium text-gray-900">Project Manager</h4>
                  <p className="text-sm text-gray-600">Create and manage impact projects</p>
                </div>
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">Invite</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                <div>
                  <h4 className="font-medium text-gray-900">Impact Analyst</h4>
                  <p className="text-sm text-gray-600">View analytics and generate reports</p>
                </div>
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">Invite</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Data Export</h4>
                <p className="text-sm text-gray-600">Download your organisation's impact data</p>
              </div>
              <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">Export Data</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                <p className="text-sm text-gray-600">Manage data sharing and privacy preferences</p>
              </div>
              <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Backup & Recovery</h4>
                <p className="text-sm text-gray-600">Manage data backups and recovery options</p>
              </div>
              <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">Manage</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 