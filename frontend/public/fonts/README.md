# NavImpact Fonts Directory

## Current Font Setup

This directory previously contained custom font files for NavImpact branding, but we now use web-safe fallback fonts for better performance and licensing compliance.

## Font Fallbacks Used

### Carrotflower → Georgia (serif)
- **Purpose**: Heading fonts and branded elements
- **Fallback Stack**: `'Georgia', 'Times New Roman', 'serif'`
- **Usage**: `font-carrotflower` class in Tailwind
- **Reason**: Georgia provides similar character and readability

### Neue Haas Display Pro → Inter (sans-serif)  
- **Purpose**: Body text and UI elements
- **Fallback Stack**: `'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'`
- **Usage**: `font-neue-haas` class in Tailwind
- **Reason**: Inter is modern, clean, and highly readable

## Implementation

These fonts are defined in:
- `frontend/tailwind.config.js` - Tailwind font family configuration
- `frontend/src/app/globals.css` - CSS custom properties

## Benefits of Current Setup

- ✅ **No 404 errors** - All fonts are system/web fonts
- ✅ **Fast loading** - No additional HTTP requests
- ✅ **Universal compatibility** - Works on all devices
- ✅ **Good typography** - Serif for headings, sans-serif for body
- ✅ **Licensing compliance** - No commercial font licensing issues

## Adding Custom Fonts (Future)

If custom fonts are needed in the future:
1. Ensure proper licensing for web use
2. Add `.woff2` and `.woff` files to this directory
3. Update `@font-face` declarations in CSS
4. Update Tailwind config font families
5. Test loading performance and fallbacks 