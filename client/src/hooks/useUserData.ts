import { useState, useEffect } from 'react';
import { AnonymousUserData, anonymousUserDataSchema, PushupSubmission } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calculateRank } from '@/lib/rankSystem';
import { useToast } from '@/hooks/use-toast';
import soundManager from '@/lib/sounds';
import { useSettings } from '@/context/SettingsContext';

// Local storage key for user data
const USER_DATA_KEY = 'pushupranker_user_data';

export function useUserData() {
  const [userData, setUserData] = useState<AnonymousUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previousRank, setPreviousRank] = useState({ tier: '', level: 0 });
  const [showRankUpNotification, setShowRankUpNotification] = useState(false);
  const [newRank, setNewRank] = useState({ tier: '', level: 0 });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { settings, updateSettings } = useSettings();

  // Initialize user data from local storage or create new
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = localStorage.getItem(USER_DATA_KEY);
        
        if (storedData) {
          // Parse and validate stored data
          const parsedData = JSON.parse(storedData);
          const validatedData = anonymousUserDataSchema.parse(parsedData);
          setUserData(validatedData);
          
          // Sync settings with context
          updateSettings(validatedData.settings);
        } else {
          // Fetch template from API if no local data
          const response = await fetch('/api/anonymous-template');
          
          if (!response.ok) {
            throw new Error('Failed to fetch user data template');
          }
          
          const template = await response.json();
          setUserData(template);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to default values if there's an error
        setUserData({
          totalPushups: 0,
          maxSet: 0,
          currentRankTier: 'bronze',
          currentRankLevel: 1,
          currentProgress: 0,
          history: [],
          settings: {
            soundEnabled: true,
            notificationsEnabled: true,
            animationsEnabled: true,
            darkModeEnabled: true
          }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [updateSettings]);

  // Save user data to local storage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }
  }, [userData]);

  // Set sound manager based on settings
  useEffect(() => {
    if (settings) {
      soundManager.enableSounds(settings.soundEnabled);
    }
  }, [settings]);

  // API mutation for submitting pushups
  const submitPushupsMutation = useMutation({
    mutationFn: async (submission: PushupSubmission) => {
      const response = await apiRequest('POST', '/api/pushups', submission);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pushups'] });
    },
    onError: (error) => {
      toast({
        title: 'Error submitting pushups',
        description: error.message || 'Please try again later.',
        variant: 'destructive'
      });
    }
  });

  // Add pushup record
  const addPushupRecord = async (submission: PushupSubmission) => {
    if (!userData) return;
    
    try {
      // Save the current rank for comparison
      setPreviousRank({
        tier: userData.currentRankTier,
        level: userData.currentRankLevel
      });
      
      // Submit pushups to API (this is just for logging purposes,
      // the actual data is stored in localStorage)
      submitPushupsMutation.mutate(submission);
      
      // Update local user data
      const newRecord = {
        count: submission.count,
        difficultyLevel: submission.difficultyLevel,
        timestamp: Date.now()
      };
      
      const newTotalPushups = userData.totalPushups + submission.count;
      const newMaxSet = Math.max(userData.maxSet, submission.count);
      
      // Calculate new rank based on updated stats
      const newRankInfo = calculateRank(newTotalPushups, newMaxSet);
      
      // Update user data
      const updatedUserData: AnonymousUserData = {
        ...userData,
        totalPushups: newTotalPushups,
        maxSet: newMaxSet,
        currentRankTier: newRankInfo.tier,
        currentRankLevel: newRankInfo.level,
        currentProgress: newRankInfo.progress,
        history: [newRecord, ...userData.history].slice(0, 100) // Keep last 100 records
      };
      
      setUserData(updatedUserData);
      
      // Check if rank changed
      if (previousRank.tier !== newRankInfo.tier || previousRank.level !== newRankInfo.level) {
        // Play rank up sound if enabled
        if (settings.soundEnabled) {
          soundManager.play('rankUp');
        }
        
        // Show rank up notification if enabled
        if (settings.notificationsEnabled) {
          setNewRank({
            tier: newRankInfo.tier,
            level: newRankInfo.level
          });
          setShowRankUpNotification(true);
          
          // Hide notification after 4 seconds
          setTimeout(() => {
            setShowRankUpNotification(false);
          }, 4000);
        }
        
        toast({
          title: '🎉 Rank Up!',
          description: `Congratulations! You've reached ${newRankInfo.tier.charAt(0).toUpperCase() + newRankInfo.tier.slice(1)} Level ${newRankInfo.level}!`,
          variant: 'default'
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error adding pushup record:', error);
      toast({
        title: 'Error recording pushups',
        description: 'Failed to save your pushup record.',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Reset all user progress
  const resetProgress = () => {
    if (!userData) return;
    
    // Reset to initial state but keep settings
    const resetData: AnonymousUserData = {
      totalPushups: 0,
      maxSet: 0,
      currentRankTier: 'bronze',
      currentRankLevel: 1,
      currentProgress: 0,
      history: [],
      settings: userData.settings
    };
    
    setUserData(resetData);
    
    toast({
      title: 'Progress Reset',
      description: 'Your pushup progress has been reset.',
      variant: 'default'
    });
  };

  // Get weekly statistics
  const getWeeklyStats = () => {
    if (!userData) return null;
    
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start from Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Initialize days of the week with zeros
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = daysOfWeek.map(day => ({ day, count: 0 }));
    
    // Calculate pushups for each day of the current week
    userData.history.forEach(record => {
      const recordDate = new Date(record.timestamp);
      
      if (recordDate >= startOfWeek) {
        const dayIndex = recordDate.getDay();
        weeklyData[dayIndex].count += record.count;
      }
    });
    
    // Calculate weekly total and average
    const weeklyTotal = weeklyData.reduce((sum, day) => sum + day.count, 0);
    const daysWithPushups = weeklyData.filter(day => day.count > 0).length;
    const avgPerDay = daysWithPushups ? Math.round(weeklyTotal / daysWithPushups) : 0;
    
    // Find best day
    let bestDay = { day: '-', count: 0 };
    weeklyData.forEach(day => {
      if (day.count > bestDay.count) {
        bestDay = day;
      }
    });
    
    // Calculate current streak
    let currentStreak = 0;
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Sort history by timestamp descending
    const sortedHistory = [...userData.history].sort((a, b) => b.timestamp - a.timestamp);
    
    if (sortedHistory.length > 0) {
      let prevDate: Date | null = null;
      
      for (const record of sortedHistory) {
        const recordDate = new Date(record.timestamp);
        recordDate.setHours(0, 0, 0, 0); // Normalize to start of day
        
        if (!prevDate) {
          // First record
          prevDate = recordDate;
          currentStreak = 1;
        } else {
          const diffDays = Math.round((prevDate.getTime() - recordDate.getTime()) / oneDayMs);
          
          if (diffDays === 1) {
            // Consecutive day
            currentStreak++;
            prevDate = recordDate;
          } else if (diffDays === 0) {
            // Same day, continue checking
            prevDate = recordDate;
          } else {
            // Streak broken
            break;
          }
        }
      }
    }
    
    return {
      weeklyData,
      weeklyTotal,
      avgPerDay,
      bestDay: bestDay.day,
      currentStreak
    };
  };

  return {
    userData,
    isLoading,
    addPushupRecord,
    resetProgress,
    getWeeklyStats,
    showRankUpNotification,
    newRank
  };
}
