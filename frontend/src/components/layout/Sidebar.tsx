'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  FolderIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  PhotoIcon,
  ClockIcon,
  Cog6ToothIcon,
  CircleStackIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  UserGroupIcon,
  UserCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const navigationGroups = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', href: '/', icon: HomeIcon },
      { name: 'Projects', href: '/projects', icon: FolderIcon },
      { name: 'Grants', href: '/grants', icon: DocumentMagnifyingGlassIcon },
      { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
    ]
  },
  {
    name: 'Analytics',
    items: [
      { name: 'Impact', href: '/impact', icon: ChartBarIcon },
      { name: 'Media', href: '/media', icon: PhotoIcon },
      { name: 'Time Logs', href: '/time-logs', icon: ClockIcon },
    ]
  },
  {
    name: 'System',
    items: [
      { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
      { name: 'Help Guide', href: '/help-guide', icon: QuestionMarkCircleIcon },
    ]
  },
  {
    name: 'Team',
    items: [
      { name: 'Team Members', href: '/team', icon: UsersIcon },
      { name: 'Collaboration', href: '/collaboration', icon: UserGroupIcon },
      { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    ]
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`flex h-full flex-col bg-sge-black/80 backdrop-blur-xl border-r border-sge-forest/20 shadow-strong transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
      {/* Enhanced SGE Logo Section */}
      <div className="flex h-20 items-center px-6 border-b border-sge-forest/20 bg-gradient-to-r from-sge-black/50 via-sge-forest/10 to-sge-tawny/10">
        <Link href="/" className="flex items-center space-x-4 group">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-xl shadow-strong group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
              <svg className="h-6 w-6 text-sge-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-sge-tawny rounded-full flex items-center justify-center">
              <SparklesIcon className="h-2 w-2 text-sge-white" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-carrot bg-gradient-to-r from-sge-white to-sge-white/90 bg-clip-text text-transparent group-hover:from-sge-forest group-hover:to-sge-tawny transition-all duration-300">
                SGE
              </span>
              <span className="text-xs text-sge-white/60 font-neue font-medium">Media Impact</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-8">
        {navigationGroups.map((group) => (
          <div key={group.name}>
            {!collapsed && (
              <h3 className="text-xs font-neue font-semibold text-sge-white/60 uppercase tracking-wider mb-4 px-2">
                {group.name}
              </h3>
            )}
            <div className="space-y-2">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={`
                      group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 cursor-pointer
                      ${isActive
                        ? 'bg-gradient-to-r from-sge-forest/20 to-sge-tawny/20 border border-sge-forest/30 shadow-soft'
                        : 'hover:bg-sge-white/5 hover:shadow-soft'
                      }
                    `}>
                      <div className={`
                        p-2 rounded-lg transition-all duration-300 group-hover:scale-110
                        ${isActive
                          ? 'bg-gradient-to-br from-sge-forest to-sge-tawny shadow-strong'
                          : 'bg-sge-black/50 group-hover:bg-gradient-to-br group-hover:from-sge-forest/20 group-hover:to-sge-tawny/20'
                        }
                      `}>
                        <item.icon className={`h-5 w-5 transition-colors duration-300 ${
                          isActive ? 'text-sge-white' : 'text-sge-white/70 group-hover:text-sge-forest'
                        }`} />
                      </div>
                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between">
                          <span className={`text-sm font-neue font-medium transition-colors duration-300 ${
                            isActive ? 'text-sge-white' : 'text-sge-white/80 group-hover:text-sge-white'
                          }`}>
                            {item.name}
                          </span>
                          {isActive && (
                            <ArrowRightIcon className="h-4 w-4 text-sge-forest" />
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Enhanced Footer */}
      <div className="p-4 border-t border-sge-forest/20 bg-gradient-to-r from-sge-black/50 via-sge-forest/10 to-sge-tawny/10">
        {!collapsed && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-sge-forest/10 to-sge-tawny/10 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-full flex items-center justify-center">
                <span className="text-sge-white text-sm font-bold font-neue">S</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-neue font-medium text-sge-white">System Status</p>
                <p className="text-xs text-sge-forest font-medium">All Systems Online</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-sge-white/60 font-neue">NavImpact v2.0</p>
              <p className="text-xs text-sge-white/40 font-neue">Powered by SGE</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-sge-forest to-sge-tawny rounded-full flex items-center justify-center">
              <span className="text-sge-white text-sm font-bold font-neue">S</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 