import { apiClient } from './api';

export interface GrantPrediction {
  grant_id: number;
  grant_title: string;
  funder: string;
  amount: number;
  success_probability: number;
  confidence_score: number;
  recommendation: 'High' | 'Medium' | 'Low';
}

export interface IntelligenceMetrics {
  total_grants: number;
  active_grants: number;
  average_success_probability: number;
  high_probability_grants: number;
  model_accuracy: number;
  predictions_generated: number;
}

export interface IntelligenceRecommendation {
  grant_id: number;
  title: string;
  funder: string;
  amount: number;
  success_probability: number;
  reason: string;
}

export interface IntelligenceDashboard {
  intelligence_metrics: IntelligenceMetrics;
  recommendations: IntelligenceRecommendation[];
  insights: string[];
}

export interface ModelTrainingResult {
  message: string;
  accuracy: number;
  model_version: string;
  feature_importance: Record<string, number>;
}

export interface IntelligenceDashboardParams {
  timeframe?: '30d' | '90d' | '1y';
  signal?: AbortSignal;
}

export interface GrantPredictionsParams {
  limit?: number;
  timeframe?: '30d' | '90d' | '1y';
  signal?: AbortSignal;
}

export const impactIntelligenceService = {
  // Get grant success predictions
  async getGrantPredictions(limit: number = 10, params?: GrantPredictionsParams): Promise<GrantPrediction[]> {
    try {
      const queryParams: Record<string, string> = { limit: limit.toString() };
      if (params?.timeframe) {
        queryParams.timeframe = params.timeframe;
      }
      
      const response = await apiClient.get(`/api/v1/impact/predictions`, queryParams);
      return response.data.predictions;
    } catch (error) {
      console.error('Error fetching grant predictions:', error);
      throw error;
    }
  },

  // Train prediction model
  async trainModel(): Promise<ModelTrainingResult> {
    try {
      const response = await apiClient.post('/api/v1/impact/train-model');
      return response.data;
    } catch (error) {
      console.error('Error training model:', error);
      throw error;
    }
  },

  // Get intelligence dashboard
  async getIntelligenceDashboard(params?: IntelligenceDashboardParams): Promise<IntelligenceDashboard> {
    try {
      const queryParams: Record<string, string> = {};
      if (params?.timeframe) {
        queryParams.timeframe = params.timeframe;
      }
      
      const response = await apiClient.get('/api/v1/impact/intelligence', queryParams);
      return response.data;
    } catch (error) {
      console.error('Error fetching intelligence dashboard:', error);
      throw error;
    }
  },

  // Get prediction details for a specific grant
  async getGrantPredictionDetails(grantId: number): Promise<GrantPrediction | null> {
    try {
      const predictions = await this.getGrantPredictions(50); // Get more to find the specific one
      return predictions.find(p => p.grant_id === grantId) || null;
    } catch (error) {
      console.error('Error fetching grant prediction details:', error);
      return null;
    }
  },

  // Get historical success reasons for a grant
  async getSuccessReasons(grantId: number): Promise<string[]> {
    try {
      // This would be enhanced in future steps with actual historical data
      const prediction = await this.getGrantPredictionDetails(grantId);
      if (!prediction) return [];

      const reasons = [];
      
      if (prediction.success_probability > 0.7) {
        reasons.push("High funding amount aligns with funder preferences");
        reasons.push("Sector has above-average success rates");
        reasons.push("Optimal application timing");
      } else if (prediction.success_probability > 0.4) {
        reasons.push("Moderate alignment with funder criteria");
        reasons.push("Standard sector performance");
      } else {
        reasons.push("Lower funding amount than typical");
        reasons.push("Sector has below-average success rates");
      }

      return reasons;
    } catch (error) {
      console.error('Error fetching success reasons:', error);
      return [];
    }
  }
}; 