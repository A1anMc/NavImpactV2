'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  ClockIcon,
  PlusIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  FilmIcon,
  CameraIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">SGE Dashboard</h1>
              <p className="text-gray-400">Shadow Goose Entertainment</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-semibold">
                LIVE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <FilmIcon className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Active Projects</h3>
            <p className="text-gray-400 text-sm">Currently in production</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <TrophyIcon className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">$1.2M</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Grants Secured</h3>
            <p className="text-gray-400 text-sm">Total funding acquired</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <UserGroupIcon className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">6</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Team Members</h3>
            <p className="text-gray-400 text-sm">Dedicated professionals</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold text-white">92%</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Impact Score</h3>
            <p className="text-gray-400 text-sm">Progress towards goals</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/grants" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 group-hover:bg-white/15">
              <div className="flex items-center justify-between mb-4">
                <TrophyIcon className="w-8 h-8 text-blue-400" />
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Grants</h3>
              <p className="text-gray-400 text-sm">Discover and track funding opportunities</p>
            </div>
          </Link>

          <Link href="/ai-grants-test" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 group-hover:bg-white/15">
              <div className="flex items-center justify-between mb-4">
                <StarIcon className="w-8 h-8 text-green-400" />
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Grant Discovery</h3>
              <p className="text-gray-400 text-sm">Real-time grant discovery with AI</p>
            </div>
          </Link>

          <Link href="/projects" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15">
              <div className="flex items-center justify-between mb-4">
                <FilmIcon className="w-8 h-8 text-purple-400" />
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Projects</h3>
              <p className="text-gray-400 text-sm">Manage your film and media projects</p>
            </div>
          </Link>

          <Link href="/tasks" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-orange-400/50 transition-all duration-300 group-hover:bg-white/15">
              <div className="flex items-center justify-between mb-4">
                <CheckCircleIcon className="w-8 h-8 text-orange-400" />
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tasks</h3>
              <p className="text-gray-400 text-sm">Track and manage team tasks</p>
            </div>
          </Link>

          <Link href="/team" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-pink-400/50 transition-all duration-300 group-hover:bg-white/15">
              <div className="flex items-center justify-between mb-4">
                <UserGroupIcon className="w-8 h-8 text-pink-400" />
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team</h3>
              <p className="text-gray-400 text-sm">Manage your team and roles</p>
            </div>
          </Link>

          <Link href="/impact" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 group-hover:bg-white/15">
              <div className="flex items-center justify-between mb-4">
                <ChartBarIcon className="w-8 h-8 text-yellow-400" />
                <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Impact</h3>
              <p className="text-gray-400 text-sm">Track your social impact</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-6 text-white">Recent Projects</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                <div className="flex items-center">
                  <FilmIcon className="w-6 h-6 text-blue-400 mr-3" />
                  <div>
                    <p className="font-medium text-white">Wild Hearts Documentary</p>
                    <p className="text-sm text-gray-400">85% Complete - In Production</p>
                  </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                <div className="flex items-center">
                  <CameraIcon className="w-6 h-6 text-green-400 mr-3" />
                  <div>
                    <p className="font-medium text-white">Around the Table Series</p>
                    <p className="text-sm text-gray-400">65% Complete - Pre-Production</p>
                  </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                <div className="flex items-center">
                  <MegaphoneIcon className="w-6 h-6 text-purple-400 mr-3" />
                  <div>
                    <p className="font-medium text-white">The Last Line Feature</p>
                    <p className="text-sm text-gray-400">45% Complete - Development</p>
                  </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-6 text-white">Quick Actions</h2>
            <div className="space-y-4">
              <div className="flex items-center bg-white/5 p-4 rounded-lg">
                <PlusIcon className="w-6 h-6 text-green-400 mr-3" />
                <div>
                  <p className="font-medium text-white">New Sprint: Q3 Impact Drive</p>
                  <p className="text-sm text-gray-400">Planned for next week</p>
                </div>
              </div>
              <div className="flex items-center bg-white/5 p-4 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-400 mr-3" />
                <div>
                  <p className="font-medium text-white">Grant Deadline Approaching</p>
                  <p className="text-sm text-gray-400">Environmental Media Grant - 5 days left</p>
                </div>
              </div>
              <div className="flex items-center bg-white/5 p-4 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-blue-400 mr-3" />
                <div>
                  <p className="font-medium text-white">Impact Report Generated</p>
                  <p className="text-sm text-gray-400">Q2 Impact Summary ready for review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
