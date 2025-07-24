import React from 'react';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type CollaborationStatus = 'Completed' | 'In Progress' | 'Pending';

export interface TeamMember {
  name: string;
  task: string;
  status: CollaborationStatus;
  email?: string;
}

interface TeamCollaborationProps {
  /**
   * Team members to display in the list
   */
  members: TeamMember[];
  /**
   * Optional callback when the "Add Member" button is pressed
   */
  onAddMember?: () => void;
  /**
   * Extra className for the root container
   */
  className?: string;
}

const statusBadgeClasses: Record<CollaborationStatus, string> = {
  Completed: 'bg-green-100 text-green-800 border-transparent',
  'In Progress': 'bg-yellow-100 text-yellow-800 border-transparent',
  Pending: 'bg-red-100 text-red-800 border-transparent',
};

export default function TeamCollaboration({
  members,
  onAddMember,
  className,
}: TeamCollaborationProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Team Collaboration
        </CardTitle>
        {onAddMember && (
          <button
            onClick={onAddMember}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <span className="text-lg leading-none">+</span>
            Add Member
          </button>
        )}
      </CardHeader>

      <CardContent className="divide-y divide-gray-200">
        {members.map((member, idx) => (
          <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-4">
              <Avatar name={member.name} email={member.email} size="lg" />
              <div className="space-y-1">
                <p className="font-medium text-gray-900 leading-none">
                  {member.name}
                </p>
                <p className="text-sm text-gray-500">
                  Working on <span className="font-medium">{member.task}</span>
                </p>
              </div>
            </div>
            <Badge className={statusBadgeClasses[member.status]}>{member.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}