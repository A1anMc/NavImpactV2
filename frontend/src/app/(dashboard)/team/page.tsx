'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SGETeamMember } from '@/types/models';
import { usersApi } from '@/services/users';
import {
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function TeamPage() {
  const { data: teamMembers, isLoading, error } = useQuery({
    queryKey: ['sge-team'],
    queryFn: usersApi.getSGETeam,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Members</h1>
            <p className="text-gray-600">Loading team information...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Members</h1>
            <p className="text-red-600">Error loading team information. Please try again.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Members</h1>
          <p className="text-gray-600">
            Meet the Shadow Goose Entertainment team
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers?.map((member) => (
            <Card key={member.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Member Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar_url} alt={member.full_name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                      {getInitials(member.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {member.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {member.job_title}
                    </p>
                    <div className="flex items-center mt-1">
                      <Badge className={`text-xs ${getStatusColor(member.current_status || 'available')}`}>
                        {member.current_status || 'Available'}
                      </Badge>
                      {member.is_intern && (
                        <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs">
                          Intern
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Member Details */}
                <div className="space-y-3">
                  {member.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {member.bio}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="truncate">{member.email}</span>
                    </div>

                    {member.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{member.location}</span>
                      </div>
                    )}

                    {member.organisation && (
                      <div className="flex items-center text-sm text-gray-600">
                        <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{member.organisation}</span>
                      </div>
                    )}

                    {member.skills && member.skills.length > 0 && (
                      <div className="flex items-start text-sm text-gray-600">
                        <AcademicCapIcon className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {member.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{member.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-3 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Stats */}
        <div className="mt-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{teamMembers?.length || 0}</p>
                  <p className="text-sm text-gray-600">Total Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {teamMembers?.filter(m => m.current_status === 'available').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {teamMembers?.filter(m => m.is_intern).length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Interns</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {teamMembers?.filter(m => m.job_title?.includes('Director')).length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Directors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 