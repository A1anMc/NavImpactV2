'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FilmIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  CameraIcon,
  MicrophoneIcon,
  LightBulbIcon,
  WrenchIcon,
  TruckIcon,
  CakeIcon,
} from '@heroicons/react/24/outline';

// Mock production data
const productions = [
  {
    id: 1,
    title: 'The Last Sunset',
    status: 'pre-production',
    type: 'Feature Film',
    director: 'Alan McCarthy',
    producer: 'Harry Dog',
    startDate: '2024-03-15',
    endDate: '2024-06-15',
    budget: '$2,500,000',
    location: 'Melbourne, Australia',
    progress: 35,
    scenes: [
      { id: 1, name: 'Opening Scene - Beach', location: 'St Kilda Beach', duration: '2 days', cast: ['Lead Actor', 'Supporting Actor'], crew: ['DP', 'Camera Op', 'Sound'], status: 'scheduled' },
      { id: 2, name: 'Interior - Office', location: 'CBD Office', duration: '1 day', cast: ['Lead Actor', 'Supporting Actor'], crew: ['DP', 'Camera Op', 'Sound', 'Gaffer'], status: 'scheduled' },
      { id: 3, name: 'Night Scene - Street', location: 'Collins Street', duration: '1 day', cast: ['Lead Actor'], crew: ['DP', 'Camera Op', 'Sound', 'Gaffer'], status: 'pending' },
    ],
    crew: [
      { name: 'Alan McCarthy', role: 'Director', email: 'alan@sge.com', phone: '+61 400 123 456', status: 'confirmed' },
      { name: 'Harry Dog', role: 'Producer', email: 'harry@sge.com', phone: '+61 400 123 457', status: 'confirmed' },
      { name: 'Clooney Cat', role: 'DP', email: 'clooney@sge.com', phone: '+61 400 123 458', status: 'confirmed' },
      { name: 'John Camera', role: 'Camera Operator', email: 'john@sge.com', phone: '+61 400 123 459', status: 'pending' },
      { name: 'Sarah Sound', role: 'Sound Recordist', email: 'sarah@sge.com', phone: '+61 400 123 460', status: 'confirmed' },
    ],
    cast: [
      { name: 'Emma Lead', role: 'Lead Actress', email: 'emma@talent.com', phone: '+61 400 123 461', status: 'confirmed' },
      { name: 'Tom Support', role: 'Supporting Actor', email: 'tom@talent.com', phone: '+61 400 123 462', status: 'confirmed' },
    ]
  },
  {
    id: 2,
    title: 'Urban Stories',
    status: 'production',
    type: 'TV Series',
    director: 'Alan McCarthy',
    producer: 'Harry Dog',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    budget: '$1,200,000',
    location: 'Sydney, Australia',
    progress: 65,
    scenes: [
      { id: 1, name: 'Episode 1 - Opening', location: 'Bondi Beach', duration: '3 days', cast: ['Series Lead', 'Guest Star'], crew: ['DP', 'Camera Op', 'Sound'], status: 'completed' },
      { id: 2, name: 'Episode 2 - Interior', location: 'Studio Set', duration: '2 days', cast: ['Series Lead', 'Supporting Cast'], crew: ['DP', 'Camera Op', 'Sound', 'Gaffer'], status: 'in-progress' },
    ],
    crew: [
      { name: 'Alan McCarthy', role: 'Director', email: 'alan@sge.com', phone: '+61 400 123 456', status: 'confirmed' },
      { name: 'Harry Dog', role: 'Producer', email: 'harry@sge.com', phone: '+61 400 123 457', status: 'confirmed' },
    ],
    cast: [
      { name: 'Lisa Series', role: 'Series Lead', email: 'lisa@talent.com', phone: '+61 400 123 463', status: 'confirmed' },
    ]
  }
];

const shootingSchedule = [
  {
    date: '2024-03-15',
    day: 'Day 1',
    scenes: [
      { id: 1, name: 'Opening Scene - Beach', location: 'St Kilda Beach', callTime: '06:00', wrapTime: '18:00', cast: ['Emma Lead', 'Tom Support'], crew: ['Alan McCarthy', 'Clooney Cat', 'John Camera', 'Sarah Sound'] },
    ],
    weather: 'Sunny, 22°C',
    notes: 'Early call for sunrise shots. Catering provided on location.'
  },
  {
    date: '2024-03-16',
    day: 'Day 2',
    scenes: [
      { id: 1, name: 'Opening Scene - Beach (continued)', location: 'St Kilda Beach', callTime: '07:00', wrapTime: '17:00', cast: ['Emma Lead', 'Tom Support'], crew: ['Alan McCarthy', 'Clooney Cat', 'John Camera', 'Sarah Sound'] },
    ],
    weather: 'Partly cloudy, 20°C',
    notes: 'Continuity shots. Wardrobe changes required.'
  },
  {
    date: '2024-03-18',
    day: 'Day 3',
    scenes: [
      { id: 2, name: 'Interior - Office', location: 'CBD Office', callTime: '08:00', wrapTime: '18:00', cast: ['Emma Lead', 'Tom Support'], crew: ['Alan McCarthy', 'Clooney Cat', 'John Camera', 'Sarah Sound', 'Lighting Crew'] },
    ],
    weather: 'Indoor shoot',
    notes: 'Office location secured. Parking available for crew.'
  }
];

