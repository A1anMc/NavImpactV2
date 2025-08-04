import { apiClient } from '@/lib/api-client';

export interface AIGrant {
  id: string;
  title: string;
  description: string;
  amount?: string;
  deadline?: string;
  source: string;
  url: string;
  category: string;
  eligibility: string;
  success_probability: number;
  ai_insights: {
    category: string;
    keywords_found: string[];
    urgency_level: string;
    complexity_score: number;
    recommended_actions: string[];
  };
  discovered_at: string;
  last_updated: string;
  status: string;
  match_score: number;
}

export interface AIGrantSource {
  name: string;
  url: string;
  description: string;
  status: string;
}

export interface AIGrantStatus {
  status: string;
  last_run: string;
  sources_monitored: number;
  discovery_method: string;
  rate_limiting: string;
  data_quality: string;
  ai_features: string[];
}

export interface AIGrantInsights {
  total_opportunities: string;
  top_categories: string[];
  success_factors: string[];
  ai_recommendations: string[];
  trends: string[];
}

export const aiGrantsApi = {
  // Discover real grants using AI bots
  async discoverGrants(): Promise<AIGrant[]> {
    try {
      const response = await apiClient.get('/ai-grants/discover');
      return response.data;
    } catch (error) {
      console.error('Error fetching AI grants:', error);
      return [];
    }
  },

  // Get AI bot sources
  async getSources(): Promise<AIGrantSource[]> {
    try {
      const response = await apiClient.get('/ai-grants/sources');
      return response.data;
    } catch (error) {
      console.error('Error fetching AI sources:', error);
      return [];
    }
  },

  // Get AI bot status
  async getStatus(): Promise<AIGrantStatus> {
    try {
      const response = await apiClient.get('/ai-grants/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching AI status:', error);
      return {
        status: 'error',
        last_run: new Date().toISOString(),
        sources_monitored: 0,
        discovery_method: 'error',
        rate_limiting: 'disabled',
        data_quality: 'unknown',
        ai_features: []
      };
    }
  },

  // Get AI insights
  async getInsights(): Promise<AIGrantInsights> {
    try {
      const response = await apiClient.get('/ai-grants/insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      return {
        total_opportunities: 'Error',
        top_categories: [],
        success_factors: [],
        ai_recommendations: [],
        trends: []
      };
    }
  },

  // Test AI bot functionality
  async testBot(): Promise<any> {
    try {
      const response = await apiClient.get('/ai-grants/test');
      return response.data;
    } catch (error) {
      console.error('Error testing AI bot:', error);
      return null;
    }
  },

  // Refresh AI discovery
  async refreshDiscovery(): Promise<any> {
    try {
      const response = await apiClient.post('/ai-grants/refresh');
      return response.data;
    } catch (error) {
      console.error('Error refreshing AI discovery:', error);
      return null;
    }
  }
}; 