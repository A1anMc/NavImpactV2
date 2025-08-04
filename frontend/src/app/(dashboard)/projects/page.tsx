import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// Real data from API
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/v1/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.items || []);
      } else {
        console.error('Failed to fetch projects');
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProjects();
}, []);

const statusColors = {
  active: 'bg-green-100 text-green-800',
  planning: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  paused: 'bg-gray-100 text-gray-800',
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Simplified Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
              <p className="text-gray-600">Manage and track your impact projects</p>
            </div>
            <Link href="/projects/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Simplified Filters */}
        <div className="mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {project.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <Badge className={`text-xs font-medium ${statusColors[project.status as keyof typeof statusColors]}`}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{project.impact_score}%</div>
                    <div className="text-xs text-gray-600">Impact Score</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{project.team_size}</div>
                    <div className="text-xs text-gray-600">Team Size</div>
                  </div>
                </div>

                {/* Framework Alignment */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ChartBarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-600">Framework Alignment</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.framework_alignment.map((framework) => (
                      <Badge key={framework} variant="outline" className="text-xs border-gray-200 text-gray-700">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>Started {new Date(project.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="h-3 w-3" />
                    <span>{project.team_size} members</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm">
                    View Details
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            Load More Projects
          </Button>
        </div>
      </div>
    </div>
  );
}
