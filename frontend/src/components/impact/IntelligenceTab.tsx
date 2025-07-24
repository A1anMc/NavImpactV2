'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpIcon, 
  LightBulbIcon, 
  ChartBarIcon,
  SparklesIcon,
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  BookmarkIcon,
  ArrowDownIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

import { 
  impactIntelligenceService, 
  GrantPrediction, 
  IntelligenceDashboard,
  ModelTrainingResult,
  IntelligenceDashboardParams,
  GrantPredictionsParams
} from '@/services/impact-intelligence';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import GradientText from '@/components/ui/GradientText';

interface PredictionDetail {
  grant: GrantPrediction;
  reasons: string[];
  isExpanded: boolean;
}

export default function IntelligenceTab() {
  const queryClient = useQueryClient();
  const [training, setTraining] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionDetail | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | '1y'>('30d');
  const [autoRefresh, setAutoRefresh] = useState<number | null>(null);
  const [savedInsights, setSavedInsights] = useState<string[]>([]);

  const {
    data: predictions = [],
    isLoading: predictionsLoading,
    isRefetching: predictionsRefetching,
    refetch: refetchPredictions,
  } = useQuery({
    queryKey: ['grantPredictions', 10, timeframe],
    queryFn: () => impactIntelligenceService.getGrantPredictions(10, { timeframe }),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: intelligenceData,
    isLoading: dashboardLoading,
    isRefetching: dashboardRefetching,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ['intelligenceDashboard', timeframe],
    queryFn: () => impactIntelligenceService.getIntelligenceDashboard({ timeframe }),
    staleTime: 5 * 60 * 1000,
  });

  const loading = predictionsLoading || dashboardLoading;

  const refreshData = () => {
    refetchPredictions();
    refetchDashboard();
  };

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshData();
    }, autoRefresh);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshData]);

  const handleTrainModel = async () => {
    try {
      setTraining(true);
      const result = await impactIntelligenceService.trainModel();
      alert(`Model trained successfully! Accuracy: ${(result.accuracy * 100).toFixed(1)}%`);
      // Invalidate cached queries to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['grantPredictions'] });
      queryClient.invalidateQueries({ queryKey: ['intelligenceDashboard'] });
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
      timeframe,
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

  const handleExportCSV = () => {
    const csvData = predictions.map(prediction => ({
      'Grant ID': prediction.grant_id,
      'Grant Title': prediction.grant_title,
      'Funder': prediction.funder,
      'Amount': prediction.amount,
      'Success Probability': `${(prediction.success_probability * 100).toFixed(1)}%`,
      'Confidence Score': `${(prediction.confidence_score * 100).toFixed(1)}%`,
      'Recommendation': prediction.recommendation,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grant-predictions-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('intelligence-dashboard');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgWidth = 297; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`intelligence-dashboard-${timeframe}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
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
    <div id="intelligence-dashboard" className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <GradientText className="text-2xl font-bold flex items-center gap-2" gradient="purple">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            AI Intelligence Dashboard
          </GradientText>
          <p className="text-gray-600 mt-1">
            Machine learning insights and predictions for optimal grant success
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Last sync • {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={refreshData}
            variant="outline"
            disabled={predictionsRefetching || dashboardRefetching}
            className="flex items-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            {predictionsRefetching || dashboardRefetching ? 'Refreshing…' : 'Refresh'}
          </Button>
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
          <Button 
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowDownIcon className="h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            onClick={handleExportPDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowDownIcon className="h-4 w-4" />
            Export PDF
          </Button>
          <Button
            onClick={() => setAutoRefresh(autoRefresh ? null : 30000)} // 30 seconds
            variant={autoRefresh ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            {autoRefresh ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh'}
          </Button>
        </div>
      </div>

      {/* Intelligence Metrics */}
      {intelligenceData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High-Probability Grants</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {intelligenceData.intelligence_metrics.high_probability_grants}
                </div>
                <p className="text-xs text-muted-foreground">
                  &gt;70% success probability
                </p>
              </CardContent>
            </Card>
          </motion.div>
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
          <div className="space-y-4">
            {/* Timeframe Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Timeframe</label>
              <div className="flex gap-2">
                {[
                  { key: '30d', label: '30 Days' },
                  { key: '90d', label: '90 Days' },
                  { key: '1y', label: '1 Year' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={timeframe === key ? "default" : "outline"}
                    onClick={() => setTimeframe(key as '30d' | '90d' | '1y')}
                    size="sm"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Recommendation Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Recommendation</label>
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
                    size="sm"
                  >
                    {label}
                    <Badge variant="default" className="ml-1">
                      {count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations with Drill-Down */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LightBulbIcon className="h-5 w-5 text-yellow-600" />
            AI Grant Recommendations
            <Badge variant="info" className="ml-2">
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
                      <Badge variant="info">${prediction.amount?.toLocaleString()}</Badge>
                      <Badge variant="info" className="flex items-center gap-1">
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