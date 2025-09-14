# Praxis AI - Backend Integration Guide
<!-- Updated by DakshMalhotra930 for complete backend integration -->

## 🔗 Connecting Fly.io Backend to Supabase

This guide shows how to integrate your Fly.io backend with the Supabase database.

---

## 📋 Prerequisites

- Supabase database set up (see `SUPABASE_SETUP.md`)
- Fly.io backend running
- Supabase service role key
- Python/Node.js backend (adjust examples as needed)

---

## 🔧 Environment Variables

Add these to your Fly.io backend:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# API Configuration
API_BASE_URL=https://your-app.fly.dev
CORS_ORIGINS=https://your-frontend-domain.com
```

---

## 🐍 Python Backend Integration

### 1. Install Dependencies
```bash
pip install supabase python-dotenv
```

### 2. Supabase Client Setup
```python
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)
```

### 3. User Authentication Middleware
```python
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # Verify the JWT token with Supabase
        response = supabase.auth.get_user(credentials.credentials)
        if not response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")
```

### 4. Usage Tracking Function
```python
async def track_usage(user_id: str, feature_name: str, session_id: str = None):
    """Track user usage for rate limiting"""
    try:
        # Call the track_usage function in Supabase
        result = supabase.rpc('track_usage', {
            'p_user_id': user_id,
            'p_feature_name': feature_name,
            'p_session_id': session_id
        }).execute()
        return True
    except Exception as e:
        print(f"Usage tracking failed: {e}")
        return False
```

### 5. Check Usage Limits
```python
async def check_usage_limit(user_id: str, feature_name: str):
    """Check if user can use a feature"""
    try:
        result = supabase.rpc('get_user_usage_status', {
            'p_user_id': user_id,
            'p_feature_name': feature_name
        }).execute()
        
        if result.data:
            usage_data = result.data[0]
            return {
                'can_use': usage_data['can_use_feature'],
                'usage_count': usage_data['usage_count'],
                'usage_limit': usage_data['usage_limit']
            }
        return {'can_use': False, 'usage_count': 0, 'usage_limit': 0}
    except Exception as e:
        print(f"Usage check failed: {e}")
        return {'can_use': False, 'usage_count': 0, 'usage_limit': 0}
```

### 6. API Endpoint Example
```python
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel

app = FastAPI()

class ContentRequest(BaseModel):
    subject: str
    chapter: str
    topic: str

@app.post("/api/generate-content")
async def generate_content(
    request: ContentRequest,
    current_user = Depends(get_current_user)
):
    # Check usage limits
    usage_status = await check_usage_limit(current_user.id, "content_generation")
    if not usage_status['can_use']:
        raise HTTPException(
            status_code=429, 
            detail="Usage limit reached. Upgrade to Pro for unlimited access."
        )
    
    # Track usage
    await track_usage(current_user.id, "content_generation")
    
    # Generate content (your AI logic here)
    content = await generate_ai_content(request.subject, request.chapter, request.topic)
    
    # Cache content in Supabase
    try:
        supabase.table('generated_content').insert({
            'user_id': current_user.id,
            'subject': request.subject,
            'chapter': request.chapter,
            'topic': request.topic,
            'content_type': 'LEARN',
            'content_data': content
        }).execute()
    except Exception as e:
        print(f"Content caching failed: {e}")
    
    return {"content": content}
```

---

## 🟢 Node.js Backend Integration

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js dotenv
```

### 2. Supabase Client Setup
```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

### 3. Authentication Middleware
```javascript
const jwt = require('jsonwebtoken');

