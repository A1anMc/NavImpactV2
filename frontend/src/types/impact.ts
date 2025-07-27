// Enhanced Impact Measurement Types
export interface ImpactMetrics {
  reach_count: number;
  outcome_count: number;
  sustainability_score: number;
  innovation_score: number;
  evidence_quality: number;
  stakeholder_satisfaction: number;
  cost_effectiveness: number;
  scalability_potential: number;
  // Enhanced metrics
  social_return_on_investment?: number;
  environmental_impact?: number;
  gender_equality_score?: number;
  digital_inclusion_score?: number;
  community_engagement_level?: number;
  policy_influence_score?: number;
  knowledge_transfer_score?: number;
  capacity_building_score?: number;
}

export interface ImpactScore {
  weighted_score: number;
  raw_score: number;
  breakdown: Record<string, number>;
  factors: Record<string, number>;
  confidence_level: 'high' | 'medium' | 'low';
  last_updated: string;
  trend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
  risk_factors: string[];
}

export interface ImpactAnalytics {
  portfolio_summary: {
    total_projects: number;
    average_impact_score: number;
    total_reach: number;
    evidence_coverage: number;
    total_investment: number;
    average_roi: number;
    sector_distribution: Record<string, number>;
    geographic_coverage: string[];
    stakeholder_diversity: number;
  };
  roi_analysis: {
    roi_ratio: number;
    social_value_created: number;
    cost_per_outcome: number;
    efficiency_score: number;
    sustainability_index: number;
    risk_adjusted_return: number;
    comparative_benchmark: number;
  };
  trend_analysis: {
    impact_score_trend: Array<{ date: string; score: number }>;
    reach_growth: Array<{ date: string; reach: number }>;
    outcome_achievement: Array<{ date: string; outcomes: number }>;
    stakeholder_satisfaction_trend: Array<{ date: string; satisfaction: number }>;
  };
  benchmarking: {
    sector_comparison: Record<string, number>;
    peer_analysis: Array<{
      organisation: string;
      impact_score: number;
      reach: number;
      efficiency: number;
    }>;
    industry_averages: Record<string, number>;
    best_practice_gaps: string[];
  };
  risk_assessment: {
    overall_risk_level: 'low' | 'medium' | 'high';
    risk_factors: Array<{
      factor: string;
      likelihood: number;
      impact: number;
      mitigation_strategies: string[];
    }>;
    compliance_status: Record<string, boolean>;
    audit_recommendations: string[];
  };
  predictive_analytics: {
    impact_forecast: Array<{ period: string; predicted_score: number; confidence: number }>;
    growth_projections: Array<{ period: string; projected_reach: number; projected_outcomes: number }>;
    resource_requirements: Array<{ period: string; estimated_cost: number; resource_needs: string[] }>;
    success_probability: number;
  };
}

export interface FrameworkAlignment {
  victorian_alignment: {
    plan_for_victoria: number;
    melbourne_2030: number;
    regional_development: number;
    climate_action: number;
    digital_transformation: number;
    health_wellbeing: number;
    education_skills: number;
    total_score: number;
  };
  sdg_alignment: {
    sdg_1: number; // No Poverty
    sdg_2: number; // Zero Hunger
    sdg_3: number; // Good Health
    sdg_4: number; // Quality Education
    sdg_5: number; // Gender Equality
    sdg_6: number; // Clean Water
    sdg_7: number; // Affordable Energy
    sdg_8: number; // Decent Work
    sdg_9: number; // Industry Innovation
    sdg_10: number; // Reduced Inequalities
    sdg_11: number; // Sustainable Cities
    sdg_12: number; // Responsible Consumption
    sdg_13: number; // Climate Action
    sdg_14: number; // Life Below Water
    sdg_15: number; // Life on Land
    sdg_16: number; // Peace Justice
    sdg_17: number; // Partnerships
    total_score: number;
  };
  national_alignment: {
    national_priorities: number;
    federal_policies: number;
    intergovernmental_agreements: number;
    total_score: number;
  };
  sector_specific: {
    health_sector: number;
    education_sector: number;
    environment_sector: number;
    social_services: number;
    economic_development: number;
    total_score: number;
  };
}

export interface ImpactStory {
  id: string;
  title: string;
  beneficiary_name: string;
  beneficiary_type: 'individual' | 'family' | 'community' | 'organisation';
  story_summary: string;
  detailed_narrative: string;
  impact_metrics: {
    before: Record<string, any>;
    after: Record<string, any>;
    improvement_percentage: number;
  };
  evidence_type: 'testimonial' | 'case_study' | 'survey' | 'interview' | 'documentation';
  evidence_attachments: string[];
  consent_given: boolean;
  publishable: boolean;
  tags: string[];
  created_date: string;
  last_updated: string;
  verified_by: string;
  verification_date: string;
}

