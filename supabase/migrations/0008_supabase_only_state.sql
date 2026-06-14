alter table public.profiles
add column if not exists theme text not null default 'light'
check (theme in ('light', 'dark'));

grant update(theme) on public.profiles to authenticated;

revoke select on public.questions from authenticated;
grant select(id, module_id, content_key, sort_order, prompt, topic, points)
on public.questions to authenticated;

create or replace function public.get_quiz_attempt_state(module_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt_id uuid;
  v_answered_question_keys jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  v_attempt_id := public.start_quiz_attempt($1);

  select coalesce(jsonb_agg(q.content_key order by q.sort_order), '[]'::jsonb)
  into v_answered_question_keys
  from public.quiz_responses as qr
  join public.questions as q on q.id = qr.question_id
  where qr.attempt_id = v_attempt_id;

  return jsonb_build_object(
    'attempt_id', v_attempt_id,
    'answered_question_keys', v_answered_question_keys
  );
end;
$$;

create or replace function public.get_quiz_attempt_result(attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.quiz_attempts;
  v_module_slug text;
  v_best_score integer;
  v_responses jsonb;
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

  select m.slug
  into v_module_slug
  from public.modules as m
  where m.id = v_attempt.module_id;

  select coalesce(mp.best_score, v_attempt.score)
  into v_best_score
  from public.module_progress as mp
  where mp.user_id = auth.uid()
    and mp.module_id = v_attempt.module_id;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'questionId', q.content_key,
        'optionId', qo.content_key,
        'confidence', qr.confidence,
        'correct', qr.is_correct,
        'points', qr.points_earned
      )
      order by q.sort_order
    ),
    '[]'::jsonb
  )
  into v_responses
  from public.quiz_responses as qr
  join public.questions as q on q.id = qr.question_id
  join public.question_options as qo on qo.id = qr.selected_option_id
  where qr.attempt_id = v_attempt.id;

  return jsonb_build_object(
    'attempt_id', v_attempt.id,
    'module_slug', v_module_slug,
    'score', v_attempt.score,
    'passed', v_attempt.passed,
    'best_score', coalesce(v_best_score, v_attempt.score),
    'responses', v_responses
  );
end;
$$;

revoke all on function public.get_quiz_attempt_state(text) from public, anon;
revoke all on function public.get_quiz_attempt_result(uuid) from public, anon;
grant execute on function public.get_quiz_attempt_state(text) to authenticated;
grant execute on function public.get_quiz_attempt_result(uuid) to authenticated;
