'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  gradient?: 'purple' | 'blue' | 'green' | 'orange' | 'pink';
}

export default function GradientText({
  children,
  className = '',
  animate = true,
  gradient = 'purple'
}: GradientTextProps) {
  const gradients = {
    purple: 'bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500',
    blue: 'bg-gradient-to-r from-blue-400 via-cyan-500 to-purple-500',
    green: 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500',
    orange: 'bg-gradient-to-r from-orange-400 via-red-500 to-pink-500',
    pink: 'bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500'
  };

  const selectedGradient = gradients[gradient];

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative ${className}`}
    >
      <span
        className={`${selectedGradient} bg-clip-text text-transparent ${
          animate ? 'motion-reduce:animate-none animate-gradient-x' : ''
        }`}
      >
        {children}
      </span>
      
      {/* Reduced glow effect */}
      {animate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:duration-150"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
} 