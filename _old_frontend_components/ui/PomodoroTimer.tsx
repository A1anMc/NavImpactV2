'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFocusMode } from '@/contexts/FocusModeContext';

interface PomodoroTimerProps {
  onComplete?: () => void;
  className?: string;
}

type TimerState = 'idle' | 'running' | 'paused' | 'completed';
type SessionType = 'work' | 'shortBreak' | 'longBreak';

const TIMER_DURATIONS = {
  work: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

export function PomodoroTimer({ onComplete, className = '' }: PomodoroTimerProps) {
  const { preferences } = useFocusMode();
  
  // Timer state
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.work);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  // Refs for interval management
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgress = () => {
    const totalTime = TIMER_DURATIONS[sessionType];
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  // Start or resume timer
  const startTimer = () => {
    if (timerState === 'idle') {
      setTimeLeft(TIMER_DURATIONS[sessionType]);
    }
    setTimerState('running');
    startTimeRef.current = Date.now();
  };

  // Pause timer
  const pauseTimer = () => {
    setTimerState('paused');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Reset timer
  const resetTimer = () => {
    setTimerState('idle');
    setTimeLeft(TIMER_DURATIONS[sessionType]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Switch session type
  const switchSession = (type: SessionType) => {
    setSessionType(type);
    setTimeLeft(TIMER_DURATIONS[type]);
    setTimerState('idle');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Handle timer completion
  const completeSession = () => {
    setTimerState('completed');
    
    if (sessionType === 'work') {
      setSessionsCompleted(prev => prev + 1);
      // Auto-suggest break after work session
      const newSessionsCompleted = sessionsCompleted + 1;
      if (newSessionsCompleted % 4 === 0) {
        setSessionType('longBreak');
        setTimeLeft(TIMER_DURATIONS.longBreak);
      } else {
        setSessionType('shortBreak');
        setTimeLeft(TIMER_DURATIONS.shortBreak);
      }
    } else {
      // After break, switch back to work
      setSessionType('work');
      setTimeLeft(TIMER_DURATIONS.work);
    }
    
    onComplete?.();
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${sessionType === 'work' ? 'Work' : 'Break'} session completed!`, {
        body: sessionType === 'work' ? 'Time for a break!' : 'Ready to focus?',
        icon: '/favicon.svg',
      });
    }
  };

  // Timer effect
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState, sessionType]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Get session color based on type and low-stim mode
  const getSessionColor = () => {
    if (preferences.lowStimMode) {
      return {
        work: 'text-blue-700 bg-blue-50 border-blue-200',
        shortBreak: 'text-green-700 bg-green-50 border-green-200',
        longBreak: 'text-purple-700 bg-purple-50 border-purple-200',
      };
    }
    return {
      work: 'text-blue-600 bg-blue-100',
      shortBreak: 'text-green-600 bg-green-100',
      longBreak: 'text-purple-600 bg-purple-100',
    };
  };

  const sessionColors = getSessionColor();

  return (
    <Card className={`${className} ${preferences.lowStimMode ? 'border-neutral-200' : ''}`}>
      <CardContent className="p-4">
        <div className="text-center space-y-4">
          {/* Session type tabs */}
          <div className="flex justify-center space-x-1 bg-neutral-100 rounded-lg p-1">
            {(['work', 'shortBreak', 'longBreak'] as SessionType[]).map((type) => (
              <button
                key={type}
                onClick={() => switchSession(type)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  sessionType === type
                    ? sessionColors[type]
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {type === 'work' ? 'Focus' : type === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </button>
            ))}
          </div>

          {/* Timer display */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-neutral-900 font-mono">
              {formatTime(timeLeft)}
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  sessionType === 'work' 
                    ? (preferences.lowStimMode ? 'bg-blue-400' : 'bg-blue-500')
                    : sessionType === 'shortBreak'
                    ? (preferences.lowStimMode ? 'bg-green-400' : 'bg-green-500')
                    : (preferences.lowStimMode ? 'bg-purple-400' : 'bg-purple-500')
                }`}
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex justify-center space-x-2">
            {timerState === 'idle' || timerState === 'completed' ? (
              <Button
                onClick={startTimer}
                variant="primary"
                size="sm"
                className="px-4"
              >
                Start
              </Button>
            ) : timerState === 'running' ? (
              <Button
                onClick={pauseTimer}
                variant="secondary"
                size="sm"
                className="px-4"
              >
                Pause
              </Button>
            ) : (
              <Button
                onClick={startTimer}
                variant="primary"
                size="sm"
                className="px-4"
              >
                Resume
              </Button>
            )}
            
            {timerState !== 'idle' && (
              <Button
                onClick={resetTimer}
                variant="ghost"
                size="sm"
                className="px-4"
              >
                Reset
              </Button>
            )}
          </div>

          {/* Sessions completed */}
          {sessionsCompleted > 0 && (
            <div className="text-xs text-neutral-600">
              {sessionsCompleted} session{sessionsCompleted !== 1 ? 's' : ''} completed today
            </div>
          )}

          {/* Current state indicator */}
          <div className="text-xs text-neutral-500">
            {timerState === 'running' && '⏱️ Timer running'}
            {timerState === 'paused' && '⏸️ Timer paused'}
            {timerState === 'completed' && '✅ Session complete!'}
            {timerState === 'idle' && `Ready for ${sessionType === 'work' ? 'focus' : 'break'} session`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 