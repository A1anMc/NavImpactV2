/**
 * Notion Integration Service
 * 
 * This service handles all API calls related to the Notion integration.
 * It provides methods for workspace management, sync operations, and monitoring.
 */

import { apiClient } from '@/lib/api-client';
import {
  NotionWorkspaceResponse,
  NotionSyncMappingResponse,
  NotionSyncLogResponse,
  NotionConnectionRequest,
  NotionSyncRequest,
  NotionTemplateRequest,
  NotionSyncStatus,
  NotionSyncDashboard,
  NotionWorkspaceFilters,
  NotionSyncMappingFilters,
  NotionSyncLogFilters,
  PaginatedNotionWorkspaces,
  PaginatedNotionSyncMappings,
  PaginatedNotionSyncLogs,
  NotionWorkspaceCreate,
  NotionWorkspaceUpdate,
  NotionSyncMappingCreate,
  NotionSyncMappingUpdate,
  SyncDirection,
  SyncStatus,
  OperationType,
  EntityType,
  LogStatus
} from '@/types/notion-integration';

// API Endpoints
const ENDPOINTS = {
  WORKSPACES: '/api/v1/notion/workspaces',
  SYNC_PROJECT: '/api/v1/notion/sync-project',
  SYNC_STATUS: '/api/v1/notion/sync-status',
  SYNC_MAPPINGS: '/api/v1/notion/sync-mappings',
  SYNC_LOGS: '/api/v1/notion/sync-logs',
  CONNECT_WORKSPACE: '/api/v1/notion/connect-workspace',
  CREATE_TEMPLATE: '/api/v1/notion/create-template',
  DASHBOARD: '/api/v1/notion/dashboard'
} as const;

