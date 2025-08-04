'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  LightBulbIcon,
  ClockIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { aiGrantsApi, AIGrant, AIGrantStatus, AIGrantInsights } from '@/services/ai-grants';

export default function AIGrantsTestPage() {
  const [grants, setGrants] = useState<AIGrant[]>([]);
  const [status, setStatus] = useState<AIGrantStatus | null>(null);
  const [insights, setInsights] = useState<AIGrantInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAIData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all AI data concurrently
      const [grantsData, statusData, insightsData] = await Promise.all([
        aiGrantsApi.discoverGrants(),
        aiGrantsApi.getStatus(),
        aiGrantsApi.getInsights()
      ]);
      
      setGrants(grantsData);
      setStatus(statusData);
      setInsights(insightsData);
      
      console.log('🤖 AI Bot Data Loaded:', {
        grants: grantsData.length,
        status: statusData.status,
        insights: insightsData.total_opportunities
      });
      
    } catch (err) {
      setError('Failed to load AI bot data');
      console.error('AI Bot Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testAIBot = async () => {
    try {
      const testResult = await aiGrantsApi.testBot();
      console.log('🧪 AI Bot Test Result:', testResult);
      alert('AI Bot test completed! Check console for details.');
    } catch (err) {
      console.error('AI Bot Test Error:', err);
      alert('AI Bot test failed! Check console for details.');
    }
  };

  const refreshDiscovery = async () => {
    try {
      const result = await aiGrantsApi.refreshDiscovery();
      console.log('🔄 Discovery Refresh Result:', result);
      alert('Discovery refresh started! Check console for details.');
    } catch (err) {
      console.error('Discovery Refresh Error:', err);
      alert('Discovery refresh failed! Check console for details.');
    }
  };

  useEffect(() => {
    loadAIData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'running': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sge-black via-sge-black to-sge-forest/20 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-sge-tawny">
            🤖 AI Grant Discovery Bot Test
          </h1>
          <p className="text-lg text-gray-300">
            Testing real-time grant discovery using AI-powered bots without API keys
          </p>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-sge-tawny">
                <SparklesIcon className="w-5 h-5 mr-2" />
                AI Bot Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {status ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(status.status)}>
                      {status.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sources:</span>
                    <span>{status.sources_monitored}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quality:</span>
                    <span>{status.data_quality}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Loading status...</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-sge-tawny">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Opportunities:</span>
                    <span>{insights.total_opportunities}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Categories:</span>
                    <span>{insights.top_categories.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Recommendations:</span>
                    <span>{insights.ai_recommendations.length}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Loading insights...</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-sge-tawny">
                <LightBulbIcon className="w-5 h-5 mr-2" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={loadAIData} 
                disabled={loading}
                className="w-full bg-sge-forest hover:bg-sge-forest/80"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                    Refresh Data
                  </>
                )}
              </Button>
              
              <Button 
                onClick={testAIBot}
                variant="outline" 
                className="w-full border-sge-tawny text-sge-tawny hover:bg-sge-tawny hover:text-white"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Test AI Bot
              </Button>
              
              <Button 
                onClick={refreshDiscovery}
                variant="outline" 
                className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh Discovery
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-500/20 backdrop-blur-sm border-red-500/30 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-400">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Grant Results */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-sge-tawny">
            🎯 Discovered Grants ({grants.length})
          </h2>
          
          {grants.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="pt-6">
                <p className="text-gray-400 text-center">
                  {loading ? 'Loading grants...' : 'No grants discovered yet. Try refreshing the data.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {grants.map((grant) => (
                <Card key={grant.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:border-sge-tawny/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-white">{grant.title}</CardTitle>
                      <Badge className="bg-sge-forest">
                        {Math.round(grant.success_probability * 100)}% Match
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{grant.source}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{grant.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {grant.amount && (
                        <div>
                          <span className="text-gray-400">Amount:</span>
                          <p className="text-sge-tawny font-semibold">{grant.amount}</p>
                        </div>
                      )}
                      {grant.deadline && (
                        <div>
                          <span className="text-gray-400">Deadline:</span>
                          <p className="text-white">{grant.deadline}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Category:</span>
                        <Badge variant="outline" className="text-xs">
                          {grant.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Urgency:</span>
                        <Badge className={`text-xs ${getUrgencyColor(grant.ai_insights.urgency_level)}`}>
                          {grant.ai_insights.urgency_level}
                        </Badge>
                      </div>
                    </div>
                    
                    {grant.ai_insights.recommended_actions.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm mb-2">AI Recommendations:</p>
                        <ul className="space-y-1">
                          {grant.ai_insights.recommended_actions.slice(0, 2).map((action, index) => (
                            <li key={index} className="text-xs text-gray-300 flex items-center">
                              <CheckCircleIcon className="w-3 h-3 mr-1 text-green-400" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-sge-tawny text-sge-tawny hover:bg-sge-tawny hover:text-white"
                        onClick={() => window.open(grant.url, '_blank')}
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <span className="text-xs text-gray-500">
                        Discovered {new Date(grant.discovered_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* AI Features Display */}
        {status && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-sge-tawny">
              🧠 AI Bot Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {status.ai_features.map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <StarIcon className="w-5 h-5 mr-2 text-sge-tawny" />
                      <span className="text-white">{feature}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 