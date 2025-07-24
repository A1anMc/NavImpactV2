'use client';

import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

interface AnimatedMetricProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  delay?: number;
}

export default function AnimatedMetric({
  value,
  label,
  icon,
  color = 'text-white',
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  delay = 0
}: AnimatedMetricProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 ${className}`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                {icon}
              </motion.div>
            )}
            <div>
              <p className="text-slate-300 text-sm font-medium mb-1">{label}</p>
              <motion.div
                className={`text-3xl font-bold ${color}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <CountUp
                  end={value}
                  duration={2}
                  decimals={decimals}
                  separator=","
                  prefix={prefix}
                  suffix={suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Animated progress bar */}
        <motion.div
          className="w-full bg-white/10 rounded-full h-1 overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((value / 1000) * 100, 100)}%` }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
} 