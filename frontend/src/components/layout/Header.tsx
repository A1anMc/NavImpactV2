import { FC } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { BellIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
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
    <div className="flex flex-1 items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      {/* Enhanced Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-3">
          <li>
            <div>
              <Link href="/" className="text-gray-500 hover:text-green-600 font-medium transition-colors duration-200 flex items-center">
                <span className="p-1 rounded-lg hover:bg-gray-100">Home</span>
              </Link>
            </div>
          </li>
          {pathSegments.map((segment, index) => (
            <li key={segment}>
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-gray-300 mx-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <Link
                  href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                  className="text-sm font-medium text-gray-500 hover:text-green-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Enhanced Notifications */}
        <button
          type="button"
          className="relative rounded-xl bg-gray-50 p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 group"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm">
            3
          </span>
        </button>

        {/* Enhanced Profile dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-x-3 rounded-xl bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 hover:bg-gray-100 transition-all duration-200 group">
            <span className="sr-only">Open user menu</span>
            <div className="p-1.5 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
              <UserCircleIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
            </div>
            <span className="hidden text-sm font-semibold text-gray-700 lg:block">Alan McCarthy</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Alan McCarthy</p>
                <p className="text-xs text-gray-500">alan@navimpact.org</p>
              </div>
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      href={item.href}
                      className={`block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 ${
                        active ? 'bg-gray-50 text-gray-900' : ''
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