-- Praxis AI - Safe Supabase Database Schema
-- Updated by DakshMalhotra930 for complete backend integration
-- This version handles existing tables gracefully

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- AUTHENTICATION & USER MANAGEMENT
-- =============================================

-- Users table (extends Supabase auth.users) - DROP IF EXISTS
DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    subscription_status TEXT DEFAULT 'FREE' CHECK (subscription_status IN ('FREE', 'PRO', 'PREMIUM')),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    timezone TEXT DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}'::jsonb
);

-- User profiles for additional data
DROP TABLE IF EXISTS public.user_profiles CASCADE;
CREATE TABLE public.user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    bio TEXT,
    grade TEXT,
    target_exam TEXT DEFAULT 'JEE',
    study_goals TEXT[],
    weak_subjects TEXT[],
    strong_subjects TEXT[],
    study_hours_per_day INTEGER DEFAULT 6,
    preferred_study_time TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SYLLABUS & CONTENT MANAGEMENT
-- =============================================

-- Subjects table
DROP TABLE IF EXISTS public.subjects CASCADE;
CREATE TABLE public.subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters table
DROP TABLE IF EXISTS public.chapters CASCADE;
CREATE TABLE public.chapters (
    id TEXT PRIMARY KEY,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    class_number INTEGER NOT NULL CHECK (class_number IN (11, 12)),
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topics table
DROP TABLE IF EXISTS public.topics CASCADE;
CREATE TABLE public.topics (
    id TEXT PRIMARY KEY,
    chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    difficulty_level TEXT DEFAULT 'MEDIUM' CHECK (difficulty_level IN ('EASY', 'MEDIUM', 'HARD')),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subtopics table
DROP TABLE IF EXISTS public.subtopics CASCADE;
CREATE TABLE public.subtopics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AI CONTENT & GENERATION
-- =============================================

-- Generated content cache
DROP TABLE IF EXISTS public.generated_content CASCADE;
CREATE TABLE public.generated_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    chapter TEXT NOT NULL,
    topic TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('LEARN', 'REVISE', 'QUIZ')),
    content_data JSONB NOT NULL,
    difficulty_level TEXT DEFAULT 'MEDIUM',
    generation_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- AI chat sessions
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
CREATE TABLE public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    session_type TEXT DEFAULT 'DEEP_STUDY' CHECK (session_type IN ('DEEP_STUDY', 'QUICK_REVIEW', 'STUDY_PLAN')),
    subject TEXT,
    chapter TEXT,
    topic TEXT,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'PAUSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Chat messages
DROP TABLE IF EXISTS public.chat_messages CASCADE;
CREATE TABLE public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('USER', 'ASSISTANT', 'SYSTEM')),
    content TEXT NOT NULL,
    image_data TEXT, -- Base64 encoded image
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- USAGE TRACKING & ANALYTICS
-- =============================================

-- Daily usage tracking
DROP TABLE IF EXISTS public.daily_usage CASCADE;
CREATE TABLE public.daily_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    usage_date DATE NOT NULL,
    feature_name TEXT NOT NULL,
    usage_count INTEGER DEFAULT 1,
    session_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, usage_date, feature_name)
);

-- Usage limits configuration
DROP TABLE IF EXISTS public.usage_limits CASCADE;
CREATE TABLE public.usage_limits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_type TEXT NOT NULL CHECK (user_type IN ('FREE', 'PRO', 'PREMIUM')),
    feature_name TEXT NOT NULL,
    daily_limit INTEGER NOT NULL,
    monthly_limit INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_type, feature_name)
);

-- User activity logs
DROP TABLE IF EXISTS public.activity_logs CASCADE;
CREATE TABLE public.activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STUDY PLANS & PROGRESS
-- =============================================

-- Study plans
DROP TABLE IF EXISTS public.study_plans CASCADE;
CREATE TABLE public.study_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_weeks INTEGER NOT NULL,
    subjects TEXT[] NOT NULL,
    goals TEXT[] NOT NULL,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'PAUSED', 'ARCHIVED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Study plan schedule
DROP TABLE IF EXISTS public.study_plan_schedule CASCADE;
CREATE TABLE public.study_plan_schedule (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    plan_id UUID REFERENCES public.study_plans(id) ON DELETE CASCADE NOT NULL,
    week_number INTEGER NOT NULL,
    topics TEXT[] NOT NULL,
    goals TEXT[] NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study progress tracking
DROP TABLE IF EXISTS public.study_progress CASCADE;
CREATE TABLE public.study_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    chapter TEXT NOT NULL,
    topic TEXT NOT NULL,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    last_studied TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    mastery_level TEXT DEFAULT 'BEGINNER' CHECK (mastery_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, subject, chapter, topic)
);

