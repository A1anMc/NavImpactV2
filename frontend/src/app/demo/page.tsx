'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLevels from '@/components/dashboard/DashboardLevels';

export default function DemoPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-heading text-gray-900 mb-4">🎨 NavImpact Font & Levels Demo</h1>
        <p className="text-xl font-body text-gray-600 mb-8">
          Showcasing the new fun fonts and dashboard levels system
        </p>
      </div>

      {/* Font Showcase */}
      <div className="mb-12">
        <h2 className="text-3xl font-heading text-center mb-8">Typography Showcase</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Righteous Font (Headings) */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Righteous Font</CardTitle>
              <CardDescription className="font-body">Used for headings and titles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-heading text-blue-600 mb-2">NavImpact Dashboard</h3>
                <p className="text-sm font-body text-gray-600">Main dashboard title</p>
              </div>
              <div>
                <h4 className="text-xl font-heading text-green-600 mb-2">Grant Explorer</h4>
                <p className="text-sm font-body text-gray-600">Level 2 user title</p>
              </div>
              <div>
                <h5 className="text-lg font-heading text-purple-600 mb-2">Strategic Seeker</h5>
                <p className="text-sm font-body text-gray-600">Level 3 user title</p>
              </div>
            </CardContent>
          </Card>

          {/* Poppins Font (Body) */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Poppins Font</CardTitle>
              <CardDescription className="font-body">Used for body text and descriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-lg font-body text-gray-800 mb-2">Welcome back! Here's what's happening with your grants today.</p>
                <p className="text-sm font-body text-gray-600">Dashboard welcome message</p>
              </div>
              <div>
                <p className="text-base font-body text-gray-700 mb-2">Complete your profile to get personalized recommendations</p>
                <p className="text-sm font-body text-gray-600">Profile setup prompt</p>
              </div>
              <div>
                <p className="text-sm font-body text-gray-600 mb-2">Browse different grant opportunities</p>
                <p className="text-sm font-body text-gray-500">Action description</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dashboard Levels Showcase */}
      <div className="mb-12">
        <h2 className="text-3xl font-heading text-center mb-8">Dashboard Levels System</h2>
        <p className="text-lg font-body text-center text-gray-600 mb-8">
          Progressive user experience with 5 levels of engagement
        </p>
        
        <DashboardLevels />
      </div>

      {/* Level Progression Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Level 1: Novice Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-gray-600 mb-4">Getting started with basic features</p>
            <ul className="space-y-2 text-sm font-body">
              <li>• Basic grant browsing</li>
              <li>• Profile setup</li>
              <li>• Welcome tutorial</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Level 2: Grant Explorer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-gray-600 mb-4">Active exploration and matching</p>
            <ul className="space-y-2 text-sm font-body">
              <li>• Grant matching</li>
              <li>• Personalized recommendations</li>
              <li>• Basic analytics</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Level 3: Strategic Seeker</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-gray-600 mb-4">Strategic approach to grant management</p>
            <ul className="space-y-2 text-sm font-body">
              <li>• Application tracking</li>
              <li>• Advanced filtering</li>
              <li>• Success analytics</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Font Comparison */}
      <div className="mt-12">
        <h2 className="text-3xl font-heading text-center mb-8">Font Comparison</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Before: Carrotflower + Neue Haas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-body text-gray-600 mb-4">Previous font combination</p>
              <div className="space-y-2">
                <p className="text-lg" style={{ fontFamily: 'Carrotflower, serif' }}>NavImpact Dashboard</p>
                <p className="text-sm" style={{ fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif' }}>
                  Welcome back! Here's what's happening with your grants today.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">After: Righteous + Poppins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-body text-gray-600 mb-4">New fun and modern font combination</p>
              <div className="space-y-2">
                <p className="text-lg font-heading">NavImpact Dashboard</p>
                <p className="text-sm font-body">
                  Welcome back! Here's what's happening with your grants today.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 