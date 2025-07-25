import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Clean professional dashboard like Donezo
export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Projects</h1>
            <p className="text-gray-600">Track and manage your impact projects with Victorian framework alignment</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="text-gray-600 border-gray-300">
              Import Data
            </Button>
            <Link href="/projects/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Projects */}
          <Card className="bg-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Total Projects</p>
                  <p className="text-4xl font-bold">2</p>
                  <div className="flex items-center mt-2">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-100">Active this month</span>
                  </div>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Projects */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Completed Projects</p>
                  <p className="text-4xl font-bold text-gray-900">0</p>
                  <div className="flex items-center mt-2">
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">Ready to complete</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-full p-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Running Projects */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Running Projects</p>
                  <p className="text-4xl font-bold text-gray-900">2</p>
                  <div className="flex items-center mt-2">
                    <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-500">In progress now</span>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* People Reached */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">People Reached</p>
                  <p className="text-4xl font-bold text-gray-900">1.25K</p>
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-500">Target engagement</span>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-full p-3">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Analytics & Framework Alignment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Framework Alignment */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Victorian Framework Alignment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Plan for Victoria', count: 0, color: 'bg-indigo-100 text-indigo-700' },
                    { name: 'Melbourne 2030', count: 2, color: 'bg-blue-100 text-blue-700' },
                    { name: 'Activity Centres', count: 0, color: 'bg-cyan-100 text-cyan-700' },
                    { name: 'Greenfields Plan', count: 1, color: 'bg-green-100 text-green-700' },
                    { name: 'Clean Economy', count: 0, color: 'bg-emerald-100 text-emerald-700' },
                    { name: 'Reconciliation', count: 0, color: 'bg-purple-100 text-purple-700' },
                  ].map((framework, index) => (
                    <div key={index} className="text-center p-4 rounded-lg border border-gray-100">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${framework.color} flex items-center justify-center text-lg font-bold`}>
                        {framework.count}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {framework.name}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Active Projects</CardTitle>
                  <Button variant="outline" size="sm" className="text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Project 1 */}
                  <div className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Greenfields Housing Renewal</h4>
                      <p className="text-sm text-gray-600">Due date: Dec 15, 2024</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Melbourne 2030</span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Greenfields Plan</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">500 people</div>
                      <div className="text-xs text-gray-500">Target reach</div>
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Frontend Integration Test</h4>
                      <p className="text-sm text-gray-600">Due date: Dec 20, 2024</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Melbourne 2030</span>
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">SDG 4</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">750 people</div>
                      <div className="text-xs text-gray-500">Target reach</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Reminders & Progress */}
          <div className="space-y-8">
            {/* Reminders */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-gray-900 mb-1">Framework Review</h4>
                    <p className="text-sm text-gray-600 mb-3">Time: 02:00 pm - 04:00 pm</p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-9V3m0 0V1m0 2H9m3 0h3" />
                      </svg>
                      Start Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Progress */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Project Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="65, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">65%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Overall Progress</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">Completed</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">In Progress</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">Pending</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900 text-white border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Ready to Scale?</h3>
                <p className="text-gray-300 text-sm mb-4">Export your impact data and share with stakeholders</p>
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
