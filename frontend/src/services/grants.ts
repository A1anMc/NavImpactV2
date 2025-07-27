import { apiClient } from './api';
import { Grant, CreateGrantInput, GrantFilters, PaginatedResponse } from '@/types/models';

// API endpoints
const ENDPOINTS = {
  BASE: '/api/v1/grants/',
  SCRAPER_RUN: '/api/v1/scraper/run',
  SCRAPER_STATUS: '/api/v1/scraper/status',
  SOURCES: '/api/v1/grants/sources',
  AI_RECOMMENDATIONS: '/api/v1/grants/ai/recommendations',
  SMART_SEARCH: '/api/v1/grants/smart-search',
  ANALYTICS: '/api/v1/grants/analytics',
  DASHBOARD: '/api/v1/grants/dashboard',
  EXPORT: '/api/v1/grants/export',
} as const;

// Enhanced types for AI features
export interface GrantRecommendation {
  grant: Grant;
  reasons: string[];
  match_score: number;
  priority: 'high' | 'medium' | 'low';
  success_probability?: number;
  estimated_effort?: string;
  key_requirements?: string[];
}

export interface GrantAnalytics {
  total_grants: number;
  open_grants: number;
  closing_soon: number;
  total_funding: number;
  average_amount: number;
  success_rate: number;
  top_industries: { industry: string; count: number }[];
  funding_trends: { month: string; amount: number }[];
  upcoming_deadlines: Grant[];
  sector_breakdown: Record<string, number>;
  location_breakdown: Record<string, number>;
}

export interface AIRecommendationRequest {
  user_id: number;
  project_tags?: string[];
  industry_focus?: string;
  location?: string;
  org_type?: string;
  budget_range?: { min?: number; max?: number };
  timeline?: string;
  max_results?: number;
}

export interface SmartSearchRequest {
  query: string;
  filters?: GrantFilters;
  include_ai_insights?: boolean;
  max_results?: number;
}

export interface SmartSearchResponse {
  grants: Grant[];
  total_results: number;
  search_suggestions: string[];
  ai_insights?: Record<string, any>;
  related_searches: string[];
}

export interface GrantDashboard {
  overview: GrantAnalytics;
  recommendations: GrantRecommendation[];
  recent_applications: any[];
  upcoming_deadlines: Grant[];
  saved_searches: any[];
  alerts: any[];
}

export interface GrantExportRequest {
  filters?: GrantFilters;
  format: 'csv' | 'pdf' | 'excel';
  include_analytics?: boolean;
  include_recommendations?: boolean;
}

export interface GrantExportResponse {
  download_url: string;
  filename: string;
  file_size: number;
  expires_at: string;
}

