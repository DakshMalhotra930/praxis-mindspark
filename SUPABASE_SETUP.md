# Praxis AI - Supabase Database Setup Guide

## 🚀 Quick Setup (Recommended)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### Step 2: Run Essential Setup
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run** to execute the script

### Step 3: Configure Authentication
1. Go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials
4. Set redirect URL: `https://your-domain.com/auth/callback`

### Step 4: Update Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🔧 Complete Setup (Advanced)

### Step 1: Run Full Schema
1. Use `supabase-schema.sql` for complete setup
2. This includes all tables, indexes, and advanced features
3. Recommended for production deployment

### Step 2: Configure RLS Policies
The schema includes comprehensive Row Level Security policies:
- Users can only access their own data
- Public read access for reference data
- Secure API access patterns

### Step 3: Set Up Monitoring
1. Enable **Database** → **Logs**
2. Monitor API usage and performance
3. Set up alerts for critical issues

---

## 📊 Database Schema Overview

### Core Tables
- **users**: User profiles and subscription status
- **daily_usage**: Usage tracking for rate limiting
- **usage_limits**: Configuration for different user types
- **chat_sessions**: AI chat session management
- **chat_messages**: Individual chat messages
- **generated_content**: Cached AI-generated content

### Key Features
- **Row Level Security**: Secure data access
- **Automatic Triggers**: User creation and updates
- **Usage Tracking**: Built-in rate limiting
- **Content Caching**: Performance optimization
- **Analytics Ready**: Built-in reporting views

---

## 🔐 Security Configuration

### RLS Policies
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR ALL USING (auth.uid() = id);
```

### API Security
- All API calls require authentication
- User data is isolated by RLS policies
- Sensitive operations are protected

---

## 📈 Usage Tracking

### Built-in Functions
```sql
-- Track user usage
SELECT track_usage('user_id', 'feature_name');

-- Get usage status
SELECT * FROM get_user_usage_status('user_id', 'feature_name');
```

### Rate Limiting
- Free users: 5 interactions per day
- Pro users: Unlimited access
- Automatic enforcement in application

---

## 🚀 Backend Integration

### API Endpoints
Your Fly.io backend should connect to these tables:

1. **User Authentication**
   - Verify user tokens
   - Check subscription status
   - Track usage

2. **Content Generation**
   - Cache generated content
   - Track generation requests
   - Monitor performance

3. **Chat Sessions**
   - Store chat history
   - Track session activity
   - Manage context

### Database Functions
```sql
-- Check if user can use feature
SELECT can_use_feature('user_id', 'feature_name');

-- Get user subscription status
SELECT subscription_status FROM users WHERE id = 'user_id';

-- Track API usage
SELECT track_usage('user_id', 'api_call');
```

---

## 🔍 Testing the Setup

### 1. Test User Creation
```sql
-- Check if users table is populated
SELECT * FROM users LIMIT 5;
```

### 2. Test RLS Policies
```sql
-- This should only return current user's data
SELECT * FROM daily_usage;
```

### 3. Test Functions
```sql
-- Test usage tracking
SELECT track_usage(auth.uid(), 'test_feature');
```

---

## 🐛 Troubleshooting

### Common Issues

1. **RLS Policies Not Working**
   - Check if policies are enabled
   - Verify user authentication
   - Test with different user contexts

2. **Functions Not Executing**
   - Check function permissions
   - Verify SECURITY DEFINER
   - Test with authenticated user

3. **Data Not Appearing**
   - Check RLS policies
   - Verify user authentication
   - Check for errors in logs

### Debug Queries
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Check function permissions
SELECT * FROM pg_proc WHERE proname = 'track_usage';

-- Check user data
SELECT * FROM users WHERE email = 'your-email@example.com';
```

---

## 📊 Monitoring & Analytics

### Built-in Views
```sql
-- User dashboard data
SELECT * FROM user_dashboard WHERE id = 'user_id';

-- Usage analytics
SELECT * FROM usage_analytics WHERE user_id = 'user_id';

-- Study progress
SELECT * FROM study_progress_summary WHERE user_id = 'user_id';
```

### Performance Monitoring
- Monitor query performance
- Check index usage
- Track API response times

---

## 🔄 Maintenance

### Regular Tasks
1. **Clean up expired content**
   ```sql
   DELETE FROM generated_content WHERE expires_at < NOW();
   ```

2. **Archive old sessions**
   ```sql
   UPDATE chat_sessions SET status = 'ARCHIVED' 
   WHERE last_activity < NOW() - INTERVAL '30 days';
   ```

3. **Update usage limits**
   ```sql
   UPDATE usage_limits SET daily_limit = 10 
   WHERE user_type = 'FREE' AND feature_name = 'ai_interaction';
   ```

---

## 🆘 Support

### Getting Help
1. Check Supabase logs for errors
2. Verify RLS policies are correct
3. Test with different user accounts
4. Check function permissions

### Useful Queries
```sql
-- Check all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables WHERE schemaname = 'public';

-- Check functions
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public';
```

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] RLS policies enabled
- [ ] Functions created and working
- [ ] Initial data inserted
- [ ] Authentication configured
- [ ] Environment variables set
- [ ] Frontend connected
- [ ] Backend integration tested
- [ ] Usage tracking working
- [ ] Content caching functional
- [ ] Chat sessions storing data
- [ ] Error handling working
- [ ] Performance monitoring active

Your Supabase database is now ready for Praxis AI! 🎉
