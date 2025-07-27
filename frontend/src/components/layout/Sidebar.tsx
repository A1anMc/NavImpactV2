import { FC, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  PhotoIcon,
  ClockIcon,
  FolderIcon,
  CogIcon,
  CircleStackIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UsersIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// Simplified navigation structure
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
      { name: 'Help & Guide', href: '/help-guide', icon: QuestionMarkCircleIcon },
    ]
  }
];

const Sidebar: FC = () => {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Core']));

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Simplified Logo Section */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
            <img src="/logo.svg" alt="NavImpact" className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">NavImpact</span>
            <span className="text-xs text-gray-500 font-medium">Impact & Intelligence</span>
          </div>
        </Link>
      </div>
      
      {/* Simplified Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationGroups.map((group) => (
          <div key={group.name} className="space-y-1">
            <button
              onClick={() => toggleGroup(group.name)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {group.name}
              </span>
              {expandedGroups.has(group.name) ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              )}
            </button>
            
            {expandedGroups.has(group.name) && (
              <div className="space-y-1 ml-2">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 flex-shrink-0 ${
                          isActive ? 'text-green-600' : 'text-gray-400'
                        }`}
                      />
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <Link
          href="/settings"
          className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            pathname === '/settings' 
              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          <CogIcon className={`h-4 w-4 ${
            pathname === '/settings' ? 'text-blue-600' : 'text-gray-400'
          }`} />
          <span>Settings</span>
          {pathname === '/settings' && (
            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 