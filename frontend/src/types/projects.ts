// Project Types for NavImpact
// Enterprise-Grade Impact & Intelligence Platform

export type ImpactType = 'social' | 'environmental' | 'community';
export type ProjectStatus = 'planning' | 'active' | 'completed' | 'paused' | 'cancelled';

// Victorian Framework Types
export type VictorianFramework = 
  | 'plan_for_victoria'
  | 'melbourne_2030'
  | 'activity_centres_program'
  | 'greenfields_housing_plan'
  | 'clean_economy_workforce_strategy'
  | 'victorian_aboriginal_affairs_framework';

// Base Project Interface
export interface BaseProject {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  owner_id: number;
}

// Extended Project with Impact Fields
export interface Project extends BaseProject {
  // Impact Context Fields
  outcome_text?: string;        // Outcome headline (e.g., "82 seniors gained lasting digital confidence")
  impact_statement?: string;    // Why this matters (e.g., "Improved digital inclusion for vulnerable populations")
  impact_types: ImpactType[];   // Multi-select: social, environmental, community
  sdg_tags?: string[];          // SDG codes (e.g., ["SDG-4", "SDG-10"])
  framework_alignment?: VictorianFramework[]; // Victorian framework alignment
  evidence_sources?: string;    // Optional evidence sources
  
  // Metrics (for future enhancement)
  reach_count?: number;         // Number of people/communities reached
  impact_score?: number;        // Calculated impact score (0-100)
  
  // Relationships
  tags?: Tag[];
  team_size?: number;
}

// Project Creation/Update Interface
export interface ProjectFormData {
  name: string;
  description?: string;
  status: ProjectStatus;
  impact_types: ImpactType[];
  sdg_tags?: string[];
  framework_alignment?: VictorianFramework[];
  outcome_text?: string;
  impact_statement?: string;
  evidence_sources?: string;
  reach_count?: number;
  start_date?: string;
  end_date?: string;
}

// Tag Interface
export interface Tag {
  id: number;
  name: string;
  color?: string;
}

// Project Filters Interface
export interface ProjectFilters {
  status?: ProjectStatus;
  impact_types?: ImpactType[];
  framework_alignment?: VictorianFramework[];
  sdg_tags?: string[];
  search?: string;
  skip?: number;
  limit?: number;
}

// Project List Response Interface
export interface ProjectListResponse {
  items: Project[];
  total: number;
  skip: number;
  limit: number;
}

// Impact Type Configuration
export const IMPACT_TYPES: Array<{ value: ImpactType; label: string; description: string; color: string }> = [
  {
    value: 'social',
    label: 'Social Impact',
    description: 'Improving people\'s lives and social outcomes',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'environmental',
    label: 'Environmental Impact',
    description: 'Protecting and improving environmental outcomes',
    color: 'bg-green-100 text-green-800',
  },
  {
    value: 'community',
    label: 'Community Impact',
    description: 'Strengthening communities and local connections',
    color: 'bg-purple-100 text-purple-800',
  },
];

// SDG Options for forms
export const SDG_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'SDG 1', label: 'SDG 1 - No Poverty' },
  { value: 'SDG 2', label: 'SDG 2 - Zero Hunger' },
  { value: 'SDG 3', label: 'SDG 3 - Good Health and Well-being' },
  { value: 'SDG 4', label: 'SDG 4 - Quality Education' },
  { value: 'SDG 5', label: 'SDG 5 - Gender Equality' },
  { value: 'SDG 6', label: 'SDG 6 - Clean Water and Sanitation' },
  { value: 'SDG 7', label: 'SDG 7 - Affordable and Clean Energy' },
  { value: 'SDG 8', label: 'SDG 8 - Decent Work and Economic Growth' },
  { value: 'SDG 9', label: 'SDG 9 - Industry, Innovation and Infrastructure' },
  { value: 'SDG 10', label: 'SDG 10 - Reduced Inequalities' },
  { value: 'SDG 11', label: 'SDG 11 - Sustainable Cities and Communities' },
  { value: 'SDG 12', label: 'SDG 12 - Responsible Consumption and Production' },
  { value: 'SDG 13', label: 'SDG 13 - Climate Action' },
  { value: 'SDG 14', label: 'SDG 14 - Life Below Water' },
  { value: 'SDG 15', label: 'SDG 15 - Life on Land' },
  { value: 'SDG 16', label: 'SDG 16 - Peace, Justice and Strong Institutions' },
  { value: 'SDG 17', label: 'SDG 17 - Partnerships for the Goals' },
];

