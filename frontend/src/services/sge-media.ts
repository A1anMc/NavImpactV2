/**
 * SGE Media Module Service
 * 
 * This service handles all API calls related to the SGE Media Management module.
 * It provides methods for CRUD operations and specialized functionality.
 */

import { apiClient } from '@/lib/api-client';
import {
  SgeMediaProject,
  SgeDistributionLog,
  SgePerformanceMetrics,
  SgeImpactStory,
  SgeClientAccess,
  CreateSgeMediaProject,
  UpdateSgeMediaProject,
  CreateSgeDistributionLog,
  CreateSgePerformanceMetrics,
  CreateSgeImpactStory,
  CreateSgeClientAccess,
  MediaDashboard,
  MediaImpactReport,
  PaginatedSgeMediaProjects,
  PaginatedSgeDistributionLogs,
  PaginatedSgePerformanceMetrics,
  PaginatedSgeImpactStories,
  PaginatedSgeClientAccess,
  SgeMediaFilters,
  SgeDistributionFilters,
  SgePerformanceFilters,
  SgeImpactStoryFilters
} from '@/types/sge-media';

// API Endpoints
const ENDPOINTS = {
  MEDIA_PROJECTS: '/api/v1/sge-media/media-projects',
  DISTRIBUTION_LOGS: '/api/v1/sge-media/distribution-logs',
  PERFORMANCE_METRICS: '/api/v1/sge-media/performance-metrics',
  IMPACT_STORIES: '/api/v1/sge-media/impact-stories',
  CLIENT_ACCESS: '/api/v1/sge-media/client-access',
  DASHBOARD: '/api/v1/sge-media/dashboard',
  IMPACT_REPORT: '/api/v1/sge-media/impact-report'
};

