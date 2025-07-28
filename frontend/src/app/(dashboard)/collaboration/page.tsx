'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CalendarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const teamMembers = [
  {
    id: 1,
    name: 'Ursula Searle',
    role: 'Managing Director',
    status: 'online',
    avatar: '/api/placeholder/40/40',
    currentTask: 'Reviewing Wild Hearts rough cut',
    lastActive: '2 minutes ago',
  },
  {
    id: 2,
    name: 'Ash Dorman',
    role: 'Managing Director',
    status: 'busy',
    avatar: '/api/placeholder/40/40',
    currentTask: 'Budget planning for Q2',
    lastActive: '5 minutes ago',
  },
  {
    id: 3,
    name: 'Shamita Siva',
    role: 'Creative Director',
    status: 'online',
    avatar: '/api/placeholder/40/40',
    currentTask: 'Editing Around the Table scenes',
    lastActive: '1 minute ago',
  },
  {
    id: 4,
    name: 'Alan McCarthy',
    role: 'Impact Director',
    status: 'away',
    avatar: '/api/placeholder/40/40',
    currentTask: 'Impact measurement analysis',
    lastActive: '15 minutes ago',
  },
  {
    id: 5,
    name: 'Mish Rep',
    role: 'Operations Officer',
    status: 'online',
    avatar: '/api/placeholder/40/40',
    currentTask: 'Coordinating production schedules',
    lastActive: '3 minutes ago',
  },
  {
    id: 6,
    name: 'Kiara Holt',
    role: 'Production Intern',
    status: 'online',
    avatar: '/api/placeholder/40/40',
    currentTask: 'Research for The Last Line',
    lastActive: 'Just now',
  },
];

const recentConversations = [
  {
    id: 1,
    title: 'Wild Hearts Production Meeting',
    participants: ['Ursula Searle', 'Shamita Siva', 'Alan McCarthy'],
    lastMessage: 'Great progress on the rough cut!',
    time: '2 hours ago',
    unread: 3,
  },
  {
    id: 2,
    title: 'Around the Table Script Review',
    participants: ['Ash Dorman', 'Shamita Siva', 'Kiara Holt'],
    lastMessage: 'Script revisions look excellent',
    time: '4 hours ago',
    unread: 0,
  },
  {
    id: 3,
    title: 'Q2 Budget Planning',
    participants: ['Ursula Searle', 'Ash Dorman', 'Mish Rep'],
    lastMessage: 'Budget approved for new equipment',
    time: '1 day ago',
    unread: 1,
  },
];

const upcomingMeetings = [
  {
    id: 1,
    title: 'Weekly Production Sync',
    time: 'Today, 2:00 PM',
    participants: 6,
    type: 'Team Meeting',
  },
  {
    id: 2,
    title: 'Wild Hearts Post-Production Review',
    time: 'Tomorrow, 10:00 AM',
    participants: 4,
    type: 'Project Review',
  },
  {
    id: 3,
    title: 'Client Presentation Prep',
    time: 'Friday, 3:00 PM',
    participants: 3,
    type: 'Client Meeting',
  },
];

export default function CollaborationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/10 rounded-xl">
                  <ChatBubbleLeftRightIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Team Collaboration</h1>
                  <p className="text-purple-100 text-lg">
                    Stay connected with your team and coordinate production efforts seamlessly.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-100">5 team members online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span className="text-purple-100">3 active conversations</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Team Status */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserGroupIcon className="h-5 w-5" />
                    <span>Team Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            member.status === 'online' ? 'bg-green-500' :
                            member.status === 'busy' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                            <Badge variant={
                              member.status === 'online' ? 'default' :
                              member.status === 'busy' ? 'secondary' :
                              'outline'
                            }>
                              {member.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{member.currentTask}</p>
                          <p className="text-xs text-gray-500 mt-1">Last active: {member.lastActive}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PlusIcon className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Start New Chat
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    Invite Team Member
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Meetings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Upcoming Meetings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingMeetings.map((meeting) => (
                      <div key={meeting.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{meeting.title}</p>
                            <p className="text-sm text-gray-600">{meeting.time}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {meeting.type}
                              </Badge>
                              <span className="text-xs text-gray-500">{meeting.participants} participants</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Conversations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <span>Recent Conversations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((conversation) => (
                  <div key={conversation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{conversation.title}</p>
                        {conversation.unread > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{conversation.lastMessage}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                        <span className="text-xs text-gray-500">
                          {conversation.participants.join(', ')}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 