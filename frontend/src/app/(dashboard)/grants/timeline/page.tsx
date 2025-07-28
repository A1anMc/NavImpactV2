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
  FireIcon,
  StarIcon,
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
    description: 'Final submission deadline for documentary development funding.',
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
    description: 'Application submitted successfully to ABC.',
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
    description: 'Final team review before submission with all stakeholders.',
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
    description: 'Budget review with production team and financial advisors.',
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
    description: 'First draft completion for multicultural content funding.',
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
    description: 'Application deadline for global documentary funding.',
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
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <FireIcon className="h-4 w-4 text-red-500" />;
      case 'medium': return <StarIcon className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      default: return <CheckCircleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deadline': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'review': return <UserGroupIcon className="h-5 w-5" />;
      case 'draft': return <PencilIcon className="h-5 w-5" />;
      default: return <CalendarIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Grant Timeline</h1>
              <p className="text-xl text-gray-600">Track deadlines, reviews, and important dates for your grant applications</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setViewMode(viewMode === 'timeline' ? 'calendar' : 'timeline')}
                variant="outline"
                className="px-6 py-3 text-lg rounded-xl"
              >
                {viewMode === 'timeline' ? 'Calendar View' : 'Timeline View'}
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg rounded-xl">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Event
              </Button>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
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
                className="p-3 rounded-xl"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold text-gray-900">
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
                className="p-3 rounded-xl"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {viewMode === 'calendar' ? (
            /* Calendar View */
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-8">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-600 py-3">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarDays().map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[120px] p-3 border border-gray-100 rounded-xl ${
                        day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                      }`}
                    >
                      {day && (
                        <>
                          <div className="text-sm font-semibold text-gray-900 mb-2">
                            {day}
                          </div>
                          <div className="space-y-1">
                            {getEventsForDate(day).map(event => (
                              <div
                                key={event.id}
                                className="text-xs p-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                                onClick={() => setSelectedEvent(event)}
                              >
                                <div className="flex items-center space-x-1 mb-1">
                                  {getTypeIcon(event.type)}
                                  <span className="truncate font-medium">{event.title}</span>
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
            <div className="space-y-6">
              {timelineEvents
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(event => (
                  <Card key={event.id} className="bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                              {getTypeIcon(event.type)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                              <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                              <Badge className={`${getStatusColor(event.status)} border`}>
                                {event.status}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                {getPriorityIcon(event.priority)}
                                <Badge className={`${event.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} border`}>
                                  {event.priority}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 text-lg mb-4 leading-relaxed">{event.description}</p>
                            <div className="flex items-center space-x-8 text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-5 w-5" />
                                <span className="font-medium">{event.date} at {event.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <UserGroupIcon className="h-5 w-5" />
                                <span className="font-medium">{event.assignees.join(', ')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">{event.category}</Badge>
                              </div>
                            </div>
                            {event.reminders.length > 0 && (
                              <div className="mt-4 flex items-center space-x-3">
                                <BellIcon className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm text-gray-600">
                                  Reminders: {event.reminders.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <PencilIcon className="h-4 w-4 mr-2" />
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
              <Card className="w-full max-w-2xl mx-4 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl">{selectedEvent.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedEvent(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Date & Time</h4>
                      <p className="text-gray-600">{selectedEvent.date} at {selectedEvent.time}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                      <Badge variant="outline">{selectedEvent.category}</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Assignees</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.assignees.map(assignee => (
                        <Badge key={assignee} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {assignee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedEvent.reminders.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Reminders</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.reminders.map(reminder => (
                          <Badge key={reminder} className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            {reminder}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Event
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
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