import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb, 
  BarChart3, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface MLInsight {
  grant_recommendations: {
    model_trained: boolean;
    last_training?: string;
  };
  impact_analysis: {
    success: boolean;
    monthly_impact?: Array<{month: string; value: number}>;
    trend_direction?: string;
    impact_statistics?: {
      mean: number;
      median: number;
      std: number;
      total_projects: number;
    };
  };
  data_summary: {
    grants: number;
    projects: number;
    metrics: number;
    users: number;
    data_quality: string;
  };
  recommendations: string[];
}

interface GrantRecommendation {
  grant_id: number;
  grant_title: string;
  grant_amount: number;
  grant_deadline: string;
  match_probability: number;
  match_score: number;
}

interface ProjectSuccessPrediction {
  project_id: number;
  success_probability: number;
  completion_rate: number;
  impact_score: number;
  total_tasks: number;
  completed_tasks: number;
  total_impact: number;
  confidence_level: string;
}

const MLInsightsDashboard: React.FC = () => {
  const [insights, setInsights] = useState<MLInsight | null>(null);
  const [grantRecommendations, setGrantRecommendations] = useState<GrantRecommendation[]>([]);
  const [projectPredictions, setProjectPredictions] = useState<ProjectSuccessPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    fetchMLInsights();
  }, []);

  const fetchMLInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/ml-analytics/insights');
      const data = await response.json();
      
      if (data.status === 'success') {
        setInsights(data.data);
      }
    } catch (error) {
      console.error('Error fetching ML insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrantRecommendations = async (projectId: number) => {
    try {
      const response = await fetch(`/api/v1/ml-analytics/grant-recommendations/${projectId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setGrantRecommendations(data.data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching grant recommendations:', error);
    }
  };

  const trainModel = async () => {
    try {
      const response = await fetch('/api/v1/ml-analytics/train-grant-recommendation', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        // Refresh insights after training
        fetchMLInsights();
      }
    } catch (error) {
      console.error('Error training model:', error);
    }
  };

  const getTrendIcon = (direction: string) => {
    return direction === 'increasing' ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-red-500" />;
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Insights Dashboard</h2>
        <Button onClick={trainModel} className="bg-blue-600 hover:bg-blue-700">
          <Target className="w-4 h-4 mr-2" />
          Train Model
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Grant Recommendations</TabsTrigger>
          <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Success Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {insights?.data_summary.data_quality === 'good' ? 'Good' : 'Needs Improvement'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {insights?.data_summary.grants || 0} grants, {insights?.data_summary.projects || 0} projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Model Status</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {insights?.grant_recommendations.model_trained ? 'Trained' : 'Not Trained'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {insights?.grant_recommendations.last_training ? 
                    `Last trained: ${new Date(insights.grant_recommendations.last_training).toLocaleDateString()}` : 
                    'No training data'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impact Trend</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {insights?.impact_analysis.trend_direction && 
                    getTrendIcon(insights.impact_analysis.trend_direction)
                  }
                  <span className="text-2xl font-bold capitalize">
                    {insights?.impact_analysis.trend_direction || 'Unknown'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Average impact: {insights?.impact_analysis.impact_statistics?.mean?.toFixed(1) || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {insights?.recommendations?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active recommendations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>AI Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights?.recommendations?.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
                {(!insights?.recommendations || insights.recommendations.length === 0) && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">All systems are running optimally!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grant Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grantRecommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{rec.grant_title}</h3>
                      <Badge variant="secondary">
                        {Math.round(rec.match_probability * 100)}% Match
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="ml-2 font-medium">
                          ${rec.grant_amount?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="ml-2 font-medium">
                          {new Date(rec.grant_deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Progress value={rec.match_probability * 100} className="mt-2" />
                  </div>
                ))}
                {grantRecommendations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No grant recommendations available</p>
                    <p className="text-sm">Select a project to get personalized recommendations</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {insights?.impact_analysis.success ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {insights.impact_analysis.impact_statistics?.mean?.toFixed(1) || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Average Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {insights.impact_analysis.impact_statistics?.total_projects || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold capitalize">
                        {insights.impact_analysis.trend_direction || 'Unknown'}
                      </div>
                      <div className="text-sm text-muted-foreground">Trend Direction</div>
                    </div>
                  </div>
                  
                  {insights.impact_analysis.monthly_impact && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Monthly Impact Trends</h4>
                      <div className="space-y-2">
                        {insights.impact_analysis.monthly_impact.slice(-6).map((month, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{month.month}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={(month.value / 100) * 100} className="w-20" />
                              <span className="text-sm font-medium">{month.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No impact data available</p>
                  <p className="text-sm">Add more projects and metrics to see impact analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Success Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectPredictions.map((prediction, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Project {prediction.project_id}</h3>
                      <Badge 
                        variant={prediction.success_probability > 0.7 ? "default" : 
                                prediction.success_probability > 0.4 ? "secondary" : "destructive"}
                      >
                        {Math.round(prediction.success_probability * 100)}% Success
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Completion Rate:</span>
                        <span className="ml-2 font-medium">
                          {Math.round(prediction.completion_rate * 100)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impact Score:</span>
                        <span className="ml-2 font-medium">
                          {Math.round(prediction.impact_score * 100)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tasks:</span>
                        <span className="ml-2 font-medium">
                          {prediction.completed_tasks}/{prediction.total_tasks}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Impact:</span>
                        <span className="ml-2 font-medium">
                          {prediction.total_impact}
                        </span>
                      </div>
                    </div>
                    
                    <Progress value={prediction.success_probability * 100} className="mb-2" />
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Confidence: {prediction.confidence_level}</span>
                    </div>
                  </div>
                ))}
                
                {projectPredictions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No success predictions available</p>
                    <p className="text-sm">Add more projects to enable success predictions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MLInsightsDashboard; 