import { FC, useState } from 'react';
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
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const navigationGroups = [
  {
    name: 'Core',
    items: [
      { name: 'Dashboard', href: '/', icon: HomeIcon },
      { name: 'Projects', href: '/projects', icon: FolderIcon },
      { name: 'Grants', href: '/grants', icon: DocumentMagnifyingGlassIcon },
      { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
    ]
  },
  {
    name: 'Team',
    items: [
      { name: 'Team Members', href: '/team', icon: UsersIcon },
      { name: 'Collaboration', href: '/collaboration', icon: UserGroupIcon },
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
    name: 'Advanced',
    items: [
      { name: 'Customer Hub', href: '/customer-hub', icon: CircleStackIcon },
      { name: 'Sustainability', href: '/sustainability', icon: ShieldCheckIcon },
      { name: 'Help Guide', href: '/help-guide', icon: QuestionMarkCircleIcon },
      { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ]
  }
];

const Sidebar: FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`flex h-full flex-col bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
      {/* Enhanced SGE Logo Section */}
      <div className="flex h-20 items-center px-6 border-b border-white/20 bg-gradient-to-r from-green-50/50 via-blue-50/50 to-indigo-50/50">
        <Link href="/" className="flex items-center space-x-4 group">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
              <SparklesIcon className="h-2 w-2 text-yellow-900" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300">
                SGE
              </span>
              <span className="text-xs text-gray-500 font-medium">Media Impact</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-8">
        {navigationGroups.map((group) => (
          <div key={group.name}>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
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
                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/50 shadow-sm' 
                        : 'hover:bg-white/50 hover:shadow-sm'
                      }
                    `}>
                      <div className={`
                        p-2 rounded-lg transition-all duration-300 group-hover:scale-110
                        ${isActive 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg' 
                          : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-green-500/20 group-hover:to-emerald-600/20'
                        }
                      `}>
                        <item.icon className={`h-5 w-5 transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-gray-600 group-hover:text-green-600'
                        }`} />
                      </div>
                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between">
                          <span className={`text-sm font-medium transition-colors duration-300 ${
                            isActive ? 'text-green-700' : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {item.name}
                          </span>
                          {isActive && (
                            <ArrowRightIcon className="h-4 w-4 text-green-600" />
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
      <div className="p-4 border-t border-white/20 bg-gradient-to-r from-gray-50/50 to-blue-50/50">
        {!collapsed && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">System Status</p>
                <p className="text-xs text-green-600 font-medium">All Systems Online</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">NavImpact v2.0</p>
              <p className="text-xs text-gray-400">Powered by SGE</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 