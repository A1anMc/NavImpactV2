import { FC } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Custom NavImpact dashboard header, built by Alan – not boilerplate
const userNavigation = [
  { name: 'Your Profile', href: '/profile' },
  { name: 'Time Logs', href: '/time-logs' },
  { name: 'Settings', href: '/settings' },
  { name: 'Sign out', href: '/auth/signout' },
];

const Header: FC = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  
  return (
    <div className="flex flex-1 items-center justify-between bg-white border-b border-gray-200 px-6 py-4">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <div>
              <Link href="/" className="text-gray-500 hover:text-gray-700 font-medium">
                Home
              </Link>
            </div>
          </li>
          {pathSegments.map((segment, index) => (
            <li key={segment}>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <Link
                  href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                  className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-full bg-gray-50 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-5 w-5" aria-hidden="true" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            3
          </span>
        </button>

        {/* Profile dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-x-3 rounded-lg bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-gray-100 transition-colors">
            <span className="sr-only">Open user menu</span>
            <UserCircleIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
            <span className="hidden text-sm font-medium text-gray-700 lg:block">Alan McCarthy</span>
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                        active ? 'bg-gray-50' : ''
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