'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BellIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FireIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { grantsApi } from '@/services/grants';
import { Grant } from '@/types/models';

interface TimelineEvent {
  id: number;
  grantId: number;
  title: string;
  type: 'deadline' | 'review' | 'draft' | 'submission';
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  description: string;
  assignees: string[];
  reminders: string[];
  category: string;
}

export default function GrantTimelinePage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // Fetch grants and create timeline events
  useEffect(() => {
    const fetchGrantsAndCreateTimeline = async () => {
      try {
        setLoading(true);
        const response = await grantsApi.getGrants({ limit: 100 });
        const grantsData = response.items || [];
        setGrants(grantsData);

        // Create timeline events from grants
        const events: TimelineEvent[] = [];
        let eventId = 1;

        grantsData.forEach((grant) => {
          if (grant.deadline) {
            const deadlineDate = new Date(grant.deadline);
            const now = new Date();
            
            events.push({
              id: eventId++,
              grantId: grant.id,
              title: grant.title,
              type: 'deadline',
              date: grant.deadline?.toString(),
              time: '23:59',
              status: deadlineDate < now ? 'overdue' : 'upcoming',
              priority: deadlineDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000 ? 'high' : 'medium',
              description: `Final submission deadline for ${grant.title}`,
              assignees: ['Alan McCarthy'],
              reminders: [
                new Date(deadlineDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                new Date(deadlineDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              ],
              category: grant.industry_focus || 'General'
            });

            // Add review event 5 days before deadline
            const reviewDate = new Date(deadlineDate.getTime() - 5 * 24 * 60 * 60 * 1000);
            if (reviewDate > now) {
              events.push({
                id: eventId++,
                grantId: grant.id,
                title: `${grant.title} - Final Review`,
                type: 'review',
                date: reviewDate.toISOString().split('T')[0],
                time: '14:00',
                status: 'upcoming',
                priority: 'high',
                description: `Final team review before submission for ${grant.title}`,
                assignees: ['Alan McCarthy', 'Harry Dog'],
                reminders: [
                  new Date(reviewDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                ],
                category: grant.industry_focus || 'General'
              });
            }

            // Add draft deadline 10 days before final deadline
            const draftDate = new Date(deadlineDate.getTime() - 10 * 24 * 60 * 60 * 1000);
            if (draftDate > now) {
              events.push({
                id: eventId++,
                grantId: grant.id,
                title: `${grant.title} - Draft Deadline`,
                type: 'draft',
                date: draftDate.toISOString().split('T')[0],
                time: '17:00',
                status: 'upcoming',
                priority: 'medium',
                description: `First draft completion for ${grant.title}`,
                assignees: ['Alan McCarthy'],
                reminders: [
                  new Date(draftDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                ],
                category: grant.industry_focus || 'General'
              });
            }
          }
        });

        // Sort events by date
        events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setTimelineEvents(events);
        setError(null);
      } catch (err) {
        console.error('Error fetching grants:', err);
        setError('Failed to load timeline data. Please try again.');
        setTimelineEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGrantsAndCreateTimeline();
  }, []);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDay = getFirstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getEventsForDate = (day: number) => {
    if (!day) return [];
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return timelineEvents.filter(event => event.date === dateString);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <FireIcon className="h-4 w-4 text-red-500" />;
      case 'medium': return <StarIcon className="h-4 w-4 text-yellow-500" />;
      case 'low': return <ClockIcon className="h-4 w-4 text-gray-500" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'review': return <UserGroupIcon className="h-4 w-4 text-blue-500" />;
      case 'draft': return <PencilIcon className="h-4 w-4 text-yellow-500" />;
      case 'submission': return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      default: return <CalendarIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading timeline...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
            <p className="mt-4 text-red-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grant Timeline</h1>
            <p className="text-gray-600 mt-2">
              Track deadlines, reviews, and important grant milestones
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant={viewMode === 'timeline' ? 'primary' : 'outline'}
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'outline'}
              onClick={() => setViewMode('calendar')}
            >
              Calendar
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        /* Timeline View */
        <div className="space-y-6">
          {timelineEvents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No timeline events</h3>
                <p className="mt-2 text-gray-600">
                  Timeline events will appear here based on your grant deadlines and milestones.
                </p>
              </CardContent>
            </Card>
          ) : (
            timelineEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getTypeIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                          <div className="flex items-center">
                            {getPriorityIcon(event.priority)}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">{event.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            {event.assignees.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* Calendar View */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendar View</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium">
                  {currentDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`p-2 min-h-[80px] border border-gray-200 ${
                    day ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {day && (
                    <>
                      <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                      <div className="space-y-1">
                        {getEventsForDate(day).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded cursor-pointer ${
                              event.priority === 'high' ? 'bg-red-100 text-red-800' :
                              event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}
                            onClick={() => setSelectedEvent(event)}
                          >
                            {event.title.substring(0, 20)}...
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedEvent.title}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Date & Time</h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(selectedEvent.date)} at {selectedEvent.time}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Assignees</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.assignees.join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Reminders</h4>
                  <p className="text-sm text-gray-600">
                    {selectedEvent.reminders.map(date => formatDate(date)).join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 