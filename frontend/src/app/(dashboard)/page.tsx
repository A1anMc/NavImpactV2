'use client';

import React, { useState, useEffect } from 'react';
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
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { grantsApi, GrantDashboard, GrantAnalytics } from '@/services/grants';

// Fallback data for when API is not available
const FALLBACK_DASHBOARD_DATA = {
  overview: {
    total_grants: 45,
    open_grants: 23,
    closing_soon: 8,
    total_funding: 1250000,
    average_amount: 75000,
    success_rate: 85,
    top_industries: [
      { industry: 'media', count: 15 },
      { industry: 'arts', count: 12 },
      { industry: 'technology', count: 8 }
    ],
    funding_trends: [
      { month: 'Jan', amount: 250000 },
      { month: 'Feb', amount: 300000 },
      { month: 'Mar', amount: 400000 }
    ],
    upcoming_deadlines: [],
    sector_breakdown: { media: 35, arts: 25, technology: 20, general: 20 },
    location_breakdown: { VIC: 40, NSW: 30, Australia: 30 }
  },
  recommendations: [],
  recent_applications: [],
  upcoming_deadlines: [],
  saved_searches: [],
  alerts: []
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<GrantDashboard>(FALLBACK_DASHBOARD_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Fetching real dashboard data from API...');
        const data = await grantsApi.getGrantDashboard();
        
        if (data && data.overview) {
          console.log('✅ Real dashboard data loaded:', data.overview);
          setDashboardData(data);
          setLastUpdated(new Date());
        } else {
          console.log('⚠️ API returned no data, using fallback');
          setDashboardData(FALLBACK_DASHBOARD_DATA);
        }
      } catch (err) {
        console.log('❌ API error, using fallback data:', err);
        setError('Unable to load real-time data');
        setDashboardData(FALLBACK_DASHBOARD_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDataStatus = () => {
    if (loading) return { text: 'Loading real data...', color: 'text-blue-400' };
    if (error) return { text: 'Using cached data', color: 'text-orange-400' };
    if (lastUpdated) return { text: `Updated ${lastUpdated.toLocaleTimeString()}`, color: 'text-green-400' };
    return { text: 'Real-time data', color: 'text-green-400' };
  };

  const dataStatus = getDataStatus();

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
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-blue-400 animate-pulse' : error ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                <span className={`text-xs font-semibold ${dataStatus.color}`}>
                  {dataStatus.text}
                </span>
              </div>
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
              <span className="text-2xl font-bold text-white">
                {loading ? '...' : dashboardData.overview.open_grants}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Active Grants</h3>
            <p className="text-gray-400 text-sm">Currently available</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <TrophyIcon className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">
                {loading ? '...' : formatCurrency(dashboardData.overview.total_funding)}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Total Funding</h3>
            <p className="text-gray-400 text-sm">Available across all grants</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <UserGroupIcon className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">
                {loading ? '...' : dashboardData.overview.closing_soon}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Closing Soon</h3>
            <p className="text-gray-400 text-sm">Deadlines approaching</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold text-white">
                {loading ? '...' : `${dashboardData.overview.success_rate}%`}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
            <p className="text-gray-400 text-sm">Historical performance</p>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Grant Analytics</h2>
              <button 
                onClick={() => window.location.reload()}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                <div className="flex items-center">
                  <ChartBarIcon className="w-6 h-6 text-blue-400 mr-3" />
                  <div>
                    <p className="font-medium text-white">Total Grants</p>
                    <p className="text-sm text-gray-400">{loading ? '...' : dashboardData.overview.total_grants} available</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">{loading ? '...' : dashboardData.overview.total_grants}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrophyIcon className="w-6 h-6 text-green-400 mr-3" />
                  <div>
                    <p className="font-medium text-white">Average Grant</p>
                    <p className="text-sm text-gray-400">Per opportunity</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">{loading ? '...' : formatCurrency(dashboardData.overview.average_amount)}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-orange-400 mr-3" />
                  <div>
                    <p className="font-medium text-white">Closing Soon</p>
                    <p className="text-sm text-gray-400">Urgent deadlines</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">{loading ? '...' : dashboardData.overview.closing_soon}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-6 text-white">Top Industries</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-lg animate-pulse">
                      <div className="h-4 bg-gray-600 rounded w-24"></div>
                      <div className="h-4 bg-gray-600 rounded w-8"></div>
                    </div>
                  ))}
                </div>
              ) : (
                dashboardData.overview.top_industries.slice(0, 3).map((industry, index) => (
                  <div key={industry.industry} className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0 ? 'bg-blue-400' : 
                        index === 1 ? 'bg-green-400' : 'bg-purple-400'
                      }`}></div>
                      <div>
                        <p className="font-medium text-white capitalize">{industry.industry}</p>
                        <p className="text-sm text-gray-400">{industry.count} grants</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-white">{industry.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 

