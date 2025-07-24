import { FC } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { BellIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Custom NavImpact dashboard header, built by Alan – not boilerplate
const userNavigation = [
  { name: 'Your Profile', href: '/settings/profile' },
  { name: 'Time Logs', href: '/time-logs' },
  { name: 'Settings', href: '/settings' },
  { name: 'Sign out', href: '/auth/signout' },
];

const Header: FC = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  
  return (
    <div className="flex flex-1 items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center space-x-3 transition-transform duration-250 ease-in-out hover:scale-105">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <CpuChipIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            NavImpact
          </span>
        </Link>
      </div>
      
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <div>
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
            </div>
          </li>
          {pathSegments.map((segment, index) => (
            <li key={segment}>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-slate-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <Link
                  href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                  className="ml-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* System Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-mono">LIVE</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-full bg-white/10 backdrop-blur-xl border border-white/20 p-2 text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-5 w-5" aria-hidden="true" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white animate-pulse">
            3
          </span>
        </button>

        {/* Profile dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-x-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 p-2 text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <span className="sr-only">Open user menu</span>
            <Avatar 
              email="alan.mccarthy@example.com" 
              name="Alan McCarthy" 
              size="sm" 
              className="border-2 border-white/20"
            />
            <span className="hidden text-sm font-medium text-white lg:block">Alan McCarthy</span>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/20 py-1 shadow-2xl focus:outline-none">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors ${
                        active ? 'bg-white/10' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default Header; 