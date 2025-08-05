'use client';

import React, { useEffect, useRef } from 'react';

interface OrbitalData {
  id: string;
  title: string;
  color: string;
  radius: number;
  speed: number;
  solutions: string[];
}

const AnimatedOrbitalChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const orbitals: OrbitalData[] = [
    {
      id: 'impact',
      title: 'Impact Measurement',
      color: '#10B981',
      radius: 120,
      speed: 0.02,
      solutions: ['Real-time Scoring', 'Analytics', 'Reporting']
    },
    {
      id: 'alignment',
      title: 'Strategic Alignment',
      color: '#3B82F6',
      radius: 180,
      speed: 0.015,
      solutions: ['Policy Mapping', 'SDG Alignment', 'Compliance']
    },
    {
      id: 'funding',
      title: 'Funding & Resources',
      color: '#F59E0B',
      radius: 240,
      speed: 0.025,
      solutions: ['Grant Discovery', 'ROI Calculator', 'Budget Planning']
    },
    {
      id: 'engagement',
      title: 'Stakeholder Engagement',
      color: '#8B5CF6',
      radius: 300,
      speed: 0.018,
      solutions: ['Feedback Systems', 'Communication', 'Trust Building']
    },
    {
      id: 'growth',
      title: 'Growth & Innovation',
      color: '#06B6D4',
      radius: 360,
      speed: 0.012,
      solutions: ['Scalability', 'Innovation Hub', 'Capacity Building']
    },
    {
      id: 'compliance',
      title: 'Risk & Compliance',
      color: '#EF4444',
      radius: 420,
      speed: 0.022,
      solutions: ['Risk Assessment', 'Compliance', 'Quality Assurance']
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 900;
    canvas.height = 900;

    let animationId: number;
    let time = 0;

    const drawOrbital = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw central customer hub
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
      ctx.fillStyle = 'linear-gradient(135deg, #10B981, #3B82F6)';
      ctx.fill();
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw hub text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CUSTOMER', centerX, centerY - 5);
      ctx.fillText('HUB', centerX, centerY + 15);

      // Draw orbital rings and solutions
      orbitals.forEach((orbital, index) => {
        const angle = time * orbital.speed + (index * Math.PI / 3);
        const x = centerX + Math.cos(angle) * orbital.radius;
        const y = centerY + Math.sin(angle) * orbital.radius;

        // Draw orbital ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbital.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = orbital.color + '40';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw solution node
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, 2 * Math.PI);
        ctx.fillStyle = orbital.color;
        ctx.fill();
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw solution text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(orbital.solutions[0], x, y + 4);

        // Draw connecting lines
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = orbital.color + '30';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw orbital title
        const titleAngle = angle + Math.PI / 2;
        const titleX = centerX + Math.cos(titleAngle) * (orbital.radius + 40);
        const titleY = centerY + Math.sin(titleAngle) * (orbital.radius + 40);
        
        ctx.fillStyle = orbital.color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(orbital.title, titleX, titleY);
      });

      time += 0.02;
      animationId = requestAnimationFrame(drawOrbital);
    };

    drawOrbital();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className="flex justify-center my-8">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-xl shadow-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Orbital System</h3>
            <p className="text-sm text-gray-500">Solutions rotating around the customer hub</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedOrbitalChart; 