async function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}
```

### 4. Usage Tracking
```javascript
async function trackUsage(userId, featureName, sessionId = null) {
  try {
    const { error } = await supabase.rpc('track_usage', {
      p_user_id: userId,
      p_feature_name: featureName,
      p_session_id: sessionId
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Usage tracking failed:', error);
    return false;
  }
}

async function checkUsageLimit(userId, featureName) {
  try {
    const { data, error } = await supabase.rpc('get_user_usage_status', {
      p_user_id: userId,
      p_feature_name: featureName
    });
    
    if (error) throw error;
    return data[0] || { can_use_feature: false, usage_count: 0, usage_limit: 0 };
  } catch (error) {
    console.error('Usage check failed:', error);
    return { can_use_feature: false, usage_count: 0, usage_limit: 0 };
  }
}
```

### 5. API Endpoint Example
```javascript
app.post('/api/generate-content', authenticateUser, async (req, res) => {
  try {
    const { subject, chapter, topic } = req.body;
    const userId = req.user.id;

    // Check usage limits
    const usageStatus = await checkUsageLimit(userId, 'content_generation');
    if (!usageStatus.can_use_feature) {
      return res.status(429).json({
        error: 'Usage limit reached. Upgrade to Pro for unlimited access.'
      });
    }

    // Track usage
    await trackUsage(userId, 'content_generation');

    // Generate content (your AI logic here)
    const content = await generateAIContent(subject, chapter, topic);

    // Cache content
    try {
      await supabase.from('generated_content').insert({
        user_id: userId,
        subject,
        chapter,
        topic,
        content_type: 'LEARN',
        content_data: content
      });
    } catch (error) {
      console.error('Content caching failed:', error);
    }

    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Content generation failed' });
  }
});
```

---

## 🔄 Database Operations

### 1. User Management
```python
# Get user profile
async def get_user_profile(user_id: str):
    result = supabase.table('users').select('*').eq('id', user_id).execute()
    return result.data[0] if result.data else None

# Update user subscription
async def update_user_subscription(user_id: str, status: str):
    supabase.table('users').update({
        'subscription_status': status,
        'is_premium': status in ['PRO', 'PREMIUM']
    }).eq('id', user_id).execute()
```

### 2. Content Caching
```python
# Cache generated content
async def cache_content(user_id: str, subject: str, chapter: str, topic: str, content: dict, content_type: str):
    supabase.table('generated_content').insert({
        'user_id': user_id,
        'subject': subject,
        'chapter': chapter,
        'topic': topic,
        'content_type': content_type,
        'content_data': content
    }).execute()

# Get cached content
async def get_cached_content(user_id: str, subject: str, chapter: str, topic: str, content_type: str):
    result = supabase.table('generated_content').select('content_data').eq('user_id', user_id).eq('subject', subject).eq('chapter', chapter).eq('topic', topic).eq('content_type', content_type).gt('expires_at', 'now()').execute()
    return result.data[0]['content_data'] if result.data else None
```

### 3. Chat Session Management
```python
# Create chat session
async def create_chat_session(user_id: str, session_type: str = 'DEEP_STUDY'):
    result = supabase.table('chat_sessions').insert({
        'user_id': user_id,
        'session_type': session_type
    }).execute()
    return result.data[0]['id'] if result.data else None

# Store chat message
async def store_chat_message(session_id: str, user_id: str, message_type: str, content: str):
    supabase.table('chat_messages').insert({
        'session_id': session_id,
        'user_id': user_id,
        'message_type': message_type,
        'content': content
    }).execute()

# Get chat history
async def get_chat_history(session_id: str, limit: int = 10):
    result = supabase.table('chat_messages').select('*').eq('session_id', session_id).order('created_at', desc=True).limit(limit).execute()
    return result.data
```

---

## 📊 Analytics & Monitoring

### 1. Usage Analytics
```python
# Get user usage stats
async def get_user_usage_stats(user_id: str, days: int = 30):
    result = supabase.table('daily_usage').select('*').eq('user_id', user_id).gte('usage_date', f'now() - interval \'{days} days\'').execute()
    return result.data

# Get feature usage across all users
async def get_feature_usage_stats(feature_name: str, days: int = 7):
    result = supabase.table('daily_usage').select('*').eq('feature_name', feature_name).gte('usage_date', f'now() - interval \'{days} days\'').execute()
    return result.data
```

### 2. Health Monitoring
```python
# Log API health
async def log_api_health(service_name: str, status: str, response_time_ms: int = None, error_message: str = None):
    supabase.table('health_logs').insert({
        'service_name': service_name,
        'status': status,
        'response_time_ms': response_time_ms,
        'error_message': error_message
    }).execute()

# Log API usage
async def log_api_usage(user_id: str, endpoint: str, method: str, status_code: int, response_time_ms: int):
    supabase.table('api_logs').insert({
        'user_id': user_id,
        'endpoint': endpoint,
        'method': method,
        'status_code': status_code,
        'response_time_ms': response_time_ms
    }).execute()
```

---

## 🔒 Security Best Practices

### 1. Input Validation
```python
from pydantic import BaseModel, validator

class ContentRequest(BaseModel):
    subject: str
    chapter: str
    topic: str
    
    @validator('subject')
    def validate_subject(cls, v):
        allowed_subjects = ['physics', 'chemistry', 'mathematics']
        if v.lower() not in allowed_subjects:
            raise ValueError('Invalid subject')
        return v.lower()
```

### 2. Rate Limiting
```python
from collections import defaultdict
import time

# Simple in-memory rate limiter (use Redis in production)
rate_limiter = defaultdict(list)

def check_rate_limit(user_id: str, limit: int = 100, window: int = 3600):
    now = time.time()
    user_requests = rate_limiter[user_id]
    
    # Remove old requests
    user_requests[:] = [req_time for req_time in user_requests if now - req_time < window]
    
    if len(user_requests) >= limit:
        return False
    
    user_requests.append(now)
    return True
```

### 3. Error Handling
```python
import logging

logger = logging.getLogger(__name__)

async def safe_database_operation(operation, *args, **kwargs):
    try:
        return await operation(*args, **kwargs)
    except Exception as e:
        logger.error(f"Database operation failed: {e}")
        return None
```

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Supabase client initialized
- [ ] Authentication middleware working
- [ ] Usage tracking implemented
- [ ] Content caching functional
- [ ] Error handling in place
- [ ] Rate limiting configured
- [ ] Health monitoring active
- [ ] Logging configured
- [ ] Security measures implemented
- [ ] API endpoints tested
- [ ] Database connections stable
- [ ] Performance optimized
- [ ] Monitoring alerts set up

---

## 🆘 Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Check JWT token format
   - Verify Supabase URL and keys
   - Ensure proper token validation

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Monitor connection pool

3. **Usage Tracking Problems**
   - Check RLS policies
   - Verify function permissions
   - Monitor error logs

4. **Performance Issues**
   - Optimize database queries
   - Implement caching
   - Monitor response times

Your Fly.io backend is now fully integrated with Supabase! 🎉
