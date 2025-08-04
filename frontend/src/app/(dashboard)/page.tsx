'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CalendarIcon, 
  ChartBarIcon as ChartBarIcon2,
  RocketLaunchIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  EyeIcon,
  HeartIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { 
  ChartBarIcon as TrendingUpSolid,
  UsersIcon as UsersSolid,
  CalendarIcon as CalendarSolid,
  ChartBarIcon as ChartBarSolid
} from '@heroicons/react/24/solid';

// Mock data for demonstration
const mockAnalytics = {
  googleAnalytics: {
    active_users: 247,
    page_views: 1247,
    current_pages: [
      { page: '/dashboard', views: 156 },
      { page: '/grants', views: 89 },
      { page: '/sprints', views: 67 }
    ],
    status: 'live'
  },
  instagram: {
    followers: 2847,
    posts: 156,
    engagement_rate: 4.2,
    recent_posts: [
      { id: 1, caption: 'Behind the scenes of our latest project', likes: 234, comments: 45 },
      { id: 2, caption: 'Team collaboration in action', likes: 189, comments: 32 }
    ],
    status: 'live'
  }
};

const mockSprints = [
  {
    id: 1,
    name: 'Sprint 5 - Grant MVP',
    theme: 'Grant Readiness',
    status: 'active',
    completion_rate: 85,
    start_date: '2024-08-01',
    end_date: '2024-08-15',
    team_members: ['Ursula', 'Kiara', 'Alan'],
    priority: 'high'
  },
  {
    id: 2,
    name: 'Sprint 6 - Analytics Integration',
    theme: 'Data & Insights',
    status: 'planning',
    completion_rate: 0,
    start_date: '2024-08-16',
    end_date: '2024-08-30',
    team_members: ['Alan', 'Kiara'],
    priority: 'medium'
  }
];

