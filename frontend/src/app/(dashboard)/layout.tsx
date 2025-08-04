import React from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <main className="h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 