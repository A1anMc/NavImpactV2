'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RocketLaunchIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ChartBarIcon,
  UsersIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

// Mock sprint data
const mockSprints = [
  {
    id: 1,
    name: 'Sprint 5 - Grant MVP',
    theme: 'Grant Readiness & Application',
    status: 'active',
    completion_rate: 85,
    start_date: '2024-08-01',
    end_date: '2024-08-15',
    team_members: [
      { name: 'Ursula', role: 'Lead', avatar: '/avatars/ursula.jpg', hours_allocated: 40, hours_spent: 32 },
      { name: 'Kiara', role: 'Developer', avatar: '/avatars/kiara.jpg', hours_allocated: 30, hours_spent: 28 },
      { name: 'Alan', role: 'Analyst', avatar: '/avatars/alan.jpg', hours_allocated: 25, hours_spent: 20 }
    ],
    priority: 'high',
    goals: [
      { id: 1, title: 'Complete grant application', completed: true },
      { id: 2, title: 'Prepare supporting documents', completed: true },
      { id: 3, title: 'Review and submit', completed: false }
    ],
    metrics: {
      velocity: 12,
      burndown: 85,
      quality_score: 92,
      stakeholder_satisfaction: 88
    }
  },
  {
    id: 2,
    name: 'Sprint 6 - Analytics Integration',
    theme: 'Data & Insights Platform',
    status: 'planning',
    completion_rate: 0,
    start_date: '2024-08-16',
    end_date: '2024-08-30',
    team_members: [
      { name: 'Alan', role: 'Lead', avatar: '/avatars/alan.jpg', hours_allocated: 35, hours_spent: 0 },
      { name: 'Kiara', role: 'Developer', avatar: '/avatars/kiara.jpg', hours_allocated: 30, hours_spent: 0 }
    ],
    priority: 'medium',
    goals: [
      { id: 1, title: 'Set up Google Analytics', completed: false },
      { id: 2, title: 'Integrate Instagram API', completed: false },
      { id: 3, title: 'Create dashboard views', completed: false }
    ],
    metrics: {
      velocity: 0,
      burndown: 0,
      quality_score: 0,
      stakeholder_satisfaction: 0
    }
  },
  {
    id: 3,
    name: 'Sprint 4 - Content Strategy',
    theme: 'Digital Content & Marketing',
    status: 'completed',
    completion_rate: 100,
    start_date: '2024-07-15',
    end_date: '2024-07-31',
    team_members: [
      { name: 'Ursula', role: 'Lead', avatar: '/avatars/ursula.jpg', hours_allocated: 40, hours_spent: 38 },
      { name: 'Kiara', role: 'Content', avatar: '/avatars/kiara.jpg', hours_allocated: 25, hours_spent: 24 }
    ],
    priority: 'high',
    goals: [
      { id: 1, title: 'Develop content calendar', completed: true },
      { id: 2, title: 'Create brand guidelines', completed: true },
      { id: 3, title: 'Launch social media campaign', completed: true }
    ],
    metrics: {
      velocity: 15,
      burndown: 100,
      quality_score: 95,
      stakeholder_satisfaction: 92
    }
  }
];