const mockGrants = [
  {
    id: 1,
    title: 'Screen Australia Documentary Funding',
    amount: '$50,000',
    status: 'in_progress',
    match_score: 92,
    deadline: '2024-09-15'
  },
  {
    id: 2,
    title: 'Business.gov.au Innovation Grant',
    amount: '$25,000',
    status: 'researching',
    match_score: 78,
    deadline: '2024-10-01'
  }
];

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [sprints, setSprints] = useState(mockSprints);
  const [grants, setGrants] = useState(mockGrants);
  const [activeTab, setActiveTab] = useState('overview');

  // Animated counter effect
  const [counters, setCounters] = useState({
    activeUsers: 0,
    pageViews: 0,
    followers: 0,
    completionRate: 0
  });

  useEffect(() => {
    const animateCounters = () => {
      setCounters({
        activeUsers: analytics.googleAnalytics.active_users,
        pageViews: analytics.googleAnalytics.page_views,
        followers: analytics.instagram.followers,
        completionRate: sprints[0]?.completion_rate || 0
      });
    };

    const timer = setTimeout(animateCounters, 500);
    return () => clearTimeout(timer);
  }, [analytics, sprints]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SGE Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Strategic execution engine for Shadow Goose Entertainment</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Live
              </Badge>
              <Avatar>
                <AvatarImage src="/avatars/ursula.jpg" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <ChartBarSolid className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="sprints" className="flex items-center space-x-2">
              <RocketLaunchIcon className="w-4 h-4" />
              <span>Sprints</span>
            </TabsTrigger>
            <TabsTrigger value="grants" className="flex items-center space-x-2">
              <StarIcon className="w-4 h-4" />
              <span>Grants</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <ChartBarIcon className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Active Users</p>
                      <p className="text-3xl font-bold">{counters.activeUsers}</p>
                      <p className="text-blue-200 text-sm">+12% from last hour</p>
                    </div>
                    <div className="bg-blue-400/20 p-3 rounded-full">
                      <UsersSolid className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Page Views</p>
                      <p className="text-3xl font-bold">{counters.pageViews}</p>
                      <p className="text-green-200 text-sm">+8% from yesterday</p>
                    </div>
                    <div className="bg-green-400/20 p-3 rounded-full">
                      <EyeIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Instagram Followers</p>
                      <p className="text-3xl font-bold">{counters.followers}</p>
                      <p className="text-purple-200 text-sm">+23 this week</p>
                    </div>
                    <div className="bg-purple-400/20 p-3 rounded-full">
                      <HeartIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Sprint Progress</p>
                      <p className="text-3xl font-bold">{counters.completionRate}%</p>
                      <p className="text-orange-200 text-sm">On track</p>
                    </div>
                    <div className="bg-orange-400/20 p-3 rounded-full">
                      <RocketLaunchIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Sprint & Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Sprint */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FireIcon className="w-5 h-5 text-orange-500" />
                    <span>Current Sprint</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sprints.filter(s => s.status === 'active').map((sprint) => (
                    <div key={sprint.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{sprint.name}</h3>
                        <Badge className={getPriorityColor(sprint.priority)}>
                          {sprint.priority}
                        </Badge>
                      </div>
                      <p className="text-slate-600">{sprint.theme}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{sprint.completion_rate}%</span>
                        </div>
                        <Progress value={sprint.completion_rate} className="h-2" />
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{sprint.start_date} - {sprint.end_date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-500">Team:</span>
                        <div className="flex -space-x-2">
                          {sprint.team_members.map((member, index) => (
                            <Avatar key={index} className="w-6 h-6 border-2 border-white">
                              <AvatarFallback className="text-xs">{member[0]}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Live Analytics */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BoltIcon className="w-5 h-5 text-blue-500" />
                    <span>Live Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{analytics.googleAnalytics.active_users}</p>
                      <p className="text-sm text-blue-600">Active Users</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{analytics.instagram.followers}</p>
                      <p className="text-sm text-green-600">Followers</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Engagement Rate</span>
                      <span className="font-semibold">{analytics.instagram.engagement_rate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Recent Posts</span>
                      <span className="font-semibold">{analytics.instagram.recent_posts.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5 text-slate-500" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Grant application submitted</p>
                      <p className="text-sm text-slate-600">Screen Australia Documentary Funding</p>
                    </div>
                    <span className="text-sm text-slate-500 ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <PlayIcon className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Sprint 5 started</p>
                      <p className="text-sm text-slate-600">Grant MVP development</p>
                    </div>
                    <span className="text-sm text-slate-500 ml-auto">4h ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <ChartBarIcon className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Analytics updated</p>
                      <p className="text-sm text-slate-600">Instagram engagement increased 15%</p>
                    </div>
                    <span className="text-sm text-slate-500 ml-auto">6h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sprints Tab */}
          <TabsContent value="sprints" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sprints.map((sprint) => (
                <Card key={sprint.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <RocketLaunchIcon className="w-5 h-5 text-orange-500" />
                        <span>{sprint.name}</span>
                      </CardTitle>
                      <Badge className={getPriorityColor(sprint.priority)}>
                        {sprint.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">{sprint.theme}</p>
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-500">Team:</span>
                      <div className="flex -space-x-2">
                        {sprint.team_members.map((member, index) => (
                          <Avatar key={index} className="w-6 h-6 border-2 border-white">
                            <AvatarFallback className="text-xs">{member[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Grants Tab */}
          <TabsContent value="grants" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {grants.map((grant) => (
                <Card key={grant.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <StarIcon className="w-5 h-5 text-yellow-500" />
                        <span>{grant.title}</span>
                      </CardTitle>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {grant.amount}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Match Score</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{grant.match_score}%</span>
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                            style={{ width: `${grant.match_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Deadline</span>
                      <span className="font-medium">{grant.deadline}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Status</span>
                      <Badge className={grant.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                        {grant.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Google Analytics */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ChartBarIcon className="w-5 h-5 text-blue-500" />
                    <span>Google Analytics</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analytics.googleAnalytics.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{analytics.googleAnalytics.active_users}</p>
                      <p className="text-sm text-blue-600">Active Users</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{analytics.googleAnalytics.page_views}</p>
                      <p className="text-sm text-green-600">Page Views</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Top Pages</p>
                    {analytics.googleAnalytics.current_pages.map((page, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{page.page}</span>
                        <span className="font-medium">{page.views} views</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Instagram Analytics */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HeartIcon className="w-5 h-5 text-pink-500" />
                    <span>Instagram Analytics</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analytics.instagram.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <p className="text-2xl font-bold text-pink-600">{analytics.instagram.followers}</p>
                      <p className="text-sm text-pink-600">Followers</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{analytics.instagram.engagement_rate}%</p>
                      <p className="text-sm text-purple-600">Engagement</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recent Posts</p>
                    {analytics.instagram.recent_posts.slice(0, 3).map((post, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="truncate">{post.caption}</span>
                        <span className="font-medium">{post.likes} likes</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 