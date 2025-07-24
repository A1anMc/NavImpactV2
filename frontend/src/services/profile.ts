import api from './api';

export interface UserProfile {
  id: number;
  organisation_name: string;
  organisation_type: string;
  industry_focus?: string;
  location?: string;
  website?: string;
  description?: string;
  preferred_funding_range_min?: number;
  preferred_funding_range_max?: number;
  preferred_industries?: string[];
  preferred_locations?: string[];
  preferred_org_types?: string[];
  max_deadline_days?: number;
  min_grant_amount?: number;
  max_grant_amount?: number;
  email_notifications: string;
  deadline_alerts: number;
  created_at: string;
  updated_at: string;
  user_id?: number;
}

export interface UserProfileCreate {
  organisation_name: string;
  organisation_type: string;
  industry_focus?: string;
  location?: string;
  website?: string;
  description?: string;
  preferred_funding_range_min?: number;
  preferred_funding_range_max?: number;
  preferred_industries?: string[];
  preferred_locations?: string[];
  preferred_org_types?: string[];
  max_deadline_days?: number;
  min_grant_amount?: number;
  max_grant_amount?: number;
  email_notifications: string;
  deadline_alerts: number;
}

export interface UserProfileUpdate {
  organisation_name?: string;
  organisation_type?: string;
  industry_focus?: string;
  location?: string;
  website?: string;
  description?: string;
  preferred_funding_range_min?: number;
  preferred_funding_range_max?: number;
  preferred_industries?: string[];
  preferred_locations?: string[];
  preferred_org_types?: string[];
  max_deadline_days?: number;
  min_grant_amount?: number;
  max_grant_amount?: number;
  email_notifications?: string;
  deadline_alerts?: number;
}

export const profileService = {
  // Get current user's profile
  async getMyProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/user-profiles/me');
    return response.data;
  },

  // Get all user profiles (admin only)
  async getAllProfiles(skip = 0, limit = 100): Promise<UserProfile[]> {
    const queryParams = {
      skip: skip.toString(),
      limit: limit.toString()
    };
    const response = await api.get<UserProfile[]>('/user-profiles/', { params: queryParams });
    return response.data;
  },

  // Get specific user profile by ID
  async getProfile(id: number): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/user-profiles/${id}`);
    return response.data;
  },

  // Create new user profile
  async createProfile(profile: UserProfileCreate): Promise<UserProfile> {
    const response = await api.post<UserProfile>('/user-profiles/', profile);
    return response.data;
  },

  // Update current user's profile
  async updateMyProfile(profile: UserProfileUpdate): Promise<UserProfile> {
    const response = await api.put<UserProfile>('/user-profiles/me', profile);
    return response.data;
  },

  // Update specific user profile by ID
  async updateProfile(id: number, profile: UserProfileUpdate): Promise<UserProfile> {
    const response = await api.put<UserProfile>(`/user-profiles/${id}`, profile);
    return response.data;
  },

  // Delete user profile
  async deleteProfile(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/user-profiles/${id}`);
    return response.data;
  }
}; 