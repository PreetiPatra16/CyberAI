# Decision Log

## Product

- Primary audience: employee learners.
- Product name: CyberAI.
- All eight modules are visible; phishing is the only available module.
- Lesson completion is awarded by passing the quiz at 70% (350/500).
- Quiz feedback is immediate and retakes retain the highest score.
- Confidence is captured before submission and does not change points.
- Cheat sheet unlocks after passing; certificate requires all eight modules.

## Engineering

- Next.js App Router, strict TypeScript, Tailwind CSS, and Supabase.
- Learning content is seeded through SQL migrations; no admin UI in prototype.
- Scoring is performed by security-definer database functions.
- The persisted post-quiz Groq coach receives only topic-level performance and
  confidence signals, with a deterministic fallback when generation fails.
- The supplied Word brief remains local and is excluded from Git.
- No commits are created until the user verifies a checkpoint.
