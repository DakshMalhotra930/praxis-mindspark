-- Fix for ambiguous column reference error
-- Run this if you got the "column reference 'feature_name' is ambiguous" error

-- Drop the problematic view if it exists
DROP VIEW IF EXISTS public.usage_analytics;

-- Recreate the view with proper table aliases
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

-- Verify the view was created successfully
SELECT 'Usage analytics view created successfully' as status;