const stripboard = [
  { scene: 'SC1', description: 'Opening Scene - Beach', location: 'St Kilda Beach', duration: '2 days', cast: 2, crew: 4, status: 'scheduled' },
  { scene: 'SC2', description: 'Interior - Office', location: 'CBD Office', duration: '1 day', cast: 2, crew: 5, status: 'scheduled' },
  { scene: 'SC3', description: 'Night Scene - Street', location: 'Collins Street', duration: '1 day', cast: 1, crew: 4, status: 'pending' },
  { scene: 'SC4', description: 'Interior - Restaurant', location: 'CBD Restaurant', duration: '1 day', cast: 2, crew: 4, status: 'pending' },
  { scene: 'SC5', description: 'Exterior - Park', location: 'Royal Botanic Gardens', duration: '1 day', cast: 2, crew: 4, status: 'pending' },
];

export default function ProductionsPage() {
  const [selectedProduction, setSelectedProduction] = useState(productions[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCallSheet, setShowCallSheet] = useState(false);
  const [selectedDay, setSelectedDay] = useState(shootingSchedule[0]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pre-production': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'production': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'post-production': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStripboardColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-4xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <FilmIcon className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                    Productions
                  </h1>
                  <p className="text-xl text-orange-100 leading-relaxed">
                    Manage shooting schedules, stripboards, and call sheets for all your productions.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold">{productions.length} active productions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-300 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold">Professional workflow</span>
                </div>
              </div>
            </div>
          </div>

          {/* Production Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Active Productions</h2>
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl">
                <PlusIcon className="h-5 w-5 mr-2" />
                New Production
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productions.map((production) => (
                <Card 
                  key={production.id} 
                  className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedProduction.id === production.id 
                      ? 'ring-2 ring-orange-500 shadow-xl' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedProduction(production)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{production.title}</h3>
                        <p className="text-gray-600 font-medium">{production.type}</p>
                      </div>
                      <Badge className={`${getStatusColor(production.status)} border`}>
                        {production.status}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Director: {production.director}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{production.startDate} - {production.endDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{production.location}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{production.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${production.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Production Management Tabs */}
          {selectedProduction && (
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Overview', icon: EyeIcon },
                    { id: 'schedule', name: 'Shooting Schedule', icon: CalendarIcon },
                    { id: 'stripboard', name: 'Stripboard', icon: DocumentTextIcon },
                    { id: 'callsheets', name: 'Call Sheets', icon: BellIcon },
                    { id: 'crew', name: 'Crew & Cast', icon: UserGroupIcon },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <CalendarIcon className="h-8 w-8 text-blue-600" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Shooting Days</h3>
                              <p className="text-sm text-gray-600">Total scheduled</p>
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">{shootingSchedule.length}</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <UserGroupIcon className="h-8 w-8 text-green-600" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Crew & Cast</h3>
                              <p className="text-sm text-gray-600">Total team members</p>
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">{selectedProduction.crew.length + selectedProduction.cast.length}</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <DocumentTextIcon className="h-8 w-8 text-orange-600" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Scenes</h3>
                              <p className="text-sm text-gray-600">Total to shoot</p>
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-gray-900">{selectedProduction.scenes.length}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <ClockIcon className="h-5 w-5 text-gray-600" />
                            <span>Upcoming Shoots</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {shootingSchedule.slice(0, 3).map((day, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">{day.day} - {day.date}</p>
                                  <p className="text-sm text-gray-600">{day.scenes.length} scene(s)</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDay(day);
                                    setShowCallSheet(true);
                                  }}
                                >
                                  View Call Sheet
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <UserGroupIcon className="h-5 w-5 text-gray-600" />
                            <span>Key Team</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedProduction.crew.slice(0, 4).map((member, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{member.name}</p>
                                  <p className="text-sm text-gray-600">{member.role}</p>
                                </div>
                                <Badge className={member.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {member.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Shooting Schedule</h3>
                      <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Shooting Day
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {shootingSchedule.map((day, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">{day.day} - {day.date}</h4>
                                <p className="text-sm text-gray-600">Weather: {day.weather}</p>
                              </div>
                              <Button 
                                onClick={() => {
                                  setSelectedDay(day);
                                  setShowCallSheet(true);
                                }}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                              >
                                <BellIcon className="h-4 w-4 mr-2" />
                                Generate Call Sheet
                              </Button>
                            </div>
                            
                            <div className="space-y-3">
                              {day.scenes.map((scene, sceneIndex) => (
                                <div key={sceneIndex} className="p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-semibold text-gray-900">{scene.name}</h5>
                                    <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-600">Location</p>
                                      <p className="font-medium">{scene.location}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Call Time</p>
                                      <p className="font-medium">{scene.callTime}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Wrap Time</p>
                                      <p className="font-medium">{scene.wrapTime}</p>
                                    </div>
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex items-center space-x-4">
                                      <div>
                                        <p className="text-xs text-gray-600">Cast ({scene.cast.length})</p>
                                        <p className="text-sm font-medium">{scene.cast.join(', ')}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-600">Crew ({scene.crew.length})</p>
                                        <p className="text-sm font-medium">{scene.crew.join(', ')}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {day.notes && (
                              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                                <p className="text-sm text-gray-700"><strong>Notes:</strong> {day.notes}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'stripboard' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Stripboard</h3>
                      <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Scene
                      </Button>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="grid grid-cols-1 gap-2">
                        {stripboard.map((strip, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
                            <div className={`w-4 h-4 rounded-full ${getStripboardColor(strip.status)}`}></div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <span className="font-bold text-gray-900">{strip.scene}</span>
                                <span className="text-gray-700">{strip.description}</span>
                                <span className="text-sm text-gray-600">{strip.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{strip.duration}</span>
                              <span>Cast: {strip.cast}</span>
                              <span>Crew: {strip.crew}</span>
                              <Badge className={strip.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                                {strip.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'callsheets' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Call Sheets</h3>
                      <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Generate All Call Sheets
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {shootingSchedule.map((day, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">{day.day}</h4>
                                <p className="text-sm text-gray-600">{day.date}</p>
                              </div>
                              <Button 
                                onClick={() => {
                                  setSelectedDay(day);
                                  setShowCallSheet(true);
                                }}
                                variant="outline"
                                size="sm"
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{day.scenes.length} scene(s)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <UserGroupIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {day.scenes.reduce((total, scene) => total + scene.cast.length + scene.crew.length, 0)} people
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPinIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{day.scenes[0]?.location}</span>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <Button 
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                                onClick={() => {
                                  setSelectedDay(day);
                                  setShowCallSheet(true);
                                }}
                              >
                                <EnvelopeIcon className="h-4 w-4 mr-2" />
                                Send to Crew
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'crew' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Crew & Cast</h3>
                      <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Team Member
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <WrenchIcon className="h-5 w-5 text-gray-600" />
                            <span>Crew</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedProduction.crew.map((member, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">{member.name}</p>
                                  <p className="text-sm text-gray-600">{member.role}</p>
                                  <p className="text-xs text-gray-500">{member.email}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={member.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                    {member.status}
                                  </Badge>
                                  <Button variant="outline" size="sm">
                                    <PhoneIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <CameraIcon className="h-5 w-5 text-gray-600" />
                            <span>Cast</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedProduction.cast.map((member, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">{member.name}</p>
                                  <p className="text-sm text-gray-600">{member.role}</p>
                                  <p className="text-xs text-gray-500">{member.email}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={member.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                    {member.status}
                                  </Badge>
                                  <Button variant="outline" size="sm">
                                    <PhoneIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Call Sheet Modal */}
          {showCallSheet && selectedDay && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Call Sheet - {selectedDay.day}</h2>
                    <Button
                      onClick={() => setShowCallSheet(false)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <CalendarIcon className="h-5 w-5 text-gray-600" />
                            <span>Production Details</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Production</p>
                              <p className="font-semibold">{selectedProduction.title}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Date</p>
                              <p className="font-semibold">{selectedDay.date}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Day</p>
                              <p className="font-semibold">{selectedDay.day}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Weather</p>
                              <p className="font-semibold">{selectedDay.weather}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <ClockIcon className="h-5 w-5 text-gray-600" />
                            <span>Schedule</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedDay.scenes.map((scene, index) => (
                              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">{scene.name}</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-600">Location</p>
                                    <p className="font-medium">{scene.location}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Call Time</p>
                                    <p className="font-medium">{scene.callTime}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Wrap Time</p>
                                    <p className="font-medium">{scene.wrapTime}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Duration</p>
                                    <p className="font-medium">~{scene.wrapTime}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <UserGroupIcon className="h-5 w-5 text-gray-600" />
                            <span>Cast & Crew</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Cast</h4>
                              <div className="space-y-2">
                                {selectedDay.scenes.flatMap(scene => scene.cast).filter((value, index, self) => self.indexOf(value) === index).map((member, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                    <span className="font-medium">{member}</span>
                                    <Badge className="bg-blue-100 text-blue-800">Cast</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Crew</h4>
                              <div className="space-y-2">
                                {selectedDay.scenes.flatMap(scene => scene.crew).filter((value, index, self) => self.indexOf(value) === index).map((member, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                                    <span className="font-medium">{member}</span>
                                    <Badge className="bg-green-100 text-green-800">Crew</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <LightBulbIcon className="h-5 w-5 text-gray-600" />
                            <span>Notes</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{selectedDay.notes}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <Button variant="outline" onClick={() => setShowCallSheet(false)}>
                      Close
                    </Button>
                    <div className="flex items-center space-x-3">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        Send to Crew
                      </Button>
                      <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 