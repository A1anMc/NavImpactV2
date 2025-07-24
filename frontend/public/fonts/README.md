# NavImpact Fonts

This directory contains the custom fonts for the NavImpact branding system.

## Required Fonts

### Carrotflower Regular
- **File**: `Carrotflower-Regular.woff2` and `Carrotflower-Regular.woff`
- **Usage**: Headlines, H1 + H2 titles, taglines, and warm brand moments
- **Style**: Friendly, human, approachable
- **Fallback**: serif

### Neue Haas Grotesk Display Pro 45 Light
- **File**: `NeueHaasDisplayPro-45Light.woff2` and `NeueHaasDisplayPro-45Light.woff`
- **Usage**: Body text, UI, and precise information
- **Style**: Clean, minimal, professional
- **Fallback**: Inter, sans-serif

## Font Loading

The fonts are loaded via CSS `@font-face` declarations in `globals.css` with `font-display: swap` for optimal performance.

## Fallback Strategy

If the custom fonts are not available, the system falls back to:
- Carrotflower → serif
- Neue Haas → Inter → system sans-serif

## Performance Notes

- Fonts are loaded with `font-display: swap` to prevent layout shifts
- WOFF2 format is preferred for better compression
- WOFF format is provided as fallback for older browsers 