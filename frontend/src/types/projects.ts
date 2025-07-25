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
  start_date?: string;
  end_date?: string;
  
  // Impact Fields
  outcome_text?: string;
  impact_statement?: string;
  impact_types: ImpactType[];
  sdg_tags?: string[];
  framework_alignment?: VictorianFramework[];
  evidence_sources?: string;
}

// Project List Response
export interface ProjectListResponse {
  items: Project[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
  has_prev: boolean;
}

// Project Filters
export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus;
  impact_types?: ImpactType[];
  sdg_tags?: string[];
  framework_alignment?: VictorianFramework[];
  skip?: number;
  limit?: number;
}

// Tag Interface (for project tags)
export interface Tag {
  id: number;
  name: string;
  color?: string;
  project_count?: number;
}

// Impact Type Configuration
export const IMPACT_TYPES: Record<ImpactType, { label: string; description: string; color: string }> = {
  social: {
    label: 'Social Impact',
    description: 'Improving human wellbeing, equality, and social inclusion',
    color: 'bg-blue-100 text-blue-800',
  },
  environmental: {
    label: 'Environmental Impact',
    description: 'Protecting ecosystems, reducing emissions, and promoting sustainability',
    color: 'bg-green-100 text-green-800',
  },
  community: {
    label: 'Community Impact',
    description: 'Strengthening local communities and fostering civic engagement',
    color: 'bg-purple-100 text-purple-800',
  },
};

// Victorian Framework Configuration
export const VICTORIAN_FRAMEWORKS: Record<VictorianFramework, { 
  label: string; 
  description: string; 
  color: string;
  badgeLabel: string;
}> = {
  plan_for_victoria: {
    label: 'Plan for Victoria',
    description: 'Victoria\'s long-term vision for a fairer, more prosperous state',
    color: '#4F46E5',
    badgeLabel: 'Plan for Victoria',
  },
  melbourne_2030: {
    label: 'Melbourne 2030',
    description: 'Melbourne\'s strategic plan for sustainable urban development',
    color: '#0EA5E9',
    badgeLabel: 'Melbourne 2030',
  },
  activity_centres_program: {
    label: 'Activity Centres Program',
    description: 'Supporting vibrant, accessible activity centres across Victoria',
    color: '#6366F1',
    badgeLabel: 'Activity Centres',
  },
  greenfields_housing_plan: {
    label: 'Greenfields Housing Plan',
    description: 'Sustainable housing development in growth areas',
    color: '#16A34A',
    badgeLabel: 'Greenfields Plan',
  },
  clean_economy_workforce_strategy: {
    label: 'Clean Economy Workforce Strategy',
    description: 'Building Victoria\'s clean energy workforce and capabilities',
    color: '#10B981',
    badgeLabel: 'Clean Economy Workforce',
  },
  victorian_aboriginal_affairs_framework: {
    label: 'Victorian Aboriginal Affairs Framework',
    description: 'Supporting Aboriginal self-determination and cultural safety',
    color: '#DC2626',
    badgeLabel: 'Reconciliation (VAAF)',
  },
};

// Project Status Configuration
export const PROJECT_STATUSES: Record<ProjectStatus, { label: string; description: string; color: string }> = {
  planning: {
    label: 'Planning',
    description: 'Project is in development or planning phase',
    color: 'bg-neutral-100 text-neutral-800',
  },
  active: {
    label: 'Active',
    description: 'Project is currently running and delivering outcomes',
    color: 'bg-impact-100 text-impact-800',
  },
  completed: {
    label: 'Completed',
    description: 'Project has finished with measurable outcomes',
    color: 'bg-success-100 text-success-800',
  },
  paused: {
    label: 'Paused',
    description: 'Project is temporarily on hold',
    color: 'bg-yellow-100 text-yellow-800',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Project has been discontinued',
    color: 'bg-red-100 text-red-800',
  },
};

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