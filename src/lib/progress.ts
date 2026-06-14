export type QuizAnswer = {
  questionId: string;
  optionId: string;
  confidence: "confident" | "guessing";
  correct: boolean;
  points: number;
};

export type ModuleProgress = {
  attemptCount: number;
  passed: boolean;
  bestScore: number;
};

export type UserProgress = {
  displayName: string;
  modules: Record<string, ModuleProgress>;
  theme: "light" | "dark";
};

export const defaultModuleProgress: ModuleProgress = {
  attemptCount: 0,
  passed: false,
  bestScore: 0,
};

export const defaultProgress: UserProgress = {
  displayName: "Learner",
  modules: {},
  theme: "light",
};

export function getModuleProgress(progress: UserProgress, slug: string): ModuleProgress {
  return progress.modules[slug] ?? defaultModuleProgress;
}

export function insightFor(answers: QuizAnswer[]) {
  const confidentMisses = answers.filter((answer) => answer.confidence === "confident" && !answer.correct).length;
  const misses = answers.filter((answer) => !answer.correct).length;
  if (confidentMisses > 0) return "Review the explanations for your confident misses. These are the most valuable knowledge gaps to correct.";
  if (misses > 0) return "You are building good awareness. Review the missed topics, then retake the quiz when you feel ready.";
  return "Excellent calibration. You recognized every phishing scenario and understood the safest response.";
}

export const levels = [
  { name: "Level 1", minimumPoints: 0, statusName: "Security Starter" },
  { name: "Level 2", minimumPoints: 250, statusName: "Threat Spotter" },
  { name: "Level 3", minimumPoints: 500, statusName: "Phishing Defender" },
  { name: "Level 4", minimumPoints: 1500, statusName: "Security Architect" },
  { name: "Level 5", minimumPoints: 3000, statusName: "Cyber Sentinel" },
];

export function levelFor(totalPoints: number) {
  let current = levels[0];
  for (const level of levels) {
    if (totalPoints >= level.minimumPoints) current = level;
  }
  const number = Number(current.name.replace("Level ", ""));
  return { level: number, statusName: current.statusName };
}

export function totalPoints(progress: UserProgress) {
  return Object.values(progress.modules).reduce((total, module) => total + module.bestScore, 0);
}

export function completedCount(progress: UserProgress) {
  return Object.values(progress.modules).filter((module) => module.passed).length;
}
