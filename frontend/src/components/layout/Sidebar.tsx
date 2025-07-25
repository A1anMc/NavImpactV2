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
];

const Sidebar: FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-3">
          <img src="/logo.svg" alt="NavImpact" className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">NavImpact</span>
            <span className="text-xs text-gray-500">Impact & Intelligence</span>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150 ${
                  isActive ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <Link
          href="/settings"
          className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
            pathname === '/settings' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <CogIcon 
            className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150 ${
              pathname === '/settings' ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'
            }`} 
          />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 