// Grants API service
export const grantsApi = {
  // Get all grants with pagination
  async getGrants(params?: { skip?: number; limit?: number }): Promise<PaginatedResponse<Grant>> {
    try {
      console.log('[grantsApi.getGrants] Fetching grants with params:', params);
      
      const response = await apiClient.getGrants(params);
      
      console.log('[grantsApi.getGrants] Response received:', response);
      
      return response;
    } catch (error) {
      console.error('[grantsApi.getGrants] Error:', error);
      throw error;
    }
  },

  // Get grants with filters
  async getGrantsWithFilters(filters: GrantFilters): Promise<PaginatedResponse<Grant>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.industry_focus) queryParams.append('industry_focus', filters.industry_focus);
      if (filters.location_eligibility) queryParams.append('location', filters.location_eligibility);
      if (filters.org_type) queryParams.append('org_type', filters.org_type);
      if (filters.min_amount) queryParams.append('min_amount', filters.min_amount.toString());
      if (filters.max_amount) queryParams.append('max_amount', filters.max_amount.toString());
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.size) queryParams.append('size', filters.size.toString());
      
      const response = await apiClient.get(`${ENDPOINTS.BASE}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.getGrantsWithFilters] Error:', error);
      throw error;
    }
  },

  // Create a new grant
  async createGrant(grant: CreateGrantInput): Promise<Grant> {
    try {
      const response = await apiClient.post(ENDPOINTS.BASE, grant);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.createGrant] Error:', error);
      throw error;
    }
  },

  // Get a specific grant
  async getGrant(id: string): Promise<Grant> {
    try {
      const response = await apiClient.get(`${ENDPOINTS.BASE}${id}`);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.getGrant] Error:', error);
      throw error;
    }
  },

  // Update a grant
  async updateGrant(id: string, grant: Partial<CreateGrantInput>): Promise<Grant> {
    try {
      const response = await apiClient.put(`${ENDPOINTS.BASE}${id}`, grant);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.updateGrant] Error:', error);
      throw error;
    }
  },

  // Delete a grant
  async deleteGrant(id: string): Promise<void> {
    try {
      await apiClient.delete(`${ENDPOINTS.BASE}${id}`);
    } catch (error) {
      console.error('[grantsApi.deleteGrant] Error:', error);
      throw error;
    }
  },

  // Get grant sources
  async getGrantSources(): Promise<any> {
    try {
      const response = await apiClient.get(ENDPOINTS.SOURCES);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.getGrantSources] Error:', error);
      throw error;
    }
  },

  // Run scraper
  async runScraper(source?: string): Promise<any> {
    try {
      const endpoint = source ? `${ENDPOINTS.SCRAPER_RUN}/${source}` : ENDPOINTS.SCRAPER_RUN;
      const response = await apiClient.post(endpoint);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.runScraper] Error:', error);
      throw error;
    }
  },

  // Get scraper status
  async getScraperStatus(): Promise<any> {
    try {
      const response = await apiClient.get(ENDPOINTS.SCRAPER_STATUS);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.getScraperStatus] Error:', error);
      throw error;
    }
  },

  // New AI-Powered Methods

  // Get AI recommendations
  async getAIRecommendations(request: AIRecommendationRequest): Promise<{
    recommendations: GrantRecommendation[];
    total_matches: number;
    confidence_score: number;
    reasoning: string;
  }> {
    try {
      const response = await apiClient.post(ENDPOINTS.AI_RECOMMENDATIONS, request);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.getAIRecommendations] Error:', error);
      throw error;
    }
  },

  // Smart search with natural language processing
  async smartSearch(request: SmartSearchRequest): Promise<SmartSearchResponse> {
    try {
      const response = await apiClient.post(ENDPOINTS.SMART_SEARCH, request);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.smartSearch] Error:', error);
      throw error;
    }
  },

  // Get grant analytics
  async getGrantAnalytics(): Promise<GrantAnalytics> {
    try {
      const response = await apiClient.get(ENDPOINTS.ANALYTICS);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.getGrantAnalytics] Error:', error);
      throw error;
    }
  },

  // Get grant dashboard
  async getGrantDashboard(): Promise<GrantDashboard> {
    try {
      const response = await apiClient.get(ENDPOINTS.DASHBOARD);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.getGrantDashboard] Error:', error);
      throw error;
    }
  },

  // Export grants
  async exportGrants(request: GrantExportRequest): Promise<GrantExportResponse> {
    try {
      const response = await apiClient.post(ENDPOINTS.EXPORT, request);
      return response.data;
    } catch (error) {
      console.error('[grantsApi.exportGrants] Error:', error);
      throw error;
    }
  },

  // Download exported file
  async downloadExport(downloadUrl: string): Promise<Blob> {
    try {
      const response = await apiClient.get(downloadUrl, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('[grantsApi.downloadExport] Error:', error);
      throw error;
    }
  },

  // Utility methods for enhanced features

  // Calculate relevance score for a grant
  calculateRelevanceScore(grant: Grant, searchQuery: string): number {
    let score = 50;
    const query = searchQuery.toLowerCase();
    const title = grant.title.toLowerCase();
    const description = grant.description?.toLowerCase() || '';

    // Title match (30 points)
    if (query.split(' ').some(word => title.includes(word))) {
      score += 30;
    }

    // Description match (20 points)
    if (query.split(' ').some(word => description.includes(word))) {
      score += 20;
    }

    return Math.min(100, score);
  },

  // Estimate success probability
  estimateSuccessProbability(grant: Grant): number {
    let probability = 60;

    // Adjust based on grant characteristics
    if (grant.max_amount && grant.max_amount > 100000) {
      probability -= 10; // Larger grants are more competitive
    }

    if (grant.deadline) {
      const daysUntilDeadline = Math.ceil((new Date(grant.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntilDeadline < 30) {
        probability -= 15; // Short deadlines reduce success chance
      }
    }

    return Math.max(0, Math.min(100, probability));
  },

  // Extract tags from grant
  extractTagsFromGrant(grant: Grant): string[] {
    const tags: string[] = [];

    if (grant.industry_focus) {
      tags.push(grant.industry_focus);
    }

    if (grant.funding_purpose) {
      tags.push(...grant.funding_purpose);
    }

    if (grant.audience_tags) {
      tags.push(...grant.audience_tags);
    }

    return [...new Set(tags)]; // Remove duplicates
  },

  // Generate search suggestions
  generateSearchSuggestions(query: string): string[] {
    return [
      `${query} in Victoria`,
      `${query} for nonprofits`,
      `${query} under $50,000`,
      `${query} closing soon`
    ];
  },

  // Generate related searches
  generateRelatedSearches(query: string): string[] {
    return [
      'sustainability grants',
      'technology innovation funding',
      'community development grants',
      'indigenous cultural projects'
    ];
  },

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  // Get status color
  getStatusColor(status: string): string {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closing_soon': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  },

  // Get status label
  getStatusLabel(status: string): string {
    switch (status) {
      case 'open': return 'Open';
      case 'closing_soon': return 'Closing Soon';
      case 'closed': return 'Closed';
      default: return 'Unknown';
    }
  },

  // Get priority color
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
};

// Export types for use in components
export type { CreateGrantInput, GrantFilters }; 