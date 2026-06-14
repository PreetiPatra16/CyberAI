import { NextResponse } from "next/server";
import { CoachContent, CoachContext, deterministicCoach, parseCoachContent, PersistedCoach } from "@/lib/coach";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const GROQ_MODEL = "openai/gpt-oss-120b";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ attemptId: string }> },
) {
  const { attemptId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { data: existing, error: existingError } = await supabase
    .from("quiz_coaching")
    .select("summary,strengths,focus_areas,next_steps,source,model,generated_at")
    .eq("attempt_id", attemptId)
    .maybeSingle();
  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
  if (existing) return NextResponse.json(existing);

  const { data: contextData, error: contextError } = await supabase
    .rpc("get_quiz_coach_context", { attempt_id: attemptId });
  if (contextError) return NextResponse.json({ error: contextError.message }, { status: 404 });
  const context = contextData as CoachContext;

  let content = deterministicCoach(context);
  let source: PersistedCoach["source"] = "deterministic";
  let model = "deterministic-v1";

  try {
    const generated = await generateWithGroq(context);
    if (generated) {
      content = generated;
      source = "groq";
      model = GROQ_MODEL;
    }
  } catch (error) {
    console.error("Groq learning coach failed:", error);
  }

  const record = {
    attempt_id: attemptId,
    user_id: user.id,
    ...content,
    source,
    model,
  };
  const { data: inserted, error: insertError } = await supabase
    .from("quiz_coaching")
    .insert(record)
    .select("summary,strengths,focus_areas,next_steps,source,model,generated_at")
    .single();

  if (!insertError) return NextResponse.json(inserted);

  const { data: concurrent } = await supabase
    .from("quiz_coaching")
    .select("summary,strengths,focus_areas,next_steps,source,model,generated_at")
    .eq("attempt_id", attemptId)
    .maybeSingle();
  if (concurrent) return NextResponse.json(concurrent);
  return NextResponse.json({ error: insertError.message }, { status: 500 });
}

async function generateWithGroq(context: CoachContext): Promise<CoachContent | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  const promptContext = {
    module_title: context.module_title,
    score: context.score,
    max_points: context.max_points,
    pass_threshold: context.pass_threshold,
    passed: context.passed,
    signals: context.signals,
  };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(15_000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.2,
      max_completion_tokens: 700,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "cyberai_learning_coach",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["summary", "strengths", "focus_areas", "next_steps"],
            properties: {
              summary: { type: "string" },
              strengths: { type: "array", minItems: 1, maxItems: 4, items: { type: "string" } },
              focus_areas: { type: "array", minItems: 1, maxItems: 4, items: { type: "string" } },
              next_steps: { type: "array", minItems: 1, maxItems: 4, items: { type: "string" } },
            },
          },
        },
      },
      messages: [
        {
          role: "system",
          content: "You are CyberAI, a concise cybersecurity learning coach. Give supportive, specific coaching using only the supplied topic-level performance signals. Do not invent questions, answers, personal data, or scores. Prioritize confident incorrect responses. Each list item must be one short actionable sentence.",
        },
        {
          role: "user",
          content: JSON.stringify(promptContext),
        },
      ],
    }),
  });

  if (!response.ok) throw new Error(`Groq returned ${response.status}: ${await response.text()}`);
  const body = await response.json() as { choices?: { message?: { content?: string } }[] };
  const raw = body.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Groq returned no coaching content.");
  return parseCoachContent(JSON.parse(raw));
}
