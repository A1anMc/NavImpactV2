// Impact Measurement Service for NavImpact
// Enterprise-Grade Impact & Intelligence Platform

import { apiClient } from './api';
import { 
  ImpactMetrics, 
  ImpactScore, 
  OutcomeMeasurement, 
  EvidenceItem, 
  ImpactStory, 
  FrameworkAlignment, 
  ImpactAnalytics, 
  ImpactAssessment,
  ImpactMeasurementSettings 
} from '@/types/impact';
import { Project, VictorianFramework } from '@/types/projects';

class ImpactMeasurementService {
  // Core Impact Score Calculator
  calculateImpactScore(metrics: ImpactMetrics, weights?: Partial<ImpactScore['factors']>): ImpactScore {
    const defaultWeights = {
      reach_weight: 0.15,
      outcomes_weight: 0.20,
      sustainability_weight: 0.15,
      innovation_weight: 0.10,
      evidence_weight: 0.15,
      satisfaction_weight: 0.10,
      efficiency_weight: 0.10,
      scalability_weight: 0.05,
    };

    const finalWeights = { ...defaultWeights, ...weights };

    // Normalize metrics to 0-100 scale
    const normalizedMetrics = {
      reach: Math.min(metrics.reach_count / 1000 * 100, 100),
      outcomes: Math.min(metrics.outcome_count / 100 * 100, 100),
      sustainability: metrics.sustainability_score,
      innovation: metrics.innovation_score,
      evidence: metrics.evidence_quality,
      satisfaction: metrics.stakeholder_satisfaction,
      efficiency: Math.min(metrics.cost_effectiveness * 100, 100),
      scalability: metrics.scalability_potential,
    };

    // Calculate weighted score
    const weightedScore = 
      normalizedMetrics.reach * finalWeights.reach_weight +
      normalizedMetrics.outcomes * finalWeights.outcomes_weight +
      normalizedMetrics.sustainability * finalWeights.sustainability_weight +
      normalizedMetrics.innovation * finalWeights.innovation_weight +
      normalizedMetrics.evidence * finalWeights.evidence_weight +
      normalizedMetrics.satisfaction * finalWeights.satisfaction_weight +
      normalizedMetrics.efficiency * finalWeights.efficiency_weight +
      normalizedMetrics.scalability * finalWeights.scalability_weight;

    return {
      total_score: Object.values(normalizedMetrics).reduce((sum, val) => sum + val, 0) / 8,
      weighted_score: weightedScore,
      breakdown: normalizedMetrics,
      factors: finalWeights,
    };
  }

  // Framework Alignment Calculator
  calculateFrameworkAlignment(project: Project): FrameworkAlignment {
    const victorianAlignment = {
      plan_for_victoria: 0,
      melbourne_2030: 0,
      activity_centres_program: 0,
      greenfields_housing_plan: 0,
      clean_economy_workforce_strategy: 0,
      victorian_aboriginal_affairs_framework: 0,
      total_score: 0,
    };

    // Calculate Victorian framework alignment
    if (project.framework_alignment) {
      project.framework_alignment.forEach(framework => {
        victorianAlignment[framework] = 100; // Full alignment for matched frameworks
      });
      victorianAlignment.total_score = (victorianAlignment.plan_for_victoria + 
        victorianAlignment.melbourne_2030 + 
        victorianAlignment.activity_centres_program + 
        victorianAlignment.greenfields_housing_plan + 
        victorianAlignment.clean_economy_workforce_strategy + 
        victorianAlignment.victorian_aboriginal_affairs_framework) / 6;
    }

    // Calculate SDG alignment
    const sdgAlignment: Record<string, number> = { total_score: 0 };
    if (project.sdg_tags) {
      project.sdg_tags.forEach(sdg => {
        sdgAlignment[sdg] = 100; // Full alignment for matched SDGs
      });
      sdgAlignment.total_score = project.sdg_tags.length > 0 ? 
        Object.values(sdgAlignment).filter(v => v > 0).reduce((sum, val) => sum + val, 0) / project.sdg_tags.length : 0;
    }

    // Calculate policy impact (simplified)
    const policyImpact = {
      local_policy: project.impact_types.includes('community') ? 80 : 40,
      state_policy: victorianAlignment.total_score > 0 ? 70 : 30,
      national_policy: project.sdg_tags && project.sdg_tags.length > 0 ? 60 : 20,
      international_policy: project.sdg_tags && project.sdg_tags.length > 2 ? 50 : 10,
      total_score: 0,
    };
    policyImpact.total_score = (policyImpact.local_policy + policyImpact.state_policy + 
      policyImpact.national_policy + policyImpact.international_policy) / 4;

    return {
      victorian_alignment: victorianAlignment,
      sdg_alignment: sdgAlignment,
      policy_impact: policyImpact,
    };
  }

