'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SolutionOrbital {
  id: string;
  title: string;
  icon: string;
  color: string;
  solutions: string[];
  description: string;
  metrics: {
    adoption: number;
    impact: number;
    satisfaction: number;
  };
  features: string[];
}

const CustomerHubDiagram: React.FC = () => {
  const [selectedOrbital, setSelectedOrbital] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const orbitals: SolutionOrbital[] = [
    {
      id: 'impact',
      title: 'Impact Measurement',
      icon: '📊',
      color: 'from-green-500 to-emerald-600',
      description: 'Core impact measurement and analytics',
      metrics: { adoption: 85, impact: 92, satisfaction: 88 },
      solutions: [
        'Real-time Impact Scoring',
        'Outcome Measurement Tools',
        'Framework Alignment Scoring',
        'Impact Analytics Dashboard',
        'Reporting & Communication',
        'SROI Calculations'
      ],
      features: ['AI-Powered Insights', 'Predictive Analytics', 'Custom Dashboards']
    },
    {
      id: 'alignment',
      title: 'Strategic Alignment',
      icon: '🎯',
      color: 'from-blue-500 to-indigo-600',
      description: 'Align with government and global frameworks',
      metrics: { adoption: 78, impact: 89, satisfaction: 82 },
      solutions: [
        'Victorian Government Priorities',
        'UN Sustainable Development Goals',
        'National Policy Frameworks',
        'Local Community Priorities',
        'Sector-Specific Standards',
        'Funding Alignment Tools'
      ],
      features: ['Policy Mapping', 'Compliance Tracking', 'Stakeholder Analysis']
    },
    {
      id: 'funding',
      title: 'Funding & Resources',
      icon: '💰',
      color: 'from-yellow-500 to-orange-600',
      description: 'Secure and optimize funding opportunities',
      metrics: { adoption: 92, impact: 87, satisfaction: 91 },
      solutions: [
        'Grant Discovery & Matching',
        'Funding Eligibility Assessment',
        'Resource Optimization',
        'Cost-Effectiveness Analysis',
        'Budget Planning Tools',
        'Financial Impact Tracking'
      ],
      features: ['Smart Matching', 'ROI Calculator', 'Funding Pipeline']
    },
    {
      id: 'engagement',
      title: 'Stakeholder Engagement',
      icon: '🤝',
      color: 'from-purple-500 to-pink-600',
      description: 'Build trust and collaboration',
      metrics: { adoption: 76, impact: 84, satisfaction: 79 },
      solutions: [
        'Community Feedback Systems',
        'Partner Collaboration Tools',
        'Communication Platforms',
        'Impact Story Sharing',
        'Stakeholder Mapping',
        'Engagement Analytics'
      ],
      features: ['Feedback Loops', 'Story Builder', 'Engagement Scoring']
    },
    {
      id: 'growth',
      title: 'Growth & Innovation',
      icon: '📈',
      color: 'from-teal-500 to-cyan-600',
      description: 'Scale operations and drive innovation',
      metrics: { adoption: 68, impact: 81, satisfaction: 75 },
      solutions: [
        'Scalability Assessment',
        'Innovation Tracking',
        'Capacity Building Tools',
        'Knowledge Transfer Systems',
        'Best Practice Sharing',
        'Learning & Development'
      ],
      features: ['Growth Modeling', 'Innovation Hub', 'Capacity Planning']
    },
    {
      id: 'compliance',
      title: 'Risk & Compliance',
      icon: '🛡️',
      color: 'from-red-500 to-rose-600',
      description: 'Ensure compliance and manage risks',
      metrics: { adoption: 88, impact: 86, satisfaction: 90 },
      solutions: [
        'Risk Assessment Tools',
        'Compliance Monitoring',
        'Data Protection & Privacy',
        'Ethical Guidelines',
        'Audit Trail Systems',
        'Quality Assurance'
      ],
      features: ['Risk Scoring', 'Compliance Dashboard', 'Audit Automation']
    }
  ];

  const selectedOrbitalData = orbitals.find(o => o.id === selectedOrbital);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Enhanced Header with Animation */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 animate-pulse">
              Customer Hub Visualization
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-ping"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The customer as the central hub with all solutions rotating around their needs and driving their success
          </p>
          
          {/* Animated Stats */}
          <div className="flex justify-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 animate-pulse">6</div>
              <div className="text-sm text-gray-600">Solution Orbitals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 animate-pulse">36+</div>
              <div className="text-sm text-gray-600">Core Solutions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 animate-pulse">100%</div>
              <div className="text-sm text-gray-600">Customer Focused</div>
            </div>
          </div>
        </div>

        {/* Central Customer Hub with Animation */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            {/* Rotating Orbit Rings */}
            <div className={`absolute inset-0 rounded-full border-2 border-green-200 animate-spin-slow`} style={{ animationDuration: '20s' }}></div>
            <div className={`absolute inset-4 rounded-full border-2 border-blue-200 animate-spin-slow`} style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
            <div className={`absolute inset-8 rounded-full border-2 border-purple-200 animate-spin-slow`} style={{ animationDuration: '25s' }}></div>
            
            <Card className="w-96 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 shadow-xl relative z-10 hover:scale-105 transition-transform duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-3xl text-white mb-4 animate-pulse">
                  🎯
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Customer Hub
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-700 font-medium mb-4">
                  Impact-Driven Organisations
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <p className="font-semibold text-green-600">Non-profits</p>
                    <p className="text-xs">Charities & NGOs</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <p className="font-semibold text-blue-600">Social Enterprises</p>
                    <p className="text-xs">Impact Businesses</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <p className="font-semibold text-purple-600">Government</p>
                    <p className="text-xs">Agencies & Departments</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <p className="font-semibold text-orange-600">Community</p>
                    <p className="text-xs">Groups & Networks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Solution Orbitals with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {orbitals.map((orbital) => (
            <Card 
              key={orbital.id} 
              className={`bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${
                selectedOrbital === orbital.id ? 'ring-4 ring-green-300' : ''
              }`}
              onClick={() => setSelectedOrbital(selectedOrbital === orbital.id ? null : orbital.id)}
            >
              <CardHeader className={`bg-gradient-to-r ${orbital.color} text-white rounded-t-xl relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full -ml-8 -mb-8"></div>
                <div className="flex items-center space-x-3 relative z-10">
                  <span className="text-3xl animate-bounce">{orbital.icon}</span>
                  <CardTitle className="text-lg font-semibold">
                    {orbital.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 text-sm">
                  {orbital.description}
                </p>
                
                {/* Metrics Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Adoption</span>
                    <span>{orbital.metrics.adoption}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${orbital.color} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${orbital.metrics.adoption}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  {orbital.solutions.slice(0, 3).map((solution, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full mt-2 bg-gradient-to-r ${orbital.color}`}></div>
                      <span className="text-sm text-gray-700">{solution}</span>
                    </div>
                  ))}
                  {orbital.solutions.length > 3 && (
                    <div className="text-xs text-gray-500 mt-2">
                      +{orbital.solutions.length - 3} more solutions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Orbital View */}
        {selectedOrbitalData && (
          <div className="mb-16 animate-fade-in">
            <Card className="bg-white border-0 shadow-xl">
              <CardHeader className={`bg-gradient-to-r ${selectedOrbitalData.color} text-white`}>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{selectedOrbitalData.icon}</span>
                  <div>
                    <CardTitle className="text-2xl">{selectedOrbitalData.title}</CardTitle>
                    <p className="text-white/80">{selectedOrbitalData.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Adoption Rate</span>
                          <span>{selectedOrbitalData.metrics.adoption}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`bg-gradient-to-r ${selectedOrbitalData.color} h-3 rounded-full transition-all duration-1000`}
                            style={{ width: `${selectedOrbitalData.metrics.adoption}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Impact Score</span>
                          <span>{selectedOrbitalData.metrics.impact}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`bg-gradient-to-r ${selectedOrbitalData.color} h-3 rounded-full transition-all duration-1000`}
                            style={{ width: `${selectedOrbitalData.metrics.impact}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Customer Satisfaction</span>
                          <span>{selectedOrbitalData.metrics.satisfaction}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`bg-gradient-to-r ${selectedOrbitalData.color} h-3 rounded-full transition-all duration-1000`}
                            style={{ width: `${selectedOrbitalData.metrics.satisfaction}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Solutions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Solutions</h3>
                    <div className="space-y-2">
                      {selectedOrbitalData.solutions.map((solution, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedOrbitalData.color}`}></div>
                          <span className="text-sm text-gray-700">{solution}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Features</h3>
                    <div className="space-y-2">
                      {selectedOrbitalData.features.map((feature, index) => (
                        <Badge key={index} className={`bg-gradient-to-r ${selectedOrbitalData.color} text-white border-0`}>
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Customer Journey */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Customer Journey Touchpoints
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="text-center group">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900">Awareness</h3>
                <p className="text-sm text-gray-600">Impact Demo</p>
                <div className="mt-2 text-xs text-green-600 font-medium">Discovery Phase</div>
              </div>
              <div className="flex-1 h-2 bg-gradient-to-r from-green-500 to-blue-500 mx-4 rounded-full animate-pulse"></div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="font-semibold text-gray-900">Adoption</h3>
                <p className="text-sm text-gray-600">Grant Match</p>
                <div className="mt-2 text-xs text-blue-600 font-medium">Implementation</div>
              </div>
              <div className="flex-1 h-2 bg-gradient-to-r from-blue-500 to-purple-500 mx-4 rounded-full animate-pulse"></div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📈</span>
                </div>
                <h3 className="font-semibold text-gray-900">Growth</h3>
                <p className="text-sm text-gray-600">Scaling Tools</p>
                <div className="mt-2 text-xs text-purple-600 font-medium">Expansion</div>
              </div>
              <div className="flex-1 h-2 bg-gradient-to-r from-purple-500 to-pink-500 mx-4 rounded-full animate-pulse"></div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🌟</span>
                </div>
                <h3 className="font-semibold text-gray-900">Transformation</h3>
                <p className="text-sm text-gray-600">Policy Change</p>
                <div className="mt-2 text-xs text-pink-600 font-medium">Leadership</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Success Metrics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Customer Success Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 opacity-20 rounded-full -mr-8 -mt-8"></div>
                <CardTitle className="text-lg font-semibold text-gray-900 relative z-10">Immediate Value (0-3 months)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 font-medium">Impact measurement established</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 font-medium">Grant opportunities identified</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 font-medium">Basic reporting automated</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 opacity-20 rounded-full -mr-8 -mt-8"></div>
                <CardTitle className="text-lg font-semibold text-gray-900 relative z-10">Medium-term Value (3-12 months)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 font-medium">Funding secured</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 font-medium">Stakeholder trust built</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 font-medium">Operations scaled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 opacity-20 rounded-full -mr-8 -mt-8"></div>
                <CardTitle className="text-lg font-semibold text-gray-900 relative z-10">Long-term Value (12+ months)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 font-medium">Policy influence achieved</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 font-medium">Ecosystem leadership</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 font-medium">Sustainable impact model</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Interactive Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Impact?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join the growing community of impact-driven organisations using NavImpact to measure, 
                align, and scale their social impact with confidence.
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Your Journey
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CustomerHubDiagram; 