// NavImpact Copy Kit
// Enterprise-Grade Impact & Intelligence Platform Content

export const copyKit = {
  // Dashboard Overview
  dashboard: {
    tagline: "Impact Intelligence Dashboard",
    subheading: "Measure, understand, and amplify your organisation's social and environmental impact",
    description: "Comprehensive analytics platform for tracking outcomes, measuring reach, and demonstrating value to stakeholders. Align with Victorian priorities, SDGs, track systemic influence, and showcase sustainable impact.",
  },

  // Projects Section
  projects: {
    tagline: "Every project tells a story of measurable change",
    subheading: "Explore social, environmental, and community outcomes aligned with Victorian priorities",
    description: "Create, monitor, and report on impact projects with detailed outcome frameworks. Demonstrate value to funders, align with Victorian plans and global goals, and track systemic change.",
  },

  // Grants Section
  grants: {
    tagline: "Funding Intelligence",
    subheading: "Discover and manage funding opportunities aligned with your impact objectives",
    description: "Access comprehensive grant databases with intelligent matching based on your impact profile. Track applications, manage compliance, and align funding with outcomes.",
  },

  // Grant Matching
  grantsMatching: {
    tagline: "Intelligent Funding Discovery",
    subheading: "AI-powered grant matching that aligns with your impact goals and project requirements",
    description: "Our intelligent matching system analyses your impact profile and finds the most relevant funding opportunities. Increase success rates and reduce application time.",
  },

  // Impact Section
  impact: {
    tagline: "Impact Analytics",
    subheading: "Comprehensive measurement and reporting of your organisation's social and environmental outcomes",
    description: "Advanced impact measurement tools with Victorian framework alignment, SDG alignment, outcome frameworks, and stakeholder reporting. Demonstrate measurable value and attract sustainable funding.",
  },

  // Media Section
  media: {
    tagline: "Stakeholder Communications",
    subheading: "Track media coverage, manage communications, and amplify your impact stories",
    description: "Monitor media mentions, track communication campaigns, and showcase your impact through compelling storytelling and stakeholder engagement.",
  },

  // News Section
  news: {
    tagline: "Sector Intelligence",
    subheading: "Stay informed with curated industry insights, funding updates, and impact sector trends",
    description: "Access real-time sector intelligence, funding announcements, and impact insights. Stay ahead of trends and opportunities in the social impact space.",
  },

  // Tasks Section
  tasks: {
    tagline: "Impact Delivery",
    subheading: "Organise project activities, track progress, and ensure timely delivery of outcomes",
    description: "Streamlined project management with impact integration, milestone tracking, and team collaboration. Keep your impact projects on track and measurable.",
  },

  // Time Logs Section
  timeLogs: {
    tagline: "Resource Analytics",
    subheading: "Track time allocation across projects and activities for impact measurement and reporting",
    description: "Comprehensive resource tracking with project integration, activity categorisation, and impact reporting. Demonstrate efficient resource allocation and project effectiveness.",
  },

  // Settings Section
  settings: {
    tagline: "Platform Configuration",
    subheading: "Configure your NavImpact platform, manage user profiles, and customise your impact measurement framework",
    description: "Personalise your platform experience, manage team access, and configure impact measurement frameworks to match your organisation's strategic objectives.",
  },

  // Profile Section
  profile: {
    tagline: "Profile Management",
    subheading: "Update your profile, manage preferences, and configure your impact measurement settings",
    description: "Customise your profile, set impact preferences, and configure notification settings to optimise your NavImpact experience and impact tracking.",
  },
};

// Page-specific content with actions
export const pageContent = {
  // Projects page with actions
  projects: {
    ...copyKit.projects,
    actions: {
      primary: "New Impact Project",
      secondary: "Import Portfolio",
    },
  },

  // Grants page with actions
  grants: {
    ...copyKit.grants,
    actions: {
      primary: "Discover Funding",
      secondary: "Track Applications",
    },
  },

  // Impact page with actions
  impact: {
    ...copyKit.impact,
    actions: {
      primary: "Generate Impact Report",
      secondary: "Export Analytics",
    },
  },

  // Tasks page with actions
  tasks: {
    ...copyKit.tasks,
    actions: {
      primary: "New Activity",
      secondary: "Bulk Actions",
    },
  },
};

// Impact metrics and KPIs
export const impactMetricsConfig = {
  reach: {
    label: "Total Reach",
    description: "Number of individuals or communities directly impacted",
    unit: "people",
  },
  depth: {
    label: "Impact Depth",
    description: "Intensity and quality of impact delivered",
    unit: "score",
  },
  systemic: {
    label: "Systemic Influence",
    description: "Extent of systemic change and policy influence",
    unit: "score",
  },
  sustainability: {
    label: "Sustainability",
    description: "Long-term viability and lasting impact",
    unit: "score",
  },
  funding: {
    label: "Funding Utilisation",
    description: "Efficiency of funding deployment vs outcomes achieved",
    unit: "%",
  },
  sdgAlignment: {
    label: "SDG Alignment",
    description: "Number of UN Sustainable Development Goals addressed",
    unit: "goals",
  },
  victorianAlignment: {
    label: "Victorian Framework Alignment",
    description: "Number of Victorian government priorities and plans supported",
    unit: "frameworks",
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

// Victorian Framework descriptions
export const victorianFrameworkDescriptions = {
  plan_for_victoria: 'Plan for Victoria - Victoria\'s long-term vision for a fairer, more prosperous state',
  melbourne_2030: 'Melbourne 2030 - Melbourne\'s strategic plan for sustainable urban development',
  activity_centres_program: 'Activity Centres Program - Supporting vibrant, accessible activity centres across Victoria',
  greenfields_housing_plan: 'Greenfields Housing Plan - Sustainable housing development in growth areas',
  clean_economy_workforce_strategy: 'Clean Economy Workforce Strategy - Building Victoria\'s clean energy workforce and capabilities',
  victorian_aboriginal_affairs_framework: 'Victorian Aboriginal Affairs Framework - Supporting Aboriginal self-determination and cultural safety',
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
  active: 'Project is currently active and delivering outcomes',
  completed: 'Project has been successfully completed with measurable impact',
  pending: 'Project is awaiting approval or resources to begin',
  draft: 'Project is in planning or development stage',
  cancelled: 'Project has been discontinued or redirected',
};

// Framework alignment messaging
export const frameworkAlignment = {
  tagline: "Connecting local outcomes to Victorian priorities",
  description: "NavImpact connects local project outcomes to Victorian priorities like Plan for Victoria and Melbourne 2030, national frameworks like the Clean Economy Workforce Strategy, and global efforts like the UN Sustainable Development Goals. This ensures community outcomes are visible, relevant, and aligned with systemic change.",
  benefits: [
    "Demonstrate alignment with Victorian government priorities",
    "Show relevance to local and national frameworks",
    "Connect community outcomes to global goals",
    "Enhance funding applications with policy context",
    "Build stakeholder confidence through strategic alignment",
  ],
};

export default {
  copyKit,
  pageContent,
  impactMetricsConfig,
  sdgDescriptions,
  victorianFrameworkDescriptions,
  impactAreas,
  statusDescriptions,
  frameworkAlignment,
}; 