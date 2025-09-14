-- Praxis AI - Essential Supabase Setup
-- Run this first to set up the core tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CORE TABLES
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    subscription_status TEXT DEFAULT 'FREE' CHECK (subscription_status IN ('FREE', 'PRO', 'PREMIUM')),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily usage tracking
CREATE TABLE public.daily_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    usage_date DATE NOT NULL,
    feature_name TEXT NOT NULL,
    usage_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, usage_date, feature_name)
);

-- Usage limits configuration
CREATE TABLE public.usage_limits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_type TEXT NOT NULL CHECK (user_type IN ('FREE', 'PRO', 'PREMIUM')),
    feature_name TEXT NOT NULL,
    daily_limit INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_type, feature_name)
);

-- Chat sessions
CREATE TABLE public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    session_type TEXT DEFAULT 'DEEP_STUDY' CHECK (session_type IN ('DEEP_STUDY', 'QUICK_REVIEW', 'STUDY_PLAN')),
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'PAUSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages
CREATE TABLE public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('USER', 'ASSISTANT', 'SYSTEM')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated content cache
CREATE TABLE public.generated_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    chapter TEXT NOT NULL,
    topic TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('LEARN', 'REVISE', 'QUIZ')),
    content_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own data" ON public.users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own usage" ON public.daily_usage
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own messages" ON public.chat_messages
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own content" ON public.generated_content
    FOR ALL USING (auth.uid() = user_id);

-- Public read access for usage limits
CREATE POLICY "Anyone can read usage limits" ON public.usage_limits
    FOR SELECT USING (is_active = true);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
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
    p_feature_name TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.daily_usage (user_id, usage_date, feature_name)
    VALUES (p_user_id, CURRENT_DATE, p_feature_name)
    ON CONFLICT (user_id, usage_date, feature_name)
    DO UPDATE SET usage_count = daily_usage.usage_count + 1;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert usage limits
INSERT INTO public.usage_limits (user_type, feature_name, daily_limit) VALUES
('FREE', 'content_generation', 5),
('FREE', 'quiz_generation', 5),
('FREE', 'ai_interaction', 5),
('FREE', 'deep_study_session', 2),
('FREE', 'study_plan_chat', 3),
('FREE', 'study_plan_generation', 1),
('FREE', 'image_solve', 2),
('PRO', 'content_generation', 999999),
('PRO', 'quiz_generation', 999999),
('PRO', 'ai_interaction', 999999),
('PRO', 'deep_study_session', 999999),
('PRO', 'study_plan_chat', 999999),
('PRO', 'study_plan_generation', 999999),
('PRO', 'image_solve', 999999);

-- =============================================
-- PERMISSIONS
-- =============================================

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.usage_limits TO anon;
