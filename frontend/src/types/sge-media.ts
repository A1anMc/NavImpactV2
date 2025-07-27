/**
 * SGE Media Module TypeScript Interfaces
 * 
 * This file contains all the TypeScript interfaces for the SGE Media Management module.
 * These interfaces define the data structures used in the frontend components.
 */

// Base Interfaces
export interface SgeMediaProject {
  id: number;
  project_id: number;
  media_type: 'video' | 'photo' | 'transcript' | 'mixed';
  duration?: string;
  release_date?: string;
  target_audience?: string[];
  contributors?: string[];
  production_budget?: number;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SgeDistributionLog {
  id: number;
  media_project_id: number;
  platform: string;
  url?: string;
  publish_date?: string;
  views?: number;
  reach?: number;
  engagement_rate?: number;
  notes?: string;
  created_at: string;
}

export interface SgePerformanceMetrics {
  id: number;
  media_project_id: number;
  metric_date: string;
  views?: number;
  unique_viewers?: number;
  watch_time_minutes?: number;
  engagement_rate?: number;
  shares?: number;
  comments?: number;
  created_at: string;
}

export interface SgeImpactStory {
  id: number;
  media_project_id: number;
  story_type?: 'testimonial' | 'policy_change' | 'funding_unlocked' | 'community_action';
  title: string;
  description?: string;
  stakeholder_name?: string;
  stakeholder_organisation?: string;
  impact_date?: string;
  quantifiable_outcome?: string;
  created_at: string;
}

export interface SgeClientAccess {
  id: number;
  client_name: string;
  client_email: string;
  access_level?: 'viewer' | 'analyst' | 'admin';
  allowed_projects?: number[];
  is_active?: boolean;
  created_at: string;
}

// Create/Update Interfaces
export interface CreateSgeMediaProject {
  project_id: number;
  media_type: 'video' | 'photo' | 'transcript' | 'mixed';
  duration?: string;
  release_date?: string;
  target_audience?: string[];
  contributors?: string[];
  production_budget?: number;
  thumbnail_url?: string;
}

export interface UpdateSgeMediaProject {
  media_type?: 'video' | 'photo' | 'transcript' | 'mixed';
  duration?: string;
  release_date?: string;
  target_audience?: string[];
  contributors?: string[];
  production_budget?: number;
  thumbnail_url?: string;
}

export interface CreateSgeDistributionLog {
  media_project_id: number;
  platform: string;
  url?: string;
  publish_date?: string;
  views?: number;
  reach?: number;
  engagement_rate?: number;
  notes?: string;
}

export interface CreateSgePerformanceMetrics {
  media_project_id: number;
  metric_date: string;
  views?: number;
  unique_viewers?: number;
  watch_time_minutes?: number;
  engagement_rate?: number;
  shares?: number;
  comments?: number;
}

export interface CreateSgeImpactStory {
  media_project_id: number;
  story_type?: 'testimonial' | 'policy_change' | 'funding_unlocked' | 'community_action';
  title: string;
  description?: string;
  stakeholder_name?: string;
  stakeholder_organisation?: string;
  impact_date?: string;
  quantifiable_outcome?: string;
}

export interface CreateSgeClientAccess {
  client_name: string;
  client_email: string;
  access_level?: 'viewer' | 'analyst' | 'admin';
  allowed_projects?: number[];
  is_active?: boolean;
}

// Dashboard and Report Interfaces
export interface MediaDashboard {
  total_projects: number;
  total_views: number;
  active_distributions: number;
  impact_stories: number;
  recent_projects: SgeMediaProject[];
  distribution_data: {
    platforms: string[];
    counts: number[];
  };
  performance_data: {
    dates: string[];
    views: number[];
  };
  recent_stories: SgeImpactStory[];
}

export interface MediaImpactReport {
  project_id: number;
  project_name: string;
  media_projects: SgeMediaProject[];
  total_views: number;
  total_engagement: number;
  distribution_summary: {
    platforms: number;
    total_distributions: number;
  };
  performance_summary: {
    avg_views: number;
  };
  impact_stories: SgeImpactStory[];
  funding_impact?: string;
}

// API Response Interfaces
export interface PaginatedSgeMediaProjects {
  items: SgeMediaProject[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginatedSgeDistributionLogs {
  items: SgeDistributionLog[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginatedSgePerformanceMetrics {
  items: SgePerformanceMetrics[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginatedSgeImpactStories {
  items: SgeImpactStory[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginatedSgeClientAccess {
  items: SgeClientAccess[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Filter Interfaces
export interface SgeMediaFilters {
  media_type?: string;
  project_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface SgeDistributionFilters {
  media_project_id?: number;
  platform?: string;
  start_date?: string;
  end_date?: string;
}

export interface SgePerformanceFilters {
  media_project_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface SgeImpactStoryFilters {
  media_project_id?: number;
  story_type?: string;
  start_date?: string;
  end_date?: string;
}

// Form Interfaces
export interface SgeMediaProjectFormData {
  project_id: number;
  media_type: 'video' | 'photo' | 'transcript' | 'mixed';
  duration: string;
  release_date: string;
  target_audience: string[];
  contributors: string[];
  production_budget: number;
  thumbnail_url: string;
}

export interface SgeDistributionLogFormData {
  media_project_id: number;
  platform: string;
  url: string;
  publish_date: string;
  views: number;
  reach: number;
  engagement_rate: number;
  notes: string;
}

export interface SgePerformanceMetricsFormData {
  media_project_id: number;
  metric_date: string;
  views: number;
  unique_viewers: number;
  watch_time_minutes: number;
  engagement_rate: number;
  shares: number;
  comments: number;
}

export interface SgeImpactStoryFormData {
  media_project_id: number;
  story_type: 'testimonial' | 'policy_change' | 'funding_unlocked' | 'community_action';
  title: string;
  description: string;
  stakeholder_name: string;
  stakeholder_organisation: string;
  impact_date: string;
  quantifiable_outcome: string;
}
