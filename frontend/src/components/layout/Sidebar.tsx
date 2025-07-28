'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  FilmIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ClockIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Productions', href: '/productions', icon: FilmIcon },
  { name: 'Grants', href: '/grants', icon: CurrencyDollarIcon },
  { name: 'Team', href: '/team', icon: UserGroupIcon },
  { name: 'Collaboration', href: '/collaboration', icon: GlobeAltIcon },
  { name: 'Profile', href: '/profile', icon: UserGroupIcon },
  { name: 'Time Logs', href: '/time-logs', icon: ClockIcon },
  { name: 'Media', href: '/media', icon: FilmIcon },
  { name: 'Impact', href: '/impact', icon: GlobeAltIcon },
  { name: 'Notion', href: '/notion', icon: BookOpenIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <img src="/SGE_Main_Logo_White.svg" alt="SGE" className="w-6 h-6" />
                </div>
                <span className="text-lg font-bold text-gray-900">SGE</span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {collapsed ? (
                <ChevronRightIcon className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!collapsed && (
            <div className="text-xs text-gray-500">
              <p>Shadow Goose Entertainment</p>
              <p>Production Management</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 