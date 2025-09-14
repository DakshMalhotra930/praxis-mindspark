import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  user_id: string;
  email: string;
  name: string;
  subscription_status?: 'FREE' | 'PRO';
  is_premium?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  const checkAuthStatus = useCallback(async () => {
    try {
      // Check if Supabase is properly configured
      if (!supabase) {
        console.warn('Supabase not configured, using demo mode');
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('Supabase auth error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
        return;
      }
      
      if (session?.user) {
        const user: User = {
          user_id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || session.user.email || '',
          subscription_status: 'FREE',
          is_premium: false,
        };
        
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const login = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check if Supabase is properly configured
      if (!supabase) {
        throw new Error('Supabase not configured. Please add your Supabase credentials.');
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      checkAuthStatus();
    });

    return () => subscription.unsubscribe();
  }, [checkAuthStatus]);

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
  };
};