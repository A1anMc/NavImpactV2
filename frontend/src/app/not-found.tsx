'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Try to navigate to the requested path
    const path = window.location.pathname;
    
    // List of valid routes
    const validRoutes = [
      '/',
      '/productions',
      '/grants',
      '/team',
      '/time-logs',
      '/media',
      '/impact',
      '/settings',
      '/grants/match',
      '/grants/timeline',
      '/grants/feedback',
    ];

    // Check if the path is valid
    if (validRoutes.includes(path)) {
      // If it's a valid route, try to navigate
      router.push(path);
    } else {
      // If not valid, redirect to home
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-8">This page could not be found.</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
} 