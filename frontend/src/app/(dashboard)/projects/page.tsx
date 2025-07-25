import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// High-tech media themed projects page
export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Tech Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="relative p-8 space-y-8">
        {/* Page Header - Tech Style */}
        <div className="mb-12">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1 h-16 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                <div>
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 uppercase tracking-tight">
                    Impact Projects
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-cyan-300 text-lg font-medium">
                      SYSTEM ONLINE • TRACKING VICTORIAN FRAMEWORK ALIGNMENT
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-lg max-w-3xl leading-relaxed">
                Advanced impact monitoring system with real-time framework alignment tracking, 
                outcome measurement, and strategic goal synchronization protocols.
              </p>
            </div>
            <div className="flex items-center space-x-4 ml-6">
              <Link href="/projects/new">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl border border-cyan-400/30 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Initialize New Project
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* System Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m-2-2H9m10 0V9M5 13l4 4L5 21l-4-4 4-4z" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-black text-cyan-400 mb-2">02</div>
                <div className="text-sm text-slate-400 uppercase tracking-wide font-medium">Active Projects</div>
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{width: '67%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 backdrop-blur-xl shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-black text-green-400 mb-2">1.25K</div>
                <div className="text-sm text-slate-400 uppercase tracking-wide font-medium">People Reached</div>
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 backdrop-blur-xl shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-black text-purple-400 mb-2">06</div>
                <div className="text-sm text-slate-400 uppercase tracking-wide font-medium">Framework Alignment</div>
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 backdrop-blur-xl shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="text-4xl font-black text-orange-400 mb-2">94</div>
                <div className="text-sm text-slate-400 uppercase tracking-wide font-medium">Impact Score</div>
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{width: '94%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Framework Alignment Matrix */}
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-cyan-500/20 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <h3 className="text-2xl font-bold text-cyan-300 uppercase tracking-wide">Victorian Framework Alignment Matrix</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { name: 'Plan for Victoria', count: 0, color: 'from-indigo-400 to-purple-500' },
                { name: 'Melbourne 2030', count: 2, color: 'from-cyan-400 to-blue-500' },
                { name: 'Activity Centres', count: 0, color: 'from-blue-400 to-indigo-500' },
                { name: 'Greenfields Plan', count: 1, color: 'from-green-400 to-emerald-500' },
                { name: 'Clean Economy', count: 0, color: 'from-emerald-400 to-teal-500' },
                { name: 'Reconciliation', count: 0, color: 'from-red-400 to-pink-500' },
              ].map((framework, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${framework.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl font-black text-white">{framework.count}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium uppercase tracking-wider leading-tight">
                    {framework.name}
                  </div>
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${framework.color} rounded-full transition-all duration-500`}
                      style={{width: framework.count > 0 ? `${(framework.count / 2) * 100}%` : '0%'}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>2 projects linked to UN SDGs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>2 projects aligned with Victorian priorities</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Projects Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase tracking-wide">
                Active Projects
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-sm uppercase tracking-wide">REAL-TIME STATUS MONITORING</span>
              </div>
            </div>
            <div className="text-sm text-slate-400 font-mono">
              SHOWING 2 OF 2 ACTIVE PROJECTS
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Project 1 - Tech Enhanced */}
            <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-green-500/30 backdrop-blur-xl shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02] group">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="px-3 py-1 text-xs font-bold text-green-300 bg-green-500/20 border border-green-500/30 rounded-full uppercase tracking-wide">
                          ACTIVE
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                        Greenfields Housing Renewal
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 leading-relaxed">
                    Sustainable housing development in Melbourne's growth corridors, focusing on environmental impact and community wellbeing through advanced urban planning protocols.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                      Melbourne 2030
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">
                      Greenfields Plan
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                      SDG 11
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-mono">TARGET REACH:</span>
                      <span className="text-green-400 font-bold">500 PEOPLE</span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project 2 - Tech Enhanced */}
            <Card className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-blue-500/30 backdrop-blur-xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] group">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="px-3 py-1 text-xs font-bold text-blue-300 bg-blue-500/20 border border-blue-500/30 rounded-full uppercase tracking-wide">
                          ACTIVE
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        Frontend Integration Test
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 leading-relaxed">
                    Advanced testing protocol for frontend-backend integration with framework alignment features and real-time monitoring capabilities.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                      Melbourne 2030
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full">
                      SDG 4
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-mono">TARGET REACH:</span>
                      <span className="text-blue-400 font-bold">750 PEOPLE</span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status */}
        <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-cyan-500/20 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-bold text-cyan-300 uppercase tracking-wide">System Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <div className="text-sm text-green-400 font-bold uppercase tracking-wide">Rendering Engine</div>
                  <div className="text-slate-400 text-sm font-mono">ONLINE • OPTIMIZED</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <div className="text-sm text-blue-400 font-bold uppercase tracking-wide">Data Pipeline</div>
                  <div className="text-slate-400 text-sm font-mono">ACTIVE • SYNCHRONIZED</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <div className="text-sm text-purple-400 font-bold uppercase tracking-wide">Framework Sync</div>
                  <div className="text-slate-400 text-sm font-mono">READY • MONITORING</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
