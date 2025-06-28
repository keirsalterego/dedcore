# Newsletter Setup Guide

This guide will help you set up email storage in Supabase for your DedCore newsletter signups.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed
3. Your Next.js project running

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be set up (this may take a few minutes)

### 2. Set Up the Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-setup.sql` into the editor
4. Run the script to create the necessary table and policies

### 3. Fix RLS Policies (IMPORTANT!)

If you encounter "row-level security policy" errors when testing the signup, run the RLS fix script:

1. In your Supabase SQL Editor, run the contents of `fix-rls-policies.sql`
2. This will update the Row Level Security policies to allow anonymous users to sign up

**Alternative (for testing only):** If you want to quickly test without RLS, run `disable-rls-temp.sql` in your Supabase SQL Editor.

### 4. Get Your Supabase Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key
3. Create a `.env.local` file in your project root (copy from `.env.local.example`)
4. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Install Dependencies

The Supabase client has already been installed. If you need to reinstall:

```bash
npm install @supabase/supabase-js
```

### 6. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your website
3. Click the "Sign Up" button in the navbar
4. Enter an email address and submit
5. Check your Supabase dashboard > Table Editor > newsletter_subscribers to see the new entry

## Troubleshooting

### Common Issues

1. **"row-level security policy" error**: Run the `fix-rls-policies.sql` script in your Supabase SQL Editor
2. **"Invalid email format"**: Check that the email validation regex is working correctly
3. **"Failed to subscribe"**: Verify your Supabase credentials and network connection
4. **Duplicate emails**: The system handles duplicates gracefully and shows "Email already subscribed!"

### RLS Policy Issues

If you're getting RLS policy violations, the most common causes are:

1. **Anonymous users not allowed**: The default RLS policies might not allow anonymous inserts
2. **Policy syntax**: Some Supabase versions require specific policy syntax

**Quick Fix**: Run this in your Supabase SQL Editor:

```sql
-- Drop and recreate the insert policy
DROP POLICY IF EXISTS "Allow public signups" ON newsletter_subscribers;
CREATE POLICY "Allow public signups" ON newsletter_subscribers
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);
```

## Database Schema

The `newsletter_subscribers` table includes:

- `id`: Unique identifier (UUID)
- `email`: Email address (unique, required)
- `created_at`: Timestamp when the subscription was created
- `updated_at`: Timestamp when the record was last updated
- `status`: Subscription status ('active' or 'unsubscribed')
- `source`: Where the signup came from (default: 'website')
- `metadata`: Additional data in JSON format

## API Endpoints

### POST /api/newsletter

Adds a new newsletter subscriber.

**Request Body:**
```json
{
  "email": "user@example.com",
  "source": "website" // optional
}
```

**Response:**
```json
{
  "message": "Successfully subscribed!"
}
```

## Functions Available

The `lib/supabase.ts` file provides these functions:

- `addNewsletterSubscriber(email, source)`: Add a new subscriber
- `getActiveSubscribers()`: Get all active subscribers
- `unsubscribeNewsletter(email)`: Unsubscribe a user

## Security Features

- Row Level Security (RLS) is enabled
- Email validation on both frontend and backend
- Duplicate email handling
- Proper error handling and user feedback

## Next Steps

1. **Email Service Integration**: Consider integrating with services like SendGrid, Mailgun, or Resend for sending newsletters
2. **Admin Dashboard**: Create an admin interface to manage subscribers
3. **Analytics**: Add tracking for signup sources and engagement
4. **Unsubscribe Flow**: Implement proper unsubscribe links in your newsletters

## Debug Mode

To enable debug logging, add this to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

## Support

If you encounter issues, check:
1. Supabase project status
2. Environment variables are correctly set
3. Database table was created successfully
4. RLS policies are configured correctly
5. Network connectivity 