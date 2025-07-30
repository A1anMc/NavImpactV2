import { apiClient } from '@/lib/api-client';

export interface InstagramMetrics {
  platform: string;
  timestamp: string;
  followers: number | null;
  media_count: number | null;
  recent_engagement: {
    total_likes: number;
    total_comments: number;
    avg_likes_per_post: number;
    avg_comments_per_post: number;
  } | null;
  account_info: {
    username: string;
    biography: string;
    profile_picture: string;
  } | null;
  status: string;
  error: string | null;
}

export interface InstagramAccountInfo {
  id: string;
  username: string;
  followers_count: number;
  media_count: number;
  biography: string;
  profile_picture_url: string;
}

export interface InstagramMedia {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
}

export interface SocialMediaStatus {
  instagram: {
    configured: boolean;
    business_account_id: boolean;
    status: string;
  };
  overall_status: string;
}

export class SocialMediaService {
  /**
   * Get comprehensive Instagram metrics for OKR tracking
   */
  static async getInstagramMetrics(): Promise<InstagramMetrics> {
    try {
      const response = await apiClient.get('/social-media/instagram/metrics');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Instagram metrics:', error);
      throw new Error('Failed to fetch Instagram metrics');
    }
  }

  /**
   * Get current Instagram follower count
   */
  static async getInstagramFollowers(): Promise<number> {
    try {
      const response = await apiClient.get('/social-media/instagram/followers');
      return response.data.data.followers;
    } catch (error) {
      console.error('Error fetching Instagram followers:', error);
      throw new Error('Failed to fetch Instagram follower count');
    }
  }

  /**
   * Get Instagram account information
   */
  static async getInstagramAccountInfo(): Promise<InstagramAccountInfo> {
    try {
      const response = await apiClient.get('/social-media/instagram/account');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Instagram account info:', error);
      throw new Error('Failed to fetch Instagram account information');
    }
  }

  /**
   * Get recent Instagram media posts
   */
  static async getInstagramRecentMedia(limit: number = 10): Promise<InstagramMedia[]> {
    try {
      const response = await apiClient.get(`/social-media/instagram/media?limit=${limit}`);
      return response.data.data.data || [];
    } catch (error) {
      console.error('Error fetching Instagram media:', error);
      throw new Error('Failed to fetch Instagram media');
    }
  }

  /**
   * Get status of all social media API connections
   */
  static async getSocialMediaStatus(): Promise<SocialMediaStatus> {
    try {
      const response = await apiClient.get('/social-media/status');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching social media status:', error);
      throw new Error('Failed to fetch social media status');
    }
  }

  /**
   * Test Instagram API connection
   */
  static async testInstagramConnection(): Promise<boolean> {
    try {
      await this.getInstagramFollowers();
      return true;
    } catch (error) {
      return false;
    }
  }
} 