// Victorian Framework Configuration
export const VICTORIAN_FRAMEWORKS: Array<{ value: VictorianFramework; label: string; description: string; color: string; badgeLabel: string }> = [
  {
    value: 'plan_for_victoria',
    label: 'Plan for Victoria',
    description: 'Victoria\'s long-term strategic plan for sustainable growth',
    color: '#1F2937',
    badgeLabel: 'Plan for Victoria',
  },
  {
    value: 'melbourne_2030',
    label: 'Melbourne 2030',
    description: 'Melbourne\'s strategic planning framework for sustainable development',
    color: '#3B82F6',
    badgeLabel: 'Melbourne 2030',
  },
  {
    value: 'activity_centres_program',
    label: 'Activity Centres Program',
    description: 'Framework for developing vibrant, mixed-use activity centres',
    color: '#10B981',
    badgeLabel: 'Activity Centres',
  },
  {
    value: 'greenfields_housing_plan',
    label: 'Greenfields Housing Plan',
    description: 'Strategic approach to new housing development in growth areas',
    color: '#059669',
    badgeLabel: 'Greenfields Plan',
  },
  {
    value: 'clean_economy_workforce_strategy',
    label: 'Clean Economy Workforce Strategy',
    description: 'Building workforce capacity for Victoria\'s clean economy transition',
    color: '#0D9488',
    badgeLabel: 'Clean Economy',
  },
  {
    value: 'victorian_aboriginal_affairs_framework',
    label: 'Victorian Aboriginal Affairs Framework',
    description: 'Supporting Aboriginal self-determination and cultural safety',
    color: '#DC2626',
    badgeLabel: 'Reconciliation (VAAF)',
  },
];

// Legacy VICTORIAN_FRAMEWORKS object format for backward compatibility
export const VICTORIAN_FRAMEWORKS_LEGACY: Record<VictorianFramework, { label: string; description: string; color: string; badgeLabel: string }> = {
  plan_for_victoria: {
    label: 'Plan for Victoria',
    description: 'Victoria\'s long-term strategic plan for sustainable growth',
    color: '#1F2937',
    badgeLabel: 'Plan for Victoria',
  },
  melbourne_2030: {
    label: 'Melbourne 2030',
    description: 'Melbourne\'s strategic planning framework for sustainable development',
    color: '#3B82F6',
    badgeLabel: 'Melbourne 2030',
  },
  activity_centres_program: {
    label: 'Activity Centres Program',
    description: 'Framework for developing vibrant, mixed-use activity centres',
    color: '#10B981',
    badgeLabel: 'Activity Centres',
  },
  greenfields_housing_plan: {
    label: 'Greenfields Housing Plan',
    description: 'Strategic approach to new housing development in growth areas',
    color: '#059669',
    badgeLabel: 'Greenfields Plan',
  },
  clean_economy_workforce_strategy: {
    label: 'Clean Economy Workforce Strategy',
    description: 'Building workforce capacity for Victoria\'s clean economy transition',
    color: '#0D9488',
    badgeLabel: 'Clean Economy',
  },
  victorian_aboriginal_affairs_framework: {
    label: 'Victorian Aboriginal Affairs Framework',
    description: 'Supporting Aboriginal self-determination and cultural safety',
    color: '#DC2626',
    badgeLabel: 'Reconciliation (VAAF)',
  },
};

// Project Status Configuration
export const PROJECT_STATUSES: Array<{ value: ProjectStatus; label: string; description: string; color: string }> = [
  {
    value: 'planning',
    label: 'Planning',
    description: 'Project is in development or planning phase',
    color: 'bg-neutral-100 text-neutral-800',
  },
  {
    value: 'active',
    label: 'Active',
    description: 'Project is currently running and delivering outcomes',
    color: 'bg-impact-100 text-impact-800',
  },
  {
    value: 'completed',
    label: 'Completed',
    description: 'Project has finished with measurable outcomes',
    color: 'bg-success-100 text-success-800',
  },
  {
    value: 'paused',
    label: 'Paused',
    description: 'Project is temporarily on hold',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    description: 'Project has been discontinued',
    color: 'bg-red-100 text-red-800',
  },
];

// Portfolio Summary Interface
export interface PortfolioSummary {
  total_projects: number;
  total_reach: number;
  sdg_alignment_count: number;
  framework_alignment_count: number;
  top_impact_project?: Project;
  impact_type_breakdown: Record<ImpactType, number>;
  status_breakdown: Record<ProjectStatus, number>;
  framework_breakdown: Record<VictorianFramework, number>;
}

// Framework Alignment Summary
export interface FrameworkAlignmentSummary {
  plan_for_victoria: number;
  melbourne_2030: number;
  activity_centres_program: number;
  greenfields_housing_plan: number;
  clean_economy_workforce_strategy: number;
  victorian_aboriginal_affairs_framework: number;
  total_sdg_projects: number;
} 