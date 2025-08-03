'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PlusIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const mediaItems = [
  {
    id: 1,
    title: 'Wild Hearts - Rough Cut',
    type: 'video',
    size: '2.4 GB',
    duration: '45:30',
    status: 'review',
    project: 'Wild Hearts',
    uploadDate: '2024-01-27',
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: 2,
    title: 'Around the Table - Episode 1',
    type: 'video',
    size: '1.8 GB',
    duration: '32:15',
    status: 'approved',
    project: 'Around the Table',
    uploadDate: '2024-01-26',
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: 3,
    title: 'The Last Line - Script Draft',
    type: 'document',
    size: '2.1 MB',
    duration: null,
    status: 'draft',
    project: 'The Last Line',
    uploadDate: '2024-01-25',
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: 4,
    title: 'Production Photos - Set 1',
    type: 'image',
    size: '156 MB',
    duration: null,
    status: 'approved',
    project: 'Wild Hearts',
    uploadDate: '2024-01-24',
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: 5,
    title: 'Interview Footage - Ursula',
    type: 'video',
    size: '3.2 GB',
    duration: '1:15:30',
    status: 'processing',
    project: 'Around the Table',
    uploadDate: '2024-01-23',
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: 6,
    title: 'Impact Report - Q1 2024',
    type: 'document',
    size: '4.5 MB',
    duration: null,
    status: 'approved',
    project: 'General',
    uploadDate: '2024-01-22',
    thumbnail: '/api/placeholder/300/200',
  },
];

const projects = [
  { name: 'Wild Hearts', items: 12, size: '15.2 GB' },
  { name: 'Around the Table', items: 8, size: '8.7 GB' },
  { name: 'The Last Line', items: 5, size: '3.1 GB' },
];

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/10 rounded-xl">
                  <PhotoIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Media Library</h1>
                  <p className="text-purple-100 text-lg">
                    Manage your production assets, videos, documents, and media content in one central location.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-purple-100">27 GB total storage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span className="text-purple-100">25 media items</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Media Assets</h2>
              <p className="text-gray-600">Upload, organize, and manage your production content</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <PlusIcon className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
              <Button variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Folder
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Media Grid */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PhotoIcon className="h-5 w-5" />
                    <span>Recent Media</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mediaItems.map((item) => (
                      <div key={item.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            {item.type === 'video' && <VideoCameraIcon className="h-12 w-12 text-gray-400" />}
                            {item.type === 'document' && <DocumentTextIcon className="h-12 w-12 text-gray-400" />}
                            {item.type === 'image' && <PhotoIcon className="h-12 w-12 text-gray-400" />}
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <PlayIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-gray-900 text-sm truncate">{item.title}</h3>
                            <Badge className={
                              item.status === 'approved' ? 'bg-green-100 text-green-800' :
                              item.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{item.project}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{item.size}</span>
                            {item.duration && <span>{item.duration}</span>}
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <Button size="sm" variant="outline" className="flex-1">
                              <EyeIcon className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Storage Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Storage Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">27 GB</div>
                    <div className="text-sm text-gray-600">Total Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">25</div>
                    <div className="text-sm text-gray-600">Total Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-gray-600">Projects</div>
                  </div>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{project.name}</p>
                          <p className="text-sm text-gray-600">{project.items} items</p>
                        </div>
                        <span className="text-sm text-gray-600">{project.size}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Upload Media
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Folder
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <PhotoIcon className="h-4 w-4 mr-2" />
                    View Gallery
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Bulk Download
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}