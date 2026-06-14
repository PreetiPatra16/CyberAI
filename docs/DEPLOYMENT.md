# Deployment Guide

CyberAI is ready to deploy as a Next.js application on Vercel with hosted Supabase.

## 1. Prepare Supabase

1. Create or select the production Supabase project.
2. Enable email/password signups and anonymous sign-ins.
3. Apply all migrations:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

## 2. Deploy To Vercel

1. Import the GitHub repository into Vercel.
2. Keep the framework preset as Next.js.
3. Add these environment variables:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

4. Deploy.

## 3. Configure Production Auth URLs

In Supabase **Authentication → URL Configuration**:

1. Set Site URL to the deployed Vercel URL.
2. Add the deployed URL and preview URL patterns as allowed redirect URLs.

## 4. Verify Deployment

- Launch an anonymous demo.
- Complete a quiz and refresh during the attempt.
- Confirm results, progress, rewards, and coaching persist.
- Reopen coaching from Coach History.
- Confirm a second demo user cannot access the first user's data.

## Environment Safety

- Never expose or commit `GROQ_API_KEY`.
- Never use a Supabase service-role key in this application.
- Only `NEXT_PUBLIC_SUPABASE_URL` and the publishable/anon key belong in browser configuration.
