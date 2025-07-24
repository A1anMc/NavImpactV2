'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLevels from '@/components/dashboard/DashboardLevels';

export default function DemoPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🎨 NavImpact Design System</h1>
        <p className="text-xl text-gray-600 mb-8">
          Clean, professional typography and dashboard levels system
        </p>
      </div>

      {/* Font Showcase */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Typography System</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inter Font (Headings) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Inter Font</CardTitle>
              <CardDescription>Clean, modern typography for all text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">NavImpact Dashboard</h3>
                <p className="text-sm text-gray-600">Main dashboard title (font-weight: 700)</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-green-600 mb-2">Grant Explorer</h4>
                <p className="text-sm text-gray-600">Section heading (font-weight: 600)</p>
              </div>
              <div>
                <h5 className="text-lg font-medium text-purple-600 mb-2">Strategic Seeker</h5>
                <p className="text-sm text-gray-600">Subsection heading (font-weight: 500)</p>
              </div>
            </CardContent>
          </Card>

          {/* Body Text */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Body Text</CardTitle>
              <CardDescription>Consistent, readable typography</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-lg text-gray-800 mb-2">Welcome back! Here&rsquo;s what&rsquo;s happening with your grants today.</p>
                <p className="text-sm text-gray-600">Dashboard welcome message (text-lg)</p>
              </div>
              <div>
                <p className="text-base text-gray-700 mb-2">Complete your profile to get personalized recommendations</p>
                <p className="text-sm text-gray-600">Standard body text (text-base)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Browse different grant opportunities</p>
                <p className="text-sm text-gray-500">Small text (text-sm)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dashboard Levels Showcase */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Dashboard Levels System</h2>
        <p className="text-lg text-center text-gray-600 mb-8">
          Progressive user experience with 5 levels of engagement
        </p>
        
        <DashboardLevels />
      </div>

      {/* Level Progression Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Level 1: Novice Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Getting started with basic features</p>
            <ul className="space-y-2 text-sm">
              <li>• Basic grant browsing</li>
              <li>• Profile setup</li>
              <li>• Welcome tutorial</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Level 2: Grant Explorer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Active exploration and matching</p>
            <ul className="space-y-2 text-sm">
              <li>• Grant matching</li>
              <li>• Personalized recommendations</li>
              <li>• Basic analytics</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Level 3: Strategic Seeker</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Strategic approach to grant management</p>
            <ul className="space-y-2 text-sm">
              <li>• Application tracking</li>
              <li>• Advanced filtering</li>
              <li>• Success analytics</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Design Principles */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8">Design Principles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Typography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Clean, professional approach</p>
              <div className="space-y-2">
                <p className="text-lg font-bold">Inter Font Family</p>
                <p className="text-sm">
                  Single font family for consistency and professional appearance
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Clean, organized structure</p>
              <div className="space-y-2">
                <p className="text-lg font-bold">Professional Layout</p>
                <p className="text-sm">
                  Clean cards, proper spacing, and intuitive navigation
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 