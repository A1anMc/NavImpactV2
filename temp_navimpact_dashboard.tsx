'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChartBarIcon,
  FolderIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  ClockIcon,
  CircleStackIcon,
  ShieldCheckIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  UserCircleIcon,
  PlayIcon,
  UsersIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
        <div className="relative p-8 max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl shadow-2xl">
                  <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <SparklesIcon className="h-3 w-3 text-yellow-900" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
                  Shadow Goose Entertainment
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                  Media Impact & Project Management Platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-700">System Online</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <UsersIcon className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-700">6 Team Members</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <PlayIcon className="h-4 w-4 text-green-600" />
                <span className="font-medium text-gray-700">4 Active Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto -mt-8">
        {/* Enhanced Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Media Projects</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">4</p>
                  <p className="text-xs text-green-600 font-medium mt-1">Active & Thriving</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <PhotoIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Team Members</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">6</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">Including 1 Intern</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserCircleIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Grants Available</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">12</p>
                  <p className="text-xs text-amber-600 font-medium mt-1">Matching SGE</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DocumentMagnifyingGlassIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Impact Stories</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">8</p>
                  <p className="text-xs text-purple-600 font-medium mt-1">Documented</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Projects Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Media Projects</h2>
              <p className="text-gray-600">Our flagship productions making real impact</p>
            </div>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              View All Projects
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20"></div>
                <CardContent className="p-8 relative">
                  <div className="flex items-start space-x-6">
                    <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <PhotoIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">Wild Hearts</h3>
                        <Badge className="bg-green-100 text-green-800 border-0 px-3 py-1 font-medium">In Production</Badge>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Environmental conservation documentary exploring the intersection of human connection and nature preservation.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-semibold text-green-600">75% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Shamita (Creative)</span>
                          <span>•</span>
                          <span>Ursula (Strategy)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            <Card className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-600/20"></div>
                <CardContent className="p-8 relative">
                  <div className="flex items-start space-x-6">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <PhotoIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">Around the Table</h3>
                        <Badge className="bg-amber-100 text-amber-800 border-0 px-3 py-1 font-medium">Planning</Badge>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Community engagement series fostering dialogue and connection through shared experiences and storytelling.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-semibold text-amber-600">25% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Mish (Operations)</span>
                          <span>•</span>
                          <span>Ash (Partnerships)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                  <SparklesIcon className="h-5 w-5 mr-2 text-green-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <PlusIcon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">New Project</div>
                        <div className="text-sm opacity-90">Start a new media project</div>
                      </div>
                    </div>
                  </Button>

                  <Button className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Find Grants</div>
                        <div className="text-sm opacity-90">Discover funding opportunities</div>
                      </div>
                    </div>
                  </Button>

                  <Button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <UsersIcon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Team Overview</div>
                        <div className="text-sm opacity-90">View team collaboration</div>
                      </div>
                    </div>
                  </Button>

                  <Button className="group bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <ChartBarIcon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Impact Report</div>
                        <div className="text-sm opacity-90">Generate impact analytics</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                  <ClockIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Kiara updated learning progress</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Shamita assigned new project tasks</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Ursula scheduled team meeting</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                  <UsersIcon className="h-5 w-5 mr-2 text-green-600" />
                  Team Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">US</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Ursula Searle</p>
                        <p className="text-xs text-gray-500">Managing Director</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-0 text-xs">Available</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">SS</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Shamita Siva</p>
                        <p className="text-xs text-gray-500">Creative Director</p>
                      </div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 border-0 text-xs">Busy</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">KH</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Kiara Holt</p>
                        <p className="text-xs text-gray-500">Intern</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-0 text-xs">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">87%</p>
                    <p className="text-sm text-gray-600">Grant Success Rate</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">92%</p>
                    <p className="text-sm text-gray-600">Project Completion</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <p className="text-2xl font-bold text-purple-600">95%</p>
                    <p className="text-sm text-gray-600">Team Satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 