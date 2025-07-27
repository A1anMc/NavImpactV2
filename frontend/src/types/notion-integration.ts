/**
 * Notion Integration Types
 * TypeScript interfaces for Notion integration functionality
 */

// Enums
export enum SyncDirection {
  NAVIMPACT_TO_NOTION = "navimpact_to_notion",
  NOTION_TO_NAVIMPACT = "notion_to_navimpact",
  BIDIRECTIONAL = "bidirectional"
}

export enum SyncStatus {
  PENDING = "pending",
  SYNCING = "syncing",
  COMPLETED = "completed",
  FAILED = "failed"
}

export enum OperationType {
  CREATE_PAGE = "create_page",
  UPDATE_PAGE = "update_page",
  DELETE_PAGE = "delete_page",
  SYNC_PROJECT = "sync_project",
  SYNC_DISTRIBUTION = "sync_distribution",
  SYNC_PERFORMANCE = "sync_performance",
  SYNC_IMPACT_STORY = "sync_impact_story"
}

export enum EntityType {
  MEDIA_PROJECT = "media_project",
  DISTRIBUTION_LOG = "distribution_log",
  PERFORMANCE_METRICS = "performance_metrics",
  IMPACT_STORY = "impact_story",
  CLIENT_ACCESS = "client_access"
}

export enum LogStatus {
  SUCCESS = "success",
  FAILED = "failed",
  PARTIAL = "partial"
}

// Base Interfaces
export interface NotionWorkspaceBase {
  workspace_id: string;
  workspace_name: string;
  bot_user_id?: string;
  is_active: boolean;
}

export interface NotionSyncMappingBase {
  notion_page_id: string;
  notion_database_id?: string;
  sync_direction: SyncDirection;
  sync_status: SyncStatus;
}

export interface NotionSyncLogBase {
  operation_type: OperationType;
  entity_type: EntityType;
  entity_id?: string;
  status: LogStatus;
  error_message?: string;
  sync_duration_ms?: number;
}

// Create Interfaces
export interface NotionWorkspaceCreate extends NotionWorkspaceBase {
  access_token: string;
}

export interface NotionSyncMappingCreate extends NotionSyncMappingBase {
  media_project_id?: number;
}

export interface NotionSyncLogCreate extends NotionSyncLogBase {
  workspace_id?: number;
}

// Update Interfaces
export interface NotionWorkspaceUpdate {
  workspace_name?: string;
  access_token?: string;
  bot_user_id?: string;
  is_active?: boolean;
}

export interface NotionSyncMappingUpdate {
  notion_database_id?: string;
  sync_direction?: SyncDirection;
  sync_status?: SyncStatus;
}

// Response Interfaces
export interface NotionWorkspaceResponse extends NotionWorkspaceBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface NotionSyncMappingResponse extends NotionSyncMappingBase {
  id: number;
  media_project_id?: number;
  last_sync_at?: string;
  created_at: string;
}

export interface NotionSyncLogResponse extends NotionSyncLogBase {
  id: number;
  workspace_id?: number;
  created_at: string;
}

// Specialized Interfaces
export interface NotionConnectionRequest {
  code: string;
  state?: string;
}

export interface NotionSyncRequest {
  project_id: number;
  force_sync: boolean;
  sync_direction?: SyncDirection;
}

export interface NotionTemplateRequest {
  template_name: string;
  parent_page_id: string;
  project_data?: Record<string, any>;
}

export interface NotionSyncStatus {
  workspace_id: number;
  workspace_name: string;
  is_connected: boolean;
  last_sync_at?: string;
  sync_status: SyncStatus;
  total_mappings: number;
  pending_mappings: number;
  failed_mappings: number;
  recent_errors: string[];
}

export interface NotionSyncDashboard {
  workspaces: NotionWorkspaceResponse[];
  sync_status: NotionSyncStatus;
  recent_logs: NotionSyncLogResponse[];
  sync_analytics: Record<string, any>;
}

// Filter Interfaces
export interface NotionWorkspaceFilters {
  is_active?: boolean;
  workspace_name?: string;
}

export interface NotionSyncMappingFilters {
  media_project_id?: number;
  sync_status?: SyncStatus;
  sync_direction?: SyncDirection;
}

export interface NotionSyncLogFilters {
  workspace_id?: number;
  operation_type?: OperationType;
  entity_type?: EntityType;
  status?: LogStatus;
  start_date?: string;
  end_date?: string;
}

