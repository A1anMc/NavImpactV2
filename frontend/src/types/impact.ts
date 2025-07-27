// Impact Measurement Types for NavImpact
// Enterprise-Grade Impact & Intelligence Platform

// Core Impact Metrics
export interface ImpactMetrics {
  reach_count: number;
  outcome_count: number;
  sustainability_score: number;
  innovation_score: number;
  evidence_quality: number;
  stakeholder_satisfaction: number;
  cost_effectiveness: number;
  scalability_potential: number;
}

// Impact Score Calculation
export interface ImpactScore {
  total_score: number;
  weighted_score: number;
  breakdown: {
    reach: number;
    outcomes: number;
    sustainability: number;
    innovation: number;
    evidence: number;
    satisfaction: number;
    efficiency: number;
    scalability: number;
  };
  factors: {
    reach_weight: number;
    outcomes_weight: number;
    sustainability_weight: number;
    innovation_weight: number;
    evidence_weight: number;
    satisfaction_weight: number;
    efficiency_weight: number;
    scalability_weight: number;
  };
}

// Outcome Measurement
export interface OutcomeMeasurement {
  id: number;
  project_id: number;
  outcome_type: 'quantitative' | 'qualitative' | 'mixed';
  title: string;
  description: string;
  baseline_value?: number;
  target_value?: number;
  actual_value?: number;
  unit: string;
  measurement_method: string;
  evidence_sources: string[];
  stakeholder_feedback?: string;
  created_at: string;
  updated_at: string;
}

// Evidence Collection
export interface EvidenceItem {
  id: number;
  project_id: number;
  outcome_id?: number;
  type: 'document' | 'photo' | 'video' | 'audio' | 'survey' | 'interview' | 'data';
  title: string;
  description: string;
  file_url?: string;
  external_url?: string;
  collected_date: string;
  verified: boolean;
  verification_date?: string;
  verified_by?: string;
  created_at: string;
}

// Impact Story
export interface ImpactStory {
  id: number;
  project_id: number;
  title: string;
  summary: string;
  full_story: string;
  beneficiary_name?: string;
  beneficiary_type: 'individual' | 'family' | 'community' | 'organisation';
  before_situation: string;
  after_situation: string;
  key_quote?: string;
  media_urls?: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Framework Alignment Scoring
export interface FrameworkAlignment {
  victorian_alignment: {
    plan_for_victoria: number;
    melbourne_2030: number;
    activity_centres_program: number;
    greenfields_housing_plan: number;
    clean_economy_workforce_strategy: number;
    victorian_aboriginal_affairs_framework: number;
    total_score: number;
  };
  sdg_alignment: {
    [key: string]: number; // SDG code -> score
    total_score: number;
  };
  policy_impact: {
    local_policy: number;
    state_policy: number;
    national_policy: number;
    international_policy: number;
    total_score: number;
  };
}

// Impact Analytics
export interface ImpactAnalytics {
  portfolio_summary: {
    total_projects: number;
    total_impact_score: number;
    average_impact_score: number;
    total_reach: number;
    total_outcomes: number;
    evidence_coverage: number;
  };
  trends: {
    impact_score_trend: Array<{date: string; score: number}>;
    reach_trend: Array<{date: string; count: number}>;
    outcomes_trend: Array<{date: string; count: number}>;
  };
  benchmarks: {
    industry_average: number;
    sector_comparison: Record<string, number>;
    regional_comparison: Record<string, number>;
  };
  roi_analysis: {
    total_investment: number;
    total_impact_value: number;
    roi_ratio: number;
    cost_per_outcome: number;
    cost_per_person_reached: number;
  };
}

// Impact Report Configuration
export interface ImpactReportConfig {
  report_type: 'executive' | 'detailed' | 'stakeholder' | 'funder' | 'custom';
  time_period: {
    start_date: string;
    end_date: string;
  };
  include_sections: {
    executive_summary: boolean;
    impact_metrics: boolean;
    outcome_stories: boolean;
    framework_alignment: boolean;
    financial_analysis: boolean;
    recommendations: boolean;
  };
  customizations: {
    branding: boolean;
    stakeholder_focus: string[];
    key_messages: string[];
  };
}

// Impact Assessment Workflow
export interface ImpactAssessment {
  id: number;
  project_id: number;
  assessment_type: 'baseline' | 'midterm' | 'final' | 'followup';
  status: 'planned' | 'in_progress' | 'completed' | 'reviewed';
  planned_date: string;
  completed_date?: string;
  assessor_id?: number;
  methodology: string;
  findings: string;
  recommendations: string[];
  impact_score?: ImpactScore;
  outcomes: OutcomeMeasurement[];
  evidence: EvidenceItem[];
  stories: ImpactStory[];
  created_at: string;
  updated_at: string;
}

// Impact Measurement Settings
export interface ImpactMeasurementSettings {
  scoring_weights: {
    reach: number;
    outcomes: number;
    sustainability: number;
    innovation: number;
    evidence: number;
    satisfaction: number;
    efficiency: number;
    scalability: number;
  };
  thresholds: {
    high_impact: number;
    medium_impact: number;
    low_impact: number;
  };
  evidence_requirements: {
    minimum_evidence_items: number;
    verification_required: boolean;
    stakeholder_feedback_required: boolean;
  };
  reporting_frequency: 'monthly' | 'quarterly' | 'annually' | 'project_based';
  automated_assessments: boolean;
  stakeholder_notifications: boolean;
} 