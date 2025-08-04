export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sge-black via-sge-black to-sge-forest/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sge-black/80 to-sge-forest/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Shadow Goose Entertainment
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Cinematic storytelling meets professional impact measurement
            </p>
            
            {/* Live Status Indicators */}
            <div className="flex justify-center space-x-4 mb-8">
              <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-500/30">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-400 text-sm font-medium">Real-Time</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/30">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-400 text-sm font-medium">Professional</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-1">Active Projects</p>
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-xs text-gray-400 mt-1">Projects in active development</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-green-400 text-sm font-medium">+1</span>
              <span className="text-gray-400 text-xs ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-1">Production Hours</p>
                <p className="text-2xl font-bold text-white">1,247</p>
                <p className="text-xs text-gray-400 mt-1">Total hours invested</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-green-400 text-sm font-medium">+23%</span>
              <span className="text-gray-400 text-xs ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-1">Team Members</p>
                <p className="text-2xl font-bold text-white">6</p>
                <p className="text-xs text-gray-400 mt-1">Active team members</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-green-400 text-sm font-medium">+1</span>
              <span className="text-gray-400 text-xs ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-1">Impact Score</p>
                <p className="text-2xl font-bold text-white">94%</p>
                <p className="text-xs text-gray-400 mt-1">Average impact rating</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-green-400 text-sm font-medium">+8%</span>
              <span className="text-gray-400 text-xs ml-2">vs last month</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Sprint System</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Real-Time Grants</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Live</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Impact Framework</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Monitoring</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Connected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Sprint "Wild Hearts Production" completed</p>
                  <p className="text-xs text-gray-400">Achieved 85% of planned deliverables</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">New grant opportunity matched</p>
                  <p className="text-xs text-gray-400">Screen Australia Documentary Fund - ,000</p>
                  <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Impact milestone reached</p>
                  <p className="text-xs text-gray-400">Environmental awareness increased by 15%</p>
                  <p className="text-xs text-gray-500 mt-1">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Explore?</h2>
          <p className="text-gray-300 mb-6">Discover our comprehensive systems for sprint management, real-time grants, and impact measurement</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-forest to-tawny text-white px-6 py-3 rounded-lg font-medium hover:from-forest/90 hover:to-tawny/90 transition-all">
              View Sprints
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all">
              Explore Grants
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all">
              Impact Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
