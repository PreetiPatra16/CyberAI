# CyberAI Product Specification

## Product

CyberAI is a responsive employee cybersecurity learning platform. It converts
security-awareness topics into short lessons, scenario-based quizzes,
confidence calibration, measurable progress, rewards, and personalized coaching.

## Implemented Scope

- Eight functional modules:
  - Phishing email
  - Passwords and 2FA
  - Malware and ransomware
  - Vishing and smishing
  - Physical, travel, and remote security
  - Data handling and compliance
  - Social engineering and modern scams
  - Financial and cryptocurrency scams
- Email/password signup and login.
- Isolated anonymous Supabase demo accounts.
- Dashboard, lesson, quiz, results, profile, badges, cheat sheets, certificate,
  and AI Coach History.
- Persisted light/dark themes and responsive mobile/desktop navigation.

## Learning Contract

- Every quiz requires an answer and confidence selection.
- Confidence affects insight and AI coaching, never points.
- Quiz submissions receive immediate feedback and explanations.
- Every completed attempt is retained.
- The highest score drives module progress.
- Passing thresholds are data-driven per module.
- Passing unlocks the module badge and cheat sheet.
- The certificate unlocks after all eight modules pass.
- Refreshing resumes the next unanswered question in an active attempt.

## Backend Contract

- Supabase is the only persistence layer.
- SQL migrations reproduce schema, RLS, RPCs, levels, catalog, and content.
- Authenticated security-definer RPCs create attempts, submit responses,
  calculate points, finalize attempts, update progress, and award badges.
- One active attempt per learner/module is enforced and concurrency-safe.
- Results and rewards are loaded from authoritative database records.
- RLS isolates learner-owned data.

## AI Coaching Contract

- A completed attempt receives one persisted coaching response.
- Groq uses `openai/gpt-oss-120b` with JSON Schema structured output.
- The model receives topic-level correctness, confidence, points, pass state,
  and module title only.
- The model never receives profile data, email, answer text, correct-answer
  keys, or attempt identifiers.
- Invalid/unavailable model output falls back to deterministic coaching.
- Coach History lets learners revisit all persisted sessions.

## Quality Gates

- ESLint passes.
- Strict TypeScript passes.
- Focused domain tests pass.
- Production build passes.
- Core flows are manually verified on mobile and desktop layouts.
