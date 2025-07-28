import { apiClient } from '@/lib/api-client';

export interface NotionConnection {
  id: number;
  name: string;
  type: 'database' | 'page' | 'workspace';
  status: 'connected' | 'pending' | 'disconnected' | 'error';
  database_id?: string;
  workspace_id?: string;
  description?: string;
  items_count: number;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}

export interface NotionUpdate {
  id: number;
  title: string;
  type: 'create' | 'update' | 'delete' | 'comment';
  database_name: string;
  user_name: string;
  timestamp: string;
  description?: string;
}

export interface NotionSync {
  connection_id: number;
  items_synced: number;
  sync_time: string;
  status: string;
  errors: string[];
}

export interface NotionHealthStatus {
  status: string;
  connected_databases: number;
  total_items: number;
  last_sync?: string;
  errors: string[];
}

// Notion API functions
export const notionApi = {
  // Get all Notion connections
  getConnections: async (): Promise<NotionConnection[]> => {
    const response = await apiClient.get('/api/v1/notion/connections');
    return response.data;
  },

  // Connect a new Notion database
  connectDatabase: async (databaseId: string, databaseName: string): Promise<NotionConnection> => {
    const response = await apiClient.post('/api/v1/notion/connect', {
      database_id: databaseId,
      database_name: databaseName,
    });
    return response.data;
  },

  // Sync a specific connection
  syncConnection: async (connectionId: number): Promise<NotionSync> => {
    const response = await apiClient.get(`/api/v1/notion/sync/${connectionId}`);
    return response.data;
  },

  // Get recent updates
  getRecentUpdates: async (): Promise<NotionUpdate[]> => {
    const response = await apiClient.get('/api/v1/notion/updates');
    return response.data;
  },

  // Disconnect a database
  disconnectDatabase: async (connectionId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/notion/disconnect/${connectionId}`);
  },

  // Health check
  healthCheck: async (): Promise<NotionHealthStatus> => {
    const response = await apiClient.get('/api/v1/notion/health');
    return response.data;
  },
};

// React Query hooks for Notion
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useNotionConnections = () => {
  return useQuery({
    queryKey: ['notion', 'connections'],
    queryFn: notionApi.getConnections,
  });
};

export const useNotionRecentUpdates = () => {
  return useQuery({
    queryKey: ['notion', 'updates'],
    queryFn: notionApi.getRecentUpdates,
  });
};

export const useNotionHealth = () => {
  return useQuery({
    queryKey: ['notion', 'health'],
    queryFn: notionApi.healthCheck,
  });
};

export const useConnectNotionDatabase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ databaseId, databaseName }: { databaseId: string; databaseName: string }) =>
      notionApi.connectDatabase(databaseId, databaseName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion', 'connections'] });
      queryClient.invalidateQueries({ queryKey: ['notion', 'health'] });
    },
  });
};

export const useSyncNotionConnection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (connectionId: number) => notionApi.syncConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion', 'connections'] });
      queryClient.invalidateQueries({ queryKey: ['notion', 'updates'] });
    },
  });
};

export const useDisconnectNotionDatabase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (connectionId: number) => notionApi.disconnectDatabase(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion', 'connections'] });
      queryClient.invalidateQueries({ queryKey: ['notion', 'health'] });
    },
  });
}; 