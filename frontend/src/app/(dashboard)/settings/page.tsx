'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VICTORIAN_FRAMEWORKS } from '@/types/projects';
import { 
  Cog6ToothIcon, 
  DocumentArrowDownIcon, 
  CheckIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  GlobeAltIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Cog6ToothIcon className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
            </div>
            <p className="text-gray-600 text-lg">Configure your impact measurement framework and team access</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
              <CheckIcon className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Framework Alignment Methodology */}
        <Card className="bg-white border-0 shadow-lg mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <GlobeAltIcon className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">Policy Context & Framework Alignment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-green-600" />
                Strategic Impact Alignment
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6 text-base">
                Align your impact projects with Victorian Government priorities and UN Sustainable Development Goals 
                to demonstrate strategic value and maximise funding opportunities.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2 text-green-600" />
                  Key Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-green-100 rounded-full mt-0.5">
                      <CheckIcon className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Enhanced funding eligibility and grant applications</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-green-100 rounded-full mt-0.5">
                      <CheckIcon className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Strategic alignment with government priorities</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-green-100 rounded-full mt-0.5">
                      <CheckIcon className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Improved stakeholder engagement and reporting</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-green-100 rounded-full mt-0.5">
                      <CheckIcon className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Global impact measurement and benchmarking</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-green-600" />
                Victorian Government Priorities
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VICTORIAN_FRAMEWORKS.map((config) => (
                  <div key={config.value} className="p-5 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge
                        variant="victorian"
                        victorianFramework={config.value}
                        size="sm"
                        className="text-xs"
                      >
                        {config.badgeLabel}
                      </Badge>
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">{config.label}</h5>
                    <p className="text-sm text-gray-600 leading-relaxed">{config.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">UN Sustainable Development Goals</h4>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                The 17 UN SDGs provide a global framework for addressing the world's most pressing challenges. 
                Aligning your projects with relevant SDGs demonstrates global impact and connects local outcomes to international priorities.
              </p>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {['SDG-1', 'SDG-4', 'SDG-8', 'SDG-10', 'SDG-11', 'SDG-13', 'SDG-15', 'SDG-16'].map((sdg) => (
                  <Badge key={sdg} variant="sdg" sdgCode={sdg} size="sm" className="text-xs justify-center">
                    {sdg}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Impact Measurement Framework</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Default Impact Types
                </label>
                <div className="space-y-3">
                  {[
                    { label: 'Social Impact', description: 'Community and individual wellbeing outcomes' },
                    { label: 'Environmental Impact', description: 'Sustainability and climate action results' },
                    { label: 'Community Impact', description: 'Local community development and engagement' }
                  ].map((item) => (
                    <label key={item.label} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" defaultChecked className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Framework Alignment Preferences
                </label>
                <div className="space-y-3">
                  {[
                    { label: 'Show Victorian framework alignment', description: 'Display alignment with Victorian government priorities' },
                    { label: 'Show UN SDG alignment', description: 'Display alignment with UN Sustainable Development Goals' },
                    { label: 'Require framework alignment for new projects', description: 'Make framework alignment mandatory for project creation' }
                  ].map((item, index) => (
                    <label key={item.label} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" defaultChecked={index < 2} className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DocumentArrowDownIcon className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Reporting & Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Dashboard Metrics
                </label>
                <div className="space-y-3">
                  {[
                    { label: 'Show framework alignment snapshot', description: 'Display current alignment status on dashboard' },
                    { label: 'Show SDG alignment summary', description: 'Display UN SDG alignment overview' },
                    { label: 'Show impact analytics', description: 'Display advanced impact measurement metrics' }
                  ].map((item) => (
                    <label key={item.label} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" defaultChecked className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Export Options
                </label>
                <div className="space-y-3">
                  {[
                    { label: 'Include framework alignment in reports', description: 'Add alignment data to exported reports' },
                    { label: 'Include SDG mapping in exports', description: 'Include UN SDG mapping in data exports' },
                    { label: 'Generate policy alignment summaries', description: 'Create policy alignment summary reports' }
                  ].map((item, index) => (
                    <label key={item.label} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" defaultChecked={index < 2} className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team & Access Management */}
        <Card className="bg-white border-0 shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserGroupIcon className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">Team & Access Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { role: 'Admin Access', description: 'Full platform access and configuration', badge: 'Current User', badgeColor: 'bg-green-100 text-green-800 border-green-200' },
                { role: 'Project Manager', description: 'Create and manage impact projects', action: 'Invite' },
                { role: 'Impact Analyst', description: 'View analytics and generate reports', action: 'Invite' }
              ].map((item) => (
                <div key={item.role} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition-shadow">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.role}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  {item.badge ? (
                    <Badge className={item.badgeColor}>{item.badge}</Badge>
                  ) : (
                    <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                      {item.action}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ShieldCheckIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">Data & Privacy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { title: 'Data Export', description: 'Download your organisation\'s impact data', action: 'Export Data' },
                { title: 'Privacy Settings', description: 'Manage data sharing and privacy preferences', action: 'Configure' },
                { title: 'Backup & Recovery', description: 'Manage data backups and recovery options', action: 'Manage' }
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition-shadow">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                    {item.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 