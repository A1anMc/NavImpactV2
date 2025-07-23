'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrophyIcon, 
  StarIcon, 
  RocketLaunchIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  CheckCircleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface DashboardLevel {
  id: number;
  name: string;
  title: string;
  description: string;
  requiredPoints: number;
  unlockedFeatures: string[];
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
}

interface UserProgress {
  currentLevel: number;
  currentPoints: number;
  totalPoints: number;
  completedTasks: string[];
  profileCompletion: number;
  grantsViewed: number;
  applicationsSubmitted: number;
  daysActive: number;
}

const DASHBOARD_LEVELS: DashboardLevel[] = [
  {
    id: 1,
    name: 'Novice Navigator',
    title: 'Getting Started',
    description: 'Complete your profile and explore your first grants',
    requiredPoints: 0,
    unlockedFeatures: ['Basic grant browsing', 'Profile setup'],
    icon: RocketLaunchIcon,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    name: 'Grant Explorer',
    title: 'Active Explorer',
    description: 'Start discovering and matching with grants',
    requiredPoints: 50,
    unlockedFeatures: ['Grant matching', 'Personalized recommendations', 'Basic analytics'],
    icon: StarIcon,
    color: 'text-green-600',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 3,
    name: 'Strategic Seeker',
    title: 'Strategic Approach',
    description: 'Develop your grant strategy and track applications',
    requiredPoints: 150,
    unlockedFeatures: ['Application tracking', 'Advanced filtering', 'Success analytics'],
    icon: ChartBarIcon,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 4,
    name: 'Impact Champion',
    title: 'Impact Leader',
    description: 'Master grant management and optimize success rates',
    requiredPoints: 300,
    unlockedFeatures: ['AI-powered insights', 'Team collaboration', 'Advanced reporting'],
    icon: TrophyIcon,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 5,
    name: 'Grant Master',
    title: 'Grant Master',
    description: 'Achieve mastery in grant management and funding success',
    requiredPoints: 500,
    unlockedFeatures: ['Predictive analytics', 'Custom dashboards', 'Priority support'],
    icon: UserGroupIcon,
    color: 'text-red-600',
    gradient: 'from-red-500 to-red-600'
  }
];

const calculateUserProgress = (): UserProgress => {
  // Mock data - in real app, this would come from user profile and activity
  return {
    currentLevel: 2,
    currentPoints: 85,
    totalPoints: 150,
    completedTasks: [
      'Complete profile setup',
      'Browse 10+ grants',
      'Set grant preferences',
      'View personalized recommendations'
    ],
    profileCompletion: 85,
    grantsViewed: 15,
    applicationsSubmitted: 2,
    daysActive: 7
  };
};

const calculatePoints = (progress: UserProgress): number => {
  let points = 0;
  
  // Profile completion points
  points += Math.floor(progress.profileCompletion / 10) * 10;
  
  // Activity points
  points += progress.grantsViewed * 2;
  points += progress.applicationsSubmitted * 15;
  points += progress.daysActive * 5;
  
  // Task completion points
  points += progress.completedTasks.length * 10;
  
  return Math.min(points, 500); // Cap at max level
};

export default function DashboardLevels() {
  const [userProgress, setUserProgress] = useState<UserProgress>(calculateUserProgress());
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    const points = calculatePoints(userProgress);
    setCurrentPoints(points);
  }, [userProgress]);

  const currentLevel = DASHBOARD_LEVELS.find(level => level.id === userProgress.currentLevel) || DASHBOARD_LEVELS[0];
  const nextLevel = DASHBOARD_LEVELS.find(level => level.id === userProgress.currentLevel + 1);
  
  const progressToNextLevel = nextLevel 
    ? ((currentPoints - currentLevel.requiredPoints) / (nextLevel.requiredPoints - currentLevel.requiredPoints)) * 100
    : 100;

  const getUnlockedFeatures = () => {
    const unlocked: string[] = [];
    DASHBOARD_LEVELS.forEach(level => {
      if (currentPoints >= level.requiredPoints) {
        unlocked.push(...level.unlockedFeatures);
      }
    });
    return unlocked;
  };

  const getLockedFeatures = () => {
    const locked: string[] = [];
    DASHBOARD_LEVELS.forEach(level => {
      if (currentPoints < level.requiredPoints) {
        locked.push(...level.unlockedFeatures);
      }
    });
    return locked.slice(0, 3); // Show next 3 locked features
  };

  return (
    <div className="space-y-6">
      {/* Current Level Card */}
      <Card className="border-2 border-gradient-to-r from-blue-500 to-purple-600">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full bg-gradient-to-r ${currentLevel.gradient} text-white`}>
              <currentLevel.icon className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="font-heading text-2xl text-gray-900">
            {currentLevel.name}
          </CardTitle>
          <CardDescription className="font-body text-lg">
            {currentLevel.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-body">
              <span>Progress to next level</span>
              <span>{Math.round(progressToNextLevel)}%</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
            <div className="text-center text-sm text-gray-600 font-body">
              {currentPoints} / {nextLevel?.requiredPoints || currentLevel.requiredPoints} points
            </div>
          </div>

          {/* Points Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-bold text-gray-900">{userProgress.profileCompletion}%</div>
              <div className="text-gray-600">Profile Complete</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-bold text-gray-900">{userProgress.grantsViewed}</div>
              <div className="text-gray-600">Grants Viewed</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-bold text-gray-900">{userProgress.applicationsSubmitted}</div>
              <div className="text-gray-600">Applications</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-bold text-gray-900">{userProgress.daysActive}</div>
              <div className="text-gray-600">Days Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Features */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            Unlocked Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getUnlockedFeatures().map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm font-body text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Level Preview */}
      {nextLevel && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <LockClosedIcon className="h-5 w-5 text-gray-500" />
              Next Level: {nextLevel.name}
            </CardTitle>
            <CardDescription className="font-body">
              {nextLevel.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 font-body">
                Unlock at {nextLevel.requiredPoints} points (need {nextLevel.requiredPoints - currentPoints} more)
              </div>
              <div className="space-y-2">
                {nextLevel.unlockedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-body text-gray-500">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions to Level Up */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Level Up Faster</CardTitle>
          <CardDescription className="font-body">
            Complete these tasks to earn more points and unlock new features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium font-body">Complete Profile (10 points)</div>
                <div className="text-sm text-gray-600 font-body">Fill in all profile sections</div>
              </div>
              <Button size="sm" variant="outline">
                Complete
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium font-body">Browse 5 More Grants (10 points)</div>
                <div className="text-sm text-gray-600 font-body">Explore different grant opportunities</div>
              </div>
              <Button size="sm" variant="outline">
                Browse
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium font-body">Submit Application (15 points)</div>
                <div className="text-sm text-gray-600 font-body">Apply for a grant</div>
              </div>
              <Button size="sm" variant="outline">
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 