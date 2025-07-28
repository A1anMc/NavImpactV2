'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navimpactTeamMembers = [
  {
    id: 1,
    full_name: 'Alan McCarthy',
    job_title: 'Founder & CEO',
    organisation: 'NavImpact',
    bio: 'Leading innovation in grant management and impact measurement.',
    avatar_url: '/api/placeholder/40/40',
    current_status: 'active',
    skills: ['Grant Management', 'Impact Measurement', 'Strategic Planning'],
    is_active: true,
    is_superuser: true,
  },
  {
    id: 2,
    full_name: 'Harry Dog',
    job_title: 'Chief Operations Officer',
    organisation: 'NavImpact',
    bio: 'Ensuring smooth operations and team coordination.',
    avatar_url: '/api/placeholder/40/40',
    current_status: 'active',
    skills: ['Operations', 'Team Management', 'Process Optimization'],
    is_active: true,
    is_superuser: false,
  },
  {
    id: 3,
    full_name: 'Clooney Cat',
    job_title: 'Creative Director',
    organisation: 'NavImpact',
    bio: 'Bringing creativity and innovation to our projects.',
    avatar_url: '/api/placeholder/40/40',
    current_status: 'active',
    skills: ['Creative Design', 'User Experience', 'Brand Strategy'],
    is_active: true,
    is_superuser: false,
  },
];

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">NavImpact Team</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Meet the dedicated team behind NavImpact's mission to revolutionise grant management and impact measurement.
        </p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{navimpactTeamMembers.length}</div>
              <div className="text-sm text-gray-600">Team Members</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{navimpactTeamMembers.filter(m => m.current_status === 'active').length}</div>
              <div className="text-sm text-gray-600">Active Members</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{navimpactTeamMembers.filter(m => m.is_superuser).length}</div>
              <div className="text-sm text-gray-600">Leadership</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navimpactTeamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar_url} alt={member.full_name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {member.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{member.full_name}</CardTitle>
                  <p className="text-sm text-gray-600">{member.job_title}</p>
                </div>
                <Badge variant={member.current_status === 'active' ? 'default' : 'secondary'}>
                  {member.current_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{member.bio}</p>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 