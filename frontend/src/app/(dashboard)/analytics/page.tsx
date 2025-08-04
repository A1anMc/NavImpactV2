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
  ArrowDownIcon,
  UsersIcon,
  EyeIcon,
  HeartIcon,
  ClockIcon,
  ChartBarIcon as ChartBarIcon2,
  BoltIcon,
  StarIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowDownIcon as ArrowDownIcon2,
  PlayIcon,
  PauseIcon,
  StopIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline';

// Mock analytics data
const mockAnalytics = {
  googleAnalytics: {
    active_users: 247,
    page_views: 1247,
    session_duration: 245,
    bounce_rate: 23.4,
    current_pages: [
      { page: '/dashboard', views: 156, change: 12 },
      { page: '/grants', views: 89, change: -5 },
      { page: '/sprints', views: 67, change: 8 },
      { page: '/analytics', views: 45, change: 15 },
      { page: '/team', views: 34, change: -2 }
    ],
    traffic_sources: [
      { source: 'Direct', sessions: 456, percentage: 45 },
      { source: 'Organic Search', sessions: 234, percentage: 23 },
      { source: 'Social Media', sessions: 189, percentage: 19 },
      { source: 'Referral', sessions: 89, percentage: 9 },
      { source: 'Email', sessions: 45, percentage: 4 }
    ],
    devices: [
      { device: 'Desktop', sessions: 567, percentage: 56 },
      { device: 'Mobile', sessions: 345, percentage: 34 },
      { device: 'Tablet', sessions: 101, percentage: 10 }
    ],
    status: 'live'
  },
  instagram: {
    followers: 2847,
    posts: 156,
    engagement_rate: 4.2,
    reach: 12450,
    impressions: 18920,
    recent_posts: [
      { id: 1, caption: 'Behind the scenes of our latest project', likes: 234, comments: 45, reach: 1200 },
      { id: 2, caption: 'Team collaboration in action', likes: 189, comments: 32, reach: 980 },
      { id: 3, caption: 'Grant success story', likes: 312, comments: 67, reach: 1500 },
      { id: 4, caption: 'Sprint completion celebration', likes: 156, comments: 28, reach: 890 }
    ],
    top_hashtags: [
      { hashtag: '#documentary', posts: 23, reach: 4500 },
      { hashtag: '#filmmaking', posts: 18, reach: 3200 },
      { hashtag: '#grants', posts: 15, reach: 2800 },
      { hashtag: '#impact', posts: 12, reach: 2100 }
    ],
    status: 'live'
  },
  trends: {
    weekly_growth: 12.5,
    monthly_growth: 8.3,
    engagement_trend: 'up',
    follower_growth: 23,
    post_frequency: 2.3
  }
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');

  const getTrendIcon = (change: number) => {
    return change > 0 ? (
      <ArrowUpIcon className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 text-red-500" />
    );
  };

  const getTrendColor = (change: number) => {
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const calculateEngagementRate = (likes: number, comments: number, followers: number) => {
    return ((likes + comments) / followers * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Real-time insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Live Data
              </Badge>
              <Button variant="outline" className="border-slate-200">
                <ChartBarIcon className="w-4 h-4 mr-2" />
                Export Report
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
            <TabsTrigger value="google" className="flex items-center space-x-2">
              <GlobeAltIcon className="w-4 h-4" />
              <span>Google Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center space-x-2">
              <HeartIcon className="w-4 h-4" />
              <span>Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <ChartBarIcon className="w-4 h-4" />
              <span>Trends</span>
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
                      <p className="text-3xl font-bold">{formatNumber(analytics.googleAnalytics.active_users)}</p>
                      <div className="flex items-center mt-1">
                        <ArrowUpIcon className="w-4 h-4 text-blue-200 mr-1" />
                        <span className="text-blue-200 text-sm">+12% from last hour</span>
                      </div>
                    </div>
                    <div className="bg-blue-400/20 p-3 rounded-full">
                      <UsersIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Page Views</p>
                      <p className="text-3xl font-bold">{formatNumber(analytics.googleAnalytics.page_views)}</p>
                      <div className="flex items-center mt-1">
                        <ArrowUpIcon className="w-4 h-4 text-green-200 mr-1" />
                        <span className="text-green-200 text-sm">+8% from yesterday</span>
                      </div>
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
                      <p className="text-3xl font-bold">{formatNumber(analytics.instagram.followers)}</p>
                      <div className="flex items-center mt-1">
                        <ArrowUpIcon className="w-4 h-4 text-purple-200 mr-1" />
                        <span className="text-purple-200 text-sm">+23 this week</span>
                      </div>
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
                      <p className="text-orange-100 text-sm font-medium">Engagement Rate</p>
                      <p className="text-3xl font-bold">{analytics.instagram.engagement_rate}%</p>
                      <div className="flex items-center mt-1">
                        <ArrowUpIcon className="w-4 h-4 text-orange-200 mr-1" />
                        <span className="text-orange-200 text-sm">+2.1% from last month</span>
                      </div>
                    </div>
                    <div className="bg-orange-400/20 p-3 rounded-full">
                      <StarIcon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Google Analytics Overview */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                    <span>Google Analytics</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analytics.googleAnalytics.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{analytics.googleAnalytics.session_duration}s</p>
                      <p className="text-sm text-blue-600">Avg Session</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{analytics.googleAnalytics.bounce_rate}%</p>
                      <p className="text-sm text-green-600">Bounce Rate</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Top Pages</h4>
                    {analytics.googleAnalytics.current_pages.slice(0, 3).map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-sm font-medium">{page.page}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{page.views} views</span>
                          <div className="flex items-center">
                            {getTrendIcon(page.change)}
                            <span className={`text-xs ${getTrendColor(page.change)}`}>
                              {Math.abs(page.change)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Instagram Overview */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HeartIcon className="w-5 h-5 text-pink-500" />
                    <span>Instagram</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analytics.instagram.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <p className="text-2xl font-bold text-pink-600">{formatNumber(analytics.instagram.reach)}</p>
                      <p className="text-sm text-pink-600">Reach</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{formatNumber(analytics.instagram.impressions)}</p>
                      <p className="text-sm text-purple-600">Impressions</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Recent Posts</h4>
                    {analytics.instagram.recent_posts.slice(0, 3).map((post, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{post.caption}</p>
                          <p className="text-xs text-slate-500">{post.likes} likes, {post.comments} comments</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatNumber(post.reach)}</p>
                          <p className="text-xs text-slate-500">reach</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Sources & Devices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                    <span>Traffic Sources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.googleAnalytics.traffic_sources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{source.source}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                              style={{ width: `${source.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{source.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-green-500" />
                    <span>Device Usage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.googleAnalytics.devices.map((device, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {device.device === 'Desktop' && <ComputerDesktopIcon className="w-4 h-4 text-blue-500" />}
                          {device.device === 'Mobile' && <DevicePhoneMobileIcon className="w-4 h-4 text-green-500" />}
                          {device.device === 'Tablet' && <DeviceTabletIcon className="w-4 h-4 text-purple-500" />}
                          <span className="text-sm font-medium">{device.device}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                              style={{ width: `${device.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{device.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Google Analytics Tab */}
          <TabsContent value="google" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detailed Metrics */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ChartBarIcon className="w-5 h-5 text-blue-500" />
                      <span>Page Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.googleAnalytics.current_pages.map((page, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{page.page}</p>
                            <p className="text-sm text-slate-500">{page.views} views</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {getTrendIcon(page.change)}
                              <span className={`text-sm font-medium ${getTrendColor(page.change)}`}>
                                {Math.abs(page.change)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                      <span>Traffic Sources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.googleAnalytics.traffic_sources.map((source, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{source.source}</span>
                            <span className="text-sm text-slate-500">{source.sessions} sessions</span>
                          </div>
                          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                              style={{ width: `${source.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-slate-500">{source.percentage}% of total traffic</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Key Metrics */}
              <div className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BoltIcon className="w-5 h-5 text-blue-500" />
                      <span>Key Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">{formatNumber(analytics.googleAnalytics.active_users)}</p>
                      <p className="text-sm text-blue-600">Active Users</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">{formatNumber(analytics.googleAnalytics.page_views)}</p>
                      <p className="text-sm text-green-600">Page Views</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">{analytics.googleAnalytics.session_duration}s</p>
                      <p className="text-sm text-purple-600">Avg Session</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-3xl font-bold text-orange-600">{analytics.googleAnalytics.bounce_rate}%</p>
                      <p className="text-sm text-orange-600">Bounce Rate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Instagram Tab */}
          <TabsContent value="instagram" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Post Performance */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <HeartIcon className="w-5 h-5 text-pink-500" />
                      <span>Recent Posts Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.instagram.recent_posts.map((post, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium text-sm">{post.caption}</p>
                            <Badge className="bg-pink-100 text-pink-800">
                              {calculateEngagementRate(post.likes, post.comments, analytics.instagram.followers)}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-lg font-bold text-pink-600">{post.likes}</p>
                              <p className="text-xs text-slate-500">Likes</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-purple-600">{post.comments}</p>
                              <p className="text-xs text-slate-500">Comments</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-blue-600">{formatNumber(post.reach)}</p>
                              <p className="text-xs text-slate-500">Reach</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FireIcon className="w-5 h-5 text-orange-500" />
                      <span>Top Hashtags</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.instagram.top_hashtags.map((hashtag, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium">{hashtag.hashtag}</p>
                            <p className="text-sm text-slate-500">{hashtag.posts} posts</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatNumber(hashtag.reach)}</p>
                            <p className="text-sm text-slate-500">reach</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Instagram Metrics */}
              <div className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <StarIcon className="w-5 h-5 text-pink-500" />
                      <span>Instagram Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <p className="text-3xl font-bold text-pink-600">{formatNumber(analytics.instagram.followers)}</p>
                      <p className="text-sm text-pink-600">Followers</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">{analytics.instagram.engagement_rate}%</p>
                      <p className="text-sm text-purple-600">Engagement Rate</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">{formatNumber(analytics.instagram.reach)}</p>
                      <p className="text-sm text-blue-600">Reach</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">{formatNumber(analytics.instagram.impressions)}</p>
                      <p className="text-sm text-green-600">Impressions</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ChartBarIcon className="w-5 h-5 text-green-500" />
                    <span>Growth Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{analytics.trends.weekly_growth}%</p>
                      <p className="text-sm text-green-600">Weekly Growth</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{analytics.trends.monthly_growth}%</p>
                      <p className="text-sm text-blue-600">Monthly Growth</p>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">+{analytics.trends.follower_growth}</p>
                    <p className="text-sm text-purple-600">New Followers This Week</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClockIcon className="w-5 h-5 text-orange-500" />
                    <span>Posting Frequency</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-3xl font-bold text-orange-600">{analytics.trends.post_frequency}</p>
                    <p className="text-sm text-orange-600">Posts per Week</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Optimal Frequency</span>
                      <span className="text-sm font-medium text-green-600">3-5 posts/week</span>
                    </div>
                    <Progress value={70} className="h-2" />
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