'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  QuestionMarkCircleIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  ClockIcon,
  FolderIcon,
  CogIcon,
  CircleStackIcon,
  BookOpenIcon,
  AcademicCapIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlayIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  items: GuideItem[];
}

interface GuideItem {
  title: string;
  description: string;
  howToUse: string;
  benefits: string[];
  tips: string[];
  icon: React.ReactNode;
}

const HelpGuidePage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('dashboard');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const toggleItem = (itemId: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemId)) {
      newExpandedItems.delete(itemId);
    } else {
      newExpandedItems.add(itemId);
    }
    setExpandedItems(newExpandedItems);
  };

  const guideSections: GuideSection[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      icon: <ChartBarIcon className="h-6 w-6" />,
      description: 'Your central command center for impact measurement and project management',
      color: 'from-green-500 to-emerald-600',
      items: [
        {
          title: 'Key Metrics Cards',
          description: 'Real-time overview of your impact performance',
          howToUse: 'Review the cards daily to track progress. Click on any metric to see detailed breakdowns and trends.',
          benefits: [
            'Quick performance assessment',
            'Identify areas needing attention',
            'Track progress over time',
            'Share insights with stakeholders'
          ],
          tips: [
            'Set up alerts for metrics below targets',
            'Use the trend arrows to spot patterns',
            'Export metrics for reports and presentations'
          ],
          icon: <ChartBarIcon className="h-5 w-5" />
        },
        {
          title: 'Recent Activity Feed',
          description: 'Timeline of recent project updates and achievements',
          howToUse: 'Scroll through recent activities to stay updated. Click on any activity for more details.',
          benefits: [
            'Stay informed about project progress',
            'Celebrate team achievements',
            'Identify bottlenecks quickly',
            'Maintain project momentum'
          ],
          tips: [
            'Check daily for new updates',
            'Use filters to focus on specific project types',
            'Share positive updates with your team'
          ],
          icon: <ClockIcon className="h-5 w-5" />
        },
        {
          title: 'Quick Actions',
          description: 'Fast access to common tasks and workflows',
          howToUse: 'Click any quick action button to jump directly to that function. Perfect for frequent tasks.',
          benefits: [
            'Save time on routine tasks',
            'Reduce navigation clicks',
            'Streamline workflows',
            'Improve productivity'
          ],
          tips: [
            'Customize quick actions in settings',
            'Use keyboard shortcuts when available',
            'Pin frequently used actions'
          ],
          icon: <LightBulbIcon className="h-5 w-5" />
        }
      ]
    },
    {
      id: 'projects',
      title: 'Projects Management',
      icon: <FolderIcon className="h-6 w-6" />,
      description: 'Create, manage, and track your impact projects from start to finish',
      color: 'from-blue-500 to-indigo-600',
      items: [
        {
          title: 'Project Creation',
          description: 'Set up new impact projects with comprehensive details',
          howToUse: 'Click "New Impact Project" and fill in all required fields. Include detailed descriptions and set realistic targets.',
          benefits: [
            'Standardized project setup',
            'Clear project objectives',
            'Framework alignment tracking',
            'Stakeholder communication'
          ],
          tips: [
            'Use templates for similar projects',
            'Include all relevant stakeholders',
            'Set SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goals',
            'Upload supporting documents'
          ],
          icon: <FolderIcon className="h-5 w-5" />
        },
        {
          title: 'Impact Cards',
          description: 'Visual representation of project impact and alignment',
          howToUse: 'Review impact cards to understand project performance. Use filters to focus on specific areas.',
          benefits: [
            'Quick visual assessment',
            'Identify high-impact projects',
            'Track alignment with frameworks',
            'Support funding applications'
          ],
          tips: [
            'Regularly update impact metrics',
            'Use color coding to identify priorities',
            'Share cards with stakeholders',
            'Export for presentations'
          ],
          icon: <CheckCircleIcon className="h-5 w-5" />
        },
        {
          title: 'Project Analytics',
          description: 'Deep dive into project performance and outcomes',
          howToUse: 'Click on any project to access detailed analytics. Review trends, outcomes, and recommendations.',
          benefits: [
            'Data-driven decision making',
            'Identify improvement opportunities',
            'Demonstrate impact to funders',
            'Optimize resource allocation'
          ],
          tips: [
            'Set up regular review schedules',
            'Compare projects to benchmarks',
            'Use insights for future planning',
            'Share analytics with team members'
          ],
          icon: <ChartBarIcon className="h-5 w-5" />
        }
      ]
    },
    {
      id: 'grants',
      title: 'Grants Discovery',
      icon: <DocumentMagnifyingGlassIcon className="h-6 w-6" />,
      description: 'Find and apply for funding opportunities that align with your impact goals',
      color: 'from-yellow-500 to-orange-600',
      items: [
        {
          title: 'Grant Search',
          description: 'Discover funding opportunities using advanced filters',
          howToUse: 'Use filters to narrow down grants by sector, amount, deadline, and alignment. Save searches for future reference.',
          benefits: [
            'Find relevant funding quickly',
            'Match projects to opportunities',
            'Stay updated on new grants',
            'Improve application success'
          ],
          tips: [
            'Set up email alerts for new grants',
            'Use keywords related to your sector',
            'Check eligibility criteria carefully',
            'Save interesting grants to your list'
          ],
          icon: <DocumentMagnifyingGlassIcon className="h-5 w-5" />
        },
        {
          title: 'Eligibility Assessment',
          description: 'Check if your projects qualify for specific grants',
          howToUse: 'Click "Check Eligibility" on any grant to see how well your projects align. Review recommendations for improvement.',
          benefits: [
            'Save time on applications',
            'Focus on high-probability grants',
            'Identify alignment gaps',
            'Improve project design'
          ],
          tips: [
            'Review eligibility before applying',
            'Address alignment gaps proactively',
            'Keep project information updated',
            'Use alignment scores to prioritize'
          ],
          icon: <CheckCircleIcon className="h-5 w-5" />
        },
        {
          title: 'Application Tracking',
          description: 'Monitor your grant applications and outcomes',
          howToUse: 'Track all your applications in one place. Update status and outcomes to maintain accurate records.',
          benefits: [
            'Centralized application management',
            'Track success rates',
            'Learn from outcomes',
            'Maintain application history'
          ],
          tips: [
            'Update application status regularly',
            'Record feedback from unsuccessful applications',
            'Analyze success patterns',
            'Use insights for future applications'
          ],
          icon: <ClockIcon className="h-5 w-5" />
        }
      ]
    },
    {
      id: 'tasks',
      title: 'Task Management',
      icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
      description: 'Organize and track tasks to keep your impact projects on track',
      color: 'from-purple-500 to-pink-600',
      items: [
        {
          title: 'Task Creation',
          description: 'Create and assign tasks to team members',
          howToUse: 'Click "New Task" and fill in details. Assign to team members, set priorities, and add due dates.',
          benefits: [
            'Clear task ownership',
            'Track progress systematically',
            'Ensure accountability',
            'Meet project deadlines'
          ],
          tips: [
            'Break large tasks into smaller ones',
            'Set realistic deadlines',
            'Include clear instructions',
            'Link tasks to specific projects'
          ],
          icon: <ClipboardDocumentListIcon className="h-5 w-5" />
        },
        {
          title: 'Task Filtering',
          description: 'Organize and find tasks using various filters',
          howToUse: 'Use filters to view tasks by status, assignee, priority, or project. Save filter combinations for quick access.',
          benefits: [
            'Focus on relevant tasks',
            'Manage workload effectively',
            'Identify bottlenecks',
            'Track team performance'
          ],
          tips: [
            'Use status filters to focus on current work',
            'Check overdue tasks regularly',
            'Use priority filters for urgent items',
            'Save common filter combinations'
          ],
          icon: <InformationCircleIcon className="h-5 w-5" />
        },
        {
          title: 'Progress Tracking',
          description: 'Monitor task completion and team productivity',
          howToUse: 'Update task status regularly. Use progress indicators to track completion and identify delays.',
          benefits: [
            'Real-time progress visibility',
            'Identify project delays early',
            'Support team collaboration',
            'Improve project planning'
          ],
          tips: [
            'Update task status promptly',
            'Use comments to communicate updates',
            'Review progress reports regularly',
            'Celebrate completed tasks'
          ],
          icon: <ChartBarIcon className="h-5 w-5" />
        }
      ]
    },
    {
      id: 'impact',
      title: 'Impact Measurement',
      icon: <ChartBarIcon className="h-6 w-6" />,
      description: 'Measure, analyze, and report on your social impact outcomes',
      color: 'from-teal-500 to-cyan-600',
      items: [
        {
          title: 'Impact Score Calculator',
          description: 'Calculate comprehensive impact scores for your projects',
          howToUse: 'Input your project data and metrics. The system will calculate weighted impact scores with confidence levels.',
          benefits: [
            'Standardized impact measurement',
            'Comparable project scores',
            'Evidence-based decision making',
            'Stakeholder communication'
          ],
          tips: [
            'Ensure data quality and accuracy',
            'Update metrics regularly',
            'Review confidence levels',
            'Use scores for project comparison'
          ],
          icon: <ChartBarIcon className="h-5 w-5" />
        },
        {
          title: 'Framework Alignment',
          description: 'Align your impact with government and global frameworks',
          howToUse: 'Review alignment scores for Victorian priorities, UN SDGs, and other frameworks. Use insights to improve alignment.',
          benefits: [
            'Demonstrate strategic value',
            'Improve funding eligibility',
            'Connect local to global impact',
            'Support policy influence'
          ],
          tips: [
            'Regularly review alignment scores',
            'Address alignment gaps proactively',
            'Use alignment for stakeholder communication',
            'Track alignment improvements over time'
          ],
          icon: <CheckCircleIcon className="h-5 w-5" />
        },
        {
          title: 'Impact Analytics',
          description: 'Advanced analytics and insights for impact optimization',
          howToUse: 'Explore detailed analytics dashboards. Use trend analysis, benchmarking, and predictive insights.',
          benefits: [
            'Data-driven optimization',
            'Benchmark against peers',
            'Predict future outcomes',
            'Identify improvement opportunities'
          ],
          tips: [
            'Set up regular analytics reviews',
            'Use insights for strategic planning',
            'Share analytics with stakeholders',
            'Track improvements over time'
          ],
          icon: <AcademicCapIcon className="h-5 w-5" />
        }
      ]
    },
    {
      id: 'media',
      title: 'Media Management',
      icon: <PhotoIcon className="h-6 w-6" />,
      description: 'Organize and share media assets that support your impact stories',
      color: 'from-indigo-500 to-purple-600',
      items: [
        {
          title: 'Media Upload',
          description: 'Upload and organize photos, videos, and documents',
          howToUse: 'Drag and drop files or click to browse. Add tags and descriptions for easy organization.',
          benefits: [
            'Centralized media storage',
            'Easy asset organization',
            'Secure file management',
            'Quick access to resources'
          ],
          tips: [
            'Use descriptive file names',
            'Add relevant tags for searching',
            'Organize files by project or theme',
            'Regularly backup important files'
          ],
          icon: <PhotoIcon className="h-5 w-5" />
        },
        {
          title: 'Media Gallery',
          description: 'Browse and search through your media assets',
          howToUse: 'Use filters and search to find specific media. Preview files before downloading or sharing.',
          benefits: [
            'Quick asset discovery',
            'Visual project documentation',
            'Easy sharing with stakeholders',
            'Professional presentation support'
          ],
          tips: [
            'Use tags for easy searching',
            'Create collections for specific projects',
            'Preview files before sharing',
            'Keep gallery organized'
          ],
          icon: <InformationCircleIcon className="h-5 w-5" />
        },
        {
          title: 'Impact Stories',
          description: 'Create compelling stories using your media assets',
          howToUse: 'Combine media assets with narrative text to create impactful stories. Share with stakeholders and funders.',
          benefits: [
            'Compelling impact communication',
            'Stakeholder engagement',
            'Funding support',
            'Community awareness'
          ],
          tips: [
            'Use high-quality images and videos',
            'Include personal testimonials',
            'Connect stories to impact metrics',
            'Share stories across platforms'
          ],
          icon: <BookOpenIcon className="h-5 w-5" />
        }
      ]
    },
    {
      id: 'settings',
      title: 'Platform Settings',
      icon: <CogIcon className="h-6 w-6" />,
      description: 'Configure your platform preferences and team access',
      color: 'from-gray-500 to-slate-600',
      items: [
        {
          title: 'Framework Alignment',
          description: 'Configure your impact measurement frameworks',
          howToUse: 'Select which frameworks to track and set up alignment preferences. Customize scoring weights if needed.',
          benefits: [
            'Tailored measurement approach',
            'Relevant stakeholder alignment',
            'Improved reporting accuracy',
            'Strategic focus areas'
          ],
          tips: [
            'Choose frameworks relevant to your sector',
            'Review alignment settings regularly',
            'Update preferences as priorities change',
            'Train team on framework requirements'
          ],
          icon: <CheckCircleIcon className="h-5 w-5" />
        },
        {
          title: 'Team Management',
          description: 'Manage user access and permissions',
          howToUse: 'Invite team members and assign appropriate roles. Set up access controls for different project areas.',
          benefits: [
            'Secure platform access',
            'Role-based permissions',
            'Team collaboration',
            'Accountability tracking'
          ],
          tips: [
            'Regularly review user access',
            'Use role-based permissions',
            'Train new team members',
            'Remove access for departed staff'
          ],
          icon: <CogIcon className="h-5 w-5" />
        },
        {
          title: 'Data & Privacy',
          description: 'Manage your data and privacy settings',
          howToUse: 'Configure data export options, privacy settings, and backup preferences. Review compliance status.',
          benefits: [
            'Data security and privacy',
            'Compliance management',
            'Data backup and recovery',
            'Stakeholder trust'
          ],
          tips: [
            'Regularly review privacy settings',
            'Set up automated backups',
            'Monitor compliance status',
            'Update settings as regulations change'
          ],
          icon: <ExclamationTriangleIcon className="h-5 w-5" />
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Help & Guide</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to use all NavImpact features effectively and maximize your impact measurement success
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <PlayIcon className="h-6 w-6 text-green-600" />
              <CardTitle className="text-2xl font-bold text-gray-900">Quick Start Guide</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl mb-2">1️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Create Your First Project</h3>
                <p className="text-sm text-gray-600">Set up a project with impact goals and framework alignment</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl mb-2">2️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Add Impact Metrics</h3>
                <p className="text-sm text-gray-600">Input your data and start measuring impact</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl mb-2">3️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Explore Grants</h3>
                <p className="text-sm text-gray-600">Find funding opportunities that align with your impact</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Guide Sections */}
        <div className="space-y-6">
          {guideSections.map((section) => (
            <Card key={section.id} className="bg-white border-0 shadow-lg">
              <CardHeader 
                className={`bg-gradient-to-r ${section.color} text-white rounded-t-xl cursor-pointer`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {section.icon}
                    <div>
                      <CardTitle className="text-xl font-semibold">
                        {section.title}
                      </CardTitle>
                      <p className="text-white/80 text-sm mt-1">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {section.items.length} features
                    </Badge>
                    {expandedSection === section.id ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedSection === section.id && (
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {section.items.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleItem(`${section.id}-${index}`)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color} text-white`}>
                              {item.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                          {expandedItems.has(`${section.id}-${index}`) ? (
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        
                        {expandedItems.has(`${section.id}-${index}`) && (
                          <div className="mt-4 space-y-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                <PlayIcon className="h-4 w-4 mr-2 text-green-600" />
                                How to Use
                              </h5>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {item.howToUse}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-600" />
                                  Benefits
                                </h5>
                                <ul className="space-y-1">
                                  {item.benefits.map((benefit, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                                      <span className="text-green-500 mr-2 mt-1">•</span>
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                  <LightBulbIcon className="h-4 w-4 mr-2 text-yellow-600" />
                                  Pro Tips
                                </h5>
                                <ul className="space-y-1">
                                  {item.tips.map((tip, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                                      <span className="text-yellow-500 mr-2 mt-1">💡</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need More Help?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you get the most out of NavImpact.
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Contact Support
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  View Tutorials
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpGuidePage; 