-- =============================================
-- QUIZZES & ASSESSMENTS
-- =============================================

-- Quiz sessions
DROP TABLE IF EXISTS public.quiz_sessions CASCADE;
CREATE TABLE public.quiz_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    chapter TEXT NOT NULL,
    topic TEXT NOT NULL,
    difficulty TEXT DEFAULT 'MEDIUM',
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    score_percentage INTEGER DEFAULT 0,
    time_taken_seconds INTEGER,
    status TEXT DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Quiz questions
DROP TABLE IF EXISTS public.quiz_questions CASCADE;
CREATE TABLE public.quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer_index INTEGER NOT NULL,
    explanation TEXT,
    user_answer_index INTEGER,
    is_correct BOOLEAN,
    time_spent_seconds INTEGER,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SUBSCRIPTIONS & PAYMENTS
-- =============================================

-- Subscription plans
DROP TABLE IF EXISTS public.subscription_plans CASCADE;
CREATE TABLE public.subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    features JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;
CREATE TABLE public.user_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    payment_provider TEXT,
    payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SYSTEM & HEALTH MONITORING
-- =============================================

-- System health logs
DROP TABLE IF EXISTS public.health_logs CASCADE;
CREATE TABLE public.health_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('HEALTHY', 'UNHEALTHY', 'DEGRADED')),
    response_time_ms INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage logs
DROP TABLE IF EXISTS public.api_logs CASCADE;
CREATE TABLE public.api_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON public.users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_generated_content_user_subject ON public.generated_content(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_generated_content_topic ON public.generated_content(subject, chapter, topic);
CREATE INDEX IF NOT EXISTS idx_generated_content_expires ON public.generated_content(expires_at);

-- Chat indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages(user_id);

-- Usage tracking indexes
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, usage_date);
CREATE INDEX IF NOT EXISTS idx_daily_usage_feature ON public.daily_usage(feature_name);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);

-- Study progress indexes
CREATE INDEX IF NOT EXISTS idx_study_progress_user ON public.study_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_study_progress_subject ON public.study_progress(subject, chapter);
CREATE INDEX IF NOT EXISTS idx_study_progress_last_studied ON public.study_progress(last_studied);

-- Quiz indexes
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user ON public.quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_subject ON public.quiz_sessions(subject, chapter, topic);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_session ON public.quiz_questions(session_id);

