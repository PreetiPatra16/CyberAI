create table public.quiz_coaching (
  attempt_id uuid primary key references public.quiz_attempts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  summary text not null check (char_length(summary) between 1 and 1200),
  strengths jsonb not null default '[]'::jsonb check (jsonb_typeof(strengths) = 'array'),
  focus_areas jsonb not null default '[]'::jsonb check (jsonb_typeof(focus_areas) = 'array'),
  next_steps jsonb not null default '[]'::jsonb check (jsonb_typeof(next_steps) = 'array'),
  source text not null check (source in ('groq', 'deterministic')),
  model text not null,
  generated_at timestamptz not null default now()
);

create index quiz_coaching_user_idx on public.quiz_coaching(user_id, generated_at desc);

alter table public.quiz_coaching enable row level security;

create policy "users read own coaching"
on public.quiz_coaching for select
to authenticated
using (user_id = auth.uid());

create policy "users insert own completed attempt coaching"
on public.quiz_coaching for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.quiz_attempts as a
    where a.id = attempt_id
      and a.user_id = auth.uid()
      and a.status = 'completed'
  )
);

revoke all on public.quiz_coaching from anon, authenticated;
grant select, insert(attempt_id, user_id, summary, strengths, focus_areas, next_steps, source, model)
on public.quiz_coaching to authenticated;

create or replace function public.get_quiz_coach_context(attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.quiz_attempts;
  v_module public.modules;
  v_signals jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select a.*
  into v_attempt
  from public.quiz_attempts as a
  where a.id = $1
    and a.user_id = auth.uid()
    and a.status = 'completed';

  if not found then
    raise exception 'Completed attempt not found';
  end if;

  select m.*
  into v_module
  from public.modules as m
  where m.id = v_attempt.module_id;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'topic', q.topic,
        'confidence', qr.confidence,
        'correct', qr.is_correct,
        'points_earned', qr.points_earned,
        'question_points', q.points
      )
      order by q.sort_order
    ),
    '[]'::jsonb
  )
  into v_signals
  from public.quiz_responses as qr
  join public.questions as q on q.id = qr.question_id
  where qr.attempt_id = v_attempt.id;

  return jsonb_build_object(
    'attempt_id', v_attempt.id,
    'module_title', v_module.title,
    'score', v_attempt.score,
    'max_points', v_module.max_points,
    'pass_threshold', v_module.pass_threshold,
    'passed', v_attempt.passed,
    'signals', v_signals
  );
end;
$$;

revoke all on function public.get_quiz_coach_context(uuid) from public, anon;
grant execute on function public.get_quiz_coach_context(uuid) to authenticated;
