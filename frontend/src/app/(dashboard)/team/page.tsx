'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/services/users';
import { SGETeamMember } from '@/types/models';
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
  PlusIcon,
} from '@heroicons/react/24/outline';

export default function TeamPage() {
  // Temporary mock data while authentication is being set up
  const mockTeamMembers: SGETeamMember[] = [
    {
      id: 1,
      name: 'Ursula Searle',
      email: 'ursula@shadowgoose.com',
      job_title: 'Managing Director',
      organisation: 'Shadow Goose Entertainment',
      location: 'Melbourne, VIC',
      timezone: 'AEST',
      current_status: 'available',
      bio: 'Strategic leader with 15+ years in media production and business development. Passionate about creating impactful content that drives positive change.',
      skills: ['Strategic Planning', 'Business Development', 'Media Production', 'Team Leadership'],
      interests: ['Environmental Conservation', 'Community Engagement', 'Innovation'],
      social_links: {
        linkedin: 'https://linkedin.com/in/ursula-searle',
        twitter: 'https://twitter.com/ursula_searle'
      },
      is_intern: false,
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
      projects_assigned: ['Wild Hearts', 'Around the Table']
    },
    {
      id: 2,
      name: 'Ash Dorman',
      email: 'ash@shadowgoose.com',
      job_title: 'Managing Director',
      organisation: 'Shadow Goose Entertainment',
      location: 'Melbourne, VIC',
      timezone: 'AEST',
      current_status: 'busy',
      bio: 'Experienced director focused on strategic partnerships and innovative media solutions. Committed to building sustainable business models.',
      skills: ['Strategic Partnerships', 'Business Strategy', 'Media Innovation', 'Stakeholder Management'],
      interests: ['Sustainable Business', 'Digital Innovation', 'Partnership Development'],
      social_links: {
        linkedin: 'https://linkedin.com/in/ash-dorman',
        twitter: 'https://twitter.com/ash_dorman'
      },
      is_intern: false,
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
      projects_assigned: ['Around the Table', 'Forging Friendships']
    },
    {
      id: 3,
      name: 'Shamita Siva',
      email: 'shamita@shadowgoose.com',
      job_title: 'Creative Director',
      organisation: 'Shadow Goose Entertainment',
      location: 'Melbourne, VIC',
      timezone: 'AEST',
      current_status: 'busy',
      bio: 'Award-winning creative director with a passion for storytelling that creates meaningful connections and drives social impact.',
      skills: ['Creative Direction', 'Storytelling', 'Visual Design', 'Project Management'],
      interests: ['Storytelling', 'Visual Arts', 'Social Impact', 'Mentorship'],
      social_links: {
        linkedin: 'https://linkedin.com/in/shamita-siva',
        instagram: 'https://instagram.com/shamita_siva'
      },
      is_intern: false,
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
      projects_assigned: ['Wild Hearts', 'The Last Line']
    },
    {
      id: 4,
      name: 'Alan McCarthy',
      email: 'alan@shadowgoose.com',
      job_title: 'Impact Director',
      organisation: 'Shadow Goose Entertainment',
      location: 'Melbourne, VIC',
      timezone: 'AEST',
      current_status: 'available',
      bio: 'Impact measurement specialist focused on quantifying social and environmental outcomes. Expert in Victorian government frameworks and UN SDGs.',
      skills: ['Impact Measurement', 'Data Analytics', 'Government Frameworks', 'Evaluation'],
      interests: ['Impact Measurement', 'Data Science', 'Sustainability', 'Policy'],
      social_links: {
        linkedin: 'https://linkedin.com/in/alan-mccarthy',
        twitter: 'https://twitter.com/alan_mccarthy'
      },
      is_intern: false,
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
      projects_assigned: ['The Last Line', 'Impact Analytics']
    },
    {
      id: 5,
      name: 'Mish Rep',
      email: 'mish@shadowgoose.com',
      job_title: 'Operations Officer',
      organisation: 'Shadow Goose Entertainment',
      location: 'Melbourne, VIC',
      timezone: 'AEST',
      current_status: 'available',
      bio: 'Operations specialist ensuring smooth project delivery and team coordination. Focused on process optimization and quality assurance.',
      skills: ['Operations Management', 'Project Coordination', 'Process Optimization', 'Quality Assurance'],
      interests: ['Process Improvement', 'Team Efficiency', 'Quality Management'],
      social_links: {
        linkedin: 'https://linkedin.com/in/mish-rep'
      },
      is_intern: false,
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
      projects_assigned: ['Around the Table', 'Operations Management']
    },
    {
      id: 6,
      name: 'Kiara Holt',
      email: 'kiara@shadowgoose.com',
      job_title: 'Media Production Intern',
      organisation: 'Shadow Goose Entertainment',
      location: 'Melbourne, VIC',
      timezone: 'AEST',
      current_status: 'available',
      bio: 'Enthusiastic intern learning the ropes of media production and impact measurement. Eager to contribute to meaningful projects.',
      skills: ['Media Production', 'Research', 'Content Creation', 'Social Media'],
      interests: ['Media Production', 'Environmental Conservation', 'Learning', 'Innovation'],
      social_links: {
        linkedin: 'https://linkedin.com/in/kiara-holt',
        instagram: 'https://instagram.com/kiara_holt'
      },
      is_intern: true,
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date(),
      projects_assigned: ['The Last Line', 'Research Support']
    }
  ];

  // Use mock data for now, will switch to real API when authentication is ready
  const { data: teamMembers, isLoading, error } = useQuery({
    queryKey: ['sge-team'],
    queryFn: usersApi.getSGETeam,
    initialData: mockTeamMembers, // Use mock data as fallback
    retry: false, // Don't retry if API fails
  });

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
                SGE Team
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Meet the passionate team behind our media impact projects
              </p>
            </div>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{teamMembers?.length || 0}</div>
                <div className="text-sm text-gray-600">Total Team Members</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {teamMembers?.filter(m => m.current_status === 'available').length || 0}
                </div>
                <div className="text-sm text-gray-600">Available Now</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {teamMembers?.filter(m => m.is_intern).length || 0}
                </div>
                <div className="text-sm text-gray-600">Interns</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">4</div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {teamMembers?.map((member) => (
            <Card key={member.id} className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5"></div>
                <CardContent className="p-8 relative">
                  {/* Header */}
                  <div className="flex items-start space-x-4 mb-6">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-lg font-bold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                        <Badge className={`${getStatusColor(member.current_status)} border-0 text-xs font-medium`}>
                          {member.current_status}
                        </Badge>
                      </div>
                      <p className="text-green-600 font-semibold mb-1">{member.job_title}</p>
                      <p className="text-sm text-gray-600">{member.organisation}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed">{member.bio}</p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 text-green-600" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 text-blue-600" />
                      <span>{member.location}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <LightBulbIcon className="h-4 w-4 mr-2 text-amber-600" />
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 border-0 text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 3 && (
                          <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
                            +{member.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {member.projects_assigned && member.projects_assigned.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-2 text-purple-600" />
                        Projects
                      </h4>
                      <div className="space-y-2">
                        {member.projects_assigned.map((project, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{project}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Intern Badge */}
                  {member.is_intern && (
                    <div className="mb-6">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
                        <AcademicCapIcon className="h-3 w-3 mr-1" />
                        Intern
                      </Badge>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    View Profile
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 