'use client';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  DocumentMagnifyingGlassIcon, 
  FolderIcon, 
  ClipboardDocumentListIcon,
  ClockIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { Target, TrendingUp, Zap, Globe, Shield } from 'lucide-react';
import AnimatedMetric from '@/components/ui/AnimatedMetric';
import AnimatedCard from '@/components/ui/AnimatedCard';
import GradientText from '@/components/ui/GradientText';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Modern Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <CpuChipIcon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            <div>
              <GradientText className="text-4xl font-bold mb-2">
                NavImpact Command Center
              </GradientText>
              <div className="space-y-3">
                <p className="text-slate-300 text-lg font-medium">Welcome to NavImpact</p>
                <p className="text-slate-300 text-base">A new way to see, shape, and scale impact.</p>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>It&rsquo;s more than grants.</p>
                  <p>It&rsquo;s more than projects.</p>
                  <p>It&rsquo;s the connection between funding and real human outcomes.</p>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <span className="text-lg">✔</span>
                    <span>Empower your team</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <span className="text-lg">✔</span>
                    <span>Streamline complex funding</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <span className="text-lg">✔</span>
                    <span>Turn data into stories that matter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">All Systems Operational</span>
                </div>
                <div className="hidden md:flex items-center gap-4 text-slate-300 text-sm">
                  <span>• API: 99.9% uptime</span>
                  <span>• Database: Connected</span>
                  <span>• Sync: Active</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <span className="text-green-400 text-sm font-mono">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <AnimatedMetric
            value={8}
            label="Active Grants"
            icon={<DocumentMagnifyingGlassIcon className="h-6 w-6 text-white" />}
            color="text-white"
            suffix=""
            delay={0.1}
          />
          
          <AnimatedMetric
            value={3}
            label="Live Projects"
            icon={<FolderIcon className="h-6 w-6 text-white" />}
            color="text-white"
            suffix=""
            delay={0.2}
          />
          
          <AnimatedMetric
            value={12}
            label="Pending Tasks"
            icon={<ClipboardDocumentListIcon className="h-6 w-6 text-white" />}
            color="text-white"
            suffix=""
            delay={0.3}
          />
          
          <AnimatedMetric
            value={5}
            label="Deadlines"
            icon={<ClockIcon className="h-6 w-6 text-white" />}
            color="text-white"
            suffix=""
            delay={0.4}
          />
        </div>

        {/* Quick Actions */}
        <AnimatedCard className="p-6" delay={0.5}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              <p className="text-slate-300 text-sm">Access your tools instantly</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/grants">
              <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105">
                <DocumentMagnifyingGlassIcon className="h-4 w-4 mr-3" />
                Browse All Grants
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105">
                <FolderIcon className="h-4 w-4 mr-3" />
                Manage Projects
              </Button>
            </Link>
            <Link href="/tasks">
              <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105">
                <ClipboardDocumentListIcon className="h-4 w-4 mr-3" />
                View Tasks
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105">
                <Shield className="h-4 w-4 mr-3" />
                Settings
              </Button>
            </Link>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
} 