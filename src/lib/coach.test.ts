import { describe, expect, it } from "vitest";
import { CoachContext, deterministicCoach, parseCoachContent } from "./coach";

const context: CoachContext = {
  attempt_id: "attempt",
  module_title: "Phishing",
  score: 300,
  max_points: 500,
  pass_threshold: 350,
  passed: false,
  signals: [
    { topic: "Detection", confidence: "guessing", correct: true, points_earned: 100, question_points: 100 },
    { topic: "Incident response", confidence: "confident", correct: false, points_earned: 0, question_points: 150 },
  ],
};

describe("learning coach", () => {
  it("prioritizes confident misses in deterministic coaching", () => {
    const coach = deterministicCoach(context);
    expect(coach.focus_areas.join(" ")).toContain("confident miss");
  });

  it("rejects malformed structured model output", () => {
    expect(parseCoachContent({ summary: "Incomplete" })).toBeNull();
  });
});
