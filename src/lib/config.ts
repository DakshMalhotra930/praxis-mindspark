// Environment Configuration
// Updated by DakshMalhotra930 for complete backend integration
export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://praxis-ai.fly.dev',
    TIMEOUT: 5000, // Reduced timeout for faster fallback
    RETRY_ATTEMPTS: 1, // Reduced retries for faster fallback
    RETRY_DELAY: 500,
  },
  
  // Supabase Configuration
  SUPABASE: {
    URL: import.meta.env.VITE_SUPABASE_URL || 'https://zhcdugrwubgzntrqchpg.supabase.co',
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoY2R1Z3J3dWJnem50cnFjaHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDI0MTksImV4cCI6MjA3MzQxODQxOX0.KDiPNal4QZcP2_3pDHSta-YS_agR-uh733Tz3blkkHs',
  },
  
  // App Configuration
  APP: {
    NAME: 'Praxis AI',
    VERSION: '1.0.0',
    DESCRIPTION: 'AI-powered JEE preparation platform',
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_HEALTH_CHECK: true,
    ENABLE_USAGE_TRACKING: true,
    ENABLE_FALLBACK_CONTENT: true,
    ENABLE_IMAGE_UPLOAD: true,
  },
  
  // Usage Limits
  USAGE: {
    FREE_DAILY_LIMIT: 5,
    PREMIUM_DAILY_LIMIT: 999999,
  },
  
  // Premium Users (for development)
  PREMIUM_USERS: [
    'dakshmalhotra930@gmail.com',
  ],
} as const;

// Environment validation
export const validateConfig = () => {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];
  
  const missingVars = requiredEnvVars.filter(
    (varName) => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(', ')}. Using fallback values.`
    );
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
};

// Initialize config validation
validateConfig();