// Media Projects
export const sgeMediaApi = {
  // Create a new media project
  createMediaProject: async (data: CreateSgeMediaProject): Promise<SgeMediaProject> => {
    const response = await apiClient.post(ENDPOINTS.MEDIA_PROJECTS, data);
    return response.data;
  },

  // Get all media projects with optional filters
  getMediaProjects: async (filters?: SgeMediaFilters): Promise<SgeMediaProject[]> => {
    const params = new URLSearchParams();
    if (filters?.media_type) params.append('media_type', filters.media_type);
    if (filters?.project_id) params.append('project_id', filters.project_id.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await apiClient.get(`${ENDPOINTS.MEDIA_PROJECTS}?${params.toString()}`);
    return response.data;
  },

  // Get a specific media project by ID
  getMediaProject: async (id: number): Promise<SgeMediaProject> => {
    const response = await apiClient.get(`${ENDPOINTS.MEDIA_PROJECTS}/${id}`);
    return response.data;
  },

  // Update a media project
  updateMediaProject: async (id: number, data: UpdateSgeMediaProject): Promise<SgeMediaProject> => {
    const response = await apiClient.put(`${ENDPOINTS.MEDIA_PROJECTS}/${id}`, data);
    return response.data;
  },

  // Delete a media project
  deleteMediaProject: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.MEDIA_PROJECTS}/${id}`);
  },

  // Distribution Logs
  createDistributionLog: async (data: CreateSgeDistributionLog): Promise<SgeDistributionLog> => {
    const response = await apiClient.post(ENDPOINTS.DISTRIBUTION_LOGS, data);
    return response.data;
  },

  getDistributionLogs: async (filters?: SgeDistributionFilters): Promise<SgeDistributionLog[]> => {
    const params = new URLSearchParams();
    if (filters?.media_project_id) params.append('media_project_id', filters.media_project_id.toString());
    if (filters?.platform) params.append('platform', filters.platform);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await apiClient.get(`${ENDPOINTS.DISTRIBUTION_LOGS}?${params.toString()}`);
    return response.data;
  },

  // Performance Metrics
  createPerformanceMetrics: async (data: CreateSgePerformanceMetrics): Promise<SgePerformanceMetrics> => {
    const response = await apiClient.post(ENDPOINTS.PERFORMANCE_METRICS, data);
    return response.data;
  },

  getPerformanceMetrics: async (filters?: SgePerformanceFilters): Promise<SgePerformanceMetrics[]> => {
    const params = new URLSearchParams();
    if (filters?.media_project_id) params.append('media_project_id', filters.media_project_id.toString());
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await apiClient.get(`${ENDPOINTS.PERFORMANCE_METRICS}?${params.toString()}`);
    return response.data;
  },

  // Impact Stories
  createImpactStory: async (data: CreateSgeImpactStory): Promise<SgeImpactStory> => {
    const response = await apiClient.post(ENDPOINTS.IMPACT_STORIES, data);
    return response.data;
  },

  getImpactStories: async (filters?: SgeImpactStoryFilters): Promise<SgeImpactStory[]> => {
    const params = new URLSearchParams();
    if (filters?.media_project_id) params.append('media_project_id', filters.media_project_id.toString());
    if (filters?.story_type) params.append('story_type', filters.story_type);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const response = await apiClient.get(`${ENDPOINTS.IMPACT_STORIES}?${params.toString()}`);
    return response.data;
  },

  // Client Access
  createClientAccess: async (data: CreateSgeClientAccess): Promise<SgeClientAccess> => {
    const response = await apiClient.post(ENDPOINTS.CLIENT_ACCESS, data);
    return response.data;
  },

  getClientAccess: async (isActive?: boolean): Promise<SgeClientAccess[]> => {
    const params = new URLSearchParams();
    if (isActive !== undefined) params.append('is_active', isActive.toString());

    const response = await apiClient.get(`${ENDPOINTS.CLIENT_ACCESS}?${params.toString()}`);
    return response.data;
  },

  // Dashboard and Reports
  getMediaDashboard: async (): Promise<MediaDashboard> => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD);
    return response.data;
  },

  getMediaImpactReport: async (projectId: number): Promise<MediaImpactReport> => {
    const response = await apiClient.get(`${ENDPOINTS.IMPACT_REPORT}/${projectId}`);
    return response.data;
  }
};

// React Query Hooks (if using TanStack Query)
export const useSgeMedia = () => {
  return {
    // Media Projects
    createMediaProject: (data: CreateSgeMediaProject) => sgeMediaApi.createMediaProject(data),
    getMediaProjects: (filters?: SgeMediaFilters) => sgeMediaApi.getMediaProjects(filters),
    getMediaProject: (id: number) => sgeMediaApi.getMediaProject(id),
    updateMediaProject: (id: number, data: UpdateSgeMediaProject) => sgeMediaApi.updateMediaProject(id, data),
    deleteMediaProject: (id: number) => sgeMediaApi.deleteMediaProject(id),

    // Distribution Logs
    createDistributionLog: (data: CreateSgeDistributionLog) => sgeMediaApi.createDistributionLog(data),
    getDistributionLogs: (filters?: SgeDistributionFilters) => sgeMediaApi.getDistributionLogs(filters),

    // Performance Metrics
    createPerformanceMetrics: (data: CreateSgePerformanceMetrics) => sgeMediaApi.createPerformanceMetrics(data),
    getPerformanceMetrics: (filters?: SgePerformanceFilters) => sgeMediaApi.getPerformanceMetrics(filters),

    // Impact Stories
    createImpactStory: (data: CreateSgeImpactStory) => sgeMediaApi.createImpactStory(data),
    getImpactStories: (filters?: SgeImpactStoryFilters) => sgeMediaApi.getImpactStories(filters),

    // Client Access
    createClientAccess: (data: CreateSgeClientAccess) => sgeMediaApi.createClientAccess(data),
    getClientAccess: (isActive?: boolean) => sgeMediaApi.getClientAccess(isActive),

    // Dashboard and Reports
    getMediaDashboard: () => sgeMediaApi.getMediaDashboard(),
    getMediaImpactReport: (projectId: number) => sgeMediaApi.getMediaImpactReport(projectId)
  };
};
