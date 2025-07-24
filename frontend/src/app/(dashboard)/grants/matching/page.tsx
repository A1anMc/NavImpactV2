'use client';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

import MatchingGrants from '@/components/grants/MatchingGrants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Info } from 'lucide-react';

export default function MatchingGrantsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Target className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Matching Grants</h1>
        </div>
        <p className="text-gray-600">
          Grants that match your organization&apos;s profile and preferences
        </p>
      </div>

      {/* Info Card */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            How Matching Works
          </CardTitle>
          <CardDescription className="text-blue-700">
            These grants are automatically filtered based on your profile preferences including funding range, 
            industry focus, location, and organization type.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-800">Funding Range</p>
              <p className="text-blue-700">$25K - $500K</p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Industry Focus</p>
              <p className="text-blue-700">Technology, Healthcare</p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Location</p>
              <p className="text-blue-700">National, Victoria</p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Organization Type</p>
              <p className="text-blue-700">Startup, SME</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matching Grants Component */}
      <MatchingGrants showFilters={true} />
    </div>
  );
} 