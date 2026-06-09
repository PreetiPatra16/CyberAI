export type StoredAnswer = {
  questionId: string;
  optionId: string;
  confidence: "confident" | "guessing";
  correct: boolean;
  points: number;
};

export type LocalProgress = {
  displayName: string;
  attempts: StoredAnswer[][];
  activeAnswers: StoredAnswer[];
  passed: boolean;
  bestScore: number;
  theme: "light" | "dark";
};

export const defaultProgress: LocalProgress = {
  displayName: "Demo Learner",
  attempts: [],
  activeAnswers: [],
  passed: false,
  bestScore: 0,
  theme: "light",
};

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
