'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  StarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  BoltIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

// Mock grants data
const mockGrants = [
  {
    id: 1,
    title: 'Screen Australia Documentary Funding',
    amount: '$50,000',
    status: 'in_progress',
    match_score: 92,
    deadline: '2024-09-15',
    category: 'Documentary',
    source: 'Screen Australia',
    description: 'Funding for documentary film production and development',
    requirements: [
      'Australian citizen or permanent resident',
      'Previous filmmaking experience',
      'Detailed project proposal',
      'Budget breakdown'
    ],
    team_members: [
      { name: 'Ursula', role: 'Lead', avatar: '/avatars/ursula.jpg' },
      { name: 'Kiara', role: 'Producer', avatar: '/avatars/kiara.jpg' }
    ],
    progress: 75,
    documents: [
      { name: 'Project Proposal', status: 'completed' },
      { name: 'Budget Breakdown', status: 'completed' },
      { name: 'Team CVs', status: 'in_progress' },
      { name: 'Supporting Materials', status: 'pending' }
    ],
    metrics: {
      application_strength: 85,
      competition_level: 'medium',
      success_probability: 78,
      time_to_deadline: 42
    }
  },
  {
    id: 2,
    title: 'Business.gov.au Innovation Grant',
    amount: '$25,000',
    status: 'researching',
    match_score: 78,
    deadline: '2024-10-01',
    category: 'Innovation',
    source: 'Business.gov.au',
    description: 'Support for innovative business projects and digital transformation',
    requirements: [
      'Registered Australian business',
      'Innovation component',
      'Economic impact assessment',
      'Digital transformation plan'
    ],
    team_members: [
      { name: 'Alan', role: 'Lead', avatar: '/avatars/alan.jpg' },
      { name: 'Kiara', role: 'Analyst', avatar: '/avatars/kiara.jpg' }
    ],
    progress: 30,
    documents: [
      { name: 'Business Plan', status: 'in_progress' },
      { name: 'Innovation Strategy', status: 'pending' },
      { name: 'Financial Projections', status: 'pending' },
      { name: 'Impact Assessment', status: 'pending' }
    ],
    metrics: {
      application_strength: 65,
      competition_level: 'high',
      success_probability: 45,
      time_to_deadline: 58
    }
  },
  {
    id: 3,
    title: 'Victorian Creative Industries Grant',
    amount: '$35,000',
    status: 'completed',
    match_score: 88,
    deadline: '2024-07-30',
    category: 'Creative Industries',
    source: 'Victorian Government',
    description: 'Support for creative industry projects and cultural development',
    requirements: [
      'Victorian-based project',
      'Cultural significance',
      'Community engagement plan',
      'Sustainability strategy'
    ],
    team_members: [
      { name: 'Ursula', role: 'Lead', avatar: '/avatars/ursula.jpg' },
      { name: 'Alan', role: 'Coordinator', avatar: '/avatars/alan.jpg' }
    ],
    progress: 100,
    documents: [
      { name: 'Project Proposal', status: 'completed' },
      { name: 'Cultural Impact Assessment', status: 'completed' },
      { name: 'Community Engagement Plan', status: 'completed' },
      { name: 'Final Report', status: 'completed' }
    ],
    metrics: {
      application_strength: 92,
      competition_level: 'medium',
      success_probability: 85,
      time_to_deadline: 0
    }
  }
];

