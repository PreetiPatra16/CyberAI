# CyberAI Phishing Prototype

A polished cybersecurity-awareness learning prototype built as one complete,
extensible vertical slice. All eight modules appear in the roadmap, while
**Phishing: The Lure (Email)** includes a lesson, four-question quiz, confidence
capture, immediate feedback, persisted progress, badge, and cheat sheet.

## Stack

- Next.js App Router, React, strict TypeScript, Tailwind CSS
- Supabase Auth and PostgreSQL with RLS and security-definer quiz RPCs
- Groq-powered persisted post-quiz coaching using `openai/gpt-oss-120b`
- Vitest for focused domain tests
- Vercel-ready deployment

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Supabase is required. Add the hosted project URL and anonymous key before
starting the application. Authentication, profiles, theme preferences, quiz
attempts, responses, scores, progress, and rewards are all database-backed.
Set `GROQ_API_KEY` to enable AI-generated coaching. If Groq is unavailable, a
deterministic coaching response is persisted instead.

Development uses `.next-dev` while production builds use `.next`, so running a
verification build does not corrupt the active development server cache.

## Reproduce Supabase

1. Create an empty Supabase project.
2. Enable anonymous sign-ins and disable email confirmation for the prototype.
3. Link the CLI and apply every committed migration:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Migrations create the full schema, constraints, RLS policies, server-controlled
scoring functions, eight-module catalog, and phishing content.

## Key decisions

- Content is authored through SQL seed migrations so future modules require no
  quiz-engine changes.
- Correctness determines points; confidence powers learning insights only.
- Every attempt is retained, while the highest score drives progress.
- A score of 350/500 passes the phishing module and unlocks its rewards.
- Post-quiz coaching uses topic-level performance signals only and persists one
  validated coaching response per completed attempt.

See [docs/SPEC.md](docs/SPEC.md), [docs/DECISIONS.md](docs/DECISIONS.md), and
[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for implementation intent,
backend setup, and verification. See [AI_WORKFLOW.md](AI_WORKFLOW.md) for AI
usage.
