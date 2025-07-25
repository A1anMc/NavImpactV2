// ADHD-Friendly Design System
// Reduces cognitive load, improves focus, respects sensory sensitivities

export const designTokens = {
  // Existing color system
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      600: '#4b5563',
      700: '#374151',
      900: '#111827',
    },
    // ADHD-friendly color extensions
    focus: {
      ring: '#3b82f6',
      ringLowStim: '#6b7280', // Softer focus ring for low-stim mode
      background: '#eff6ff',
      backgroundLowStim: '#f9fafb',
    },
    status: {
      overdue: '#dc2626', // Warm red for urgency
      dueSoon: '#f59e0b', // Warm amber for upcoming
      inProgress: '#3b82f6', // Cool blue for active work
      completed: '#10b981', // Cool green for done
      // Low-stim versions (muted)
      overdueLowStim: '#991b1b',
      dueSoonLowStim: '#d97706',
      inProgressLowStim: '#1e40af',
      completedLowStim: '#047857',
    },
    lowStim: {
      background: '#fefefe', // Softer than pure white
      cardBackground: '#fbfbfb',
      border: '#f0f0f0', // Very subtle borders
      text: '#525252', // Softer than pure black
      textSecondary: '#737373',
    }
  },

  // Motion system that respects prefers-reduced-motion
  motion: {
    // These will be set to 0ms when prefers-reduced-motion is enabled
    fast: '150ms',
    normal: '250ms', 
    slow: '350ms',
    // Easing functions
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  },

  // Spacing system with density options
  spacing: {
    density: {
      compact: {
        xs: '0.25rem', // 4px
        sm: '0.5rem',  // 8px
        md: '0.75rem', // 12px
        lg: '1rem',    // 16px
        xl: '1.5rem',  // 24px
      },
      comfortable: {
        xs: '0.5rem',  // 8px
        sm: '0.75rem', // 12px
        md: '1rem',    // 16px
        lg: '1.5rem',  // 24px
        xl: '2rem',    // 32px
      },
      spacious: {
        xs: '0.75rem', // 12px
        sm: '1rem',    // 16px
        md: '1.5rem',  // 24px
        lg: '2rem',    // 32px
        xl: '3rem',    // 48px
      }
    }
  },

  // Typography with ADHD-friendly considerations
  typography: {
    // Consistent heading scale for clear hierarchy
    headings: {
      h1: {
        fontSize: '2.25rem', // 36px
        fontWeight: '800',
        lineHeight: '1.2',
        letterSpacing: '-0.025em',
      },
      h2: {
        fontSize: '1.875rem', // 30px
        fontWeight: '700',
        lineHeight: '1.3',
      },
      h3: {
        fontSize: '1.5rem', // 24px
        fontWeight: '600',
        lineHeight: '1.4',
      },
      h4: {
        fontSize: '1.25rem', // 20px
        fontWeight: '600',
        lineHeight: '1.4',
      }
    },
    // Body text optimized for readability
    body: {
      base: {
        fontSize: '1rem', // 16px
        lineHeight: '1.6',
      },
      small: {
        fontSize: '0.875rem', // 14px
        lineHeight: '1.5',
      },
      large: {
        fontSize: '1.125rem', // 18px
        lineHeight: '1.7',
      }
    }
  },

  // Focus and interaction states
  focus: {
    ring: {
      width: '2px',
      color: 'var(--focus-ring-color)',
      offset: '2px',
    },
    // High contrast focus states
    highContrast: {
      ring: '3px solid #3b82f6',
      background: '#eff6ff',
    }
  },

  // Card and surface variants
  surfaces: {
    card: {
      default: {
        background: 'white',
        border: '1px solid #e5e7eb',
        shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      },
      lowStim: {
        background: 'var(--low-stim-card-bg)',
        border: '1px solid var(--low-stim-border)',
        shadow: 'none', // Remove shadows in low-stim mode
      },
      focus: {
        background: 'white',
        border: '2px solid #3b82f6',
        shadow: '0 0 0 3px rgb(59 130 246 / 0.1)',
      }
    }
  }
};

// Utility functions for ADHD-friendly features
export const adhdUtils = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get motion duration (0 if reduced motion preferred)
  getMotionDuration: (duration: keyof typeof designTokens.motion) => {
    if (adhdUtils.prefersReducedMotion()) return '0ms';
    return designTokens.motion[duration];
  },

  // localStorage utilities for user preferences
  preferences: {
    get: (key: string, defaultValue: any = null) => {
      if (typeof window === 'undefined') return defaultValue;
      try {
        const stored = localStorage.getItem(`navimpact-${key}`);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    
    set: (key: string, value: any) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(`navimpact-${key}`, JSON.stringify(value));
      } catch {
        // Silently fail if localStorage is not available
      }
    },

    // Specific preference getters/setters
    getDensity: () => adhdUtils.preferences.get('density', 'comfortable'),
    setDensity: (density: 'compact' | 'comfortable' | 'spacious') => 
      adhdUtils.preferences.set('density', density),
    
    getLowStimMode: () => adhdUtils.preferences.get('lowStimMode', false),
    setLowStimMode: (enabled: boolean) => 
      adhdUtils.preferences.set('lowStimMode', enabled),
    
    getFocusMode: () => adhdUtils.preferences.get('focusMode', false),
    setFocusMode: (enabled: boolean) => 
      adhdUtils.preferences.set('focusMode', enabled),

    getCollapsedSections: () => adhdUtils.preferences.get('collapsedSections', []),
    setCollapsedSections: (sections: string[]) => 
      adhdUtils.preferences.set('collapsedSections', sections),
  }
};

// CSS custom properties generator
export const generateCSSCustomProperties = (lowStimMode: boolean = false) => {
  const tokens = designTokens;
  const colors = lowStimMode ? tokens.colors.lowStim : tokens.colors;
  
  return {
    '--focus-ring-color': lowStimMode ? tokens.colors.focus.ringLowStim : tokens.colors.focus.ring,
    '--focus-bg-color': lowStimMode ? tokens.colors.focus.backgroundLowStim : tokens.colors.focus.background,
    '--low-stim-bg': tokens.colors.lowStim.background,
    '--low-stim-card-bg': tokens.colors.lowStim.cardBackground,
    '--low-stim-border': tokens.colors.lowStim.border,
    '--low-stim-text': tokens.colors.lowStim.text,
    '--low-stim-text-secondary': tokens.colors.lowStim.textSecondary,
    '--status-overdue': lowStimMode ? tokens.colors.status.overdueLowStim : tokens.colors.status.overdue,
    '--status-due-soon': lowStimMode ? tokens.colors.status.dueSoonLowStim : tokens.colors.status.dueSoon,
    '--status-in-progress': lowStimMode ? tokens.colors.status.inProgressLowStim : tokens.colors.status.inProgress,
    '--status-completed': lowStimMode ? tokens.colors.status.completedLowStim : tokens.colors.status.completed,
    '--motion-fast': adhdUtils.getMotionDuration('fast'),
    '--motion-normal': adhdUtils.getMotionDuration('normal'),
    '--motion-slow': adhdUtils.getMotionDuration('slow'),
  };
};

export default designTokens; 