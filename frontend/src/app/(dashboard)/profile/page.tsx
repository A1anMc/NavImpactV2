'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  Cog6ToothIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

const userProfile = {
  id: 1,
  full_name: 'Alan McCarthy',
  job_title: 'Impact Director',
  organisation: 'Shadow Goose Entertainment',
  bio: 'Measuring and maximizing social impact through cinematic storytelling. Ensuring every production drives meaningful change.',
  avatar_url: '/api/placeholder/40/40',
  email: 'alan@shadowgoose.com',
  phone: '+61 400 123 459',
  location: 'Brisbane, Australia',
  timezone: 'Australia/Brisbane',
  skills: ['Impact Measurement', 'Social Change', 'Data Analysis', 'Project Management', 'Strategic Planning'],
  interests: ['Documentary Film', 'Social Impact', 'Data Visualization', 'Storytelling'],
  current_projects: ['The Last Line', 'Impact Stories'],
  completed_projects: ['Wild Hearts', 'Around the Table'],
  join_date: 'January 2024',
  status: 'active',
  role: 'Impact Director',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-4 border-white/20">
                <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
                <AvatarFallback className="bg-white/20 text-white text-2xl">
                  {userProfile.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{userProfile.full_name}</h1>
                <p className="text-xl text-blue-100 mb-4">{userProfile.job_title}</p>
                <p className="text-blue-100 mb-6">{userProfile.bio}</p>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white/20 text-white">
                    {userProfile.status}
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white">
                    {userProfile.role}
                  </Badge>
                  <span className="text-blue-100 text-sm">Member since {userProfile.join_date}</span>
                </div>
              </div>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-blue-600">
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-5 w-5" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{userProfile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{userProfile.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{userProfile.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Timezone</p>
                        <p className="text-sm text-gray-600">{userProfile.timezone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <StarIcon className="h-5 w-5" />
                      <span>Skills</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserCircleIcon className="h-5 w-5" />
                      <span>Interests</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Current Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProfile.current_projects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{project}</p>
                          <p className="text-sm text-gray-600">Active Project</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Completed Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Completed Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProfile.completed_projects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{project}</p>
                          <p className="text-sm text-gray-600">Completed Project</p>
                        </div>
                        <Badge variant="outline" className="text-gray-600">
                          Completed
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userProfile.current_projects.length}</div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userProfile.completed_projects.length}</div>
                    <div className="text-sm text-gray-600">Completed Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{userProfile.skills.length}</div>
                    <div className="text-sm text-gray-600">Skills</div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Cog6ToothIcon className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 