// Pagination Interfaces
export interface PaginatedNotionWorkspaces {
  items: NotionWorkspaceResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginatedNotionSyncMappings {
  items: NotionSyncMappingResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginatedNotionSyncLogs {
  items: NotionSyncLogResponse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Notion API Response Interfaces
export interface NotionPage {
  id: string;
  url: string;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  properties: Record<string, any>;
  parent: {
    type: string;
    page_id?: string;
    database_id?: string;
  };
}

export interface NotionDatabase {
  id: string;
  url: string;
  title: NotionRichText[];
  description: NotionRichText[];
  properties: Record<string, NotionProperty>;
  parent: {
    type: string;
    page_id?: string;
    database_id?: string;
  };
}

export interface NotionRichText {
  type: string;
  text: {
    content: string;
    link?: {
      url: string;
    };
  };
  annotations?: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string;
}

export interface NotionProperty {
  id: string;
  type: string;
  name: string;
  title?: {
    rich_text: NotionRichText[];
  };
  rich_text?: {
    rich_text: NotionRichText[];
  };
  number?: number;
  select?: {
    name: string;
    color: string;
  };
  multi_select?: Array<{
    name: string;
    color: string;
  }>;
  date?: {
    start: string;
    end?: string;
  };
  checkbox?: boolean;
  url?: string;
  email?: string;
  phone_number?: string;
  formula?: {
    type: string;
    string?: string;
    number?: number;
    boolean?: boolean;
    date?: {
      start: string;
      end?: string;
    };
  };
  relation?: Array<{
    id: string;
  }>;
  rollup?: {
    type: string;
    number?: number;
    date?: {
      start: string;
      end?: string;
    };
    array?: any[];
  };
  people?: Array<{
    object: string;
    id: string;
    name?: string;
    avatar_url?: string;
    type: string;
    person?: {
      email: string;
    };
    bot?: {
      workspace_name: string;
    };
  }>;
  files?: Array<{
    name: string;
    type: string;
    file?: {
      url: string;
      expiry_time: string;
    };
    external?: {
      url: string;
    };
  }>;
  created_by?: {
    object: string;
    id: string;
  };
  created_time?: string;
  last_edited_by?: {
    object: string;
    id: string;
  };
  last_edited_time?: string;
}

// Template Interfaces
export interface NotionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  properties: Record<string, NotionProperty>;
  content: NotionBlock[];
}

export interface NotionBlock {
  object: string;
  id: string;
  type: string;
  created_time: string;
  last_edited_time: string;
  has_children: boolean;
  archived: boolean;
  heading_1?: {
    rich_text: NotionRichText[];
    color: string;
    is_toggleable: boolean;
  };
  heading_2?: {
    rich_text: NotionRichText[];
    color: string;
    is_toggleable: boolean;
  };
  heading_3?: {
    rich_text: NotionRichText[];
    color: string;
    is_toggleable: boolean;
  };
  paragraph?: {
    rich_text: NotionRichText[];
    color: string;
  };
  bulleted_list_item?: {
    rich_text: NotionRichText[];
    color: string;
  };
  numbered_list_item?: {
    rich_text: NotionRichText[];
    color: string;
  };
  callout?: {
    rich_text: NotionRichText[];
    icon: {
      type: string;
      emoji?: string;
      file?: {
        url: string;
        expiry_time: string;
      };
      external?: {
        url: string;
      };
    };
    color: string;
  };
  table_of_contents?: {
    color: string;
  };
  divider?: {
    color: string;
  };
  image?: {
    caption: NotionRichText[];
    type: string;
    file?: {
      url: string;
      expiry_time: string;
    };
    external?: {
      url: string;
    };
  };
}

// Component Props Interfaces
export interface NotionConnectionProps {
  onConnect: (workspace: NotionWorkspaceResponse) => void;
  onError: (error: string) => void;
}

export interface NotionSyncStatusProps {
  syncStatus: NotionSyncStatus;
  onRefresh: () => void;
}

export interface NotionSyncLogProps {
  logs: NotionSyncLogResponse[];
  onViewDetails: (log: NotionSyncLogResponse) => void;
}

export interface NotionTemplateSelectorProps {
  templates: NotionTemplate[];
  onSelectTemplate: (template: NotionTemplate) => void;
  selectedTemplate?: NotionTemplate;
}

export interface NotionSyncControlsProps {
  projectId: number;
  onSync: (request: NotionSyncRequest) => void;
  isSyncing: boolean;
  lastSyncAt?: string;
} 