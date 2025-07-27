import { FC } from 'react';
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
} from '@heroicons/react/24/outline';

// Custom NavImpact dashboard navigation, built by Alan – not boilerplate
const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Grants', href: '/grants', icon: DocumentMagnifyingGlassIcon },
  { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Impact', href: '/impact', icon: ChartBarIcon },
  { name: 'Media', href: '/media', icon: PhotoIcon },
  { name: 'Time Logs', href: '/time-logs', icon: ClockIcon },
  { name: 'Customer Hub', href: '/customer-hub', icon: CircleStackIcon },
];

const Sidebar: FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Enhanced Logo Section */}
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
      
      {/* Enhanced Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
              }`}
            >
              <div className={`p-1.5 rounded-lg mr-3 transition-all duration-200 ${
                isActive 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-600'
              }`}>
                <item.icon
                  className="h-4 w-4 flex-shrink-0"
                  aria-hidden="true"
                />
              </div>
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Enhanced Settings Section */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <Link
          href="/settings"
          className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
            pathname === '/settings' 
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm'
          }`}
        >
          <div className={`p-1.5 rounded-lg mr-3 transition-all duration-200 ${
            pathname === '/settings' 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-600'
          }`}>
            <CogIcon className="h-4 w-4 flex-shrink-0" />
          </div>
          <span className="font-medium">Settings</span>
          {pathname === '/settings' && (
            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 