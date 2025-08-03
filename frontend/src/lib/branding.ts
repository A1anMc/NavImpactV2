// Branding configuration based on environment
export interface BrandingConfig {
  name: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

// NavImpact branding
export const navimpactBranding: BrandingConfig = {
  name: "NavImpact",
  logo: "NavImpact",
  colors: {
    primary: "#0ea5e9", // Blue
    secondary: "#22c55e", // Green
    accent: "#f59e0b", // Amber
    background: "#f8fafc", // Gray
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
};

// Shadow Goose Entertainment branding
export const sgeBranding: BrandingConfig = {
  name: "Shadow Goose Entertainment",
  logo: "SGE",
  colors: {
    primary: "#425627", // SGE Forest
    secondary: "#885C24", // SGE Tawny
    accent: "#181818", // SGE Black
    background: "#fffefe", // SGE White
  },
  fonts: {
    heading: "Carrotflower",
    body: "Neue Haas Grotesk Display Pro",
  },
};

// Get branding based on environment
export function getBranding(): BrandingConfig {
  const client = process.env.NEXT_PUBLIC_CLIENT || 'sge';

  switch (client) {
    case 'sge':
    case 'shadow-goose':
      return sgeBranding;
    case 'navimpact':
    default:
      return navimpactBranding;
  }
}

// Export the current branding
export const currentBranding = getBranding(); 