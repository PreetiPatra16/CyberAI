import { describe, expect, it } from "vitest";
import { insightFor, QuizAnswer } from "./progress";

const answers: QuizAnswer[] = [
  { questionId: "one", optionId: "a", confidence: "confident", correct: true, points: 150 },
  { questionId: "two", optionId: "b", confidence: "confident", correct: false, points: 0 },
  { questionId: "three", optionId: "c", confidence: "guessing", correct: true, points: 100 },
];

describe("progress rules", () => {
  it("prioritizes confident misses in learning insight", () => {
    expect(insightFor(answers)).toContain("confident misses");
  });
});
