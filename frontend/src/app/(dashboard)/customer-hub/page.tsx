import CustomerHubDiagram from '@/components/visualization/CustomerHubDiagram';
import AnimatedOrbitalChart from '@/components/visualization/AnimatedOrbitalChart';
import MetricsDashboard from '@/components/visualization/MetricsDashboard';

export default function CustomerHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      <CustomerHubDiagram />
      
      {/* Animated Orbital Chart Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Interactive Orbital System
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Watch how all solutions orbit around the customer hub, demonstrating our customer-centric approach
          </p>
          <AnimatedOrbitalChart />
        </div>
      </div>

      {/* Metrics Dashboard Section */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-8">
          <MetricsDashboard />
        </div>
      </div>
    </div>
  );
} 