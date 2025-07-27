'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SGETeamMember, InternProfile } from '@/types/models';
import { usersApi } from '@/services/users';
import {
  UserGroupIcon,
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function CollaborationPage() {
  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ['sge-team'],
    queryFn: usersApi.getSGETeam,
  });

  const { data: interns, isLoading: internsLoading } = useQuery({
    queryKey: ['interns'],
    queryFn: usersApi.getInterns,
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'away':
        return 'bg-gray-100 text-gray-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (teamLoading || internsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Collaboration</h1>
            <p className="text-gray-600">Loading collaboration data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Collaboration</h1>
          <p className="text-gray-600">
            Real-time team status, project assignments, and collaboration tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Status Overview */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Team Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers?.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar_url} alt={member.full_name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                            {getInitials(member.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{member.full_name}</h3>
                          <p className="text-sm text-gray-600">{member.job_title}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={`text-xs ${getStatusColor(member.current_status || 'available')}`}>
                          {member.current_status || 'Available'}
                        </Badge>
                        {member.is_intern && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            Intern
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Team Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Members</span>
                  <span className="font-semibold text-gray-900">{teamMembers?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="font-semibold text-green-600">
                    {teamMembers?.filter(m => m.current_status === 'available').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Interns</span>
                  <span className="font-semibold text-purple-600">
                    {teamMembers?.filter(m => m.is_intern).length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Directors</span>
                  <span className="font-semibold text-blue-600">
                    {teamMembers?.filter(m => m.job_title?.includes('Director')).length || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Kiara updated her learning progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Shamita assigned new project tasks</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Ursula scheduled team meeting</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Intern Development Section */}
        {interns && interns.length > 0 && (
          <div className="mt-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  Intern Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {interns.map((intern) => (
                    <div key={intern.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={intern.avatar_url} alt={intern.full_name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm font-semibold">
                            {getInitials(intern.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{intern.full_name}</h3>
                          <p className="text-sm text-gray-600">Intern</p>
                          {intern.mentor_name && (
                            <p className="text-xs text-blue-600">Mentored by {intern.mentor_name}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {intern.learning_goals && intern.learning_goals.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Learning Goals</h4>
                            <div className="flex flex-wrap gap-1">
                              {intern.learning_goals.slice(0, 3).map((goal, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {goal}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {intern.skills_learning && intern.skills_learning.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Learning</h4>
                            <div className="flex flex-wrap gap-1">
                              {intern.skills_learning.slice(0, 3).map((skill, index) => (
                                <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View Progress
                          </Button>
                          <Button variant="outline" size="sm">
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Project Collaboration */}
        <div className="mt-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Project Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sample Project Cards */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Wild Hearts</h3>
                    <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Documentary about environmental conservation
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex items-center text-sm text-gray-600">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span>3 team members</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Around the Table</h3>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">Planning</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Community engagement series
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    <div className="flex items-center text-sm text-gray-600">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span>2 team members</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Forging Friendships</h3>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Review</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Social impact documentary
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                    <div className="flex items-center text-sm text-gray-600">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span>4 team members</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 