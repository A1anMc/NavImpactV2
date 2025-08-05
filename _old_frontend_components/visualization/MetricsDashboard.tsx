'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricData {
  label: string;
  value: number;
  target: number;
  color: string;
  icon: string;
  trend: 'up' | 'down' | 'stable';
}

const MetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      label: 'Customer Satisfaction',
      value: 94,
      target: 90,
      color: 'from-green-500 to-emerald-600',
      icon: '😊',
      trend: 'up'
    },
    {
      label: 'Impact Score',
      value: 87,
      target: 85,
      color: 'from-blue-500 to-indigo-600',
      icon: '📊',
      trend: 'up'
    },
    {
      label: 'Funding Success',
      value: 92,
      target: 80,
      color: 'from-yellow-500 to-orange-600',
      icon: '💰',
      trend: 'up'
    },
    {
      label: 'Stakeholder Engagement',
      value: 89,
      target: 85,
      color: 'from-purple-500 to-pink-600',
      icon: '🤝',
      trend: 'stable'
    },
    {
      label: 'Innovation Index',
      value: 76,
      target: 75,
      color: 'from-teal-500 to-cyan-600',
      icon: '💡',
      trend: 'up'
    },
    {
      label: 'Compliance Rate',
      value: 98,
      target: 95,
      color: 'from-red-500 to-rose-600',
      icon: '🛡️',
      trend: 'up'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(metric.target - 5, Math.min(100, metric.value + (Math.random() - 0.5) * 2))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Real-Time Performance Metrics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className={`bg-gradient-to-r ${metric.color} text-white rounded-t-xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{metric.icon}</span>
                  <CardTitle className="text-lg font-semibold">
                    {metric.label}
                  </CardTitle>
                </div>
                <span className={`text-lg font-bold ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Current Value */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {Math.round(metric.value)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Target: {metric.target}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Current</span>
                    <span>Target</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${metric.color} h-3 rounded-full transition-all duration-1000 relative`}
                      style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                    </div>
                    <div 
                      className="absolute top-0 h-3 w-0.5 bg-gray-400"
                      style={{ left: `${metric.target}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                  } animate-pulse`}></div>
                  <span className={`text-xs font-medium ${
                    metric.value >= metric.target ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {metric.value >= metric.target ? 'On Target' : 'Below Target'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {metrics.filter(m => m.value >= m.target).length}/{metrics.length}
            </div>
            <div className="text-sm text-gray-600">Metrics On Target</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length)}%
            </div>
            <div className="text-sm text-gray-600">Average Performance</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {metrics.filter(m => m.trend === 'up').length}
            </div>
            <div className="text-sm text-gray-600">Improving Metrics</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {Math.round(metrics.reduce((acc, m) => acc + (m.value / m.target), 0) / metrics.length * 100)}%
            </div>
            <div className="text-sm text-gray-600">Target Achievement</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricsDashboard; 