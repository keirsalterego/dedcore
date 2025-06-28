# Vercel Deployment Guide for DedCore

This guide will help you deploy your DedCore landing page to Vercel and resolve common 404 errors.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Set up all required environment variables

## Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository containing your DedCore project

### 2. Configure Build Settings

**Framework Preset**: Next.js
**Root Directory**: `dedcore-landing` (if your project is in a subdirectory)
**Build Command**: `npm run build`
**Output Directory**: `.next`
**Install Command**: `npm install`

### 3. Environment Variables

Set these environment variables in your Vercel project settings:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Authentication
ADMIN_PASSWORD=your_secure_admin_password

# Email Service Configuration (optional)
EMAIL_SERVICE=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=DedCore <your_email@gmail.com>

# Newsletter Configuration
NEWSLETTER_NAME=DedCore Newsletter
NEWSLETTER_DESCRIPTION=Stay updated with the latest DedCore developments
```

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Check the deployment logs for any errors

## Troubleshooting 404 Errors

### Common Causes and Solutions

#### 1. **Admin Routes Not Found**

**Problem**: `/admin` routes return 404
**Solution**: 
- Ensure your `next.config.ts` is properly configured
- Check that all admin page files exist in `app/admin/`
- Verify the middleware is not blocking legitimate requests

#### 2. **API Routes Not Working**

**Problem**: `/api/admin/*` routes return 404
**Solution**:
- Ensure all API route files exist in `app/api/admin/`
- Check that the route handlers are properly exported
- Verify environment variables are set correctly

#### 3. **Build Errors**

**Problem**: Build fails during deployment
**Solution**:
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally

#### 4. **Environment Variables Missing**

**Problem**: App works locally but fails on Vercel
**Solution**:
- Add all required environment variables in Vercel settings
- Ensure variable names match exactly (case-sensitive)
- Redeploy after adding environment variables

## File Structure Verification

Ensure your project has this structure:

```
dedcore-landing/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── subscribers/
│   │   │   └── page.tsx
│   │   ├── newsletter/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── database/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   └── error.tsx
│   ├── api/
│   │   └── admin/
│   │       ├── login/
│   │       │   └── route.ts
│   │       ├── check-auth/
│   │       │   └── route.ts
│   │       ├── logout/
│   │       │   └── route.ts
│   │       ├── send-newsletter/
│   │       │   └── route.ts
│   │       └── email-status/
│   │           └── route.ts
│   ├── error.tsx
│   └── page.tsx
├── components/
│   └── admin-layout.tsx
├── lib/
│   ├── auth.ts
│   ├── email.ts
│   └── supabase.ts
├── middleware.ts
├── next.config.ts
├── vercel.json
└── package.json
```

## Testing After Deployment

1. **Test Main Page**: Visit your domain root
2. **Test Admin Login**: Visit `/admin/login`
3. **Test Admin Dashboard**: Login and visit `/admin`
4. **Test API Routes**: Check browser network tab for API calls

## Common Vercel-Specific Issues

### 1. **Cold Starts**
- First request to admin routes might be slow
- Subsequent requests should be faster
- Consider using Vercel Pro for better performance

### 2. **Function Timeout**
- API routes have a 10-second timeout on free plan
- Newsletter sending might timeout with many subscribers
- Consider using Vercel Pro for longer timeouts

### 3. **Edge Functions**
- Middleware runs on edge functions
- Some Node.js APIs might not be available
- Test thoroughly in production environment

## Support

If you continue to experience issues:

1. **Check Vercel Logs**: Go to your project → Functions → View Function Logs
2. **Test Locally**: Ensure everything works with `npm run build && npm start`
3. **Check Environment Variables**: Verify all variables are set correctly
4. **Review Build Output**: Check for any TypeScript or build errors

## Performance Optimization

1. **Enable Caching**: Use appropriate cache headers
2. **Optimize Images**: Use Next.js Image component
3. **Code Splitting**: Ensure proper dynamic imports
4. **Bundle Analysis**: Monitor bundle size with `@next/bundle-analyzer`

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Admin Password**: Use a strong, unique password
3. **CORS**: Configure CORS properly for API routes
4. **Rate Limiting**: Consider implementing rate limiting for admin routes 