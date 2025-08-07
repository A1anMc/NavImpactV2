'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  UserGroupIcon,
  StarIcon,
  ClockIcon,
  ChartBarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const navimpactTeamMembers = [
  {
    id: 1,
    name: 'Alan McCarthy',
    job_title: 'CEO & Creative Director',
    email: 'alan@navimpact.com',
    phone: '+61 400 123 456',
    current_status: 'active',
    is_superuser: true,
    bio: 'Leading strategic vision and creative direction for all NavImpact productions. Expert in cinematic storytelling and impact-driven content.',
    avatar: '/avatars/alan.jpg',
    department: 'Leadership',
    start_date: '2023-01-15',
    skills: ['Strategic Planning', 'Creative Direction', 'Team Leadership'],
    projects: ['Wild Hearts', 'Around the Table', 'The Last Line']
  },
  {
    id: 2,
    name: 'Harry Dog',
    job_title: 'COO & Production Manager',
    email: 'harry@navimpact.com',
    phone: '+61 400 123 457',
    current_status: 'active',
    is_superuser: true,
    bio: 'Co-leading NavImpact with focus on operational excellence and team development. Driving innovation in production workflows.',
    avatar: '/avatars/harry.jpg',
    department: 'Operations',
    start_date: '2023-02-01',
    skills: ['Production Management', 'Operations', 'Team Development'],
    projects: ['Wild Hearts', 'Around the Table']
  },
  {
    id: 3,
    name: 'Shamita Siva',
    job_title: 'Creative Director',
    organisation: 'Shadow Goose Entertainment',
    bio: 'Crafting compelling narratives and visual storytelling. Expert in bringing stories to life through innovative cinematography.',
    avatar_url: '/api/placeholder/40/40',
    current_status: 'active',
    skills: ['Creative Direction', 'Cinematography', 'Storytelling'],
    is_active: true,
    is_superuser: false,
    email: 'shamita@shadowgoose.com',
    phone: '+61 400 123 458',
    location: 'Melbourne, Australia',
    projects: ['Wild Hearts', 'The Last Line'],
  },
  {
    id: 4,
    full_name: 'Alan McCarthy',
    job_title: 'Impact Director',
    organisation: 'Shadow Goose Entertainment',
    bio: 'Measuring and maximizing social impact through cinematic storytelling. Ensuring every production drives meaningful change.',
    avatar_url: '/api/placeholder/40/40',
    current_status: 'active',
    skills: ['Impact Measurement', 'Social Change', 'Data Analysis'],
    is_active: true,
    is_superuser: false,
    email: 'alan@shadowgoose.com',
    phone: '+61 400 123 459',
    location: 'Brisbane, Australia',
    projects: ['The Last Line', 'Impact Stories'],
  },
  {
    id: 5,
    full_name: 'Mish Rep',
    job_title: 'Operations Officer',
    organisation: 'Shadow Goose Entertainment',
    bio: 'Ensuring smooth production operations and team coordination. Expert in logistics and project management.',
    avatar_url: '/api/placeholder/40/40',
    current_status: 'active',
    skills: ['Operations', 'Project Management', 'Logistics'],
    is_active: true,
    is_superuser: false,
    email: 'mish@shadowgoose.com',
    phone: '+61 400 123 460',
    location: 'Perth, Australia',
    projects: ['Around the Table', 'Production Support'],
  },
  {
    id: 6,
    full_name: 'Kiara Holt',
    job_title: 'Production Intern',
    organisation: 'Shadow Goose Entertainment',
    bio: 'Learning the ropes of production while contributing fresh perspectives and energy to SGE projects.',
    avatar_url: '/api/placeholder/40/40',
    current_status: 'active',
    skills: ['Production Support', 'Research', 'Creative Input'],
    is_active: true,
    is_superuser: false,
    email: 'kiara@shadowgoose.com',
    phone: '+61 400 123 461',
    location: 'Melbourne, Australia',
    projects: ['The Last Line', 'General Support'],
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/10 rounded-xl">
                  <UserGroupIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">NavImpact Team</h1>
                  <p className="text-xl text-blue-100 mb-8">
                    Meet the talented individuals driving our mission to create meaningful impact through storytelling and innovation.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100">All team members active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span className="text-blue-100">{navimpactTeamMembers.length} team members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{navimpactTeamMembers.length}</div>
                  <div className="text-sm text-gray-600">Total Team Members</div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{navimpactTeamMembers.filter(m => m.current_status === 'active').length}</div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{navimpactTeamMembers.filter(m => m.is_superuser).length}</div>
                  <div className="text-sm text-gray-600">Leadership</div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{navimpactTeamMembers.filter(m => m.job_title.includes('Intern')).length}</div>
                  <div className="text-sm text-gray-600">Interns</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Members Grid */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Members</h2>
              <p className="text-gray-600">Our dedicated team of creative professionals</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {navimpactTeamMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900">{member.name}</CardTitle>
                          <p className="text-sm text-gray-600">{member.job_title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={member.current_status === 'active' ? 'default' : 'secondary'}>
                              {member.current_status}
                            </Badge>
                            {member.is_superuser && (
                              <Badge variant="outline" className="text-xs">
                                <StarIcon className="h-3 w-3 mr-1" />
                                Leadership
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 text-sm">{member.bio}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{member.location}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900">Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900">Current Projects:</div>
                      <div className="flex flex-wrap gap-1">
                        {member.projects.map((project, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 