  // Outcome Measurement Management
  async createOutcomeMeasurement(data: Omit<OutcomeMeasurement, 'id' | 'created_at' | 'updated_at'>): Promise<OutcomeMeasurement> {
    return apiClient.request<OutcomeMeasurement>('/api/v1/outcomes/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOutcomeMeasurements(projectId: number): Promise<OutcomeMeasurement[]> {
    return apiClient.request<OutcomeMeasurement[]>(`/api/v1/projects/${projectId}/outcomes/`);
  }

  async updateOutcomeMeasurement(id: number, data: Partial<OutcomeMeasurement>): Promise<OutcomeMeasurement> {
    return apiClient.request<OutcomeMeasurement>(`/api/v1/outcomes/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Evidence Collection Management
  async uploadEvidence(data: Omit<EvidenceItem, 'id' | 'created_at'>): Promise<EvidenceItem> {
    return apiClient.request<EvidenceItem>('/api/v1/evidence/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEvidence(projectId: number): Promise<EvidenceItem[]> {
    return apiClient.request<EvidenceItem[]>(`/api/v1/projects/${projectId}/evidence/`);
  }

  async verifyEvidence(id: number, verifiedBy: string): Promise<EvidenceItem> {
    return apiClient.request<EvidenceItem>(`/api/v1/evidence/${id}/verify/`, {
      method: 'POST',
      body: JSON.stringify({ verified_by: verifiedBy }),
    });
  }

  // Impact Stories Management
  async createImpactStory(data: Omit<ImpactStory, 'id' | 'created_at' | 'updated_at'>): Promise<ImpactStory> {
    return apiClient.request<ImpactStory>('/api/v1/stories/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getImpactStories(projectId: number): Promise<ImpactStory[]> {
    return apiClient.request<ImpactStory[]>(`/api/v1/projects/${projectId}/stories/`);
  }

  async updateImpactStory(id: number, data: Partial<ImpactStory>): Promise<ImpactStory> {
    return apiClient.request<ImpactStory>(`/api/v1/stories/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Impact Analytics
  async getPortfolioAnalytics(): Promise<ImpactAnalytics> {
    return apiClient.request<ImpactAnalytics>('/api/v1/impact/analytics/');
  }

  async getProjectAnalytics(projectId: number): Promise<ImpactAnalytics> {
    return apiClient.request<ImpactAnalytics>(`/api/v1/projects/${projectId}/analytics/`);
  }

  async getTrendAnalysis(timeframe: 'monthly' | 'quarterly' | 'yearly' = 'quarterly'): Promise<ImpactAnalytics['trends']> {
    return apiClient.request<ImpactAnalytics['trends']>(`/api/v1/impact/trends/?timeframe=${timeframe}`);
  }

  // Impact Assessment Workflow
  async createAssessment(data: Omit<ImpactAssessment, 'id' | 'created_at' | 'updated_at'>): Promise<ImpactAssessment> {
    return apiClient.request<ImpactAssessment>('/api/v1/assessments/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAssessments(projectId: number): Promise<ImpactAssessment[]> {
    return apiClient.request<ImpactAssessment[]>(`/api/v1/projects/${projectId}/assessments/`);
  }

  async updateAssessment(id: number, data: Partial<ImpactAssessment>): Promise<ImpactAssessment> {
    return apiClient.request<ImpactAssessment>(`/api/v1/assessments/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async completeAssessment(id: number, findings: string, recommendations: string[]): Promise<ImpactAssessment> {
    return apiClient.request<ImpactAssessment>(`/api/v1/assessments/${id}/complete/`, {
      method: 'POST',
      body: JSON.stringify({ findings, recommendations }),
    });
  }

  // Impact Report Generation
  async generateImpactReport(config: ImpactReportConfig): Promise<{ report_url: string; report_id: string }> {
    return apiClient.request<{ report_url: string; report_id: string }>('/api/v1/impact/reports/', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async getReportHistory(): Promise<Array<{ id: string; type: string; generated_at: string; download_url: string }>> {
    return apiClient.request<Array<{ id: string; type: string; generated_at: string; download_url: string }>>('/api/v1/impact/reports/history/');
  }

  // Settings Management
  async getImpactSettings(): Promise<ImpactMeasurementSettings> {
    return apiClient.request<ImpactMeasurementSettings>('/api/v1/impact/settings/');
  }

  async updateImpactSettings(settings: Partial<ImpactMeasurementSettings>): Promise<ImpactMeasurementSettings> {
    return apiClient.request<ImpactMeasurementSettings>('/api/v1/impact/settings/', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Utility Functions
  calculateROI(totalInvestment: number, impactValue: number): { ratio: number; costPerOutcome: number; costPerPerson: number } {
    return {
      ratio: impactValue / totalInvestment,
      costPerOutcome: totalInvestment / (impactValue / 100), // Assuming 100 is baseline outcome value
      costPerPerson: totalInvestment / (impactValue / 10), // Assuming 10 is baseline person value
    };
  }

  calculateEvidenceCoverage(evidenceCount: number, outcomeCount: number): number {
    return outcomeCount > 0 ? Math.min((evidenceCount / outcomeCount) * 100, 100) : 0;
  }

  calculateStakeholderSatisfaction(ratings: number[]): number {
    return ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
  }
}

export const impactService = new ImpactMeasurementService(); 