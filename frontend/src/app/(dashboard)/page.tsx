'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  PhotoIcon,
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  PlusIcon,
  ArrowRightIcon,
  SparklesIcon,
  PlayIcon,
  AcademicCapIcon,
  HeartIcon,
  LightBulbIcon,
  GlobeAltIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sge-black via-sge-forest to-sge-tawny">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-sge-subtle"></div>
        <div className="relative p-8 max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-2xl shadow-strong">
                  <svg className="h-10 w-10 text-sge-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-sge-tawny rounded-full flex items-center justify-center">
                  <SparklesIcon className="h-3 w-3 text-sge-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-carrot bg-gradient-to-r from-sge-white to-sge-white/90 bg-clip-text text-transparent mb-2">
                  Shadow Goose Entertainment
                </h1>
                <p className="text-xl font-neue text-sge-white/80 font-medium">
                  Media Impact & Project Management Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2 bg-sge-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft">
                <div className="w-3 h-3 bg-sge-forest rounded-full animate-pulse"></div>
                <span className="font-neue font-medium text-sge-white">System Online</span>
              </div>
              <div className="flex items-center space-x-2 bg-sge-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft">
                <UsersIcon className="h-4 w-4 text-sge-forest" />
                <span className="font-neue font-medium text-sge-white">6 Team Members</span>
              </div>
              <div className="flex items-center space-x-2 bg-sge-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft">
                <PlayIcon className="h-4 w-4 text-sge-tawny" />
                <span className="font-neue font-medium text-sge-white">4 Active Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto -mt-8">
        {/* Enhanced Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="group bg-sge-black/80 backdrop-blur-sm border border-sge-forest/20 shadow-strong hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-neue font-medium text-sge-white/70 mb-1">Media Projects</p>
                  <p className="text-3xl font-carrot bg-gradient-to-r from-sge-forest to-sge-tawny bg-clip-text text-transparent">4</p>
                  <p className="text-xs text-sge-forest font-medium mt-1">Active & Thriving</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-xl shadow-strong group-hover:scale-110 transition-transform duration-300">
                  <PhotoIcon className="h-6 w-6 text-sge-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-sge-black/80 backdrop-blur-sm border border-sge-forest/20 shadow-strong hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-neue font-medium text-sge-white/70 mb-1">Grant Success</p>
                  <p className="text-3xl font-carrot bg-gradient-to-r from-sge-forest to-sge-tawny bg-clip-text text-transparent">87%</p>
                  <p className="text-xs text-sge-forest font-medium mt-1">Above Average</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-xl shadow-strong group-hover:scale-110 transition-transform duration-300">
                  <ChartBarIcon className="h-6 w-6 text-sge-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-sge-black/80 backdrop-blur-sm border border-sge-forest/20 shadow-strong hover:shadow-glow-purple transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-neue font-medium text-sge-white/70 mb-1">Team Members</p>
                  <p className="text-3xl font-carrot bg-gradient-to-r from-sge-forest to-sge-tawny bg-clip-text text-transparent">6</p>
                  <p className="text-xs text-sge-forest font-medium mt-1">Including 1 Intern</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-xl shadow-strong group-hover:scale-110 transition-transform duration-300">
                  <UsersIcon className="h-6 w-6 text-sge-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-sge-black/80 backdrop-blur-sm border border-sge-forest/20 shadow-strong hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-neue font-medium text-sge-white/70 mb-1">Impact Score</p>
                  <p className="text-3xl font-carrot bg-gradient-to-r from-sge-forest to-sge-tawny bg-clip-text text-transparent">92</p>
                  <p className="text-xs text-sge-forest font-medium mt-1">Excellent Rating</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-xl shadow-strong group-hover:scale-110 transition-transform duration-300">
                  <HeartIcon className="h-6 w-6 text-sge-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Projects Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-carrot text-sge-white mb-2">Featured Media Projects</h2>
              <p className="text-sge-white/70 font-neue">Our flagship productions making real impact</p>
            </div>
            <Button className="bg-gradient-to-r from-sge-forest to-sge-tawny hover:from-sge-forest/90 hover:to-sge-tawny/90 text-sge-white border-0 shadow-strong hover:shadow-glow transition-all duration-300">
              View All Projects
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="group bg-sge-black/80 backdrop-blur-sm border border-sge-forest/20 shadow-strong hover:shadow-glow transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-sge-forest/20 to-sge-tawny/20"></div>
                <CardContent className="p-8 relative">
                  <div className="flex items-start space-x-6">
                    <div className="p-4 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-2xl shadow-strong group-hover:scale-110 transition-transform duration-300">
                      <PhotoIcon className="h-8 w-8 text-sge-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-carrot text-sge-white">Wild Hearts</h3>
                        <Badge className="bg-sge-forest/20 text-sge-forest border-0 px-3 py-1 font-neue font-medium">In Production</Badge>
                      </div>
                      <p className="text-sge-white/80 font-neue mb-4 leading-relaxed">
                        Environmental conservation documentary exploring the intersection of human connection and nature preservation.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-sge-white/70 font-neue">Progress</span>
                          <span className="text-sm font-neue font-semibold text-sge-forest">75% Complete</span>
                        </div>
                        <div className="w-full bg-sge-black/50 rounded-full h-2">
                          <div className="bg-gradient-to-r from-sge-forest to-sge-tawny h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-sge-white/60 font-neue">
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

            <Card className="group bg-sge-black/80 backdrop-blur-sm border border-sge-forest/20 shadow-strong hover:shadow-glow transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-sge-forest/20 to-sge-tawny/20"></div>
                <CardContent className="p-8 relative">
                  <div className="flex items-start space-x-6">
                    <div className="p-4 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-2xl shadow-strong group-hover:scale-110 transition-transform duration-300">
                      <HeartIcon className="h-8 w-8 text-sge-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-carrot text-sge-white">Around the Table</h3>
                        <Badge className="bg-sge-tawny/20 text-sge-tawny border-0 px-3 py-1 font-neue font-medium">Planning Phase</Badge>
                      </div>
                      <p className="text-sge-white/80 font-neue mb-4 leading-relaxed">
                        Community engagement series fostering meaningful dialogue and connection across diverse communities.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-sge-white/70 font-neue">Progress</span>
                          <span className="text-sm font-neue font-semibold text-sge-tawny">25% Complete</span>
                        </div>
                        <div className="w-full bg-sge-black/50 rounded-full h-2">
                          <div className="bg-gradient-to-r from-sge-forest to-sge-tawny h-2 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-sge-white/60 font-neue">
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
            <Card className="bg-sge-black/80 backdrop-blur-sm border border-sge-forest/20 shadow-strong">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-carrot text-sge-white">
                  <SparklesIcon className="h-5 w-5 mr-2 text-sge-forest" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="group bg-gradient-to-r from-sge-forest to-sge-tawny hover:from-sge-forest/90 hover:to-sge-tawny/90 text-sge-white border-0 shadow-strong hover:shadow-glow transition-all duration-300 h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-sge-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <PlusIcon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-neue font-semibold">New Project</div>
                        <div className="text-sm opacity-90 font-neue">Start a new media project</div>
                      </div>
                    </div>
                  </Button>

                  <Button className="group bg-gradient-to-r from-sge-forest to-sge-tawny hover:from-sge-forest/90 hover:to-sge-tawny/90 text-sge-white border-0 shadow-strong hover:shadow-glow transition-all duration-300 h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-sge-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <DocumentTextIcon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-neue font-semibold">Grant Search</div>
                        <div className="text-sm opacity-90 font-neue">Find funding opportunities</div>
                      </div>
                    </div>
                  </Button>

                  <Button className="group bg-gradient-to-r from-sge-forest to-sge-tawny hover:from-sge-forest/90 hover:to-sge-tawny/90 text-sge-white border-0 shadow-strong hover:shadow-glow transition-all duration-300 h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-sge-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <UsersIcon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-neue font-semibold">Team Meeting</div>
                        <div className="text-sm opacity-90 font-neue">Schedule collaboration</div>
                      </div>
                    </div>
                  </Button>

                  <Button className="group bg-gradient-to-r from-sge-forest to-sge-tawny hover:from-sge-forest/90 hover:to-sge-tawny/90 text-sge-white border-0 shadow-strong hover:shadow-glow transition-all duration-300 h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-sge-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <ChartBarIcon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-neue font-semibold">Impact Report</div>
                        <div className="text-sm opacity-90 font-neue">Generate analytics</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-sge-black/80 backdrop-blur-sm border border-sge-forest/20 shadow-strong">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-carrot text-sge-white">
                  <ClockIcon className="h-5 w-5 mr-2 text-sge-forest" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-sge-forest/10 to-sge-tawny/10 rounded-xl">
                    <div className="w-2 h-2 bg-sge-forest rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-neue font-medium text-sge-white">Kiara updated learning progress</p>
                      <p className="text-xs text-sge-white/60 font-neue">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-sge-forest/10 to-sge-tawny/10 rounded-xl">
                    <div className="w-2 h-2 bg-sge-tawny rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-neue font-medium text-sge-white">Wild Hearts production milestone reached</p>
                      <p className="text-xs text-sge-white/60 font-neue">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-sge-forest/10 to-sge-tawny/10 rounded-xl">
                    <div className="w-2 h-2 bg-sge-forest rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-neue font-medium text-sge-white">New grant opportunity identified</p>
                      <p className="text-xs text-sge-white/60 font-neue">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Status */}
            <Card className="bg-sge-black/80 backdrop-blur-sm border border-sge-forest/20 shadow-strong">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-carrot text-sge-white">
                  <UsersIcon className="h-5 w-5 mr-2 text-sge-forest" />
                  Team Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-sge-forest/10 to-sge-tawny/10 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-full flex items-center justify-center">
                        <span className="text-sge-white text-sm font-bold font-neue">US</span>
                      </div>
                      <div>
                        <p className="text-sm font-neue font-medium text-sge-white">Ursula Searle</p>
                        <p className="text-xs text-sge-white/60 font-neue">Managing Director</p>
                      </div>
                    </div>
                    <Badge className="bg-sge-forest/20 text-sge-forest border-0 text-xs font-neue">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-sge-forest/10 to-sge-tawny/10 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-full flex items-center justify-center">
                        <span className="text-sge-white text-sm font-bold font-neue">AS</span>
                      </div>
                      <div>
                        <p className="text-sm font-neue font-medium text-sge-white">Ash Dorman</p>
                        <p className="text-xs text-sge-white/60 font-neue">Managing Director</p>
                      </div>
                    </div>
                    <Badge className="bg-sge-tawny/20 text-sge-tawny border-0 text-xs font-neue">In Meeting</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-sge-forest/10 to-sge-tawny/10 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-full flex items-center justify-center">
                        <span className="text-sge-white text-sm font-bold font-neue">SS</span>
                      </div>
                      <div>
                        <p className="text-sm font-neue font-medium text-sge-white">Shamita Siva</p>
                        <p className="text-xs text-sge-white/60 font-neue">Creative Director</p>
                      </div>
                    </div>
                    <Badge className="bg-sge-forest/20 text-sge-forest border-0 text-xs font-neue">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-sge-black/80 backdrop-blur-sm border border-sge-forest/20 shadow-strong">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-carrot text-sge-white">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-sge-forest" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-sge-forest/10 to-sge-tawny/10 rounded-xl">
                    <p className="text-2xl font-carrot text-sge-forest">87%</p>
                    <p className="text-sm text-sge-white/70 font-neue">Grant Success Rate</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-sge-forest/10 to-sge-tawny/10 rounded-xl">
                    <p className="text-2xl font-carrot text-sge-tawny">92</p>
                    <p className="text-sm text-sge-white/70 font-neue">Impact Score</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-sge-forest/10 to-sge-tawny/10 rounded-xl">
                    <p className="text-2xl font-carrot text-sge-forest">4</p>
                    <p className="text-sm text-sge-white/70 font-neue">Active Projects</p>
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