export default function GrantsPage() {
  const [grants, setGrants] = useState(mockGrants);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGrant, setSelectedGrant] = useState(mockGrants[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'researching': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateTotalValue = () => {
    return grants.reduce((sum, grant) => {
      const amount = parseInt(grant.amount.replace(/[^0-9]/g, ''));
      return sum + amount;
    }, 0);
  };

  const calculateSuccessRate = () => {
    const completed = grants.filter(g => g.status === 'completed').length;
    return Math.round((completed / grants.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Grants Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Track applications, manage deadlines, and maximize funding opportunities</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-slate-200">
                <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                Find Grants
              </Button>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0">
                <PlusIcon className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <ChartBarIcon className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <PlayIcon className="w-4 h-4" />
              <span>Active</span>
            </TabsTrigger>
            <TabsTrigger value="researching" className="flex items-center space-x-2">
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span>Researching</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center space-x-2">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Completed</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">Total Value</p>
                      <p className="text-3xl font-bold">${calculateTotalValue().toLocaleString()}</p>
                      <p className="text-yellow-200 text-sm">Across all grants</p>
                    </div>
                    <div className="bg-yellow-400/20 p-3 rounded-full">
                      <CurrencyDollarIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Success Rate</p>
                      <p className="text-3xl font-bold">{calculateSuccessRate()}%</p>
                      <p className="text-green-200 text-sm">Applications won</p>
                    </div>
                    <div className="bg-green-400/20 p-3 rounded-full">
                      <CheckCircleIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Active Applications</p>
                      <p className="text-3xl font-bold">{grants.filter(g => g.status === 'in_progress').length}</p>
                      <p className="text-blue-200 text-sm">Currently working on</p>
                    </div>
                    <div className="bg-blue-400/20 p-3 rounded-full">
                      <PlayIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Avg Match Score</p>
                      <p className="text-3xl font-bold">
                        {Math.round(grants.reduce((sum, g) => sum + g.match_score, 0) / grants.length)}%
                      </p>
                      <p className="text-purple-200 text-sm">Application strength</p>
                    </div>
                    <div className="bg-purple-400/20 p-3 rounded-full">
                      <StarIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Grant Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {grants.map((grant) => (
                <Card 
                  key={grant.id} 
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedGrant(grant)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getStatusColor(grant.status)}>
                            {grant.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {grant.amount}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{grant.title}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{grant.source}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Match Score</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{grant.match_score}%</span>
                        <div className={`w-3 h-3 rounded-full ${getMatchScoreColor(grant.match_score)}`}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{grant.progress}%</span>
                      </div>
                      <Progress value={grant.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Deadline</span>
                      <span className="font-medium">{grant.deadline}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-500">Team:</span>
                      <div className="flex -space-x-2">
                        {grant.team_members.slice(0, 3).map((member, index) => (
                          <Avatar key={index} className="w-6 h-6 border-2 border-white">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                        {grant.team_members.length > 3 && (
                          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-xs text-slate-600">+{grant.team_members.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="font-semibold text-blue-600">{grant.metrics.success_probability}%</p>
                        <p className="text-blue-600">Success</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="font-semibold text-green-600">{grant.metrics.application_strength}%</p>
                        <p className="text-green-600">Strength</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Active Grants Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {grants.filter(g => g.status === 'in_progress').map((grant) => (
                <Card key={grant.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <PlayIcon className="w-5 h-5 text-blue-500" />
                        <span>{grant.title}</span>
                      </CardTitle>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {grant.amount}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-slate-600">{grant.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{grant.progress}%</span>
                      </div>
                      <Progress value={grant.progress} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Required Documents</h4>
                      {grant.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center space-x-2">
                            <DocumentTextIcon className="w-4 h-4 text-slate-500" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Badge className={
                            doc.status === 'completed' ? 'bg-green-100 text-green-800' :
                            doc.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {doc.status}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Requirements</h4>
                      {grant.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-slate-700">{req}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{grant.metrics.success_probability}%</p>
                        <p className="text-xs text-blue-600">Success Probability</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{grant.metrics.application_strength}%</p>
                        <p className="text-xs text-green-600">Application Strength</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Researching Grants Tab */}
          <TabsContent value="researching" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {grants.filter(g => g.status === 'researching').map((grant) => (
                <Card key={grant.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <MagnifyingGlassIcon className="w-5 h-5 text-yellow-500" />
                        <span>{grant.title}</span>
                      </CardTitle>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        {grant.amount}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">{grant.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Deadline</span>
                      <span className="font-medium">{grant.deadline}</span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Requirements</h4>
                      {grant.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                          <span className="text-sm text-slate-700">{req}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Assigned Team</h4>
                      {grant.team_members.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-lg font-bold text-yellow-600">{grant.metrics.success_probability}%</p>
                        <p className="text-xs text-yellow-600">Success Probability</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{grant.metrics.competition_level}</p>
                        <p className="text-xs text-blue-600">Competition</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Completed Grants Tab */}
          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {grants.filter(g => g.status === 'completed').map((grant) => (
                <Card key={grant.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span>{grant.title}</span>
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">{grant.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Final Progress</span>
                        <span>{grant.progress}%</span>
                      </div>
                      <Progress value={grant.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{grant.metrics.success_probability}%</p>
                        <p className="text-xs text-green-600">Success Rate</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{grant.metrics.application_strength}%</p>
                        <p className="text-xs text-blue-600">Application Strength</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Completed Documents</h4>
                      {grant.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {doc.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 