# Hosted Supabase Setup

Target project reference: `nifkckznqckfvtskljrf`

## 1. Configure authentication

In the Supabase dashboard:

1. Open **Authentication → Providers → Email**.
2. Enable email/password signups.
3. Disable email confirmation for this prototype.
4. Open **Authentication → Providers → Anonymous Sign-Ins** and enable it.
5. Open **Authentication → URL Configuration**.
6. Set Site URL to `http://localhost:3000`.
7. Add `http://localhost:3000/**` as a redirect URL.

## 2. Apply migrations

The Supabase CLI must be authenticated as a user with access to the target
project:

```bash
npx supabase login
npx supabase link --project-ref nifkckznqckfvtskljrf
npx supabase db push
```

The migrations create all tables, RLS policies, RPCs, levels, the eight-module
catalog, and phishing content. Do not manually create tables in the dashboard.

If CLI access is unavailable, use the dashboard SQL editor and run the migration
files in numeric order.

## 3. Configure local environment

Copy the project URL and publishable/anon key from **Project Settings → API**:

```bash
cp .env.example .env.local
```

Set:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://nifkckznqckfvtskljrf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Never add the service-role key to this frontend project.

Restart the dev server after changing environment values:

```bash
npm run dev -- --hostname 127.0.0.1
```

## 4. Verify backend synchronization

1. Launch an isolated demo from `/auth`.
2. Confirm a new anonymous user and profile appear in the dashboard.
3. Complete the phishing quiz.
4. Confirm rows appear in `quiz_attempts`, `quiz_responses`,
   `module_progress`, and `earned_badges`.
5. Refresh the browser and confirm the dashboard still shows the best score and
   unlocked rewards.
6. Refresh partway through a quiz and confirm it resumes at the next unanswered
   question.
7. Log out, launch another demo, and confirm the new user begins with no
   progress.
