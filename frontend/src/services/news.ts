import { apiClient } from './api';

export interface IndustryNews {
  id: number;
  title: string;
  summary?: string;
  url: string;
  source?: string;
  platform?: string;  // twitter, linkedin, facebook, website
  platform_icon?: string;  // icon name for display
  sector: string;
  relevance_score: number;
  published_at?: string;
  created_at: string;
}

export interface NewsRefreshResponse {
  total_fetched: number;
  saved: number;
  deleted_old: number;
  message: string;
}

export interface NewsStats {
  total_news_items: number;
  recent_news_items: number;
  sector_breakdown: Record<string, number>;
  available_sectors: string[];
  platform_breakdown?: Record<string, number>;  // Social media platform breakdown
}

export class NewsService {
  /**
   * Get personalized news for user based on their sectors
   */
  static async getNewsForUser(sectors: string[], limit: number = 20): Promise<IndustryNews[]> {
    const sectorsParam = sectors.join(',');
    const response = await apiClient.get(`/api/v1/news/?sectors=${sectorsParam}&limit=${limit}`);
    return response.data;
  }

  /**
   * Get news for a specific sector
   */
  static async getNewsBySector(sector: string, limit: number = 20): Promise<IndustryNews[]> {
    const response = await apiClient.get(`/api/v1/news/sectors/${sector}?limit=${limit}`);
    return response.data;
  }

  /**
   * Refresh the news feed
   */
  static async refreshNewsFeed(): Promise<NewsRefreshResponse> {
    const response = await apiClient.post('/api/v1/news/refresh');
    return response.data;
  }

  /**
   * Get available sectors
   */
  static async getAvailableSectors(): Promise<string[]> {
    const response = await apiClient.get('/api/v1/news/sectors');
    return response.data;
  }

  /**
   * Get news statistics
   */
  static async getNewsStats(): Promise<NewsStats> {
    const response = await apiClient.get('/api/v1/news/stats');
    return response.data;
  }

  /**
   * Format relevance score as percentage
   */
  static formatRelevanceScore(score: number): string {
    return `${Math.round(score * 100)}%`;
  }

  /**
   * Get relevance badge color based on score
   */
  static getRelevanceBadgeColor(score: number): string {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    if (score >= 0.4) return 'info';
    return 'default';
  }

  /**
   * Get sector badge color
   */
  static getSectorBadgeColor(sector: string): string {
    const colors: Record<string, string> = {
      creative: 'success',
      health: 'error',
      tech: 'info',
      government: 'warning',
      funding: 'default'
    };
    return colors[sector] || 'default';
  }

  /**
   * Format date for display
   */
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  /**
   * Truncate text to specified length
   */
  static truncateText(text: string, maxLength: number = 150): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }
} 