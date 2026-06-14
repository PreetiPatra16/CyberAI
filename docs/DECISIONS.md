# Decision Log

## Product

- **Employee learners first:** the application prioritizes clear next actions, immediate feedback, progress visibility, and approachable language.
- **Confidence calibration:** confidence is required because a confident mistake is more valuable coaching information than an uncertain mistake.
- **All modules visible and functional:** the roadmap communicates the complete product rather than a disconnected quiz demo.
- **Rewards follow demonstrated learning:** badges and cheat sheets unlock only after a module is passed; the certificate requires the complete roadmap.

## Architecture

- **Next.js App Router and TypeScript:** supports responsive UI, protected server routes, and one deployable application.
- **Supabase-only persistence:** removes ambiguous browser fallback state and makes progress portable across devices.
- **SQL migrations as source of truth:** an empty Supabase project can reproduce schema, security, functions, and learning content.
- **Database-authoritative scoring:** correctness, scores, pass state, progress, and rewards cannot be manipulated from browser state.
- **RLS plus ownership-validating RPCs:** learner data stays isolated while privileged calculations remain narrowly scoped.
- **Idempotent quiz start:** simultaneous requests safely resolve to one active attempt.

## AI

- **Post-quiz coach, not AI scoring:** the model supports learning while deterministic database logic remains authoritative.
- **Minimal model context:** Groq receives no personal data or answer text.
- **Structured output:** JSON Schema plus local validation prevents arbitrary output from entering the product.
- **Persist once per attempt:** coaching remains stable, reviewable, and useful in Coach History.
- **Deterministic fallback:** the learning experience remains available during provider failures or missing API configuration.

## Delivery

- Feature branches and meaningful commits keep `main` stable.
- Human verification precedes commits and merges.
- Core engineering gates run through `npm run verify`.
- The supplied Word brief and all secrets remain local and excluded from Git.
