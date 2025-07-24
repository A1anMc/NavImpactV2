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
  NewspaperIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import Logo from '@/components/ui/logo';

// Custom NavImpact dashboard navigation, built by Alan – not boilerplate
const navigation = [
  { name: 'Command Center', href: '/', icon: HomeIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Grants', href: '/grants', icon: DocumentMagnifyingGlassIcon },
  { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Impact', href: '/impact', icon: ChartBarIcon },
  { name: 'News', href: '/news', icon: NewspaperIcon },
  { name: 'Media', href: '/media', icon: PhotoIcon },
  { name: 'Time Logs', href: '/time-logs', icon: ClockIcon },
];

const Sidebar: FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col backdrop-blur-xl bg-slate-900/80 border-r border-white/10 relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-slate-900/80 to-slate-900/90"></div>
      
      <div className="relative z-10 flex h-16 items-center px-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <CpuChipIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-lg">NavImpact</div>
            <div className="text-slate-300 text-xs">Command Center</div>
          </div>
        </div>
      </div>
      
      <nav className="relative z-10 flex-1 space-y-2 px-3 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white shadow-lg border border-white/20'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white hover:shadow-md'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-blue-400 rounded-r-full"></div>
              )}
              
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                  isActive 
                    ? 'text-white scale-110' 
                    : 'text-slate-400 group-hover:text-white group-hover:scale-105'
                }`}
                aria-hidden="true"
              />
              <span className="relative z-10">{item.name}</span>
              
              {/* Hover effect */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="relative z-10 border-t border-white/10 p-4">
        <Link
          href="/settings"
          className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
            pathname === '/settings' 
              ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-white border border-white/20' 
              : 'text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <CogIcon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 