'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CreditCardIcon,
  KeyIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const settingsSections = [
  {
    id: 'profile',
    title: 'Profile Settings',
    icon: UserIcon,
    description: 'Manage your personal information and preferences',
    items: [
      { name: 'Personal Information', description: 'Update your name, email, and contact details' },
      { name: 'Avatar & Photo', description: 'Change your profile picture' },
      { name: 'Preferences', description: 'Customize your dashboard experience' },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: BellIcon,
    description: 'Configure how you receive updates and alerts',
    items: [
      { name: 'Email Notifications', description: 'Manage email alerts and updates' },
      { name: 'Push Notifications', description: 'Control browser and app notifications' },
      { name: 'Project Updates', description: 'Set up project-specific notifications' },
    ],
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: ShieldCheckIcon,
    description: 'Manage your account security and privacy settings',
    items: [
      { name: 'Password & Authentication', description: 'Update your password and 2FA settings' },
      { name: 'Privacy Settings', description: 'Control your data and privacy preferences' },
      { name: 'Session Management', description: 'Manage active sessions and devices' },
    ],
  },
  {
    id: 'team',
    title: 'Team Settings',
    icon: UserIcon,
    description: 'Manage team permissions and collaboration settings',
    items: [
      { name: 'Team Members', description: 'View and manage team member access' },
      { name: 'Permissions', description: 'Configure role-based access controls' },
      { name: 'Collaboration', description: 'Set up team collaboration preferences' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: GlobeAltIcon,
    description: 'Connect with external tools and services',
    items: [
      { name: 'API Keys', description: 'Manage API access and integrations' },
      { name: 'Third-party Services', description: 'Connect external tools and platforms' },
      { name: 'Webhooks', description: 'Configure webhook notifications' },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & Subscription',
    icon: CreditCardIcon,
    description: 'Manage your subscription and billing information',
    items: [
      { name: 'Subscription Plan', description: 'View and manage your current plan' },
      { name: 'Payment Methods', description: 'Update billing and payment information' },
      { name: 'Usage & Limits', description: 'Monitor your usage and limits' },
    ],
  },
];

const systemInfo = {
  version: '2.1.0',
  lastUpdated: '2024-01-27',
  environment: 'Production',
  database: 'PostgreSQL 16',
  apiVersion: 'v1.0.0',
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl p-8 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Cog6ToothIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Settings</h1>
                  <p className="text-gray-100 text-lg">
                    Configure your account, team, and system preferences to optimize your workflow.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-100">All systems operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span className="text-gray-100">Version 2.1.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Settings Sections */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {settingsSections.map((section) => (
                  <Card key={section.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <section.icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {section.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div>
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <InformationCircleIcon className="h-5 w-5" />
                    <span>System Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Version</span>
                      <span className="text-sm font-medium text-gray-900">{systemInfo.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Updated</span>
                      <span className="text-sm font-medium text-gray-900">{systemInfo.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Environment</span>
                      <Badge className="bg-green-100 text-green-800">{systemInfo.environment}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Database</span>
                      <span className="text-sm font-medium text-gray-900">{systemInfo.database}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">API Version</span>
                      <span className="text-sm font-medium text-gray-900">{systemInfo.apiVersion}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <KeyIcon className="h-4 w-4 mr-2" />
                    API Documentation
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <InformationCircleIcon className="h-4 w-4 mr-2" />
                    Help & Support
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <ShieldCheckIcon className="h-4 w-4 mr-2" />
                    Security Audit
                  </Button>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">Active</div>
                    <div className="text-sm text-gray-600">Account Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">Premium</div>
                    <div className="text-sm text-gray-600">Subscription Plan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">6</div>
                    <div className="text-sm text-gray-600">Team Members</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 