export default function SprintsPage() {
  const [sprints, setSprints] = useState(mockSprints);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSprint, setSelectedSprint] = useState(mockSprints[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-blue-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayIcon className="w-4 h-4 text-green-500" />;
      case 'planning': return <ClockIcon className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircleIcon className="w-4 h-4 text-purple-500" />;
      default: return <ExclamationTriangleIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const calculateTeamProgress = (team: any[]) => {
    const totalAllocated = team.reduce((sum, member) => sum + member.hours_allocated, 0);
    const totalSpent = team.reduce((sum, member) => sum + member.hours_spent, 0);
    return totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Sprint Management
              </h1>
              <p className="text-slate-600 mt-1">Track progress, manage teams, and drive strategic execution</p>
            </div>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Sprint
            </Button>
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
            <TabsTrigger value="planning" className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4" />
              <span>Planning</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center space-x-2">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Completed</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Sprint Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Active Sprints</p>
                      <p className="text-3xl font-bold">{sprints.filter(s => s.status === 'active').length}</p>
                      <p className="text-green-200 text-sm">Currently running</p>
                    </div>
                    <div className="bg-green-400/20 p-3 rounded-full">
                      <PlayIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Avg Completion</p>
                      <p className="text-3xl font-bold">
                        {Math.round(sprints.reduce((sum, s) => sum + s.completion_rate, 0) / sprints.length)}%
                      </p>
                      <p className="text-blue-200 text-sm">Across all sprints</p>
                    </div>
                    <div className="bg-blue-400/20 p-3 rounded-full">
                      <StarIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Team Velocity</p>
                      <p className="text-3xl font-bold">
                        {Math.round(sprints.reduce((sum, s) => sum + s.metrics.velocity, 0) / sprints.length)}
                      </p>
                      <p className="text-purple-200 text-sm">Story points per sprint</p>
                    </div>
                    <div className="bg-purple-400/20 p-3 rounded-full">
                      <BoltIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Quality Score</p>
                      <p className="text-3xl font-bold">
                        {Math.round(sprints.reduce((sum, s) => sum + s.metrics.quality_score, 0) / sprints.length)}%
                      </p>
                      <p className="text-orange-200 text-sm">Average quality</p>
                    </div>
                    <div className="bg-orange-400/20 p-3 rounded-full">
                      <StarIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sprint Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sprints.map((sprint) => (
                <Card 
                  key={sprint.id} 
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedSprint(sprint)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(sprint.status)}
                          <Badge className={getPriorityColor(sprint.priority)}>
                            {sprint.priority}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{sprint.name}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{sprint.theme}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{sprint.completion_rate}%</span>
                      </div>
                      <Progress value={sprint.completion_rate} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{sprint.start_date} - {sprint.end_date}</span>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(sprint.status)}`}></div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Team Progress</span>
                        <span>{calculateTeamProgress(sprint.team_members)}%</span>
                      </div>
                      <Progress value={calculateTeamProgress(sprint.team_members)} className="h-2" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-500">Team:</span>
                      <div className="flex -space-x-2">
                        {sprint.team_members.slice(0, 3).map((member, index) => (
                          <Avatar key={index} className="w-6 h-6 border-2 border-white">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                        {sprint.team_members.length > 3 && (
                          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-xs text-slate-600">+{sprint.team_members.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="font-semibold text-blue-600">{sprint.metrics.velocity}</p>
                        <p className="text-blue-600">Velocity</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="font-semibold text-green-600">{sprint.metrics.quality_score}%</p>
                        <p className="text-green-600">Quality</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Active Sprints Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sprints.filter(s => s.status === 'active').map((sprint) => (
                <Card key={sprint.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <FireIcon className="w-5 h-5 text-orange-500" />
                        <span>{sprint.name}</span>
                      </CardTitle>
                      <Badge className={getPriorityColor(sprint.priority)}>
                        {sprint.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-slate-600">{sprint.theme}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{sprint.completion_rate}%</span>
                      </div>
                      <Progress value={sprint.completion_rate} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Goals</h4>
                      {sprint.goals.map((goal) => (
                        <div key={goal.id} className="flex items-center space-x-2">
                          {goal.completed ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                          )}
                          <span className={`text-sm ${goal.completed ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                            {goal.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Team</h4>
                      {sprint.team_members.map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{member.hours_spent}/{member.hours_allocated}h</p>
                            <p className="text-xs text-slate-500">
                              {Math.round((member.hours_spent / member.hours_allocated) * 100)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{sprint.metrics.velocity}</p>
                        <p className="text-xs text-blue-600">Velocity</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{sprint.metrics.quality_score}%</p>
                        <p className="text-xs text-green-600">Quality</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Planning Sprints Tab */}
          <TabsContent value="planning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sprints.filter(s => s.status === 'planning').map((sprint) => (
                <Card key={sprint.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <ClockIcon className="w-5 h-5 text-blue-500" />
                        <span>{sprint.name}</span>
                      </CardTitle>
                      <Badge className={getPriorityColor(sprint.priority)}>
                        {sprint.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">{sprint.theme}</p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{sprint.start_date} - {sprint.end_date}</span>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(sprint.status)}`}></div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Planned Goals</h4>
                      {sprint.goals.map((goal) => (
                        <div key={goal.id} className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                          <span className="text-sm text-slate-700">{goal.title}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Assigned Team</h4>
                      {sprint.team_members.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{member.hours_allocated}h</p>
                            <p className="text-xs text-slate-500">allocated</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Completed Sprints Tab */}
          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sprints.filter(s => s.status === 'completed').map((sprint) => (
                <Card key={sprint.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-purple-500" />
                        <span>{sprint.name}</span>
                      </CardTitle>
                      <Badge className="bg-purple-100 text-purple-800">
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">{sprint.theme}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Final Progress</span>
                        <span>{sprint.completion_rate}%</span>
                      </div>
                      <Progress value={sprint.completion_rate} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{sprint.metrics.velocity}</p>
                        <p className="text-xs text-blue-600">Velocity</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{sprint.metrics.quality_score}%</p>
                        <p className="text-xs text-green-600">Quality</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-lg font-bold text-purple-600">{sprint.metrics.stakeholder_satisfaction}%</p>
                        <p className="text-xs text-purple-600">Satisfaction</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-lg font-bold text-orange-600">{sprint.metrics.burndown}%</p>
                        <p className="text-xs text-orange-600">Burndown</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Completed Goals</h4>
                      {sprint.goals.map((goal) => (
                        <div key={goal.id} className="flex items-center space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-slate-700 line-through">{goal.title}</span>
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