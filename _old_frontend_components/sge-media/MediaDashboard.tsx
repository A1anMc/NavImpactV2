import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { sgeMediaApi } from '@/services/sge-media';
import { MediaDashboard as MediaDashboardType } from '@/types/sge-media';

export const MediaDashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['sge-media-dashboard'],
    queryFn: () => sgeMediaApi.getMediaDashboard(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading SGE Media Dashboard...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-600">Error loading dashboard data</div>;
  }

  const data = dashboardData as MediaDashboardType;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SGE Media Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your media projects, performance, and impact outcomes</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Export Report</Button>
          <Button size="sm">Add Media Project</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_projects}</div>
            <p className="text-xs text-muted-foreground">Active media projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_views.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.active_distributions}</div>
            <p className="text-xs text-muted-foreground">Live content pieces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Impact Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.impact_stories}</div>
            <p className="text-xs text-muted-foreground">Documented outcomes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Media Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recent_projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{project.media_type}</h3>
                  <Badge variant="outline">{project.media_type}</Badge>
                </div>
                <div className="text-xs text-gray-600">
                  <div>Duration: {project.duration || 'N/A'}</div>
                  <div>Release: {project.release_date ? new Date(project.release_date).toLocaleDateString() : 'TBD'}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