// Notion Integration API service
export const notionApi = {
  // Workspace Management
  connectWorkspace: async (data: NotionConnectionRequest): Promise<NotionWorkspaceResponse> => {
    const response = await apiClient.post(ENDPOINTS.CONNECT_WORKSPACE, data);
    return response.data;
  },

  getWorkspaces: async (filters?: NotionWorkspaceFilters, page = 1, size = 100): Promise<PaginatedNotionWorkspaces> => {
    const params = new URLSearchParams();
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
    if (filters?.workspace_name) params.append('workspace_name', filters.workspace_name);
    params.append('skip', ((page - 1) * size).toString());
    params.append('limit', size.toString());

    const response = await apiClient.get(`${ENDPOINTS.WORKSPACES}?${params.toString()}`);
    return response.data;
  },

  getWorkspace: async (workspaceId: number): Promise<NotionWorkspaceResponse> => {
    const response = await apiClient.get(`${ENDPOINTS.WORKSPACES}/${workspaceId}`);
    return response.data;
  },

  updateWorkspace: async (workspaceId: number, data: NotionWorkspaceUpdate): Promise<NotionWorkspaceResponse> => {
    const response = await apiClient.put(`${ENDPOINTS.WORKSPACES}/${workspaceId}`, data);
    return response.data;
  },

  deleteWorkspace: async (workspaceId: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.WORKSPACES}/${workspaceId}`);
  },

  // Sync Operations
  syncProject: async (projectId: number, data: NotionSyncRequest): Promise<any> => {
    const response = await apiClient.post(`${ENDPOINTS.SYNC_PROJECT}/${projectId}`, data);
    return response.data;
  },

  getSyncStatus: async (): Promise<NotionSyncStatus> => {
    const response = await apiClient.get(ENDPOINTS.SYNC_STATUS);
    return response.data;
  },

  getSyncMappings: async (filters?: NotionSyncMappingFilters, page = 1, size = 100): Promise<PaginatedNotionSyncMappings> => {
    const params = new URLSearchParams();
    if (filters?.media_project_id) params.append('media_project_id', filters.media_project_id.toString());
    if (filters?.sync_status) params.append('sync_status', filters.sync_status);
    if (filters?.sync_direction) params.append('sync_direction', filters.sync_direction);
    params.append('skip', ((page - 1) * size).toString());
    params.append('limit', size.toString());

    const response = await apiClient.get(`${ENDPOINTS.SYNC_MAPPINGS}?${params.toString()}`);
    return response.data;
  },

  getSyncLogs: async (filters?: NotionSyncLogFilters, page = 1, size = 100): Promise<PaginatedNotionSyncLogs> => {
    const params = new URLSearchParams();
    if (filters?.workspace_id) params.append('workspace_id', filters.workspace_id.toString());
    if (filters?.operation_type) params.append('operation_type', filters.operation_type);
    if (filters?.entity_type) params.append('entity_type', filters.entity_type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    params.append('skip', ((page - 1) * size).toString());
    params.append('limit', size.toString());

    const response = await apiClient.get(`${ENDPOINTS.SYNC_LOGS}?${params.toString()}`);
    return response.data;
  },

  // Template Management
  createTemplate: async (data: NotionTemplateRequest): Promise<any> => {
    const response = await apiClient.post(ENDPOINTS.CREATE_TEMPLATE, data);
    return response.data;
  },

  // Dashboard
  getDashboard: async (): Promise<NotionSyncDashboard> => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD);
    return response.data;
  }
};

// React Query Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query keys
export const notionKeys = {
  all: ['notion'] as const,
  workspaces: () => [...notionKeys.all, 'workspaces'] as const,
  workspace: (id: number) => [...notionKeys.workspaces(), id] as const,
  syncStatus: () => [...notionKeys.all, 'sync-status'] as const,
  syncMappings: (filters?: NotionSyncMappingFilters) => [...notionKeys.all, 'sync-mappings', filters] as const,
  syncLogs: (filters?: NotionSyncLogFilters) => [...notionKeys.all, 'sync-logs', filters] as const,
  dashboard: () => [...notionKeys.all, 'dashboard'] as const
};

// Workspace Hooks
export const useNotionWorkspaces = (filters?: NotionWorkspaceFilters, page = 1, size = 100) => {
  return useQuery({
    queryKey: [...notionKeys.workspaces(), filters, page, size],
    queryFn: () => notionApi.getWorkspaces(filters, page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNotionWorkspace = (workspaceId: number) => {
  return useQuery({
    queryKey: notionKeys.workspace(workspaceId),
    queryFn: () => notionApi.getWorkspace(workspaceId),
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useConnectNotionWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NotionConnectionRequest) => notionApi.connectWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notionKeys.workspaces() });
      queryClient.invalidateQueries({ queryKey: notionKeys.syncStatus() });
      queryClient.invalidateQueries({ queryKey: notionKeys.dashboard() });
    },
  });
};

export const useUpdateNotionWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: number; data: NotionWorkspaceUpdate }) =>
      notionApi.updateWorkspace(workspaceId, data),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: notionKeys.workspace(workspaceId) });
      queryClient.invalidateQueries({ queryKey: notionKeys.workspaces() });
      queryClient.invalidateQueries({ queryKey: notionKeys.dashboard() });
    },
  });
};

export const useDeleteNotionWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (workspaceId: number) => notionApi.deleteWorkspace(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notionKeys.workspaces() });
      queryClient.invalidateQueries({ queryKey: notionKeys.syncStatus() });
      queryClient.invalidateQueries({ queryKey: notionKeys.dashboard() });
    },
  });
};

// Sync Hooks
export const useNotionSyncStatus = () => {
  return useQuery({
    queryKey: notionKeys.syncStatus(),
    queryFn: () => notionApi.getSyncStatus(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

export const useNotionSyncMappings = (filters?: NotionSyncMappingFilters, page = 1, size = 100) => {
  return useQuery({
    queryKey: [...notionKeys.syncMappings(filters), page, size],
    queryFn: () => notionApi.getSyncMappings(filters, page, size),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useNotionSyncLogs = (filters?: NotionSyncLogFilters, page = 1, size = 100) => {
  return useQuery({
    queryKey: [...notionKeys.syncLogs(filters), page, size],
    queryFn: () => notionApi.getSyncLogs(filters, page, size),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useSyncProjectToNotion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: NotionSyncRequest }) =>
      notionApi.syncProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notionKeys.syncStatus() });
      queryClient.invalidateQueries({ queryKey: notionKeys.syncMappings() });
      queryClient.invalidateQueries({ queryKey: notionKeys.syncLogs() });
      queryClient.invalidateQueries({ queryKey: notionKeys.dashboard() });
    },
  });
};

// Template Hooks
export const useCreateNotionTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NotionTemplateRequest) => notionApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notionKeys.dashboard() });
    },
  });
};

// Dashboard Hooks
export const useNotionDashboard = () => {
  return useQuery({
    queryKey: notionKeys.dashboard(),
    queryFn: () => notionApi.getDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Utility Hooks
export const useNotionIntegration = () => {
  return {
    // Workspace Management
    connectWorkspace: useConnectNotionWorkspace(),
    updateWorkspace: useUpdateNotionWorkspace(),
    deleteWorkspace: useDeleteNotionWorkspace(),
    
    // Sync Operations
    syncProject: useSyncProjectToNotion(),
    
    // Template Management
    createTemplate: useCreateNotionTemplate(),
    
    // Data Queries
    workspaces: useNotionWorkspaces(),
    syncStatus: useNotionSyncStatus(),
    syncMappings: useNotionSyncMappings(),
    syncLogs: useNotionSyncLogs(),
    dashboard: useNotionDashboard(),
  };
};

// Helper functions
export const getSyncStatusColor = (status: SyncStatus): string => {
  switch (status) {
    case SyncStatus.COMPLETED:
      return 'text-green-600 bg-green-100';
    case SyncStatus.SYNCING:
      return 'text-blue-600 bg-blue-100';
    case SyncStatus.PENDING:
      return 'text-yellow-600 bg-yellow-100';
    case SyncStatus.FAILED:
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getLogStatusColor = (status: LogStatus): string => {
  switch (status) {
    case LogStatus.SUCCESS:
      return 'text-green-600 bg-green-100';
    case LogStatus.FAILED:
      return 'text-red-600 bg-red-100';
    case LogStatus.PARTIAL:
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getOperationTypeLabel = (operationType: OperationType): string => {
  switch (operationType) {
    case OperationType.CREATE_PAGE:
      return 'Create Page';
    case OperationType.UPDATE_PAGE:
      return 'Update Page';
    case OperationType.DELETE_PAGE:
      return 'Delete Page';
    case OperationType.SYNC_PROJECT:
      return 'Sync Project';
    case OperationType.SYNC_DISTRIBUTION:
      return 'Sync Distribution';
    case OperationType.SYNC_PERFORMANCE:
      return 'Sync Performance';
    case OperationType.SYNC_IMPACT_STORY:
      return 'Sync Impact Story';
    default:
      return 'Unknown Operation';
  }
};

export const getEntityTypeLabel = (entityType: EntityType): string => {
  switch (entityType) {
    case EntityType.MEDIA_PROJECT:
      return 'Media Project';
    case EntityType.DISTRIBUTION_LOG:
      return 'Distribution Log';
    case EntityType.PERFORMANCE_METRICS:
      return 'Performance Metrics';
    case EntityType.IMPACT_STORY:
      return 'Impact Story';
    case EntityType.CLIENT_ACCESS:
      return 'Client Access';
    default:
      return 'Unknown Entity';
  }
};

export const formatSyncDuration = (durationMs: number): string => {
  if (durationMs < 1000) {
    return `${durationMs}ms`;
  } else if (durationMs < 60000) {
    return `${(durationMs / 1000).toFixed(1)}s`;
  } else {
    return `${(durationMs / 60000).toFixed(1)}m`;
  }
}; 