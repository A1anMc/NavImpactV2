'use client';

import { useState, useEffect } from 'react';
import { grantsApi } from '@/services/grants';
import { Grant } from '@/types/models';
import { GrantCard } from './GrantCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Target, TrendingUp, Clock } from 'lucide-react';

interface GrantRecommendationsProps {
  limit?: number;
  showTitle?: boolean;
}

export default function GrantRecommendations({ 
  limit = 5, 
  showTitle = true 
}: GrantRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [limit]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await grantsApi.getGrants({ page: 1, size: limit });
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadRecommendations} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No personalized recommendations yet</p>
            <p className="text-sm text-gray-500">
              Complete your profile to get personalized grant recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          {showTitle ? 'Personalized Recommendations' : 'Recommended for You'}
          <Badge variant="outline" className="ml-2">
            {recommendations.length} matches
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((grant, index) => (
            <div key={grant.id} className="relative">
              <GrantCard grant={grant} onClick={() => {}} />
              {index === 0 && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Top Match
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {recommendations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated just now</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/grants?filter=matching'}
              >
                View All Matches
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 