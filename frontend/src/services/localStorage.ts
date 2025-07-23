import { Grant } from '@/types/models';

// Local storage keys
const STORAGE_KEYS = {
  SAVED_GRANTS: 'navimpact_saved_grants',
  USER_PREFERENCES: 'navimpact_user_preferences',
  VIEWED_GRANTS: 'navimpact_viewed_grants',
  COMPARISON_HISTORY: 'navimpact_comparison_history',
} as const;

// User preferences interface
export interface UserPreferences {
  industry_preference?: string;
  location_preference?: string;
  min_amount?: number;
  max_amount?: number;
  org_type?: string;
  preferred_sources?: string[];
  notification_enabled?: boolean;
}

// Local storage service
export const localStorageService = {
  // Saved Grants Management
  getSavedGrants(): Grant[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_GRANTS);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('[localStorageService.getSavedGrants] Error:', error);
      return [];
    }
  },

  saveGrant(grant: Grant): void {
    try {
      const saved = this.getSavedGrants();
      const exists = saved.find(g => g.id === grant.id);
      
      if (!exists) {
        saved.push({
          ...grant,
          saved_at: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.SAVED_GRANTS, JSON.stringify(saved));
      }
    } catch (error) {
      console.error('[localStorageService.saveGrant] Error:', error);
    }
  },

  removeSavedGrant(grantId: number): void {
    try {
      const saved = this.getSavedGrants();
      const filtered = saved.filter(g => g.id !== grantId);
      localStorage.setItem(STORAGE_KEYS.SAVED_GRANTS, JSON.stringify(filtered));
    } catch (error) {
      console.error('[localStorageService.removeSavedGrant] Error:', error);
    }
  },

  isGrantSaved(grantId: number): boolean {
    try {
      const saved = this.getSavedGrants();
      return saved.some(g => g.id === grantId);
    } catch (error) {
      console.error('[localStorageService.isGrantSaved] Error:', error);
      return false;
    }
  },

  // User Preferences Management
  getUserPreferences(): UserPreferences {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('[localStorageService.getUserPreferences] Error:', error);
      return {};
    }
  },

  saveUserPreferences(preferences: Partial<UserPreferences>): void {
    try {
      const current = this.getUserPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
    } catch (error) {
      console.error('[localStorageService.saveUserPreferences] Error:', error);
    }
  },

  // Viewed Grants Tracking
  getViewedGrants(): number[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEWED_GRANTS);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('[localStorageService.getViewedGrants] Error:', error);
      return [];
    }
  },

  addViewedGrant(grantId: number): void {
    try {
      const viewed = this.getViewedGrants();
      if (!viewed.includes(grantId)) {
        viewed.push(grantId);
        // Keep only last 50 viewed grants
        if (viewed.length > 50) {
          viewed.shift();
        }
        localStorage.setItem(STORAGE_KEYS.VIEWED_GRANTS, JSON.stringify(viewed));
      }
    } catch (error) {
      console.error('[localStorageService.addViewedGrant] Error:', error);
    }
  },

  // Comparison History
  getComparisonHistory(): { grantIds: number[]; timestamp: string }[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPARISON_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('[localStorageService.getComparisonHistory] Error:', error);
      return [];
    }
  },

  addComparison(grantIds: number[]): void {
    try {
      const history = this.getComparisonHistory();
      history.push({
        grantIds,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 20 comparisons
      if (history.length > 20) {
        history.shift();
      }
      
      localStorage.setItem(STORAGE_KEYS.COMPARISON_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('[localStorageService.addComparison] Error:', error);
    }
  },

  // Utility methods
  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('[localStorageService.clearAllData] Error:', error);
    }
  },

  getStorageSize(): number {
    try {
      let total = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          total += item.length;
        }
      });
      return total;
    } catch (error) {
      console.error('[localStorageService.getStorageSize] Error:', error);
      return 0;
    }
  }
};

export type { UserPreferences }; 