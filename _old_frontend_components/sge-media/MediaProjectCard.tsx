import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SgeMediaProject } from '@/types/sge-media';

interface MediaProjectCardProps {
  project: SgeMediaProject;
}

export const MediaProjectCard: React.FC<MediaProjectCardProps> = ({ project }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{project.media_type}</CardTitle>
          <Badge variant={project.media_type === 'video' ? 'default' : 'secondary'}>
            {project.media_type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          {project.thumbnail_url ? (
            <img src={project.thumbnail_url} alt={project.media_type} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="text-gray-400">No thumbnail</div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Duration: {project.duration || 'N/A'}</span>
            <span>Release: {project.release_date ? new Date(project.release_date).toLocaleDateString() : 'TBD'}</span>
          </div>
          
          {project.target_audience && project.target_audience.length > 0 && (
            <div className="text-sm text-gray-600">
              Audience: {project.target_audience.join(', ')}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline">View Details</Button>
          <Button size="sm" variant="outline">Add Metrics</Button>
          <Button size="sm" variant="outline">Track Distribution</Button>
        </div>
      </CardContent>
    </Card>
  );
};
