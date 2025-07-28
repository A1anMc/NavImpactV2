'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ChartBarIcon,
  FolderIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  PlayIcon,
  FilmIcon,
  CameraIcon,
  MegaphoneIcon,
  GlobeAltIcon,
  TrophyIcon,
  StarIcon,
  FireIcon,
  LightningBoltIcon,
  CrownIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const projects = [
    {
      id: 1,
      name: 'Wild Hearts',
      description: 'Cinematic documentary exploring human resilience',
      progress: 85,
      status: 'In Production',
      category: 'Documentary',
      team: ['Ursula Searle', 'Shamita Siva'],
      budget: '$125,000',
      timeline: 'Q2 2025',
      impact: 'High',
    },
    {
      id: 2,
      name: 'Around the Table',
      description: 'Community storytelling through shared meals',
      progress: 65,
      status: 'Pre-Production',
      category: 'Series',
      team: ['Ash Dorman', 'Mish Rep'],
      budget: '$85,000',
      timeline: 'Q3 2025',
      impact: 'Medium',
    },
    {
      id: 3,
      name: 'The Last Line',
      description: 'Environmental conservation narrative',
      progress: 45,
      status: 'Development',
      category: 'Feature',
      team: ['Alan McCarthy', 'Kiara Holt'],
      budget: '$200,000',
      timeline: 'Q4 2025',
      impact: 'High',
    },
  ];

  const metrics = [
    {
      title: 'Active Projects',
      value: '3',
      change: '+1',
      icon: FilmIcon,
      color: 'from-sge-forest to-sge-tawny',
    },
    {
      title: 'Production Hours',
      value: '1,247',
      change: '+23%',
      icon: ClockIcon,
      color: 'from-sge-tawny to-sge-black',
    },
    {
      title: 'Team Members',
      value: '6',
      change: '+1',
      icon: UserGroupIcon,
      color: 'from-sge-black to-sge-forest',
    },
    {
      title: 'Impact Score',
      value: '94%',
      change: '+8%',
      icon: TrophyIcon,
      color: 'from-sge-forest to-sge-tawny',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Production milestone reached',
      project: 'Wild Hearts',
      user: 'Ursula Searle',
      time: '2 hours ago',
      type: 'milestone',
    },
    {
      id: 2,
      action: 'New grant application submitted',
      project: 'Around the Table',
      user: 'Ash Dorman',
      time: '4 hours ago',
      type: 'grant',
    },
    {
      id: 3,
      action: 'Script review completed',
      project: 'The Last Line',
      user: 'Shamita Siva',
      time: '6 hours ago',
      type: 'review',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sge-black via-sge-forest/20 to-sge-tawny/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sge-black/90 via-sge-forest/50 to-sge-tawny/70"></div>
        <div className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-2xl shadow-2xl">
                <SparklesIcon className="h-8 w-8 text-sge-white" />
              </div>
              <div>
                <h1 className="text-5xl font-carrot font-bold text-sge-white mb-2">
                  Shadow Goose Entertainment
                </h1>
                <p className="text-xl font-neue text-sge-white/80">
                  Cinematic storytelling that drives meaningful impact
                </p>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sge-white/90 font-neue">All systems operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-sge-tawny rounded-full"></div>
                <span className="text-sge-white/90 font-neue">3 active productions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-sge-forest rounded-full"></div>
                <span className="text-sge-white/90 font-neue">94% impact score</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="glass border-sge-forest/20 hover:border-sge-tawny/40 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-neue text-sge-white/60 mb-1">{metric.title}</p>
                      <p className="text-3xl font-carrot font-bold text-sge-white">{metric.value}</p>
                      <p className="text-sm font-neue text-green-400">{metric.change}</p>
                    </div>
                    <div className={`p-3 bg-gradient-to-br ${metric.color} rounded-xl`}>
                      <metric.icon className="h-6 w-6 text-sge-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Projects Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-carrot font-bold text-sge-white">Active Productions</h2>
              <Button className="bg-gradient-to-r from-sge-forest to-sge-tawny hover:from-sge-tawny hover:to-sge-forest text-sge-white border-0">
                <PlayIcon className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="glass border-sge-forest/20 hover:border-sge-tawny/40 transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-carrot text-sge-white group-hover:text-sge-tawny transition-colors">
                          {project.name}
                        </CardTitle>
                        <p className="text-sm font-neue text-sge-white/70 mt-1">{project.description}</p>
                      </div>
                      <Badge className={`${
                        project.status === 'In Production' ? 'bg-green-500/20 text-green-400' :
                        project.status === 'Pre-Production' ? 'bg-sge-tawny/20 text-sge-tawny' :
                        'bg-sge-forest/20 text-sge-forest'
                      }`}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-sge-white/60">Progress</span>
                        <span className="text-sge-white">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 bg-sge-black/30">
                        <div className="h-full bg-gradient-to-r from-sge-forest to-sge-tawny rounded-full transition-all duration-300" 
                             style={{ width: `${project.progress}%` }}></div>
                      </Progress>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-sge-white/60 font-neue">Category</p>
                        <p className="text-sge-white font-carrot">{project.category}</p>
                      </div>
                      <div>
                        <p className="text-sge-white/60 font-neue">Budget</p>
                        <p className="text-sge-white font-carrot">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-sge-white/60 font-neue">Timeline</p>
                        <p className="text-sge-white font-carrot">{project.timeline}</p>
                      </div>
                      <div>
                        <p className="text-sge-white/60 font-neue">Impact</p>
                        <p className="text-sge-white font-carrot">{project.impact}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-sge-forest/20">
                      <p className="text-xs text-sge-white/60 font-neue mb-2">Team</p>
                      <div className="flex flex-wrap gap-1">
                        {project.team.map((member, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-sge-forest/30 text-sge-white/80">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h2 className="text-3xl font-carrot font-bold text-sge-white">Recent Activity</h2>
            <Card className="glass border-sge-forest/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-xl bg-sge-black/20 hover:bg-sge-black/30 transition-colors">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'milestone' ? 'bg-green-500/20' :
                        activity.type === 'grant' ? 'bg-sge-tawny/20' :
                        'bg-sge-forest/20'
                      }`}>
                        {activity.type === 'milestone' && <TrophyIcon className="h-5 w-5 text-green-400" />}
                        {activity.type === 'grant' && <DocumentMagnifyingGlassIcon className="h-5 w-5 text-sge-tawny" />}
                        {activity.type === 'review' && <ClipboardDocumentListIcon className="h-5 w-5 text-sge-forest" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sge-white font-neue">{activity.action}</p>
                        <p className="text-sm text-sge-white/60">{activity.project} • {activity.user}</p>
                      </div>
                      <span className="text-sm text-sge-white/40 font-neue">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-3xl font-carrot font-bold text-sge-white">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="glass border-sge-forest/20 hover:border-sge-tawny/40 h-20 flex flex-col items-center justify-center space-y-2">
                <PlayIcon className="h-6 w-6 text-sge-white" />
                <span className="text-sm font-neue text-sge-white">Start Production</span>
              </Button>
              <Button className="glass border-sge-forest/20 hover:border-sge-tawny/40 h-20 flex flex-col items-center justify-center space-y-2">
                <CameraIcon className="h-6 w-6 text-sge-white" />
                <span className="text-sm font-neue text-sge-white">Schedule Shoot</span>
              </Button>
              <Button className="glass border-sge-forest/20 hover:border-sge-tawny/40 h-20 flex flex-col items-center justify-center space-y-2">
                <MegaphoneIcon className="h-6 w-6 text-sge-white" />
                <span className="text-sm font-neue text-sge-white">Marketing</span>
              </Button>
              <Button className="glass border-sge-forest/20 hover:border-sge-tawny/40 h-20 flex flex-col items-center justify-center space-y-2">
                <GlobeAltIcon className="h-6 w-6 text-sge-white" />
                <span className="text-sm font-neue text-sge-white">Distribution</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 