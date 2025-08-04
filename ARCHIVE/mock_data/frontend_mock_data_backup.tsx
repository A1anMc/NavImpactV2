// FRONTEND MOCK DATA BACKUP
// This file contains the mock data that was removed from frontend components
// when transitioning to real data. Keep for reference only.

// ========================================
// TASKS PAGE MOCK DATA
// ========================================

export const mockTasks = [
  {
    id: '1',
    title: 'Community Engagement Survey',
    description: 'Design and distribute survey to measure community engagement levels for the Greenfields Housing project',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Sarah Wilson',
    dueDate: '2024-12-20',
    project: 'Greenfields Housing Renewal',
    tags: ['Research', 'Community']
  },
  {
    id: '2',
    title: 'Framework Alignment Review',
    description: 'Review and update Victorian framework alignment documentation for all active projects',
    status: 'todo',
    priority: 'medium',
    assignee: 'Alex Chen',
    dueDate: '2024-12-25',
    project: 'Portfolio Management',
    tags: ['Documentation', 'Compliance']
  },
  {
    id: '3',
    title: 'Impact Metrics Dashboard',
    description: 'Complete the development of real-time impact metrics dashboard for stakeholder reporting',
    status: 'completed',
    priority: 'high',
    assignee: 'Jordan Martinez',
    dueDate: '2024-12-15',
    project: 'Frontend Integration Test',
    tags: ['Development', 'Analytics']
  },
  {
    id: '4',
    title: 'Grant Application - Digital Inclusion',
    description: 'Prepare and submit grant application for the Digital Inclusion Program funding opportunity',
    status: 'todo',
    priority: 'high',
    assignee: 'Maria Rodriguez',
    dueDate: '2024-12-28',
    project: 'New Initiative',
    tags: ['Funding', 'Application']
  },
  {
    id: '5',
    title: 'Stakeholder Meeting Preparation',
    description: 'Prepare presentation materials and impact reports for quarterly stakeholder review meeting',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'David Kim',
    dueDate: '2024-12-22',
    project: 'Portfolio Management',
    tags: ['Presentation', 'Reporting']
  }
];

// ========================================
// PROJECTS PAGE MOCK DATA
// ========================================

export const mockProjects = [
  {
    id: 1,
    title: 'Digital Inclusion Initiative',
    description: 'Bridging the digital divide in rural communities',
    status: 'active',
    impact_score: 87,
    framework_alignment: ['E4', 'S1'],
    start_date: '2024-01-15',
    team_size: 8,
  },
  {
    id: 2,
    title: 'Community Tech Hub',
    description: 'Creating accessible technology spaces for underserved populations',
    status: 'planning',
    impact_score: 92,
    framework_alignment: ['S1', 'S3'],
    start_date: '2024-02-01',
    team_size: 12,
  },
  {
    id: 3,
    title: 'Youth Mentoring Program',
    description: 'Empowering young people through technology education',
    status: 'active',
    impact_score: 78,
    framework_alignment: ['S1', 'S4'],
    start_date: '2023-11-01',
    team_size: 15,
  },
  {
    id: 4,
    title: 'Sustainability Report',
    description: 'Comprehensive environmental impact assessment',
    status: 'completed',
    impact_score: 95,
    framework_alignment: ['E1', 'E2', 'G2'],
    start_date: '2023-09-01',
    team_size: 6,
  },
];

// ========================================
// SUSTAINABILITY PAGE MOCK DATA
// ========================================

export const mockSustainabilityData = {
  overview: {
    total_projects: 24,
    sustainable_projects: 18,
    sustainability_score: 85,
    carbon_footprint_reduction: 12.5,
    renewable_energy_usage: 78,
  },
  metrics: {
    environmental_impact: 92,
    social_responsibility: 88,
    economic_sustainability: 82,
    governance_score: 90,
  },
  trends: [
    { month: 'Jan', score: 75 },
    { month: 'Feb', score: 78 },
    { month: 'Mar', score: 82 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 87 },
    { month: 'Jun', score: 90 },
  ],
  initiatives: [
    {
      title: 'Green Energy Transition',
      description: 'Switching to renewable energy sources',
      impact: 'High',
      status: 'In Progress',
    },
    {
      title: 'Waste Reduction Program',
      description: 'Implementing comprehensive recycling',
      impact: 'Medium',
      status: 'Completed',
    },
  ],
};

// ========================================
// IMPACT PAGE MOCK DATA
// ========================================

export const mockImpactData = {
  grants: [
    {
      id: 1,
      title: 'Screen Australia Grant',
      amount: 50000,
      status: 'Applied',
      deadline: '2024-12-31',
    },
    {
      id: 2,
      title: 'Digital Innovation Fund',
      amount: 75000,
      status: 'Shortlisted',
      deadline: '2024-11-15',
    },
  ],
  analytics: {
    total_reach: 15420,
    engagement_rate: 78.5,
    impact_score: 85,
    projects_completed: 12,
  },
};

// ========================================
// PRODUCTION PAGE MOCK DATA
// ========================================

export const mockProductionData = [
  {
    id: 1,
    title: 'Wild Hearts Documentary',
    type: 'Documentary',
    status: 'In Production',
    progress: 75,
    team: ['Ursula Searle', 'Shamita Siva'],
    impact_score: 85,
  },
  {
    id: 2,
    title: 'Around the Table Series',
    type: 'Series',
    status: 'Planning',
    progress: 25,
    team: ['Ash Dorman', 'Alan McCarthy'],
    impact_score: 92,
  },
];

// ========================================
// NOTES
// ========================================

/*
This mock data was removed from the frontend components when transitioning to real data.

REPLACEMENTS:
- Tasks: Now uses real API calls to /api/v1/tasks
- Projects: Now uses real API calls to /api/v1/projects  
- Analytics: Now uses real Google Analytics data
- Grants: Now uses real grant API data
- Impact: Now uses real impact measurement data

The real data provides:
- Live Google Analytics from Shadow Goose website
- Real Instagram social media metrics
- Live Notion project management data
- Real grant opportunities from various sources
- Actual impact measurement data

This backup is kept for reference only and should not be used in production.
*/ 