# Demo Guide

This flow demonstrates the strongest product and engineering decisions in about
five minutes.

## 1. Authentication And Isolation

1. Open `/auth`.
2. Launch an isolated Supabase demo user.
3. Explain that every demo creates a real anonymous Supabase identity and that RLS isolates its data.

## 2. Dashboard And Roadmap

1. Show all eight functional modules.
2. Point out total points, completed modules, level/status, and the next-action hero.
3. Toggle dark mode and explain that the preference persists in Supabase.

## 3. Lesson And Quiz

1. Open a module and briefly show its data-driven lesson.
2. Start the quiz.
3. Select an answer and confidence level.
4. Submit and show immediate authoritative feedback.
5. Refresh partway through to demonstrate resumable database-backed attempts.
6. Complete the quiz.

## 4. Results And AI Coach

1. Show the authoritative attempt score and best score.
2. Explain that scoring, completion, and rewards happen inside authenticated PostgreSQL functions.
3. Show the CyberAI learning coach.
4. Explain that Groq receives topic-level signals only, output is schema-validated, and a deterministic fallback is available.

## 5. Persistence And Rewards

1. Open Coach History and revisit the saved coaching session.
2. Show badges and unlocked cheat sheets.
3. Open the certificate screen and explain the all-modules completion rule.
4. Optionally show Supabase rows in `quiz_attempts`, `quiz_responses`, `module_progress`, `earned_badges`, and `quiz_coaching`.

## Engineering Talking Points

- Supabase is the only persistence layer.
- Migrations reproduce the entire backend from an empty project.
- RLS and ownership validation isolate users.
- The browser never controls scoring.
- Quiz start is concurrency-safe and idempotent.
- AI is used for coaching, not authoritative decisions.
- Groq failure does not break the learning flow.
