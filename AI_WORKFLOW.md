# AI-Assisted Development Workflow

Codex was used as the primary implementation collaborator. AI assistance was treated as an engineering accelerator, not as a substitute for product decisions, security review, or verification.

## Workflow

1. Inspected the supplied Word brief and wireframes.
2. Interviewed the product owner to define scope, audience, scoring, auth, persistence, visual quality, and the two-day delivery constraint.
3. Converted those decisions into a phased specification and acceptance checks.
4. Implemented in small feature branches and checkpoint-based commits.
5. Reviewed AI-generated code against the existing architecture before keeping it.
6. Verified each major checkpoint with linting, strict type checking, focused tests, production builds, and manual browser testing.

## Representative Prompts And Tasks

- "Discuss the stack and interview me before implementation."
- "Build one functional module first, but keep the architecture data-driven and DRY so more modules can be added through SQL migrations."
- "Use Supabase only; remove local-storage fallback and keep scoring server-controlled."
- "Review the intern branch against main before making changes."
- "Persist post-quiz coaching in Supabase using Groq `openai/gpt-oss-120b`."
- "Add AI Coach History without changing the database schema."
- "Polish UX loading and interaction feedback."

## How AI Was Used

- **Product specification:** translated wireframes and interview answers into routes, behaviors, acceptance criteria, and delivery phases.
- **Architecture:** designed the Next.js/Supabase boundaries, RLS model, security-definer RPCs, resumable attempts, and AI-coaching flow.
- **Implementation:** created UI screens, SQL migrations, RPCs, server routes, deterministic fallbacks, and focused tests.
- **Debugging:** diagnosed broken Next.js caches, cross-platform environment scripts, SQL migration errors, and concurrent quiz-start races.
- **Code review:** compared feature branches to `main`, identified invalid SQL, stale fallback behavior, client-controlled scoring, and dependency churn.
- **Documentation:** produced reproducible setup, architecture, decisions, demo, and deployment guidance.

## Guardrails

- No secrets, service-role keys, or the supplied Word brief are committed.
- Quiz correctness, scores, completion, and rewards are never trusted from the browser.
- Groq receives only module title, aggregate score, pass state, and topic-level correctness/confidence signals.
- Groq output must match a JSON Schema and local validation before persistence.
- A deterministic fallback keeps coaching available when Groq fails.
- Commits were created only after human verification and explicit approval.

## Human Decisions

The product owner selected the stack, Supabase-only persistence, anonymous demo experience, responsive polish level, Groq provider/model, feature priorities, manual browser verification, and commit/branch workflow. Codex proposed and implemented options within those decisions.
