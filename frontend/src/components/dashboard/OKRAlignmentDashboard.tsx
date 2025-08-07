import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart3,
  Users,
  Lightbulb,
  Shield
} from 'lucide-react';

interface OKRAlignmentData {
  portfolio_alignment: {
    overall_portfolio_score: number;
    total_projects: number;
    okr_categories: {
      impact_measurement: { projects: number; avg_score: number };
      efficiency_improvement: { projects: number; avg_score: number };
      innovation: { projects: number; avg_score: number };
      sustainability: { projects: number; avg_score: number };
    };
    top_aligned_projects: Array<{
      project_id: number;
      project_name: string;
      alignment_score: number;
    }>;
    needs_attention_projects: Array<{
      project_id: number;
      project_name: string;
      alignment_score: number;
    }>;
  };
  insights: {
    portfolio_score: number;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  };
  alignment_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  total_projects: number;
  last_updated: string;
}

interface ProjectAlignmentData {
  project_id: number;
  project_name: string;
  okr_alignment: {
    impact_measurement: { score: number; description: string };
    efficiency_improvement: { score: number; description: string };
    innovation: { score: number; description: string };
    sustainability: { score: number; description: string };
  };
  overall_alignment_score: number;
  recommendations: string[];
}

const OKRAlignmentDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<OKRAlignmentData | null>(null);
  const [projectAlignments, setProjectAlignments] = useState<ProjectAlignmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    fetchOKRDashboardData();
  }, []);

  const fetchOKRDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/okr-alignment/dashboard');
      const data = await response.json();
      
      if (data.status === 'success') {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching OKR dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectAlignment = async (projectId: number) => {
    try {
      const response = await fetch(`/api/v1/okr-alignment/project-alignment/${projectId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Error fetching project alignment:', error);
    }
    return null;
  };

  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = (score: number) => {
    if (score >= 80) return <Badge variant="default">Excellent</Badge>;
    if (score >= 60) return <Badge variant="secondary">Good</Badge>;
    return <Badge variant="destructive">Needs Improvement</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No OKR alignment data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">OKR Alignment Dashboard</h2>
        <Button onClick={fetchOKRDashboardData} variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Analysis</TabsTrigger>
          <TabsTrigger value="projects">Project Alignment</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(dashboardData.portfolio_alignment.overall_portfolio_score)}`}>
                  {dashboardData.portfolio_alignment.overall_portfolio_score.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall OKR alignment
                </p>
                {getStatusBadge(dashboardData.portfolio_alignment.overall_portfolio_score)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.total_projects}
                </div>
                <p className="text-xs text-muted-foreground">
                  Projects analyzed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Aligned</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {dashboardData.portfolio_alignment.top_aligned_projects.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  High alignment projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {dashboardData.portfolio_alignment.needs_attention_projects.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Low alignment projects
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alignment Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Alignment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {dashboardData.alignment_distribution.high}
                  </div>
                  <div className="text-sm text-muted-foreground">High (80-100%)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {dashboardData.alignment_distribution.medium}
                  </div>
                  <div className="text-sm text-muted-foreground">Medium (60-79%)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {dashboardData.alignment_distribution.low}
                  </div>
                  <div className="text-sm text-muted-foreground">Low (0-59%)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OKR Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(dashboardData.portfolio_alignment.okr_categories).map(([category, data]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {category.replace('_', ' ')}
                      </span>
                      <span className={`font-bold ${getStatusColor(data.avg_score)}`}>
                        {data.avg_score.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={data.avg_score} className="w-full" />
                    <div className="text-sm text-muted-foreground">
                      {data.projects} projects contributing
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Aligned Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Top Aligned Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.portfolio_alignment.top_aligned_projects.map((project) => (
                  <div key={project.project_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{project.project_name}</div>
                      <div className="text-sm text-muted-foreground">Project ID: {project.project_id}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${getStatusColor(project.alignment_score)}`}>
                        {project.alignment_score.toFixed(1)}%
                      </span>
                      {getStatusIcon(project.alignment_score)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Alignment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.portfolio_alignment.needs_attention_projects.map((project) => (
                  <div key={project.project_id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{project.project_name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${getStatusColor(project.alignment_score)}`}>
                          {project.alignment_score.toFixed(1)}%
                        </span>
                        {getStatusIcon(project.alignment_score)}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedProject(project.project_id)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.insights.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span>Areas for Improvement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboardData.insights.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <span className="text-sm">{weakness}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <span>Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.insights.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OKRAlignmentDashboard; 