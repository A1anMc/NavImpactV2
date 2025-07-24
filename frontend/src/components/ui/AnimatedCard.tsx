'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  interactive?: boolean;
}

export default function AnimatedCard({
  children,
  className = '',
  delay = 0,
  onClick,
  interactive = true
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={interactive ? {
        scale: 1.01,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={interactive ? { scale: 0.99 } : {}}
      onClick={onClick}
      className={`group relative ${className}`}
    >
      {/* Simplified background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:duration-150" />
      
      {/* Reduced shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 motion-reduce:duration-200 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] motion-reduce:transform-none" />
      
      {/* Main card content */}
      <motion.div
        className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 motion-reduce:duration-150"
      >
        {/* Reduced glow border on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:duration-150 blur-sm" />
        
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Simplified interactive effect */}
        {interactive && (
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 motion-reduce:duration-100 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/3 to-blue-500/3 rounded-2xl" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
} 