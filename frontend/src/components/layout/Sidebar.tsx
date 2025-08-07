'use client';

import React, { useState } from 'react';
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
  CalendarIcon,
  ChatBubbleLeftIcon,
  SparklesIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

// Simplified navigation for better UX
const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, group: 'main' },
  { name: 'Productions', href: '/productions', icon: FilmIcon, group: 'main' },
  { name: 'Grants', href: '/grants', icon: CurrencyDollarIcon, group: 'grants' },
  { name: 'Team', href: '/team', icon: UserGroupIcon, group: 'team' },
  { name: 'Time Logs', href: '/time-logs', icon: ClockIcon, group: 'operations' },
  { name: 'Media', href: '/media', icon: FilmIcon, group: 'operations' },
  { name: 'Impact', href: '/impact', icon: ChartBarIcon, group: 'operations' },
  { name: 'Settings', href: '/settings', icon: CogIcon, group: 'settings' },
];

// Grant sub-navigation (accessible from grants page)
const grantSubNav = [
  { name: 'AI Matching', href: '/grants/match', icon: SparklesIcon },
  { name: 'Timeline', href: '/grants/timeline', icon: CalendarIcon },
  { name: 'Feedback', href: '/grants/feedback', icon: ChatBubbleLeftIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showGrantSubNav, setShowGrantSubNav] = useState(false);

  // Check if we're on a grants page
  const isOnGrantsPage = pathname.startsWith('/grants');

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <img src="/favicon.svg" alt="NavImpact" className="w-6 h-6" />
                </div>
                <span className="text-lg font-bold text-gray-900">NavImpact</span>
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
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const isGrantsActive = item.href === '/grants' && isOnGrantsPage;
            
            return (
              <div key={item.name}>
                <a
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive || isGrantsActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={(e) => {
                    if (item.href === '/grants') {
                      e.preventDefault();
                      setShowGrantSubNav(!showGrantSubNav);
                    }
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{item.name}</span>
                      {item.href === '/grants' && !collapsed && (
                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showGrantSubNav ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  )}
                </Link>

                {/* Grant Sub-navigation */}
                {item.href === '/grants' && showGrantSubNav && !collapsed && (
                  <div className="ml-6 mt-2 space-y-1">
                    {grantSubNav.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            isSubActive
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <subItem.icon className="h-4 w-4" />
                          <span className="font-medium">{subItem.name}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!collapsed && (
            <div className="text-xs text-gray-500">
              <p>NavImpact</p>
              <p>Impact & Intelligence Platform</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 