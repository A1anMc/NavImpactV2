'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simple test to see if the component loads
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
        <div>Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Impact Projects</h1>
        <p className="text-lg text-neutral-600 mt-2">
          Track and manage your impact projects with Victorian framework alignment
        </p>
      </div>

      {/* Simple Test Content */}
      <Card className="bg-white border-neutral-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-neutral-900">Projects Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            This is a simplified test version of the projects page to check if the basic component loads correctly.
          </p>
          <div className="mt-4">
            <Button variant="primary" size="md">
              Test Button
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card className="bg-white border-neutral-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Status</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-neutral-600">Component loaded successfully</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-neutral-600">Basic UI components working</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-neutral-600">API integration pending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
