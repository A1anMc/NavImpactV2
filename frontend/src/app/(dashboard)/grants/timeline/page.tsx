'use client';

import React, { useState } from 'react';
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
} from '@heroicons/react/24/outline';

// Timeline data
const timelineEvents = [
  {
    id: 1,
    grantId: 1,
    title: 'Screen Australia Documentary Development',
    type: 'deadline',
    date: '2024-02-15',
    time: '23:59',
    status: 'upcoming',
    priority: 'high',
    description: 'Final submission deadline',
    assignees: ['Alan McCarthy', 'Harry Dog'],
    reminders: ['2024-02-10', '2024-02-13'],
    category: 'Documentary'
  },
  {
    id: 2,
    grantId: 2,
    title: 'ABC Pitch Initiative',
    type: 'deadline',
    date: '2024-01-30',
    time: '23:59',
    status: 'completed',
    priority: 'medium',
    description: 'Application submitted successfully',
    assignees: ['Alan McCarthy'],
    reminders: [],
    category: 'Television'
  },
  {
    id: 3,
    grantId: 1,
    title: 'Screen Australia - Team Review',
    type: 'review',
    date: '2024-02-10',
    time: '14:00',
    status: 'upcoming',
    priority: 'high',
    description: 'Final team review before submission',
    assignees: ['Alan McCarthy', 'Harry Dog', 'Clooney Cat'],
    reminders: ['2024-02-09'],
    category: 'Documentary'
  },
  {
    id: 4,
    grantId: 5,
    title: 'Film Victoria - Budget Review',
    type: 'review',
    date: '2024-01-25',
    time: '10:00',
    status: 'upcoming',
    priority: 'medium',
    description: 'Budget review with production team',
    assignees: ['Alan McCarthy', 'Harry Dog'],
    reminders: ['2024-01-24'],
    category: 'Feature Film'
  },
  {
    id: 5,
    grantId: 4,
    title: 'SBS Content Fund - Draft Deadline',
    type: 'draft',
    date: '2024-02-20',
    time: '17:00',
    status: 'upcoming',
    priority: 'medium',
    description: 'First draft completion',
    assignees: ['Alan McCarthy', 'Clooney Cat'],
    reminders: ['2024-02-18'],
    category: 'Television'
  },
  {
    id: 6,
    grantId: 3,
    title: 'Netflix Documentary Fund',
    type: 'deadline',
    date: '2024-03-01',
    time: '23:59',
    status: 'upcoming',
    priority: 'high',
    description: 'Application deadline',
    assignees: ['Alan McCarthy'],
    reminders: ['2024-02-25', '2024-02-28'],
    category: 'Documentary'
  }
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function GrantTimelinePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'calendar'

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty days for padding
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return timelineEvents.filter(event => event.date === date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deadline': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'review': return <UserGroupIcon className="h-4 w-4" />;
      case 'draft': return <PencilIcon className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Grant Timeline</h1>
              <p className="text-gray-600">Track deadlines, reviews, and important dates</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setViewMode(viewMode === 'timeline' ? 'calendar' : 'timeline')}
                variant="outline"
              >
                {viewMode === 'timeline' ? 'Calendar View' : 'Timeline View'}
              </Button>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900">
              {months[currentMonth]} {currentYear}
            </h2>
            <Button
              variant="outline"
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>

          {viewMode === 'calendar' ? (
            /* Calendar View */
            <Card>
              <CardContent className="p-6">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border border-gray-200 ${
                        day ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      {day && (
                        <>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {day}
                          </div>
                          <div className="space-y-1">
                            {getEventsForDate(day).map(event => (
                              <div
                                key={event.id}
                                className="text-xs p-1 rounded cursor-pointer hover:bg-gray-100"
                                onClick={() => setSelectedEvent(event)}
                              >
                                <div className="flex items-center space-x-1">
                                  {getTypeIcon(event.type)}
                                  <span className="truncate">{event.title}</span>
                                </div>
                                <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                                  {event.status}
                                </Badge>
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
          ) : (
            /* Timeline View */
            <div className="space-y-4">
              {timelineEvents
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(event => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              {getTypeIcon(event.type)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status}
                              </Badge>
                              <Badge className={getPriorityColor(event.priority)}>
                                {event.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{event.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{event.date} at {event.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <UserGroupIcon className="h-4 w-4" />
                                <span>{event.assignees.join(', ')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Badge variant="outline">{event.category}</Badge>
                              </div>
                            </div>
                            {event.reminders.length > 0 && (
                              <div className="mt-2 flex items-center space-x-2">
                                <BellIcon className="h-4 w-4 text-yellow-500" />
                                <span className="text-xs text-gray-500">
                                  Reminders: {event.reminders.join(', ')}
                                </span>
                              </div>
                            )}
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
                ))}
            </div>
          )}

          {/* Event Details Modal */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedEvent.title}</span>
                    <Button
                      variant="ghost"
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
                      <h4 className="font-medium text-gray-900">Details</h4>
                      <p className="text-gray-600">{selectedEvent.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Date & Time</h4>
                      <p className="text-gray-600">{selectedEvent.date} at {selectedEvent.time}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Assignees</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.assignees.map(assignee => (
                          <Badge key={assignee} variant="outline">
                            {assignee}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Reminders</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.reminders.map(reminder => (
                          <Badge key={reminder} className="bg-yellow-100 text-yellow-800">
                            {reminder}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit Event
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 