'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon,
  LightBulbIcon,
  UserGroupIcon,
  ArrowRightIcon,
  PencilIcon,
  CameraIcon,
  GlobeAltIcon,
  ClockIcon,
  ShieldCheckIcon,
  CogIcon,
  BellIcon,
  KeyIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data - in real app this would come from API
  const user = {
    id: 4,
    full_name: 'Alan McCarthy',
    email: 'alan@shadowgoose.com',
    is_active: true,
    is_superuser: false,
    job_title: 'Impact Director',
    organisation: 'Shadow Goose Entertainment',
    location: 'Melbourne, VIC',
    timezone: 'AEST',
    current_status: 'available',
    bio: 'Impact measurement specialist focused on quantifying social and environmental outcomes. Expert in Victorian government frameworks and UN SDGs. Passionate about creating meaningful change through data-driven insights and strategic evaluation.',
    skills: ['Impact Measurement', 'Data Analytics', 'Government Frameworks', 'Evaluation', 'Strategic Planning', 'Project Management'],
    interests: ['Impact Measurement', 'Data Science', 'Sustainability', 'Policy', 'Social Innovation', 'Environmental Conservation'],
    social_links: {
      linkedin: 'https://linkedin.com/in/alan-mccarthy',
      twitter: 'https://twitter.com/alan_mccarthy',
      github: 'https://github.com/alanmccarthy'
    },
    is_intern: false,
    avatar_url: null,
    created_at: new Date('2024-01-15'),
    updated_at: new Date(),
    phone: '+61 400 123 456',
    projects_assigned: ['The Last Line', 'Impact Analytics', 'Grant Framework Development'],
    mentor_id: null,
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profile_visible: true,
        show_status: true,
        show_projects: true
      }
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-amber-100 text-amber-800';
      case 'away':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserCircleIcon },
    { id: 'skills', name: 'Skills & Interests', icon: LightBulbIcon },
    { id: 'projects', name: 'Projects', icon: UserGroupIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
                Profile
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Manage your profile and preferences
              </p>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsEditing(!isEditing)}
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CameraIcon className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg sticky top-8">
              <CardContent className="p-6">
                {/* Avatar Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg mx-auto mb-4">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-2xl font-bold">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <SparklesIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{user.full_name}</h2>
                  <p className="text-green-600 font-semibold mb-2">{user.job_title}</p>
                  <Badge className={`${getStatusColor(user.current_status)} border-0 text-xs font-medium`}>
                    {user.current_status}
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">{user.projects_assigned.length}</p>
                    <p className="text-sm text-gray-600">Active Projects</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">{user.skills.length}</p>
                    <p className="text-sm text-gray-600">Skills</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <p className="text-2xl font-bold text-purple-600">{user.interests.length}</p>
                    <p className="text-sm text-gray-600">Interests</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 text-green-600" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 text-blue-600" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 text-purple-600" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 text-amber-600" />
                    <span>{user.timezone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Bio Section */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                      <UserCircleIcon className="h-5 w-5 mr-2 text-green-600" />
                      About Me
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                  </CardContent>
                </Card>

                {/* Organisation Info */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                      <ShieldCheckIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Organisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Organisation</p>
                        <p className="text-lg font-semibold text-gray-900">{user.organisation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Role</p>
                        <p className="text-lg font-semibold text-gray-900">{user.job_title}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Member Since</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {user.created_at.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                      <GlobeAltIcon className="h-5 w-5 mr-2 text-purple-600" />
                      Social Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(user.social_links).map(([platform, url]) => (
                        <div key={platform} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <GlobeAltIcon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-900 capitalize">{platform}</span>
                          </div>
                          <Button variant="outline" size="sm" className="border-gray-300">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                {/* Skills */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                      <LightBulbIcon className="h-5 w-5 mr-2 text-amber-600" />
                      Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 px-4 py-2 text-sm font-medium">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Interests */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                      <HeartIcon className="h-5 w-5 mr-2 text-pink-600" />
                      Interests & Passions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {user.interests.map((interest, index) => (
                        <Badge key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0 px-4 py-2 text-sm font-medium">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                      <UserGroupIcon className="h-5 w-5 mr-2 text-green-600" />
                      Active Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.projects_assigned.map((project, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <DocumentTextIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{project}</p>
                              <p className="text-sm text-gray-600">Active Project</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="border-gray-300">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Notification Settings */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                      <BellIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-900">Email Notifications</span>
                        </div>
                        <Badge className={user.preferences.notifications.email ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                          {user.preferences.notifications.email ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <BellIcon className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-gray-900">Push Notifications</span>
                        </div>
                        <Badge className={user.preferences.notifications.push ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                          {user.preferences.notifications.push ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                      <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-600" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <UserCircleIcon className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">Profile Visibility</span>
                        </div>
                        <Badge className={user.preferences.privacy.profile_visible ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                          {user.preferences.privacy.profile_visible ? "Public" : "Private"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <ClockIcon className="h-5 w-5 text-amber-600" />
                          <span className="font-medium text-gray-900">Show Status</span>
                        </div>
                        <Badge className={user.preferences.privacy.show_status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                          {user.preferences.privacy.show_status ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                      <KeyIcon className="h-5 w-5 mr-2 text-red-600" />
                      Account Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                        <KeyIcon className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                        <CogIcon className="h-4 w-4 mr-2" />
                        Account Settings
                      </Button>
                      <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-50">
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 