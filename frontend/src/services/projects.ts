// Projects Service for NavImpact
// Enterprise-Grade Impact & Intelligence Platform

import { apiClient } from './api';
import { 
  Project, 
  ProjectFormData, 
  ProjectListResponse, 
  ProjectFilters, 
  PortfolioSummary,
  ImpactType,
  ProjectStatus 
} from '@/types/projects';

class ProjectsService {
  // Get all projects with filtering
  async getProjects(filters?: ProjectFilters): Promise<ProjectListResponse> {
    const queryParams: Record<string, string> = {};
    
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.impact_types) queryParams.impact_types = filters.impact_types.join(',');
    if (filters?.sdg_tags) queryParams.sdg_tags = filters.sdg_tags.join(',');
    if (filters?.skip) queryParams.skip = filters.skip.toString();
    if (filters?.limit) queryParams.limit = filters.limit.toString();
    
    return apiClient.request<ProjectListResponse>('/api/v1/projects/', {}, queryParams);
  }

  // Get single project by ID
  async getProject(id: number): Promise<Project> {
    return apiClient.request<Project>(`/api/v1/projects/${id}/`);
  }

  // Create new project
  async createProject(data: ProjectFormData): Promise<Project> {
    return apiClient.request<Project>('/api/v1/projects/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update existing project
  async updateProject(id: number, data: Partial<ProjectFormData>): Promise<Project> {
    return apiClient.request<Project>(`/api/v1/projects/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Delete project
  async deleteProject(id: number): Promise<void> {
    return apiClient.request<void>(`/api/v1/projects/${id}/`, {
      method: 'DELETE',
    });
  }

  // Get projects by impact type
  async getProjectsByImpactType(impactType: ImpactType, filters?: Omit<ProjectFilters, 'impact_types'>): Promise<ProjectListResponse> {
    const queryParams: Record<string, string> = {
      impact_types: impactType,
    };
    
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.sdg_tags) queryParams.sdg_tags = filters.sdg_tags.join(',');
    if (filters?.skip) queryParams.skip = filters.skip.toString();
    if (filters?.limit) queryParams.limit = filters.limit.toString();
    
    return apiClient.request<ProjectListResponse>('/api/v1/projects/', {}, queryParams);
  }

  // Get projects by status
  async getProjectsByStatus(status: ProjectStatus, filters?: Omit<ProjectFilters, 'status'>): Promise<ProjectListResponse> {
    const queryParams: Record<string, string> = {
      status,
    };
    
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.impact_types) queryParams.impact_types = filters.impact_types.join(',');
    if (filters?.sdg_tags) queryParams.sdg_tags = filters.sdg_tags.join(',');
    if (filters?.skip) queryParams.skip = filters.skip.toString();
    if (filters?.limit) queryParams.limit = filters.limit.toString();
    
    return apiClient.request<ProjectListResponse>('/api/v1/projects/', {}, queryParams);
  }

  // Get projects by SDG
  async getProjectsBySDG(sdgCode: string, filters?: Omit<ProjectFilters, 'sdg_tags'>): Promise<ProjectListResponse> {
    const queryParams: Record<string, string> = {
      sdg_tags: sdgCode,
    };
    
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.impact_types) queryParams.impact_types = filters.impact_types.join(',');
    if (filters?.skip) queryParams.skip = filters.skip.toString();
    if (filters?.limit) queryParams.limit = filters.limit.toString();
    
    return apiClient.request<ProjectListResponse>('/api/v1/projects/', {}, queryParams);
  }

  // Search projects by name/description
  async searchProjects(query: string, filters?: Omit<ProjectFilters, 'search'>): Promise<ProjectListResponse> {
    const queryParams: Record<string, string> = {
      search: query,
    };
    
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.impact_types) queryParams.impact_types = filters.impact_types.join(',');
    if (filters?.sdg_tags) queryParams.sdg_tags = filters.sdg_tags.join(',');
    if (filters?.skip) queryParams.skip = filters.skip.toString();
    if (filters?.limit) queryParams.limit = filters.limit.toString();
    
    return apiClient.request<ProjectListResponse>('/api/v1/projects/', {}, queryParams);
  }

  // Get portfolio summary (for dashboard)
  async getPortfolioSummary(): Promise<PortfolioSummary> {
    return apiClient.request<PortfolioSummary>('/api/v1/projects/portfolio-summary/');
  }

  // Get recent projects (for dashboard)
  async getRecentProjects(limit: number = 5): Promise<Project[]> {
    const response = await apiClient.request<ProjectListResponse>('/api/v1/projects/', {}, {
      limit: limit.toString(),
      sort: 'updated_at',
      order: 'desc',
    });
    return response.items;
  }

  // Get high-impact projects
  async getHighImpactProjects(limit: number = 10): Promise<Project[]> {
    const response = await apiClient.request<ProjectListResponse>('/api/v1/projects/', {}, {
      limit: limit.toString(),
      sort: 'impact_score',
      order: 'desc',
    });
    return response.items;
  }
}

// Export singleton instance
export const projectsService = new ProjectsService();

// Export individual methods for convenience
export const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByImpactType,
  getProjectsByStatus,
  getProjectsBySDG,
  searchProjects,
  getPortfolioSummary,
  getRecentProjects,
  getHighImpactProjects,
} = projectsService; 