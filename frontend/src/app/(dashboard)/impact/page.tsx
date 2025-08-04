'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ChartBarIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  UsersIcon,
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface MissionGoal {
  id: string;
  title: string;
  description: string;
  category: 'social_impact' | 'environmental' | 'economic' | 'cultural' | 'innovation';
  target_date: string;
  current_progress: number;
  target_value: number;
  current_value: number;
  unit: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
  kpis: KPIMetric[];
  last_updated: string;
}

interface KPIMetric {
  id: string;
  name: string;
  current_value: number;
  target_value: number;
  unit: string;
  weight: number; // 0-1, how much this KPI contributes to the goal
}

interface ImpactStory {
  id: string;
  title: string;
  description: string;
  related_goal: string;
  date: string;
  impact_score: number;
  evidence: string;
}

// Sample data - in real app this would come from API
const sampleGoals: MissionGoal[] = [
  {
    id: '1',
    title: 'Increase Social Media Reach by 400%',
    description: 'Expand our digital presence to reach more audiences and amplify our impact stories',
    category: 'social_impact',
    target_date: '2025-04-27',
    current_progress: 30.9,
    target_value: 33160,
    current_value: 10850,
    unit: 'followers',
    status: 'on_track',
    kpis: [
      { id: '1-1', name: 'Instagram Followers', current_value: 1800, target_value: 5000, unit: 'followers', weight: 0.3 },
      { id: '1-2', name: 'YouTube Subscribers', current_value: 4200, target_value: 12000, unit: 'subscribers', weight: 0.4 },
      { id: '1-3', name: 'LinkedIn Connections', current_value: 1200, target_value: 3000, unit: 'connections', weight: 0.2 },
      { id: '1-4', name: 'Engagement Rate', current_value: 8.5, target_value: 12, unit: '%', weight: 0.1 },
    ],
    last_updated: '2025-01-27',
  },
  {
    id: '2',
    title: 'Complete 3 Impact Documentaries',
    description: 'Produce and distribute three documentaries that drive social change and awareness',
    category: 'cultural',
    target_date: '2025-12-31',
    current_progress: 66.7,
    target_value: 3,
    current_value: 2,
    unit: 'documentaries',
    status: 'on_track',
    kpis: [
      { id: '2-1', name: 'Documentaries Completed', current_value: 2, target_value: 3, unit: 'films', weight: 0.6 },
      { id: '2-2', name: 'Audience Reach', current_value: 250000, target_value: 500000, unit: 'viewers', weight: 0.3 },
      { id: '2-3', name: 'Social Impact Score', current_value: 85, target_value: 90, unit: 'points', weight: 0.1 },
    ],
    last_updated: '2025-01-25',
  },
  {
    id: '3',
    title: 'Achieve Carbon Neutral Operations',
    description: 'Reduce our environmental footprint and achieve carbon neutrality across all operations',
    category: 'environmental',
    target_date: '2025-06-30',
    current_progress: 45.2,
    target_value: 0,
    current_value: -45.2,
    unit: 'tons CO2',
    status: 'at_risk',
    kpis: [
      { id: '3-1', name: 'Carbon Footprint', current_value: 54.8, target_value: 0, unit: 'tons CO2', weight: 0.5 },
      { id: '3-2', name: 'Renewable Energy Usage', current_value: 65, target_value: 100, unit: '%', weight: 0.3 },
      { id: '3-3', name: 'Waste Reduction', current_value: 75, target_value: 90, unit: '%', weight: 0.2 },
    ],
    last_updated: '2025-01-20',
  },
];

const sampleImpactStories: ImpactStory[] = [
  {
    id: '1',
    title: 'Forging Friendships Season 2 Success',
    description: 'Our documentary series reached 200,000 viewers and sparked community discussions about friendship and mental health',
    related_goal: '2',
    date: '2025-01-15',
    impact_score: 85,
    evidence: 'Viewer surveys showed 78% reported increased awareness of mental health issues',
  },
  {
    id: '2',
    title: 'Social Media Campaign Impact',
    description: 'Instagram campaign on environmental awareness gained 500 new followers and 200+ shares',
    related_goal: '1',
    date: '2025-01-20',
    impact_score: 72,
    evidence: 'Engagement rate increased from 6.2% to 8.5% over the campaign period',
  },
];

