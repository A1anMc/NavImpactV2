// High-Tech Media Design System
// Modern, sleek interface with tech/media theming while maintaining ADHD-friendly principles

export const designTokens = {
  // High-tech color system
  colors: {
    // Tech-focused primary palette
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Cyber blue
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    // Tech accent colors
    accent: {
      electric: '#00d4ff', // Electric blue
      neon: '#39ff14',     // Neon green
      purple: '#8b5cf6',   // Tech purple
      orange: '#ff6b35',   // Tech orange
      pink: '#ff0080',     // Hot pink
    },
    // Dark theme colors for high-tech feel
    dark: {
      900: '#0a0a0b',      // Almost black
      800: '#1a1a1b',      // Dark background
      700: '#2d2d30',      // Card background
      600: '#3e3e42',      // Border
      500: '#6e6e73',      // Muted text
      400: '#98989d',      // Secondary text
      300: '#c5c5c7',      // Primary text
    },
    // Media industry colors
    media: {
      film: '#ffd700',     // Gold
      tv: '#ff4757',       // TV red
      streaming: '#7c4dff', // Streaming purple
      gaming: '#00ff88',   // Gaming green
      audio: '#ff6b6b',    // Audio red
      social: '#4ecdc4',   // Social teal
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    // ADHD-friendly extensions (now with tech theme)
    focus: {
      ring: '#00d4ff',
      ringLowStim: '#6b7280',
      background: '#f0f9ff',
      backgroundLowStim: '#f9fafb',
    },
    status: {
      overdue: '#ff4757',     // Tech red
      dueSoon: '#ffa502',     // Tech amber
      inProgress: '#00d4ff',  // Electric blue
      completed: '#39ff14',   // Neon green
      // Low-stim versions (muted tech colors)
      overdueLowStim: '#dc2626',
      dueSoonLowStim: '#d97706',
      inProgressLowStim: '#0284c7',
      completedLowStim: '#16a34a',
    },
    lowStim: {
      background: '#fefefe',
      cardBackground: '#fbfbfb',
      border: '#f0f0f0',
      text: '#525252',
      textSecondary: '#737373',
    }
  },

  // Enhanced gradients for tech feel
  gradients: {
    primary: 'linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%)',
    accent: 'linear-gradient(135deg, #8b5cf6 0%, #ff0080 100%)',
    dark: 'linear-gradient(135deg, #1a1a1b 0%, #2d2d30 100%)',
    neon: 'linear-gradient(135deg, #39ff14 0%, #00d4ff 100%)',
    media: 'linear-gradient(135deg, #ffd700 0%, #ff4757 50%, #7c4dff 100%)',
  },

  // Motion system with tech-inspired animations
  motion: {
    fast: '150ms',
    normal: '250ms', 
    slow: '350ms',
    // Tech-inspired easing
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
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

  // Tech-inspired typography
  typography: {
    // Futuristic heading scale
    headings: {
      h1: {
        fontSize: '3rem', // 48px - Larger for impact
        fontWeight: '900',
        lineHeight: '1.1',
        letterSpacing: '-0.025em',
        textTransform: 'uppercase',
      },
      h2: {
        fontSize: '2.25rem', // 36px
        fontWeight: '800',
        lineHeight: '1.2',
        letterSpacing: '-0.02em',
      },
      h3: {
        fontSize: '1.875rem', // 30px
        fontWeight: '700',
        lineHeight: '1.3',
      },
      h4: {
        fontSize: '1.5rem', // 24px
        fontWeight: '600',
        lineHeight: '1.4',
      }
    },
    // Body text optimized for readability
    body: {
      base: {
        fontSize: '1rem', // 16px
        lineHeight: '1.6',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      small: {
        fontSize: '0.875rem', // 14px
        lineHeight: '1.5',
      },
      large: {
        fontSize: '1.125rem', // 18px
        lineHeight: '1.7',
      }
    },
    // Tech-specific fonts
    mono: {
      fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
      fontSize: '0.875rem',
      lineHeight: '1.5',
    }
  },

  // Enhanced focus and interaction states
  focus: {
    ring: {
      width: '2px',
      color: 'var(--focus-ring-color)',
      offset: '2px',
    },
    // High contrast focus states
    highContrast: {
      ring: '3px solid #00d4ff',
      background: '#f0f9ff',
      glow: '0 0 20px rgba(0, 212, 255, 0.5)',
    }
  },

  // Tech-inspired card and surface variants
  surfaces: {
    card: {
      default: {
        background: 'white',
        border: '1px solid #e5e7eb',
        shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        borderRadius: '12px',
      },
      tech: {
        background: 'linear-gradient(135deg, #1a1a1b 0%, #2d2d30 100%)',
        border: '1px solid #3e3e42',
        shadow: '0 8px 32px rgba(0, 212, 255, 0.1)',
        borderRadius: '16px',
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
      },
      lowStim: {
        background: 'var(--low-stim-card-bg)',
        border: '1px solid var(--low-stim-border)',
        shadow: 'none',
        borderRadius: '8px',
      },
      focus: {
        background: 'white',
        border: '2px solid #00d4ff',
        shadow: '0 0 20px rgba(0, 212, 255, 0.2)',
        borderRadius: '12px',
      }
    }
  },

  // Tech effects
  effects: {
    glow: {
      blue: '0 0 20px rgba(0, 212, 255, 0.5)',
      green: '0 0 20px rgba(57, 255, 20, 0.5)',
      purple: '0 0 20px rgba(139, 92, 246, 0.5)',
      pink: '0 0 20px rgba(255, 0, 128, 0.5)',
    },
    blur: {
      light: 'blur(10px)',
      medium: 'blur(20px)',
      heavy: 'blur(40px)',
    }
  }
};

// SDG Colors for backward compatibility (now with tech enhancement)
export const sdgColors = {
  'SDG 1': '#E5243B',
  'SDG 2': '#DDA63A',
  'SDG 3': '#4C9F38',
  'SDG 4': '#C5192D',
  'SDG 5': '#FF3A21',
  'SDG 6': '#26BDE2',
  'SDG 7': '#FCC30B',
  'SDG 8': '#A21942',
  'SDG 9': '#FD6925',
  'SDG 10': '#DD1367',
  'SDG 11': '#FD9D24',
  'SDG 12': '#BF8B2E',
  'SDG 13': '#3F7E44',
  'SDG 14': '#0A97D9',
  'SDG 15': '#56C02B',
  'SDG 16': '#00689D',
  'SDG 17': '#19486A',
};

// Enhanced utility functions for tech features
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
        const stored = localStorage.getItem(`navimpact-tech-${key}`);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    
    set: (key: string, value: any) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(`navimpact-tech-${key}`, JSON.stringify(value));
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

    // Tech theme preferences
    getTechTheme: () => adhdUtils.preferences.get('techTheme', 'default'),
    setTechTheme: (theme: 'default' | 'dark' | 'neon' | 'glass') => 
      adhdUtils.preferences.set('techTheme', theme),
  }
};

// Enhanced CSS custom properties generator with tech themes
export const generateCSSCustomProperties = (lowStimMode: boolean = false, techTheme: string = 'default') => {
  const tokens = designTokens;
  
  const baseProperties = {
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

  // Tech theme specific properties
  const techProperties = {
    default: {
      '--tech-primary': tokens.colors.primary[500],
      '--tech-accent': tokens.colors.accent.electric,
      '--tech-bg': '#ffffff',
      '--tech-card-bg': '#ffffff',
    },
    dark: {
      '--tech-primary': tokens.colors.accent.electric,
      '--tech-accent': tokens.colors.accent.neon,
      '--tech-bg': tokens.colors.dark[900],
      '--tech-card-bg': tokens.colors.dark[800],
    },
    neon: {
      '--tech-primary': tokens.colors.accent.neon,
      '--tech-accent': tokens.colors.accent.pink,
      '--tech-bg': tokens.colors.dark[900],
      '--tech-card-bg': tokens.colors.dark[800],
    },
    glass: {
      '--tech-primary': tokens.colors.primary[400],
      '--tech-accent': tokens.colors.accent.purple,
      '--tech-bg': 'rgba(0, 0, 0, 0.1)',
      '--tech-card-bg': 'rgba(255, 255, 255, 0.1)',
    }
  };

  return {
    ...baseProperties,
    ...(techProperties[techTheme as keyof typeof techProperties] || techProperties.default)
  };
};

export default designTokens; 