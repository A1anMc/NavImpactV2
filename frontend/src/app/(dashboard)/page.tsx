// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import Link from 'next/link';
import { 
  DocumentMagnifyingGlassIcon, 
  FolderIcon, 
  ClipboardDocumentListIcon,
  ClockIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Simple Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
                          <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <CpuChipIcon className="w-8 h-8 text-white" />
                </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-slate-900"></div>
              </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                NavImpact Command Center
              </h1>
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
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white font-medium">All Systems Operational</span>
                </div>
                <div className="hidden md:flex items-center gap-4 text-slate-300 text-sm">
                  <span>• API: 99.9% uptime</span>
                  <span>• Database: Connected</span>
                  <span>• Sync: Active</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm font-mono">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <DocumentMagnifyingGlassIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Active Grants</p>
                <div className="text-3xl font-bold text-white">8</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <FolderIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Live Projects</p>
                <div className="text-3xl font-bold text-white">3</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Pending Tasks</p>
                <div className="text-3xl font-bold text-white">12</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Deadlines</p>
                <div className="text-3xl font-bold text-white">5</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <DocumentMagnifyingGlassIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              <p className="text-slate-300 text-sm">Access your tools instantly</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/grants" className="inline-block">
              <div className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-lg px-4 py-3 text-center transition-all duration-300">
                <DocumentMagnifyingGlassIcon className="h-4 w-4 mx-auto mb-2" />
                Browse All Grants
              </div>
            </Link>
            <Link href="/projects" className="inline-block">
              <div className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-lg px-4 py-3 text-center transition-all duration-300">
                <FolderIcon className="h-4 w-4 mx-auto mb-2" />
                Manage Projects
              </div>
            </Link>
            <Link href="/tasks" className="inline-block">
              <div className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-lg px-4 py-3 text-center transition-all duration-300">
                <ClipboardDocumentListIcon className="h-4 w-4 mx-auto mb-2" />
                View Tasks
              </div>
            </Link>
            <Link href="/settings" className="inline-block">
              <div className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-lg px-4 py-3 text-center transition-all duration-300">
                <ClockIcon className="h-4 w-4 mx-auto mb-2" />
                Settings
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 