export interface EvidenceCollection {
  id: string;
  project_id: string;
  evidence_type: 'quantitative' | 'qualitative' | 'mixed';
  collection_method: 'survey' | 'interview' | 'observation' | 'documentation' | 'focus_group' | 'workshop';
  data_sources: string[];
  sample_size: number;
  response_rate: number;
  collection_period: {
    start_date: string;
    end_date: string;
  };
  quality_score: number;
  reliability_rating: 'high' | 'medium' | 'low';
  bias_assessment: string[];
  limitations: string[];
  recommendations: string[];
  attachments: string[];
  collected_by: string;
  reviewed_by: string;
  review_date: string;
}

export interface AssessmentWorkflow {
  id: string;
  project_id: string;
  stage: 'planning' | 'data_collection' | 'analysis' | 'validation' | 'reporting' | 'complete';
  current_step: number;
  total_steps: number;
  steps: Array<{
    step_number: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
    assigned_to: string;
    due_date: string;
    completed_date?: string;
    deliverables: string[];
    dependencies: number[];
  }>;
  timeline: {
    start_date: string;
    target_completion: string;
    actual_completion?: string;
    milestones: Array<{
      milestone: string;
      target_date: string;
      achieved_date?: string;
      status: 'pending' | 'achieved' | 'delayed';
    }>;
  };
  quality_checks: Array<{
    check_type: string;
    status: 'passed' | 'failed' | 'pending';
    notes: string;
    reviewer: string;
    review_date?: string;
  }>;
  approvals: Array<{
    approver: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
    comments: string;
    date?: string;
  }>;
}

export interface ImpactReport {
  id: string;
  report_type: 'executive' | 'detailed' | 'stakeholder' | 'funder' | 'custom';
  title: string;
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
    methodology: boolean;
    limitations: boolean;
    appendices: boolean;
  };
  customizations: {
    branding: boolean;
    stakeholder_focus: string[];
    key_messages: string[];
    visual_style: 'professional' | 'creative' | 'minimal';
    language: 'english' | 'multilingual';
  };
  generated_date: string;
  generated_by: string;
  report_url: string;
  file_size: number;
  download_count: number;
  recipients: string[];
  feedback: Array<{
    reviewer: string;
    rating: number;
    comments: string;
    date: string;
  }>;
}

// Enhanced configuration types
export interface ImpactConfig {
  scoring_weights: Record<string, number>;
  thresholds: {
    high_impact: number;
    medium_impact: number;
    low_impact: number;
  };
  evidence_requirements: {
    minimum_quality_score: number;
    required_evidence_types: string[];
    verification_process: string[];
  };
  reporting_frequency: 'monthly' | 'quarterly' | 'annually' | 'custom';
  stakeholder_engagement: {
    feedback_channels: string[];
    consultation_frequency: string;
    transparency_level: 'high' | 'medium' | 'low';
  };
}

// Advanced analytics types
export interface ImpactBenchmark {
  sector: string;
  metric: string;
  average_value: number;
  median_value: number;
  percentile_25: number;
  percentile_75: number;
  sample_size: number;
  last_updated: string;
  data_source: string;
}

export interface ImpactPrediction {
  model_type: 'regression' | 'classification' | 'time_series';
  prediction_horizon: number;
  confidence_interval: [number, number];
  factors: Array<{
    factor: string;
    importance: number;
    direction: 'positive' | 'negative' | 'neutral';
  }>;
  accuracy_score: number;
  last_trained: string;
}

export interface StakeholderAnalysis {
  stakeholder_groups: Array<{
    group: string;
    influence_level: 'high' | 'medium' | 'low';
    interest_level: 'high' | 'medium' | 'low';
    engagement_strategy: string;
    communication_preferences: string[];
    feedback_history: Array<{
      date: string;
      feedback: string;
      sentiment: 'positive' | 'neutral' | 'negative';
    }>;
  }>;
  engagement_metrics: {
    total_stakeholders: number;
    active_participation: number;
    satisfaction_score: number;
    trust_level: number;
  };
}

// Export all types
export type {
  ImpactMetrics,
  ImpactScore,
  ImpactAnalytics,
  FrameworkAlignment,
  ImpactStory,
  EvidenceCollection,
  AssessmentWorkflow,
  ImpactReport,
  ImpactConfig,
  ImpactBenchmark,
  ImpactPrediction,
  StakeholderAnalysis,
}; 