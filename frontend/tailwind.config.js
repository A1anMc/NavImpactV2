/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'carrotflower': ['Georgia', 'Times New Roman', 'serif'], // Fallback for missing Carrotflower
        'neue-haas': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'], // Fallback for missing Neue Haas
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // NavImpact Brand Colors
        'impact-teal': '#0D9488',
        'energy-coral': '#F97316',
        'mist-white': '#FAFAFB',
        'cool-gray': '#CBD5E1',
        'mint-breeze': '#A7F3D0',
        'warm-amber': '#FBBF24',
        'soft-crimson': '#F87171',
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'blob': {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)'
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)'
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)'
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)'
          }
        }
      }
    },
  },
  plugins: [],
} 