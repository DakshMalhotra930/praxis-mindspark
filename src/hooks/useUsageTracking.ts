// Updated by DakshMalhotra930 for complete backend integration
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { ApiService } from '@/lib/api';
import { CONFIG } from '@/lib/config';

export interface UsageStatus {
  userType: 'free' | 'premium';
  usageCount: number;
  usageLimit: number;
  canUseFeature: boolean;
  lastUsedAt: string | null;
  resetTime: string | null;
  isPremium: boolean;
}

// Premium users list
const PREMIUM_USERS = CONFIG.PREMIUM_USERS;


export const useUsageTracking = () => {
  const { user, isAuthenticated } = useAuth();
  const [usageStatus, setUsageStatus] = useState<UsageStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is premium
  const isPremiumUser = user?.email && PREMIUM_USERS.includes(user.email);

  const fetchUsageStatus = useCallback(async () => {
    if (!user?.user_id || !isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      // If user is premium, set unlimited usage
      if (isPremiumUser) {
        setUsageStatus({
          userType: 'premium',
          usageCount: 0,
          usageLimit: 999999,
          canUseFeature: true,
          lastUsedAt: null,
          resetTime: null,
          isPremium: true,
        });
        setLoading(false);
        return;
      }

      // For non-premium users, use local storage tracking
      const lastUsageKey = `usage_${user.user_id}`;
      const lastUsageData = localStorage.getItem(lastUsageKey);
      
      let currentUsage = 0;
      let lastUsedAt: string | null = null;
      let resetTime: string | null = null;

      if (lastUsageData) {
        const data = JSON.parse(lastUsageData);
        const today = new Date().toDateString();
        
        if (data.date === today) {
          currentUsage = data.count || 0;
          lastUsedAt = data.lastUsedAt;
        }
        
        // Calculate reset time (24 hours from last use)
        if (data.lastUsedAt) {
          const lastUse = new Date(data.lastUsedAt);
          resetTime = new Date(lastUse.getTime() + 24 * 60 * 60 * 1000).toISOString();
        }
      }

      const usageLimit = CONFIG.USAGE.FREE_DAILY_LIMIT;

      setUsageStatus({
        userType: 'free',
        usageCount: currentUsage,
        usageLimit: usageLimit,
        canUseFeature: currentUsage < usageLimit,
        lastUsedAt,
        resetTime,
        isPremium: false,
      });
    } catch (err) {
      console.error('Failed to fetch usage status:', err);
      setError('Failed to fetch usage status');
    } finally {
      setLoading(false);
    }
  }, [user?.user_id, isAuthenticated, isPremiumUser]);

  const trackUsage = useCallback(async (featureName: string, sessionId?: string): Promise<boolean> => {
    if (!user?.user_id || !usageStatus) return false;

    // Premium users have unlimited access
    if (isPremiumUser || usageStatus.isPremium) {
      return true;
    }

    if (usageStatus.usageCount >= usageStatus.usageLimit) {
      return false; // Usage limit reached
    }

    try {
      // Update local usage count
      const lastUsageKey = `usage_${user.user_id}`;
      const newCount = usageStatus.usageCount + 1;
      const now = new Date().toISOString();
      
      localStorage.setItem(lastUsageKey, JSON.stringify({
        date: new Date().toDateString(),
        count: newCount,
        lastUsedAt: now,
      }));

      // Update state
      setUsageStatus(prev => prev ? {
        ...prev,
        usageCount: newCount,
        canUseFeature: newCount < prev.usageLimit,
        lastUsedAt: now,
      } : null);

      // Track usage on backend (fire and forget)
      try {
        await ApiService.trackUsage({
          user_id: user.user_id,
          feature_name: featureName,
          session_id: sessionId,
          timestamp: now,
        });
      } catch (apiError) {
        console.warn('Backend usage tracking failed:', apiError);
        // Continue anyway - local tracking is sufficient
      }

      return true;
    } catch (err) {
      console.error('Failed to track usage:', err);
      setError('Failed to track usage');
      return false;
    }
  }, [user?.user_id, usageStatus, isPremiumUser]);

  const refreshUsageStatus = useCallback(async () => {
    await fetchUsageStatus();
  }, [fetchUsageStatus]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUsageStatus();
    }
  }, [isAuthenticated, user, fetchUsageStatus]);

  return {
    usageStatus,
    loading,
    error,
    trackUsage,
    refreshUsageStatus,
  };
};