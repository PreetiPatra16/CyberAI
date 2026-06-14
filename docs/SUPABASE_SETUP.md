# Supabase Setup

CyberAI uses hosted Supabase for authentication, content, quiz scoring, progress, rewards, and persisted AI coach reports. The committed migrations are the source of truth, so the backend can be recreated in any empty Supabase project.

## 1. Create And Configure A Project

1. Create a new project at [supabase.com](https://supabase.com).
2. In **Authentication > Providers**, enable:
   - Email/password authentication
   - Anonymous sign-ins for the one-click demo
3. For prototype evaluation, disable email confirmation under **Authentication > Providers > Email**.
4. Under **Authentication > URL Configuration**, set:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/**`
5. Add the equivalent production URL and redirect pattern before deployment.

## 2. Configure Local Environment

Copy `.env.example` to `.env.local` and populate:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

The Groq key is optional for the main learning flow. When it is unavailable, CyberAI persists deterministic coach guidance instead.

Never expose a Supabase service-role key or the Groq key through a `NEXT_PUBLIC_` variable.

## 3. Apply The Database Migrations

Install the Supabase CLI, authenticate, and link the empty project:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

The ordered migrations in `supabase/migrations/` create:

- tables, constraints, indexes, grants, and row-level security policies
- public catalog views that hide answer correctness
- server-controlled quiz attempt, scoring, completion, and reward functions
- all eight learning modules, lessons, questions, answers, and cheat sheets
- persisted post-quiz AI coach reports

Do not edit production tables manually as a replacement for migrations. Add a new ordered migration for every backend change.

## 4. Verify The Integration

Start the app:

```bash
npm run dev
```

Then verify:

1. Create a real account or use the demo sign-in.
2. Complete onboarding.
3. Start a quiz and submit an answer.
4. Refresh the page and confirm the active attempt resumes.
5. Complete the quiz and confirm the result, progress, and coach report persist.
6. Sign in as a different user and confirm the first learner's private state is not visible.

Useful database checks:

```bash
npx supabase migration list
npx supabase db push --dry-run
```

## Backend Security Model

- Browser clients use only the public Supabase key.
- Row-level security isolates private learner records by `auth.uid()`.
- Correct-answer flags are not exposed through public quiz views.
- Quiz scoring and completion happen inside authenticated security-definer PostgreSQL functions.
- AI coach prompts use only quiz-performance signals; the Groq API key and request stay server-side.
