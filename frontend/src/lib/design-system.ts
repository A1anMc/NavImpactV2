// NavImpact Design System
// Professional Impact & Intelligence Platform

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main purple
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Success/Progress Colors (Donezo-inspired)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Accent Colors
  accent: {
    blue: '#3b82f6',
    orange: '#f97316',
    red: '#ef4444',
    yellow: '#eab308',
  },
  
  // Neutral Colors
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    dark: '#111827',
    sidebar: '#1f2937',
  },
};

export const typography = {
  // Font Families
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

export const spacing = {
  // Spacing Scale
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

// Component-specific styles
export const components = {
  // Card styles (Donezo-inspired)
  card: {
    base: 'bg-white rounded-lg border border-neutral-200 shadow-sm',
    hover: 'hover:shadow-md transition-shadow duration-200',
    interactive: 'cursor-pointer hover:shadow-lg transition-all duration-200',
  },
  
  // Button styles
  button: {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    success: 'bg-success-600 hover:bg-success-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    danger: 'bg-accent-red hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200',
    ghost: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 font-medium px-4 py-2 rounded-lg transition-colors duration-200',
  },
  
  // Badge styles
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-neutral-100 text-neutral-800',
  },
  
  // Input styles
  input: {
    base: 'block w-full rounded-lg border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
  },
};

// SDG Colors for tags
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