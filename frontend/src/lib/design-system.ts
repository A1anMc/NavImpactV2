// NavImpact Design System
// Enterprise-Grade Impact & Intelligence Platform

export const colors = {
  // Primary Brand Colors - More sophisticated
  primary: {
    50: '#f8f7ff',
    100: '#f0eeff',
    200: '#e6e2ff',
    300: '#d4ccff',
    400: '#b8a9ff',
    500: '#9c7cff', // Main purple - more sophisticated
    600: '#8b5cf6',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Impact Greens - More muted, trustworthy
  impact: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main impact green - more teal
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  
  // Enterprise Neutrals - Deep slate tones
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a', // Deep slate
  },
  
  // Success/Progress - More muted
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Accent Colors - More professional
  accent: {
    blue: '#3b82f6',
    orange: '#f97316',
    red: '#ef4444',
    yellow: '#eab308',
    teal: '#14b8a6',
  },
  
  // Background Colors - Enterprise grade
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    dark: '#0f172a',
    sidebar: '#1e293b',
  },
};

export const typography = {
  // Font Families - Keep Inter for readability
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  
  // Font Sizes - More structured hierarchy
  fontSize: {
    xs: '0.75rem',    // 12px - Captions, metadata
    sm: '0.875rem',   // 14px - Supporting text
    base: '1rem',     // 16px - Body text
    lg: '1.125rem',   // 18px - Subheadings
    xl: '1.25rem',    // 20px - Section headers
    '2xl': '1.5rem',  // 24px - Card titles
    '3xl': '1.875rem', // 30px - Page titles
    '4xl': '2.25rem',  // 36px - Impact numbers
    '5xl': '3rem',     // 48px - Hero headlines
  },
  
  // Font Weights - More structured
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights - Better readability
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

export const spacing = {
  // Spacing Scale - More generous for enterprise feel
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

export const shadows = {
  // More subtle, enterprise-grade shadows
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
};

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
};

// Component-specific styles - Enterprise focused
export const components = {
  // Card styles - More structured, data-focused
  card: {
    base: 'bg-white rounded-lg border border-neutral-200 shadow-sm',
    hover: 'hover:shadow-md transition-shadow duration-200',
    interactive: 'cursor-pointer hover:shadow-lg transition-all duration-200',
    data: 'bg-white rounded-lg border border-neutral-200 shadow-sm p-6',
  },
  
  // Button styles - More professional
  button: {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    impact: 'bg-impact-600 hover:bg-impact-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    ghost: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 font-medium px-4 py-2 rounded-lg transition-colors duration-200',
  },
  
  // Badge styles - More structured
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    primary: 'bg-primary-100 text-primary-800',
    impact: 'bg-impact-100 text-impact-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-neutral-100 text-neutral-800',
  },
  
  // Input styles - More professional
  input: {
    base: 'block w-full rounded-lg border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
  },
};

// SDG Colors for tags - Official UN colors
export const sdgColors = {
  'SDG-1': '#E5243B', // No Poverty
  'SDG-2': '#DDA63A', // Zero Hunger
  'SDG-3': '#4C9F38', // Good Health
  'SDG-4': '#C5192D', // Quality Education
  'SDG-5': '#FF3A21', // Gender Equality
  'SDG-6': '#26BDE2', // Clean Water
  'SDG-7': '#FCC30B', // Affordable Energy
  'SDG-8': '#A21942', // Decent Work
  'SDG-9': '#FD6925', // Industry Innovation
  'SDG-10': '#DD1367', // Reduced Inequalities
  'SDG-11': '#FD9D24', // Sustainable Cities
  'SDG-12': '#BF8B2E', // Responsible Consumption
  'SDG-13': '#3F7E44', // Climate Action
  'SDG-14': '#0A97D9', // Life Below Water
  'SDG-15': '#56C02B', // Life on Land
  'SDG-16': '#00689D', // Peace Justice
  'SDG-17': '#19486A', // Partnerships
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  components,
  sdgColors,
}; 