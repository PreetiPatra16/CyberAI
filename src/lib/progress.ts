export type StoredAnswer = {
  questionId: string;
  optionId: string;
  confidence: "confident" | "guessing";
  correct: boolean;
  points: number;
};

export type ModuleProgress = {
  attempts: StoredAnswer[][];
  activeAnswers: StoredAnswer[];
  passed: boolean;
  bestScore: number;
};

export type LocalProgress = {
  displayName: string;
  modules: Record<string, ModuleProgress>;
  theme: "light" | "dark";
};

export const defaultModuleProgress: ModuleProgress = {
  attempts: [],
  activeAnswers: [],
  passed: false,
  bestScore: 0,
};

export const defaultProgress: LocalProgress = {
  displayName: "Demo Learner",
  modules: {},
  theme: "light",
};

export function getModuleProgress(progress: LocalProgress, slug: string): ModuleProgress {
  return progress.modules[slug] ?? defaultModuleProgress;
}

export function calculateScore(answers: StoredAnswer[]) {
  return answers.reduce((total, answer) => total + answer.points, 0);
}

export function insightFor(answers: StoredAnswer[]) {
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

export function totalPoints(progress: LocalProgress) {
  return Object.values(progress.modules).reduce((total, module) => total + module.bestScore, 0);
}

export function completedCount(progress: LocalProgress) {
  return Object.values(progress.modules).filter((module) => module.passed).length;
}
