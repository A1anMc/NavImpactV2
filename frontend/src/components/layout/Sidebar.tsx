'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  HomeIcon,
  FilmIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ClockIcon,
  PhotoIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
    current: true,
  },
  {
    name: 'Productions',
    href: '/grants',
    icon: FilmIcon,
    current: false,
  },
  {
    name: 'Team',
    href: '/team',
    icon: UserGroupIcon,
    current: false,
  },
  {
    name: 'Collaboration',
    href: '/collaboration',
    icon: ChartBarIcon,
    current: false,
  },
  {
    name: 'Notion',
    href: '/notion',
    icon: DocumentTextIcon,
    current: false,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserCircleIcon,
    current: false,
  },
  {
    name: 'Time Logs',
    href: '/time-logs',
    icon: ClockIcon,
    current: false,
  },
  {
    name: 'Media',
    href: '/media',
    icon: PhotoIcon,
    current: false,
  },
  {
    name: 'Impact',
    href: '/impact',
    icon: GlobeAltIcon,
    current: false,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
    current: false,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Image
                  src="/SGE_Main_Logo_White.svg"
                  alt="SGE Logo"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">SGE</h1>
                <p className="text-xs text-gray-500">Production</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
              <Image
                src="/SGE_Main_Logo_White.svg"
                alt="SGE Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`h-5 w-5 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`} />
                {!collapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">S</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Shadow Goose
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Production System
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 