export type CoachSignal = {
  topic: string;
  confidence: "confident" | "guessing";
  correct: boolean;
  points_earned: number;
  question_points: number;
};

export type CoachContext = {
  attempt_id: string;
  module_title: string;
  score: number;
  max_points: number;
  pass_threshold: number;
  passed: boolean;
  signals: CoachSignal[];
};

export type CoachContent = {
  summary: string;
  strengths: string[];
  focus_areas: string[];
  next_steps: string[];
};

export type PersistedCoach = CoachContent & {
  source: "groq" | "deterministic";
  model: string;
  generated_at?: string;
};

function unique(values: string[]) {
  return [...new Set(values)];
}

export function deterministicCoach(context: CoachContext): CoachContent {
  const strongTopics = unique(context.signals.filter((signal) => signal.correct).map((signal) => signal.topic));
  const missedTopics = unique(context.signals.filter((signal) => !signal.correct).map((signal) => signal.topic));
  const confidentMisses = unique(
    context.signals
      .filter((signal) => !signal.correct && signal.confidence === "confident")
      .map((signal) => signal.topic),
  );

  const summary = context.passed
    ? `You passed ${context.module_title} with ${context.score}/${context.max_points} points. Keep reinforcing the decisions that helped you succeed.`
    : `You scored ${context.score}/${context.max_points} in ${context.module_title}. Review the missed topics before your next attempt.`;

  const strengths = strongTopics.length > 0
    ? strongTopics.map((topic) => `You made a safe decision in ${topic}.`)
    : ["You completed the assessment and created a clear starting point for improvement."];

  const focusAreas = missedTopics.length > 0
    ? missedTopics.map((topic) => confidentMisses.includes(topic)
      ? `Revisit ${topic}; this was a confident miss and is the highest-priority knowledge gap.`
      : `Review ${topic} and practice identifying the safest response.`)
    : ["No missed topics. Focus on maintaining the same careful decision-making."];

  const nextSteps = missedTopics.length > 0
    ? [
      `Review the ${missedTopics.join(", ")} lesson sections.`,
      "Retake the quiz after you can explain why each safer response works.",
    ]
    : [
      "Review the cheat sheet to reinforce the key behaviors.",
      "Apply the same verification habits in real messages and requests.",
    ];

  return { summary, strengths, focus_areas: focusAreas, next_steps: nextSteps };
}

export function parseCoachContent(value: unknown): CoachContent | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const stringArray = (item: unknown) =>
    Array.isArray(item) && item.length > 0 && item.length <= 4 && item.every((entry) => typeof entry === "string" && entry.length > 0 && entry.length <= 300);

  if (
    typeof candidate.summary !== "string"
    || candidate.summary.length < 1
    || candidate.summary.length > 1200
    || !stringArray(candidate.strengths)
    || !stringArray(candidate.focus_areas)
    || !stringArray(candidate.next_steps)
  ) {
    return null;
  }

  return candidate as CoachContent;
}
