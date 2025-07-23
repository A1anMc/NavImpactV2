'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpIcon, 
  LightBulbIcon, 
  ChartBarIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  BookmarkIcon,
  ArrowDownIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

import { 
  impactIntelligenceService, 
  GrantPrediction, 
  IntelligenceDashboard,
  ModelTrainingResult
} from '@/services/impact-intelligence';

interface PredictionDetail {
  grant: GrantPrediction;
  reasons: string[];
  isExpanded: boolean;
}

export default function IntelligenceTab() {
  const [predictions, setPredictions] = useState<GrantPrediction[]>([]);
  const [intelligenceData, setIntelligenceData] = useState<IntelligenceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionDetail | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [savedInsights, setSavedInsights] = useState<string[]>([]);

  useEffect(() => {
    loadIntelligenceData();
  }, []);

  const loadIntelligenceData = async () => {
    try {
      setLoading(true);
      const [predictionsData, dashboardData] = await Promise.all([
        impactIntelligenceService.getGrantPredictions(10),
        impactIntelligenceService.getIntelligenceDashboard()
      ]);
      
      setPredictions(predictionsData);
      setIntelligenceData(dashboardData);
    } catch (error) {
      console.error('Error loading intelligence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainModel = async () => {
    try {
      setTraining(true);
      const result = await impactIntelligenceService.trainModel();
      alert(`Model trained successfully! Accuracy: ${(result.accuracy * 100).toFixed(1)}%`);
      loadIntelligenceData(); // Reload data
    } catch (error) {
      alert('Error training model. Please try again.');
    } finally {
      setTraining(false);
    }
  };

  const handlePredictionClick = async (prediction: GrantPrediction) => {
    try {
      const reasons = await impactIntelligenceService.getSuccessReasons(prediction.grant_id);
      setSelectedPrediction({
        grant: prediction,
        reasons,
        isExpanded: true
      });
    } catch (error) {
      console.error('Error loading prediction details:', error);
    }
  };

  const handleSaveInsight = (insight: string) => {
    if (!savedInsights.includes(insight)) {
      setSavedInsights([...savedInsights, insight]);
    }
  };

  const handleSaveReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      filter,
      predictions: predictions.length,
      insights: intelligenceData?.insights || [],
      savedInsights
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intelligence-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability > 0.7) return 'text-green-600';
    if (probability > 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredPredictions = predictions.filter(prediction => {
    if (filter === 'all') return true;
    if (filter === 'high') return prediction.recommendation === 'High';
    if (filter === 'medium') return prediction.recommendation === 'Medium';
    if (filter === 'low') return prediction.recommendation === 'Low';
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            AI Intelligence Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Machine learning insights and predictions for optimal grant success
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleTrainModel} 
            disabled={training}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {training ? 'Training...' : 'Train Model'}
          </Button>
          <Button 
            onClick={handleSaveReport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowDownIcon className="h-4 w-4" />
            Save Report
          </Button>
        </div>
      </div>

      {/* Intelligence Metrics */}
      {intelligenceData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(intelligenceData.intelligence_metrics.model_accuracy * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Success prediction accuracy
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Success Probability</CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {(intelligenceData.intelligence_metrics.average_success_probability * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Across all grants
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High-Probability Grants</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {intelligenceData.intelligence_metrics.high_probability_grants}
              </div>
              <p className="text-xs text-muted-foreground">
                >70% success probability
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-blue-600" />
            Filter Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All', count: predictions.length },
              { key: 'high', label: 'High', count: predictions.filter(p => p.recommendation === 'High').length },
              { key: 'medium', label: 'Medium', count: predictions.filter(p => p.recommendation === 'Medium').length },
              { key: 'low', label: 'Low', count: predictions.filter(p => p.recommendation === 'Low').length }
            ].map(({ key, label, count }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                onClick={() => setFilter(key as any)}
                className="flex items-center gap-2"
              >
                {label}
                <Badge variant="secondary" className="ml-1">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations with Drill-Down */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LightBulbIcon className="h-5 w-5 text-yellow-600" />
            AI Grant Recommendations
            <Badge variant="outline" className="ml-2">
              {filteredPredictions.length} grants
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPredictions.map((prediction) => (
              <div 
                key={prediction.grant_id} 
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedPrediction?.grant.grant_id === prediction.grant_id 
                    ? 'ring-2 ring-purple-500 bg-purple-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handlePredictionClick(prediction)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{prediction.grant_title}</h4>
                      <Badge className={getRecommendationColor(prediction.recommendation)}>
                        {prediction.recommendation} Probability
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{prediction.funder}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">${prediction.amount?.toLocaleString()}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        Confidence: {(prediction.confidence_score * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getProbabilityColor(prediction.success_probability)}`}>
                      {(prediction.success_probability * 100).toFixed(0)}%
                    </div>
                    <p className="text-xs text-gray-500">Success Probability</p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Drill-Down Details */}
                {selectedPrediction?.grant.grant_id === prediction.grant_id && selectedPrediction.isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                      <h5 className="font-medium text-gray-900">Why this grant has a {Math.round(prediction.success_probability * 100)}% success probability:</h5>
                    </div>
                    <div className="space-y-2">
                      {selectedPrediction.reasons.map((reason, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                          <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{reason}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveInsight(reason);
                            }}
                            className="ml-auto"
                          >
                            <BookmarkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI-Generated Insights */}
      {intelligenceData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-purple-600" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {intelligenceData.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <LightBulbIcon className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 flex-1">{insight}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSaveInsight(insight)}
                    className="flex-shrink-0"
                  >
                    <BookmarkIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Insights */}
      {savedInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookmarkIcon className="h-5 w-5 text-yellow-600" />
              Saved Insights ({savedInsights.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedInsights.map((insight, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                  <BookmarkIcon className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-gray-700 flex-1">{insight}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSavedInsights(savedInsights.filter((_, i) => i !== index))}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 