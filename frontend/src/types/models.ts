// Base interfaces for the SGE Dashboard

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: Date;
  updated_at: Date;
  // New profile fields (all optional for backward compatibility)
  bio?: string;
  avatar_url?: string;
  job_title?: string;
  organisation?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  current_status?: string;
  skills?: string[];
  interests?: string[];
  social_links?: Record<string, any>;
  is_intern?: boolean;
  mentor_id?: number;
  preferences?: Record<string, any>;
}

// Extended interfaces for SGE team collaboration
export interface SGETeamMember extends User {
  projects_assigned: string[];
}

export interface InternProfile extends SGETeamMember {
  mentor_name?: string;
  learning_goals: string[];
  skills_learning: string[];
  projects_involved: string[];
}

export interface UserProfile extends User {
  // Additional profile-specific fields can be added here
}

export interface UserStatusUpdate {
  current_status: string;
}

export interface UserMentorUpdate {
  mentor_id?: number;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  color?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Grant {
  id: number;
  title: string;
  description?: string;
  source: string;
  source_url?: string;
  application_url?: string;
  contact_email?: string;
  min_amount?: number;
  max_amount?: number;
  open_date?: Date;
  deadline?: Date;
  industry_focus?: string;
  location_eligibility?: string;
  org_type_eligible?: string[];
  funding_purpose?: string[];
  audience_tags?: string[];
  status: 'draft' | 'open' | 'closed' | 'archived' | 'closing_soon';
  notes?: string;
  created_at: Date;
  updated_at: Date;
  created_by_id?: number;
  tags?: Tag[];
  // AI-enhanced properties
  relevance_score?: number;
  success_probability?: number;
  application_status?: 'not_started' | 'in_progress' | 'submitted' | 'awarded' | 'rejected';
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'pending' | 'draft' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  created_by_id: number;
  tags?: Tag[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
  created_by_id: number;
  assigned_to_id?: number;
  project_id?: number;
  tags?: Tag[];
  total_time_spent?: number;
  comment_count?: number;
  reaction_summary?: Record<string, number>;
  assignee_id?: number; // Alias for assigned_to_id for compatibility
}

export interface TaskComment {
  id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  created_by_id: number;
  task_id: number;
  parent_id?: number;
  reactions?: Reaction[];
}

export interface Reaction {
  id: number;
  emoji: string;
  created_at: Date;
  created_by_id: number;
  comment_id: number;
}

export interface TimeEntry {
  id: number;
  task_id: number;
  user_id: number;
  start_time: Date;
  end_time?: Date;
  duration_minutes?: number;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TeamMember {
  id: number;
  user_id: number;
  project_id: number;
  role: string;
  joined_at: Date;
  created_at: Date;
  updated_at: Date;
}

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
  recent_applications: GrantApplication[];
  upcoming_deadlines: Grant[];
  saved_searches: SavedSearch[];
  alerts: GrantAlert[];
}

export interface GrantApplication {
  id: number;
  grant_id: number;
  user_id: number;
  status: 'not_started' | 'in_progress' | 'submitted' | 'awarded' | 'rejected';
  progress_percentage: number;
  notes?: string;
  team_members?: string[];
  documents?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface SavedSearch {
  id: number;
  name: string;
  filters: Record<string, any>;
  user_id: number;
  last_used: Date;
  result_count: number;
  is_alert_enabled: boolean;
}

export interface GrantAlert {
  id: number;
  user_id: number;
  search_id: number;
  name: string;
  conditions: Record<string, any>;
  is_active: boolean;
  last_triggered?: Date;
  created_at: Date;
}

export interface GrantNote {
  id: number;
  grant_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface GrantDocument {
  id: number;
  grant_id: number;
  user_id: number;
  filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: Date;
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

// Filter and pagination types
export interface GrantFilters {
  search?: string;
  status?: string;
  industry_focus?: string;
  location_eligibility?: string;
  org_type?: string;
  min_amount?: number;
  max_amount?: number;
  deadline_before?: string;
  deadline_after?: string;
  funding_purpose?: string;
  audience_tags?: string;
  relevance_score_min?: number;
  success_probability_min?: number;
  page?: number;
  size?: number;
  source?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface CreateGrantInput {
  title: string;
  description?: string;
  source: string;
  source_url?: string;
  application_url?: string;
  contact_email?: string;
  min_amount?: number;
  max_amount?: number;
  open_date?: string;
  deadline?: string;
  industry_focus?: string;
  location_eligibility?: string;
  org_type_eligible?: string[];
  funding_purpose?: string[];
  audience_tags?: string[];
  status?: string;
  notes?: string;
  tags?: string[];
}

export interface CreateTagRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateTagRequest extends Partial<CreateTagRequest> {}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  project_id?: number;
  assigned_to_id?: number;
  tags?: number[];
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface ErrorResponse {
  detail: string;
  status_code: number;
}

// Utility types
export interface SelectOption {
  value: string;
  label: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

// Victorian Framework types
export type VictorianFramework = 
  | 'economic_development'
  | 'social_inclusion'
  | 'environmental_sustainability'
  | 'health_and_wellbeing'
  | 'education_and_skills'
  | 'infrastructure'
  | 'innovation'
  | 'regional_development';

export interface VictorianFrameworkConfig {
  value: VictorianFramework;
  label: string;
  color: string;
  description: string;
}

// SDG types
export type SDGCode = 
  | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | '11' | '12' | '13' | '14' | '15' | '16' | '17';

export interface SDGConfig {
  code: SDGCode;
  title: string;
  color: string;
  description: string;
}

// Impact measurement types
export interface ImpactMetric {
  id: number;
  name: string;
  description?: string;
  unit: string;
  target_value?: number;
  current_value?: number;
  project_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ImpactScore {
  overall_score: number;
  economic_score: number;
  social_score: number;
  environmental_score: number;
  governance_score: number;
  breakdown: Record<string, number>;
  recommendations: string[];
}

// Collaboration types
export interface GrantCollaboration {
  grant_id: number;
  team_members: TeamMember[];
  shared_documents: GrantDocument[];
  discussion_threads: DiscussionThread[];
  task_assignments: Task[];
}

export interface DiscussionThread {
  id: number;
  title: string;
  content: string;
  created_by_id: number;
  grant_id: number;
  created_at: Date;
  updated_at: Date;
  replies: DiscussionReply[];
}

export interface DiscussionReply {
  id: number;
  content: string;
  created_by_id: number;
  thread_id: number;
  created_at: Date;
  updated_at: Date;
}

// Notification types
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: Date;
  related_entity_type?: string;
  related_entity_id?: number;
}

// Search and discovery types
export interface SearchSuggestion {
  text: string;
  type: 'recent' | 'popular' | 'ai_generated';
  relevance_score?: number;
}

export interface SearchHistory {
  id: number;
  user_id: number;
  query: string;
  filters: Record<string, any>;
  result_count: number;
  created_at: Date;
}

// Analytics and reporting types
export interface GrantMetrics {
  total_applications: number;
  success_rate: number;
  average_processing_time?: number;
  total_funding_received: number;
  sector_performance: Record<string, number>;
  monthly_trends: Record<string, any>[];
}

export interface PerformanceReport {
  period: string;
  metrics: GrantMetrics;
  top_performing_grants: Grant[];
  areas_for_improvement: string[];
  recommendations: string[];
}

// Export and import types
export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  include_analytics: boolean;
  include_recommendations: boolean;
  date_range?: {
    start: string;
    end: string;
  };
  filters?: GrantFilters;
}

export interface ImportResult {
  total_imported: number;
  total_skipped: number;
  errors: string[];
  warnings: string[];
}