-- System monitoring indexes
CREATE INDEX IF NOT EXISTS idx_health_logs_service ON public.health_logs(service_name);
CREATE INDEX IF NOT EXISTS idx_health_logs_created ON public.health_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint ON public.api_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_logs_created ON public.api_logs(created_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plan_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can access own content" ON public.generated_content;
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can manage own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view own usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can view own activity" ON public.activity_logs;
DROP POLICY IF EXISTS "Users can manage own plans" ON public.study_plans;
DROP POLICY IF EXISTS "Users can manage own schedule" ON public.study_plan_schedule;
DROP POLICY IF EXISTS "Users can manage own progress" ON public.study_progress;
DROP POLICY IF EXISTS "Users can manage own quizzes" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Users can manage own questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Anyone can read subjects" ON public.subjects;
DROP POLICY IF EXISTS "Anyone can read chapters" ON public.chapters;
DROP POLICY IF EXISTS "Anyone can read topics" ON public.topics;
DROP POLICY IF EXISTS "Anyone can read subtopics" ON public.subtopics;
DROP POLICY IF EXISTS "Anyone can read subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Anyone can read usage limits" ON public.usage_limits;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- User profiles policies
CREATE POLICY "Users can manage own profile" ON public.user_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Generated content policies
CREATE POLICY "Users can access own content" ON public.generated_content
    FOR ALL USING (auth.uid() = user_id);

-- Chat sessions policies
CREATE POLICY "Users can manage own sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own messages" ON public.chat_messages
    FOR ALL USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON public.daily_usage
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity" ON public.activity_logs
    FOR ALL USING (auth.uid() = user_id);

-- Study plans policies
CREATE POLICY "Users can manage own plans" ON public.study_plans
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own schedule" ON public.study_plan_schedule
    FOR ALL USING (auth.uid() = (SELECT user_id FROM public.study_plans WHERE id = plan_id));

-- Study progress policies
CREATE POLICY "Users can manage own progress" ON public.study_progress
    FOR ALL USING (auth.uid() = user_id);

-- Quiz policies
CREATE POLICY "Users can manage own quizzes" ON public.quiz_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own questions" ON public.quiz_questions
    FOR ALL USING (auth.uid() = (SELECT user_id FROM public.quiz_sessions WHERE id = session_id));

-- Subscription policies
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Public read access for reference data
CREATE POLICY "Anyone can read subjects" ON public.subjects
    FOR SELECT USING (true);

CREATE POLICY "Anyone can read chapters" ON public.chapters
    FOR SELECT USING (true);

CREATE POLICY "Anyone can read topics" ON public.topics
    FOR SELECT USING (true);

CREATE POLICY "Anyone can read subtopics" ON public.subtopics
    FOR SELECT USING (true);

CREATE POLICY "Anyone can read subscription plans" ON public.subscription_plans
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read usage limits" ON public.usage_limits
    FOR SELECT USING (is_active = true);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_study_plans_updated_at ON public.study_plans;
DROP TRIGGER IF EXISTS update_study_progress_updated_at ON public.study_progress;
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON public.user_subscriptions;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON public.study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_progress_updated_at BEFORE UPDATE ON public.study_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to track usage
CREATE OR REPLACE FUNCTION track_usage(
    p_user_id UUID,
    p_feature_name TEXT,
    p_session_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.daily_usage (user_id, usage_date, feature_name, session_id, metadata)
    VALUES (p_user_id, CURRENT_DATE, p_feature_name, p_session_id, p_metadata)
    ON CONFLICT (user_id, usage_date, feature_name)
    DO UPDATE SET 
        usage_count = daily_usage.usage_count + 1,
        metadata = COALESCE(daily_usage.metadata, '{}'::jsonb) || p_metadata;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to get user usage status
CREATE OR REPLACE FUNCTION get_user_usage_status(p_user_id UUID, p_feature_name TEXT)
RETURNS TABLE(
    usage_count INTEGER,
    usage_limit INTEGER,
    can_use_feature BOOLEAN
) AS $$
DECLARE
    user_type TEXT;
    daily_limit INTEGER;
    current_usage INTEGER;
BEGIN
    -- Get user type
    SELECT subscription_status INTO user_type
    FROM public.users
    WHERE id = p_user_id;
    
    -- Get daily limit for feature
    SELECT daily_limit INTO daily_limit
    FROM public.usage_limits
    WHERE user_type = COALESCE(user_type, 'FREE')
    AND feature_name = p_feature_name
    AND is_active = true;
    
    -- Get current usage
    SELECT COALESCE(usage_count, 0) INTO current_usage
    FROM public.daily_usage
    WHERE user_id = p_user_id
    AND usage_date = CURRENT_DATE
    AND feature_name = p_feature_name;
    
    RETURN QUERY SELECT
        current_usage,
        COALESCE(daily_limit, 5),
        (current_usage < COALESCE(daily_limit, 5));
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert default usage limits
INSERT INTO public.usage_limits (user_type, feature_name, daily_limit, monthly_limit) VALUES
('FREE', 'content_generation', 5, 150),
('FREE', 'quiz_generation', 5, 150),
('FREE', 'ai_interaction', 5, 150),
('FREE', 'deep_study_session', 2, 60),
('FREE', 'study_plan_chat', 3, 90),
('FREE', 'study_plan_generation', 1, 30),
('FREE', 'image_solve', 2, 60),
('PRO', 'content_generation', 999999, 999999),
('PRO', 'quiz_generation', 999999, 999999),
('PRO', 'ai_interaction', 999999, 999999),
('PRO', 'deep_study_session', 999999, 999999),
('PRO', 'study_plan_chat', 999999, 999999),
('PRO', 'study_plan_generation', 999999, 999999),
('PRO', 'image_solve', 999999, 999999),
('PREMIUM', 'content_generation', 999999, 999999),
('PREMIUM', 'quiz_generation', 999999, 999999),
('PREMIUM', 'ai_interaction', 999999, 999999),
('PREMIUM', 'deep_study_session', 999999, 999999),
('PREMIUM', 'study_plan_chat', 999999, 999999),
('PREMIUM', 'study_plan_generation', 999999, 999999),
('PREMIUM', 'image_solve', 999999, 999999)
ON CONFLICT (user_type, feature_name) DO NOTHING;

-- Insert subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features) VALUES
('Free', 'Basic features for getting started', 0.00, 0.00, '["5 AI interactions per day", "Basic study materials", "Multiple choice quizzes", "Progress tracking", "Email support"]'),
('Pro', 'Advanced features for serious JEE aspirants', 99.00, 990.00, '["Unlimited AI interactions", "Advanced study materials", "Personalized study plans", "Image problem solving", "Deep study sessions", "Priority support", "Analytics dashboard", "Download study materials"]')
ON CONFLICT DO NOTHING;

-- Insert subjects
INSERT INTO public.subjects (id, name, description, icon, color, order_index) VALUES
('physics', 'Physics', 'Physics concepts and problem solving', 'atom', '#3B82F6', 1),
('chemistry', 'Chemistry', 'Chemistry theory and reactions', 'flask', '#10B981', 2),
('mathematics', 'Mathematics', 'Mathematical concepts and calculations', 'calculator', '#F59E0B', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample chapters for Physics
INSERT INTO public.chapters (id, subject_id, name, class_number, description, order_index) VALUES
('mechanics', 'physics', 'Mechanics', 11, 'Motion, forces, and energy', 1),
('electromagnetism', 'physics', 'Electromagnetism', 12, 'Electricity and magnetism', 2),
('modern-physics', 'physics', 'Modern Physics', 12, 'Quantum mechanics and nuclear physics', 3),
('optics', 'physics', 'Optics', 12, 'Light and wave phenomena', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert sample topics for Mechanics
INSERT INTO public.topics (id, chapter_id, name, description, difficulty_level, order_index) VALUES
('gravitation', 'mechanics', 'Gravitation', 'Universal law of gravitation and its applications', 'MEDIUM', 1),
('kinetic-theory', 'mechanics', 'Kinetic Theory', 'Molecular theory of gases', 'MEDIUM', 2),
('laws-of-motion', 'mechanics', 'Laws Of Motion', 'Newtons laws and their applications', 'HARD', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample subtopics for Gravitation
INSERT INTO public.subtopics (topic_id, name, description, order_index) VALUES
('gravitation', 'Newtons Law of Gravitation', 'The fundamental law governing gravitational force', 1),
('gravitation', 'Gravitational Field and Potential', 'Field concept and potential energy', 2),
('gravitation', 'Acceleration due to Gravity', 'Variation of g with altitude and depth', 3),
('gravitation', 'Escape Velocity and Orbital Velocity', 'Critical velocities for satellite motion', 4),
('gravitation', 'Motion of Satellites', 'Keplers laws and satellite dynamics', 5),
('gravitation', 'Keplers Laws', 'Planetary motion laws', 6)
ON CONFLICT DO NOTHING;

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Drop existing views
DROP VIEW IF EXISTS public.user_dashboard;
DROP VIEW IF EXISTS public.study_progress_summary;
DROP VIEW IF EXISTS public.usage_analytics;

-- User dashboard view
CREATE VIEW public.user_dashboard AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.subscription_status,
    u.is_premium,
    up.grade,
    up.target_exam,
    up.study_hours_per_day,
    COUNT(DISTINCT cs.id) as total_sessions,
    COUNT(DISTINCT sp.id) as total_study_plans,
    MAX(cs.last_activity) as last_activity
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.chat_sessions cs ON u.id = cs.user_id
LEFT JOIN public.study_plans sp ON u.id = sp.user_id
GROUP BY u.id, u.email, u.name, u.subscription_status, u.is_premium, 
         up.grade, up.target_exam, up.study_hours_per_day;

-- Study progress summary view
CREATE VIEW public.study_progress_summary AS
SELECT 
    user_id,
    subject,
    COUNT(*) as topics_studied,
    AVG(progress_percentage) as avg_progress,
    SUM(time_spent_minutes) as total_time_minutes,
    MAX(last_studied) as last_studied
FROM public.study_progress
GROUP BY user_id, subject;

-- Usage analytics view
CREATE VIEW public.usage_analytics AS
SELECT 
    du.user_id,
    du.feature_name,
    du.usage_date,
    du.usage_count,
    ul.daily_limit,
    CASE 
        WHEN du.usage_count >= ul.daily_limit THEN 'LIMIT_REACHED'
        ELSE 'AVAILABLE'
    END as status
FROM public.daily_usage du
LEFT JOIN public.usage_limits ul ON du.feature_name = ul.feature_name
LEFT JOIN public.users u ON du.user_id = u.id
WHERE ul.user_type = COALESCE(u.subscription_status, 'FREE');

-- =============================================
-- GRANTS AND PERMISSIONS
-- =============================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant read access to anon users for public data
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.subjects TO anon;
GRANT SELECT ON public.chapters TO anon;
GRANT SELECT ON public.topics TO anon;
GRANT SELECT ON public.subtopics TO anon;
GRANT SELECT ON public.subscription_plans TO anon;
GRANT SELECT ON public.usage_limits TO anon;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

-- This completes the Praxis AI database schema
-- The schema includes:
-- ✅ User management and authentication
-- ✅ Syllabus and content structure
-- ✅ AI content generation and caching
-- ✅ Chat sessions and messaging
-- ✅ Usage tracking and analytics
-- ✅ Study plans and progress tracking
-- ✅ Quiz system and assessments
-- ✅ Subscription and payment management
-- ✅ System health monitoring
-- ✅ Row Level Security policies
-- ✅ Performance indexes
-- ✅ Utility functions and triggers
-- ✅ Initial data and sample content
-- ✅ Views for common queries
-- ✅ Proper permissions and grants

-- The database is now ready for both frontend and Fly.io backend integration!
