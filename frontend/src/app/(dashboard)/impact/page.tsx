'use client';

import React, { useState } from 'react';
import { ImpactDashboard } from '@/components/impact/ImpactDashboard';
import { ImpactScoreCalculator } from '@/components/impact/ImpactScoreCalculator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ImpactPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'calculator'>('dashboard');
  const [calculatedScore, setCalculatedScore] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Analytics</h1>
            <p className="text-gray-600">Track and measure your organisation's social impact across all projects</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setActiveView('dashboard')}
              className={
                activeView === 'dashboard'
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                  : 'text-gray-600 border-gray-300'
              }
            >
              Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveView('calculator')}
              className={
                activeView === 'calculator'
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                  : 'text-gray-600 border-gray-300'
              }
            >
              Score Calculator
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeView === 'dashboard' ? (
          <ImpactDashboard isPortfolio={true} />
        ) : (
          <div className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Impact Score Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Use this calculator to estimate the impact score for your projects. Adjust the metrics below to see how they affect your overall impact score.
                </p>
                <ImpactScoreCalculator onScoreCalculated={setCalculatedScore} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 