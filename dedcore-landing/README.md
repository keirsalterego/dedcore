# DedCore Landing Page

This is a [Next.js](https://nextjs.org) project for the DedCore landing page, featuring a newsletter signup system integrated with Supabase.

## Features

- **Modern Landing Page**: Beautiful, responsive design with terminal-inspired UI
- **Newsletter Signup**: Email collection system with Supabase backend
- **Documentation**: Comprehensive docs section
- **Interactive Elements**: 3D background and animations

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Newsletter Setup

The landing page includes a newsletter signup system that stores emails in Supabase. To set this up:

1. **Follow the setup guide**: See [NEWSLETTER_SETUP.md](./NEWSLETTER_SETUP.md) for detailed instructions
2. **Create a Supabase project**: Set up your database and get your credentials
3. **Configure environment variables**: Add your Supabase URL and API key to `.env.local`
4. **Run the database setup**: Execute the SQL script in `supabase-setup.sql`

### Quick Setup

1. Copy `.env.local.example` to `.env.local` and add your Supabase credentials
2. Run the SQL script in your Supabase dashboard
3. Test the signup form on your website

## Admin Features

- **Subscriber Management**: View all newsletter subscribers at `/admin/subscribers`
- **Database Integration**: Direct Supabase integration for email storage
- **Error Handling**: Comprehensive error handling and user feedback

## Project Structure

```
dedcore-landing/
├── app/                    # Next.js app directory
│   ├── api/newsletter/     # Newsletter API endpoints
│   ├── admin/              # Admin pages
│   └── docs/               # Documentation pages
├── components/             # React components
├── lib/                    # Utility functions
│   ├── supabase.ts         # Supabase client and functions
│   └── utils.ts            # General utilities
├── supabase-setup.sql      # Database setup script
└── NEWSLETTER_SETUP.md     # Detailed setup guide
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
