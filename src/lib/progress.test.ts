import { describe, expect, it } from "vitest";
import { calculateScore, insightFor, StoredAnswer } from "./progress";

const answers: StoredAnswer[] = [
  { questionId: "one", optionId: "a", confidence: "confident", correct: true, points: 150 },
  { questionId: "two", optionId: "b", confidence: "confident", correct: false, points: 0 },
  { questionId: "three", optionId: "c", confidence: "guessing", correct: true, points: 100 },
];

describe("progress rules", () => {
  it("sums only points earned by correct responses", () => {
    expect(calculateScore(answers)).toBe(250);
  });

  it("prioritizes confident misses in learning insight", () => {
    expect(insightFor(answers)).toContain("confident misses");
  });
});
