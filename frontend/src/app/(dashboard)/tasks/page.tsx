'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  project: string;
  tags: string[];
}

export default function TasksPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  // Real data from API
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/v1/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data.items || []);
        } else {
          console.error('Failed to fetch tasks');
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = selectedFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === selectedFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Unknown';
    }
  };

  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
            <p className="text-gray-600">Manage project tasks and track progress across your portfolio</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="text-gray-600 border-gray-300">
              Export Tasks
            </Button>
            <Button 
              onClick={() => setShowNewTaskForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </Button>
          </div>
        </div>

        {/* Task Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={`cursor-pointer transition-all ${selectedFilter === 'all' ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white hover:shadow-md'} border border-gray-200 shadow-sm`}>
            <div onClick={() => setSelectedFilter('all')} className="w-full h-full">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{taskCounts.all}</div>
                <div className="text-sm text-gray-600">All Tasks</div>
              </CardContent>
            </div>
          </Card>

          <Card className={`cursor-pointer transition-all ${selectedFilter === 'todo' ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white hover:shadow-md'} border border-gray-200 shadow-sm`}>
            <div onClick={() => setSelectedFilter('todo')} className="w-full h-full">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">{taskCounts.todo}</div>
                <div className="text-sm text-gray-600">To Do</div>
              </CardContent>
            </div>
          </Card>

          <Card className={`cursor-pointer transition-all ${selectedFilter === 'in_progress' ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white hover:shadow-md'} border border-gray-200 shadow-sm`}>
            <div onClick={() => setSelectedFilter('in_progress')} className="w-full h-full">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{taskCounts.in_progress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </CardContent>
            </div>
          </Card>

          <Card className={`cursor-pointer transition-all ${selectedFilter === 'completed' ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white hover:shadow-md'} border border-gray-200 shadow-sm`}>
            <div onClick={() => setSelectedFilter('completed')} className="w-full h-full">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{taskCounts.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Tasks List */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {selectedFilter === 'all' ? 'All Tasks' : `${getStatusLabel(selectedFilter)} Tasks`}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredTasks.length} tasks)
                </span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <div key={task.id} className="border border-gray-100 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)} Priority
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {task.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Assignee:</span>
                      <div className="font-medium text-gray-900 mt-1 flex items-center">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-green-700">
                            {task.assignee.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        {task.assignee}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <div className="font-medium text-gray-900 mt-1">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Project:</span>
                      <div className="font-medium text-gray-900 mt-1">{task.project}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="text-gray-600">
                      Edit
                    </Button>
                    {task.status !== 'completed' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        {task.status === 'todo' ? 'Start Task' : 'Mark Complete'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600">No tasks match the selected filter.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Task Form Modal */}
        {showNewTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Create New Task</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowNewTaskForm(false)}
                    className="text-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter task title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Describe the task details and requirements"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="">Select assignee</option>
                        <option value="sarah">Sarah Wilson</option>
                        <option value="alex">Alex Chen</option>
                        <option value="jordan">Jordan Martinez</option>
                        <option value="maria">Maria Rodriguez</option>
                        <option value="david">David Kim</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <option value="">Select project</option>
                        <option value="greenfields">Greenfields Housing Renewal</option>
                        <option value="frontend">Frontend Integration Test</option>
                        <option value="portfolio">Portfolio Management</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewTaskForm(false)}
                      className="text-gray-600 border-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                      Create Task
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 