export default function ImpactPage() {
  const [goals, setGoals] = useState<MissionGoal[]>(sampleGoals);
  const [impactStories, setImpactStories] = useState<ImpactStory[]>(sampleImpactStories);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddStory, setShowAddStory] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<MissionGoal | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-green-600 bg-green-50 border-green-200';
      case 'at_risk': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'behind': return 'text-red-600 bg-red-50 border-red-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social_impact': return <UsersIcon className="h-5 w-5" />;
      case 'environmental': return <GlobeAltIcon className="h-5 w-5" />;
      case 'economic': return <ArrowTrendingUpIcon className="h-5 w-5" />;
      case 'cultural': return <LightBulbIcon className="h-5 w-5" />;
      case 'innovation': return <TagIcon className="h-5 w-5" />;
      default: return <TagIcon className="h-5 w-5" />;
    }
  };

  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => sum + goal.current_progress, 0);
    return totalProgress / goals.length;
  };

  const getGoalsByStatus = (status: string) => {
    return goals.filter(goal => goal.status === status);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Mission Alignment Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Mission Alignment Dashboard</CardTitle>
              <p className="text-blue-100 mt-2">
                Track progress against your organisational goals and measure real impact
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{calculateOverallProgress().toFixed(1)}%</div>
              <div className="text-blue-100 text-sm">Overall Progress</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{goals.length}</div>
              <div className="text-sm text-gray-600">Active Goals</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getGoalsByStatus('on_track').length}
              </div>
              <div className="text-sm text-gray-600">On Track</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {getGoalsByStatus('at_risk').length}
              </div>
              <div className="text-sm text-gray-600">At Risk</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{impactStories.length}</div>
              <div className="text-sm text-gray-600">Impact Stories</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TagIcon className="h-5 w-5" />
              <span>Mission Goals</span>
            </CardTitle>
            <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Goal</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Mission Goal</DialogTitle>
                </DialogHeader>
                <AddGoalForm onClose={() => setShowAddGoal(false)} onAdd={(goal) => {
                  setGoals([...goals, goal]);
                  setShowAddGoal(false);
                }} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getCategoryIcon(goal.category)}
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{goal.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Progress:</span>
                        <div className="font-semibold">{goal.current_progress.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Current:</span>
                        <div className="font-semibold">{goal.current_value.toLocaleString()} {goal.unit}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Target:</span>
                        <div className="font-semibold">{goal.target_value.toLocaleString()} {goal.unit}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Due:</span>
                        <div className="font-semibold">{new Date(goal.target_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedGoal(goal)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={goal.current_progress} className="w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Impact Stories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <LightBulbIcon className="h-5 w-5" />
              <span>Recent Impact Stories</span>
            </CardTitle>
            <Dialog open={showAddStory} onOpenChange={setShowAddStory}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Story
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Impact Story</DialogTitle>
                </DialogHeader>
                <AddImpactStoryForm onClose={() => setShowAddStory(false)} onAdd={(story) => {
                  setImpactStories([...impactStories, story]);
                  setShowAddStory(false);
                }} goals={goals} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impactStories.slice(0, 3).map((story) => (
              <div key={story.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{story.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{story.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-500">Impact Score: {story.impact_score}/100</span>
                      <span className="text-gray-500">{new Date(story.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {goals.find(g => g.id === story.related_goal)?.title || 'Unknown Goal'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGoalDetail = (goal: MissionGoal) => (
    <div className="space-y-6">
      {/* Goal Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {getCategoryIcon(goal.category)}
                <CardTitle className="text-2xl font-bold">{goal.title}</CardTitle>
                <Badge className={getStatusColor(goal.status)}>
                  {goal.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-gray-600">{goal.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{goal.current_progress.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Progress</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {goal.current_value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Current {goal.unit}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {goal.target_value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Target {goal.unit}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {new Date(goal.target_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">Due Date</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Target</span>
              <span>{goal.current_progress.toFixed(1)}%</span>
            </div>
            <Progress value={goal.current_progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* KPI Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5" />
            <span>KPI Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goal.kpis.map((kpi) => {
              const progress = (kpi.current_value / kpi.target_value) * 100;
              return (
                <div key={kpi.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{kpi.name}</h4>
                      <p className="text-sm text-gray-600">
                        {kpi.current_value.toLocaleString()} / {kpi.target_value.toLocaleString()} {kpi.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{progress.toFixed(1)}%</div>
                      <div className="text-sm text-gray-500">Weight: {(kpi.weight * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Related Impact Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LightBulbIcon className="h-5 w-5" />
            <span>Related Impact Stories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impactStories
              .filter(story => story.related_goal === goal.id)
              .map((story) => (
                <div key={story.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{story.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{story.description}</p>
                      <p className="text-sm text-gray-500">{story.evidence}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{story.impact_score}</div>
                      <div className="text-sm text-gray-500">Impact Score</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Impact Dashboard</h1>
            <p className="text-gray-600">Track mission alignment and measure real impact</p>
          </div>
          {selectedGoal && (
            <Button
              variant="outline"
              onClick={() => setSelectedGoal(null)}
              className="flex items-center space-x-2"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Back to Overview</span>
            </Button>
          )}
        </div>
      </header>

      {!selectedGoal && (
        <div className="mb-6 flex space-x-4 border-b border-gray-200">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'analytics'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'stories'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('stories')}
          >
            Impact Stories
          </button>
        </div>
      )}

      <main className="flex-1">
        {selectedGoal ? (
          renderGoalDetail(selectedGoal)
        ) : (
          renderOverview()
        )}
      </main>
    </div>
  );
}

// Form components for adding goals and stories
function AddGoalForm({ onClose, onAdd }: { onClose: () => void; onAdd: (goal: MissionGoal) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'social_impact' as MissionGoal['category'],
    target_date: '',
    target_value: 0,
    unit: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: MissionGoal = {
      id: Date.now().toString(),
      ...formData,
      current_progress: 0,
      current_value: 0,
      status: 'on_track',
      kpis: [],
      last_updated: new Date().toISOString(),
    };
    onAdd(newGoal);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Goal Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as MissionGoal['category'] })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="social_impact">Social Impact</SelectItem>
            <SelectItem value="environmental">Environmental</SelectItem>
            <SelectItem value="economic">Economic</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="innovation">Innovation</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="target_date">Target Date</Label>
          <Input
            id="target_date"
            type="date"
            value={formData.target_date}
            onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="target_value">Target Value</Label>
          <Input
            id="target_value"
            type="number"
            value={formData.target_value}
            onChange={(e) => setFormData({ ...formData, target_value: Number(e.target.value) })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="unit">Unit</Label>
        <Input
          id="unit"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          placeholder="e.g., followers, viewers, tons CO2"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Goal
        </Button>
      </div>
    </form>
  );
}

function AddImpactStoryForm({ onClose, onAdd, goals }: { onClose: () => void; onAdd: (story: ImpactStory) => void; goals: MissionGoal[] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    related_goal: '',
    impact_score: 0,
    evidence: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStory: ImpactStory = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString(),
    };
    onAdd(newStory);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="story_title">Story Title</Label>
        <Input
          id="story_title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="story_description">Description</Label>
        <Textarea
          id="story_description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="related_goal">Related Goal</Label>
        <Select value={formData.related_goal} onValueChange={(value) => setFormData({ ...formData, related_goal: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a goal" />
          </SelectTrigger>
          <SelectContent>
            {goals.map((goal) => (
              <SelectItem key={goal.id} value={goal.id}>
                {goal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="impact_score">Impact Score (0-100)</Label>
        <Input
          id="impact_score"
          type="number"
          min="0"
          max="100"
          value={formData.impact_score}
          onChange={(e) => setFormData({ ...formData, impact_score: Number(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label htmlFor="evidence">Evidence</Label>
        <Textarea
          id="evidence"
          value={formData.evidence}
          onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
          placeholder="Describe the evidence that supports this impact story"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Story
        </Button>
      </div>
    </form>
  );
} 