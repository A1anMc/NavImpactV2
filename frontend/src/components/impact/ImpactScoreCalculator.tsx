'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { impactService } from '@/services/impact';
import { ImpactMetrics, ImpactScore } from '@/types/impact';

interface ImpactScoreCalculatorProps {
  onScoreCalculated?: (score: ImpactScore) => void;
  initialMetrics?: Partial<ImpactMetrics>;
}

export const ImpactScoreCalculator: React.FC<ImpactScoreCalculatorProps> = ({
  onScoreCalculated,
  initialMetrics
}) => {
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    reach_count: initialMetrics?.reach_count || 0,
    outcome_count: initialMetrics?.outcome_count || 0,
    sustainability_score: initialMetrics?.sustainability_score || 50,
    innovation_score: initialMetrics?.innovation_score || 50,
    evidence_quality: initialMetrics?.evidence_quality || 50,
    stakeholder_satisfaction: initialMetrics?.stakeholder_satisfaction || 50,
    cost_effectiveness: initialMetrics?.cost_effectiveness || 0.5,
    scalability_potential: initialMetrics?.scalability_potential || 50,
  });

  const [calculatedScore, setCalculatedScore] = useState<ImpactScore | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleMetricChange = (key: keyof ImpactMetrics, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const calculateScore = () => {
    const score = impactService.calculateImpactScore(metrics);
    setCalculatedScore(score);
    setShowResults(true);
    onScoreCalculated?.(score);
  };

  const resetCalculator = () => {
    setMetrics({
      reach_count: 0,
      outcome_count: 0,
      sustainability_score: 50,
      innovation_score: 50,
      evidence_quality: 50,
      stakeholder_satisfaction: 50,
      cost_effectiveness: 0.5,
      scalability_potential: 50,
    });
    setCalculatedScore(null);
    setShowResults(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'High Impact';
    if (score >= 60) return 'Medium Impact';
    return 'Low Impact';
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Impact Metrics Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reach Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                People/Communities Reached
              </label>
              <input
                type="number"
                value={metrics.reach_count}
                onChange={(e) => handleMetricChange('reach_count', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter number of people reached"
              />
            </div>

            {/* Outcome Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Measurable Outcomes
              </label>
              <input
                type="number"
                value={metrics.outcome_count}
                onChange={(e) => handleMetricChange('outcome_count', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Number of outcomes achieved"
              />
            </div>

            {/* Sustainability Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sustainability Score (0-100)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={metrics.sustainability_score}
                onChange={(e) => handleMetricChange('sustainability_score', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{metrics.sustainability_score}</span>
                <span>100</span>
              </div>
            </div>

            {/* Innovation Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Innovation Score (0-100)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={metrics.innovation_score}
                onChange={(e) => handleMetricChange('innovation_score', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{metrics.innovation_score}</span>
                <span>100</span>
              </div>
            </div>

            {/* Evidence Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence Quality (0-100)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={metrics.evidence_quality}
                onChange={(e) => handleMetricChange('evidence_quality', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{metrics.evidence_quality}</span>
                <span>100</span>
              </div>
            </div>

            {/* Stakeholder Satisfaction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stakeholder Satisfaction (0-100)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={metrics.stakeholder_satisfaction}
                onChange={(e) => handleMetricChange('stakeholder_satisfaction', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{metrics.stakeholder_satisfaction}</span>
                <span>100</span>
              </div>
            </div>

            {/* Cost Effectiveness */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Effectiveness (0-1)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={metrics.cost_effectiveness}
                onChange={(e) => handleMetricChange('cost_effectiveness', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{metrics.cost_effectiveness.toFixed(1)}</span>
                <span>1</span>
              </div>
            </div>

            {/* Scalability Potential */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scalability Potential (0-100)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={metrics.scalability_potential}
                onChange={(e) => handleMetricChange('scalability_potential', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{metrics.scalability_potential}</span>
                <span>100</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={calculateScore} className="bg-green-600 hover:bg-green-700 text-white">
              Calculate Impact Score
            </Button>
            <Button onClick={resetCalculator} variant="outline" className="text-gray-600 border-gray-300">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && calculatedScore && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Impact Score Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(calculatedScore.weighted_score)} mb-2`}>
                {Math.round(calculatedScore.weighted_score)}
              </div>
              <div className="text-lg text-gray-600 mb-1">
                {getScoreLabel(calculatedScore.weighted_score)}
              </div>
              <div className="text-sm text-gray-500">
                Weighted Impact Score (0-100)
              </div>
            </div>

            {/* Score Breakdown */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Score Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(calculatedScore.breakdown).map(([metric, score]) => (
                  <div key={metric} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm text-gray-700 capitalize">
                      {metric.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{Math.round(score)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weight Factors */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Weight Factors</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(calculatedScore.factors).map(([factor, weight]) => (
                  <div key={factor} className="text-center p-2 border border-gray-200 rounded">
                    <div className="text-sm text-gray-600 capitalize">
                      {factor.replace(/_/g, ' ').replace(' weight', '')}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {(weight * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Recommendations</h4>
              <div className="space-y-2">
                {calculatedScore.breakdown.evidence < 70 && (
                  <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-yellow-800">Improve Evidence Quality</div>
                      <div className="text-sm text-yellow-700">Collect more robust evidence to support impact claims</div>
                    </div>
                  </div>
                )}
                {calculatedScore.breakdown.stakeholder_satisfaction < 70 && (
                  <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-yellow-800">Enhance Stakeholder Engagement</div>
                      <div className="text-sm text-yellow-700">Improve stakeholder satisfaction through better communication</div>
                    </div>
                  </div>
                )}
                {calculatedScore.weighted_score >= 80 && (
                  <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-green-800">Excellent Impact Score</div>
                      <div className="text-sm text-green-700">This project demonstrates high impact potential</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 