// API Configuration and Service Layer
// Updated by DakshMalhotra930 for complete backend integration
import { supabase } from './supabase';
import { CONFIG } from './config';

// API Configuration
export const API_CONFIG = {
  BASE_URL: CONFIG.API.BASE_URL,
  TIMEOUT: CONFIG.API.TIMEOUT,
  RETRY_ATTEMPTS: CONFIG.API.RETRY_ATTEMPTS,
  RETRY_DELAY: CONFIG.API.RETRY_DELAY,
};

// API Endpoints
export const API_ENDPOINTS = {
  SYLLABUS: '/api/syllabus',
  GENERATE_CONTENT: '/api/generate-content',
  GENERATE_QUIZ: '/api/generate-quiz',
  CHAT: '/api/chat',
  IMAGE_SOLVE: '/api/image-solve',
  STUDY_PLAN_CHAT: '/api/study-plan-chat',
  GENERATE_STUDY_PLAN: '/api/generate-study-plan',
  TRACK_USAGE: '/api/track-usage',
  HEALTH: '/api/health',
} as const;

// Request configuration
interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SyllabusResponse {
  syllabus: Subject[];
}

export interface ContentResponse {
  content: {
    learn: string;
    revise: string;
  };
}

export interface QuizResponse {
  quiz: {
    questions: Array<{
      question: string;
      options: string[];
      correct_answer: number;
      explanation: string;
    }>;
  };
}

export interface ChatResponse {
  response: string;
}

export interface ImageSolveResponse {
  solution: string;
}

export interface StudyPlanResponse {
  study_plan: StudyPlan;
}

export interface UsageTrackingResponse {
  success: boolean;
  usage_count: number;
  usage_limit: number;
}

// Types for study plan
export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  subjects: string[];
  goals: string[];
  schedule: {
    week: number;
    topics: string[];
    goals: string[];
  }[];
  created_at: string;
}

// Types for syllabus
export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  class: 11 | 12;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  subtopics?: string[];
  content?: {
    learn: string;
    revise: string;
  };
}

// Utility function to get auth token
const getAuthToken = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

// Utility function to make API requests with retry logic
const makeRequest = async <T>(
  endpoint: string,
  config: RequestConfig
): Promise<ApiResponse<T>> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const timeout = config.timeout || API_CONFIG.TIMEOUT;
  
  // Get auth token
  const token = await getAuthToken();
  
  const requestConfig: RequestInit = {
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...config.headers,
    },
    ...(config.body && { body: JSON.stringify(config.body) }),
  };

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      lastError = error as Error;
      console.warn(`API request attempt ${attempt} failed:`, error);
      
      if (attempt < API_CONFIG.RETRY_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
      }
    }
  }
  
  return {
    success: false,
    error: lastError?.message || 'Request failed after all retry attempts',
  };
};

// API Service class
export class ApiService {
  // Health check
  static async healthCheck(): Promise<ApiResponse> {
    return makeRequest(API_ENDPOINTS.HEALTH, { method: 'GET' });
  }

  // Get syllabus
  static async getSyllabus(): Promise<ApiResponse<SyllabusResponse>> {
    return makeRequest(API_ENDPOINTS.SYLLABUS, { method: 'GET' });
  }

  // Generate content
  static async generateContent(params: {
    user_id: string;
    subject: string;
    chapter: string;
    topic: string;
  }): Promise<ApiResponse<ContentResponse>> {
    return makeRequest(API_ENDPOINTS.GENERATE_CONTENT, {
      method: 'POST',
      body: params,
    });
  }

  // Generate quiz
  static async generateQuiz(params: {
    user_id: string;
    subject: string;
    chapter: string;
    topic: string;
    difficulty?: string;
    question_count?: number;
  }): Promise<ApiResponse<QuizResponse>> {
    return makeRequest(API_ENDPOINTS.GENERATE_QUIZ, {
      method: 'POST',
      body: params,
    });
  }

  // Chat with AI
  static async chat(params: {
    user_id: string;
    session_id: string;
    message: string;
    context?: any[];
  }): Promise<ApiResponse<ChatResponse>> {
    return makeRequest(API_ENDPOINTS.CHAT, {
      method: 'POST',
      body: params,
    });
  }

  // Solve image problem
  static async solveImage(params: {
    user_id: string;
    session_id: string;
    image_data: string;
    question?: string;
  }): Promise<ApiResponse<ImageSolveResponse>> {
    return makeRequest(API_ENDPOINTS.IMAGE_SOLVE, {
      method: 'POST',
      body: params,
    });
  }

  // Study plan chat
  static async studyPlanChat(params: {
    user_id: string;
    message: string;
    context?: any[];
    current_plan?: StudyPlan | null;
  }): Promise<ApiResponse<ChatResponse>> {
    return makeRequest(API_ENDPOINTS.STUDY_PLAN_CHAT, {
      method: 'POST',
      body: params,
    });
  }

  // Generate study plan
  static async generateStudyPlan(params: {
    user_id: string;
    chat_history: any[];
    preferences: {
      subjects: string[];
      duration: string;
      intensity: string;
    };
  }): Promise<ApiResponse<StudyPlanResponse>> {
    return makeRequest(API_ENDPOINTS.GENERATE_STUDY_PLAN, {
      method: 'POST',
      body: params,
    });
  }

  // Track usage
  static async trackUsage(params: {
    user_id: string;
    feature_name: string;
    session_id?: string;
    timestamp: string;
  }): Promise<ApiResponse<UsageTrackingResponse>> {
    return makeRequest(API_ENDPOINTS.TRACK_USAGE, {
      method: 'POST',
      body: params,
    });
  }
}

// Export default instance
export default ApiService;
