# Praxis AI - Deployment Guide

## 🚀 Quick Start

This guide will help you deploy Praxis AI to production with full backend integration.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository access
- Supabase account
- Fly.io account (for backend)

## 🔧 Environment Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=https://praxis-ai.fly.dev

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development Configuration
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Application

```bash
npm run build
```

## 🌐 Backend Integration

### API Endpoints

The application connects to the following Fly.io backend endpoints:

- `GET /api/health` - Health check
- `GET /api/syllabus` - JEE syllabus data
- `POST /api/generate-content` - AI content generation
- `POST /api/generate-quiz` - AI quiz generation
- `POST /api/chat` - AI chat responses
- `POST /api/image-solve` - Image problem solving
- `POST /api/study-plan-chat` - Study plan chat
- `POST /api/generate-study-plan` - Study plan generation
- `POST /api/track-usage` - Usage tracking

### Authentication

The app uses Supabase for authentication with Google OAuth:

1. **Supabase Setup**:
   - Create a new Supabase project
   - Enable Google OAuth provider
   - Configure redirect URLs
   - Update environment variables

2. **Google OAuth Setup**:
   - Create Google OAuth credentials
   - Add authorized redirect URIs
   - Configure Supabase with Google credentials

## 🔍 Testing Backend Connection

### Health Check

The application includes a built-in health check system:

1. Navigate to the "System Health" tab
2. Check API and Supabase connectivity
3. Verify all services are operational

### Manual Testing

Test each feature to ensure backend integration:

1. **Syllabus Loading**: Check if syllabus loads from API
2. **Content Generation**: Generate study materials for any topic
3. **Quiz Generation**: Create quizzes for topics
4. **AI Chat**: Test chat functionality
5. **Image Upload**: Test image problem solving
6. **Study Planning**: Generate study plans

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**:
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables**:
   - Add all environment variables in Vercel dashboard
   - Set `VITE_APP_ENV=production`

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Build Command**:
   ```bash
   npm run build
   ```

2. **Publish Directory**:
   ```
   dist
   ```

3. **Environment Variables**:
   - Add all environment variables in Netlify dashboard

### Option 3: Self-Hosted

1. **Build Application**:
   ```bash
   npm run build
   ```

2. **Serve Static Files**:
   ```bash
   npx serve -s dist -l 3000
   ```

3. **Configure Web Server**:
   - Use Nginx or Apache
   - Configure SSL certificates
   - Set up proper headers

## 🔧 Configuration

### API Configuration

Update `src/lib/config.ts` for custom settings:

```typescript
export const CONFIG = {
  API: {
    BASE_URL: 'your-api-url',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
  },
  // ... other settings
};
```

### Feature Flags

Enable/disable features in config:

```typescript
FEATURES: {
  ENABLE_HEALTH_CHECK: true,
  ENABLE_USAGE_TRACKING: true,
  ENABLE_FALLBACK_CONTENT: true,
  ENABLE_IMAGE_UPLOAD: true,
},
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**:
   - Check API_BASE_URL in environment variables
   - Verify Fly.io backend is running
   - Check network connectivity

2. **Supabase Authentication Issues**:
   - Verify Supabase URL and keys
   - Check Google OAuth configuration
   - Ensure redirect URLs are correct

3. **Build Failures**:
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify all dependencies are installed

4. **CORS Issues**:
   - Configure CORS in backend
   - Check API endpoint accessibility
   - Verify request headers

### Debug Mode

Enable debug mode for development:

```bash
VITE_DEBUG_MODE=true npm run dev
```

## 📊 Monitoring

### Health Monitoring

- Use the built-in health check system
- Monitor API response times
- Check error rates and logs

### Usage Tracking

- Monitor user usage patterns
- Track API call success rates
- Analyze performance metrics

## 🔒 Security

### Environment Variables

- Never commit `.env` files
- Use secure environment variable storage
- Rotate API keys regularly

### API Security

- Implement rate limiting
- Use HTTPS for all communications
- Validate all inputs

### Authentication

- Use secure session management
- Implement proper logout functionality
- Monitor authentication attempts

## 📈 Performance

### Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies

### Monitoring

- Monitor bundle size
- Track loading times
- Optimize API calls

## 🆘 Support

For deployment issues:

1. Check the health check system
2. Review browser console for errors
3. Verify environment variables
4. Test API endpoints manually

## 📝 Notes

- The application includes fallback content for offline functionality
- All API calls include retry logic and error handling
- The system gracefully degrades when services are unavailable
- Premium users have unlimited access to all features
