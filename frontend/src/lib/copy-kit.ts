// NavImpact Copy Kit
// Professional Impact & Intelligence Platform Content

export const copyKit = {
  // Dashboard Overview
  dashboard: {
    tagline: "Impact Dashboard",
    subheading: "Track your projects, grants, and funding flows with measurable outcomes and SDG alignment",
    description: "Monitor your organisation's impact across all projects and funding sources. Visualise outcomes, track progress, and demonstrate value to stakeholders.",
  },

  // Projects Section
  projects: {
    tagline: "Project Portfolio",
    subheading: "Manage your impact projects with comprehensive outcome tracking and stakeholder engagement",
    description: "Create, track, and manage projects with detailed outcome frameworks. Align with SDGs, measure impact, and demonstrate value to funders and stakeholders.",
  },

  // Grants Section
  grants: {
    tagline: "Grant Intelligence",
    subheading: "Discover, track, and manage funding opportunities with AI-powered matching and impact alignment",
    description: "Access comprehensive grant databases with intelligent matching based on your project profile. Track applications, manage deadlines, and align with impact goals.",
  },

  // Grant Matching
  grantsMatching: {
    tagline: "Smart Grant Matching",
    subheading: "AI-powered funding discovery that aligns with your impact goals and project requirements",
    description: "Our intelligent matching system analyses your project profile and finds the most relevant funding opportunities. Save time and increase your success rate.",
  },

  // Impact Section
  impact: {
    tagline: "Impact Intelligence",
    subheading: "Measure, track, and communicate your organisation's social and environmental impact",
    description: "Comprehensive impact measurement tools with SDG alignment, outcome frameworks, and stakeholder reporting. Demonstrate your value and attract more funding.",
  },

  // Media Section
  media: {
    tagline: "Media & Communications",
    subheading: "Track media coverage, manage communications, and amplify your impact stories",
    description: "Monitor media mentions, track communication campaigns, and showcase your impact through compelling storytelling and stakeholder engagement.",
  },

  // News Section
  news: {
    tagline: "Industry Intelligence",
    subheading: "Stay informed with curated industry news, funding updates, and impact sector insights",
    description: "Access real-time industry news, funding announcements, and sector insights. Stay ahead of trends and opportunities in the impact space.",
  },

  // Tasks Section
  tasks: {
    tagline: "Task Management",
    subheading: "Organise project tasks, track progress, and ensure timely delivery of impact outcomes",
    description: "Streamlined task management with project integration, deadline tracking, and team collaboration. Keep your impact projects on track and on time.",
  },

  // Time Logs Section
  timeLogs: {
    tagline: "Time Tracking",
    subheading: "Track time spent on projects and activities for accurate impact measurement and reporting",
    description: "Comprehensive time tracking with project integration, activity categorisation, and reporting tools. Demonstrate resource allocation and project efficiency.",
  },

  // Settings Section
  settings: {
    tagline: "Platform Settings",
    subheading: "Configure your NavImpact platform, manage user profiles, and customise your experience",
    description: "Personalise your platform experience, manage team access, and configure impact measurement frameworks to match your organisation's needs.",
  },

  // Profile Section
  profile: {
    tagline: "Profile Management",
    subheading: "Update your profile, manage preferences, and configure your impact measurement settings",
    description: "Customise your profile, set impact preferences, and configure notification settings to optimise your NavImpact experience.",
  },
};

// Page-specific content with actions
export const pageContent = {
  // Projects page with actions
  projects: {
    ...copyKit.projects,
    actions: {
      primary: "New Project",
      secondary: "Import Projects",
    },
  },

  // Grants page with actions
  grants: {
    ...copyKit.grants,
    actions: {
      primary: "Find Grants",
      secondary: "Track Applications",
    },
  },

  // Impact page with actions
  impact: {
    ...copyKit.impact,
    actions: {
      primary: "Generate Report",
      secondary: "Export Data",
    },
  },

  // Tasks page with actions
  tasks: {
    ...copyKit.tasks,
    actions: {
      primary: "New Task",
      secondary: "Bulk Actions",
    },
  },
};

// SDG descriptions for tooltips and help text
export const sdgDescriptions = {
  'SDG-1': 'No Poverty - End poverty in all its forms everywhere',
  'SDG-2': 'Zero Hunger - End hunger, achieve food security and improved nutrition',
  'SDG-3': 'Good Health - Ensure healthy lives and promote well-being for all',
  'SDG-4': 'Quality Education - Ensure inclusive and equitable quality education',
  'SDG-5': 'Gender Equality - Achieve gender equality and empower all women and girls',
  'SDG-6': 'Clean Water - Ensure availability and sustainable management of water',
  'SDG-7': 'Affordable Energy - Ensure access to affordable, reliable, sustainable energy',
  'SDG-8': 'Decent Work - Promote sustained, inclusive and sustainable economic growth',
  'SDG-9': 'Industry Innovation - Build resilient infrastructure, promote sustainable industrialisation',
  'SDG-10': 'Reduced Inequalities - Reduce inequality within and among countries',
  'SDG-11': 'Sustainable Cities - Make cities and human settlements inclusive, safe, resilient',
  'SDG-12': 'Responsible Consumption - Ensure sustainable consumption and production patterns',
  'SDG-13': 'Climate Action - Take urgent action to combat climate change and its impacts',
  'SDG-14': 'Life Below Water - Conserve and sustainably use the oceans, seas and marine resources',
  'SDG-15': 'Life on Land - Protect, restore and promote sustainable use of terrestrial ecosystems',
  'SDG-16': 'Peace Justice - Promote peaceful and inclusive societies for sustainable development',
  'SDG-17': 'Partnerships - Strengthen the means of implementation and revitalise global partnerships',
};

// Impact area descriptions
export const impactAreas = {
  education: 'Education & Skills Development',
  health: 'Health & Wellbeing',
  environment: 'Environment & Climate',
  economic: 'Economic Development',
  social: 'Social Inclusion',
  technology: 'Technology & Innovation',
  arts: 'Arts & Culture',
  sports: 'Sports & Recreation',
  community: 'Community Development',
  research: 'Research & Development',
};

// Status descriptions
export const statusDescriptions = {
  active: 'Project is currently active and progressing',
  completed: 'Project has been successfully completed',
  pending: 'Project is waiting to begin or for approval',
  draft: 'Project is in planning or draft stage',
  cancelled: 'Project has been cancelled or discontinued',
};

export default {
  copyKit,
  pageContent,
  sdgDescriptions,
  impactAreas,
  statusDescriptions,
}; 