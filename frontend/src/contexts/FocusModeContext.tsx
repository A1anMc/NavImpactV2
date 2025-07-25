'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adhdUtils, generateCSSCustomProperties } from '@/lib/design-system';

// Types for user preferences
export interface UserPreferences {
  focusMode: boolean;
  lowStimMode: boolean;
  density: 'compact' | 'comfortable' | 'spacious';
  collapsedSections: string[];
  fontSize: 'small' | 'base' | 'large';
  highContrast: boolean;
}

interface FocusModeContextType {
  // Current preferences
  preferences: UserPreferences;
  
  // Preference setters
  toggleFocusMode: () => void;
  toggleLowStimMode: () => void;
  setDensity: (density: UserPreferences['density']) => void;
  setFontSize: (fontSize: UserPreferences['fontSize']) => void;
  toggleHighContrast: () => void;
  
  // Section collapse management
  toggleSection: (sectionId: string) => void;
  isSectionCollapsed: (sectionId: string) => boolean;
  
  // Utility functions
  getSpacing: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => string;
  getMotionDuration: (duration: 'fast' | 'normal' | 'slow') => string;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

// Default preferences
const defaultPreferences: UserPreferences = {
  focusMode: false,
  lowStimMode: false,
  density: 'comfortable',
  collapsedSections: ['completed'], // Completed tasks start collapsed
  fontSize: 'base',
  highContrast: false,
};

export function FocusModeProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const loadedPreferences: UserPreferences = {
      focusMode: adhdUtils.preferences.getFocusMode(),
      lowStimMode: adhdUtils.preferences.getLowStimMode(),
      density: adhdUtils.preferences.getDensity(),
      collapsedSections: adhdUtils.preferences.getCollapsedSections(),
      fontSize: adhdUtils.preferences.get('fontSize', 'base'),
      highContrast: adhdUtils.preferences.get('highContrast', false),
    };
    
    setPreferences(loadedPreferences);
    setIsInitialized(true);
  }, []);

  // Apply CSS custom properties when preferences change
  useEffect(() => {
    if (!isInitialized) return;
    
    const root = document.documentElement;
    const customProperties = generateCSSCustomProperties(preferences.lowStimMode);
    
    // Apply CSS custom properties
    Object.entries(customProperties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Apply focus mode class
    if (preferences.focusMode) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }

    // Apply low-stim mode class
    if (preferences.lowStimMode) {
      document.body.classList.add('low-stim-mode');
    } else {
      document.body.classList.remove('low-stim-mode');
    }

    // Apply density class
    document.body.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
    document.body.classList.add(`density-${preferences.density}`);

    // Apply font size class
    document.body.classList.remove('font-small', 'font-base', 'font-large');
    document.body.classList.add(`font-${preferences.fontSize}`);

    // Apply high contrast class
    if (preferences.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [preferences, isInitialized]);

  // Preference setters
  const toggleFocusMode = () => {
    const newFocusMode = !preferences.focusMode;
    setPreferences(prev => ({ ...prev, focusMode: newFocusMode }));
    adhdUtils.preferences.setFocusMode(newFocusMode);
  };

  const toggleLowStimMode = () => {
    const newLowStimMode = !preferences.lowStimMode;
    setPreferences(prev => ({ ...prev, lowStimMode: newLowStimMode }));
    adhdUtils.preferences.setLowStimMode(newLowStimMode);
  };

  const setDensity = (density: UserPreferences['density']) => {
    setPreferences(prev => ({ ...prev, density }));
    adhdUtils.preferences.setDensity(density);
  };

  const setFontSize = (fontSize: UserPreferences['fontSize']) => {
    setPreferences(prev => ({ ...prev, fontSize }));
    adhdUtils.preferences.set('fontSize', fontSize);
  };

  const toggleHighContrast = () => {
    const newHighContrast = !preferences.highContrast;
    setPreferences(prev => ({ ...prev, highContrast: newHighContrast }));
    adhdUtils.preferences.set('highContrast', newHighContrast);
  };

  // Section collapse management
  const toggleSection = (sectionId: string) => {
    const newCollapsedSections = preferences.collapsedSections.includes(sectionId)
      ? preferences.collapsedSections.filter(id => id !== sectionId)
      : [...preferences.collapsedSections, sectionId];
    
    setPreferences(prev => ({ ...prev, collapsedSections: newCollapsedSections }));
    adhdUtils.preferences.setCollapsedSections(newCollapsedSections);
  };

  const isSectionCollapsed = (sectionId: string) => {
    return preferences.collapsedSections.includes(sectionId);
  };

  // Utility functions
  const getSpacing = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
    const { designTokens } = require('@/lib/design-system');
    return designTokens.spacing.density[preferences.density][size];
  };

  const getMotionDuration = (duration: 'fast' | 'normal' | 'slow') => {
    return adhdUtils.getMotionDuration(duration);
  };

  const contextValue: FocusModeContextType = {
    preferences,
    toggleFocusMode,
    toggleLowStimMode,
    setDensity,
    setFontSize,
    toggleHighContrast,
    toggleSection,
    isSectionCollapsed,
    getSpacing,
    getMotionDuration,
  };

  return (
    <FocusModeContext.Provider value={contextValue}>
      {children}
    </FocusModeContext.Provider>
  );
}

// Custom hook to use the focus mode context
export function useFocusMode() {
  const context = useContext(FocusModeContext);
  if (context === undefined) {
    throw new Error('useFocusMode must be used within a FocusModeProvider');
  }
  return context;
}

// Hook for checking if a section should be collapsed
export function useCollapsibleSection(sectionId: string, defaultCollapsed: boolean = false) {
  const { isSectionCollapsed, toggleSection } = useFocusMode();
  
  const isCollapsed = isSectionCollapsed(sectionId);
  const toggle = () => toggleSection(sectionId);
  
  return { isCollapsed, toggle };
} 