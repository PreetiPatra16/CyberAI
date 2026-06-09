drop function if exists public.submit_quiz_response(uuid, text, text, public.confidence_level);

create function public.submit_quiz_response(
  p_attempt_id uuid,
  p_question_key text,
  p_option_key text,
  p_answer_confidence public.confidence_level
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.quiz_attempts;
  v_question public.questions;
  v_option public.question_options;
  v_correct_option public.question_options;
  v_points_earned integer;
  v_response_count integer;
  v_question_count integer;
  v_total_score integer;
  v_passed boolean;
begin
  select a.*
  into v_attempt
  from public.quiz_attempts as a
  where a.id = p_attempt_id
    and a.user_id = auth.uid()
    and a.status = 'in_progress'
  for update;

  if not found then
    raise exception 'Active attempt not found';
  end if;

  select q.*
  into v_question
  from public.questions as q
  where q.content_key = p_question_key
    and q.module_id = v_attempt.module_id;

  if not found then
    raise exception 'Question does not belong to attempt module';
  end if;

  select qo.*
  into v_option
  from public.question_options as qo
  where qo.content_key = p_option_key
    and qo.question_id = v_question.id;

  if not found then
    raise exception 'Option does not belong to question';
  end if;

  select qo.*
  into v_correct_option
  from public.question_options as qo
  where qo.question_id = v_question.id
    and qo.is_correct;

  v_points_earned := case when v_option.is_correct then v_question.points else 0 end;

  insert into public.quiz_responses(
    attempt_id,
    question_id,
    selected_option_id,
    confidence,
    is_correct,
    points_earned
  )
  values(
    v_attempt.id,
    v_question.id,
    v_option.id,
    p_answer_confidence,
    v_option.is_correct,
    v_points_earned
  );

  select count(*)
  into v_response_count
  from public.quiz_responses as qr
  where qr.attempt_id = v_attempt.id;

  select count(*)
  into v_question_count
  from public.questions as q
  where q.module_id = v_attempt.module_id;

  if v_response_count = v_question_count then
    select coalesce(sum(qr.points_earned), 0)
    into v_total_score
    from public.quiz_responses as qr
    where qr.attempt_id = v_attempt.id;

    select v_total_score >= m.pass_threshold
    into v_passed
    from public.modules as m
    where m.id = v_attempt.module_id;

    update public.quiz_attempts as a
    set status = 'completed',
        score = v_total_score,
        passed = v_passed,
        completed_at = now()
    where a.id = v_attempt.id;

    insert into public.module_progress(
      user_id,
      module_id,
      attempt_count,
      best_score,
      passed,
      completed_at
    )
    values(
      auth.uid(),
      v_attempt.module_id,
      1,
      v_total_score,
      v_passed,
      case when v_passed then now() end
    )
    on conflict(user_id, module_id) do update
    set attempt_count = public.module_progress.attempt_count + 1,
        best_score = greatest(public.module_progress.best_score, excluded.best_score),
        passed = public.module_progress.passed or excluded.passed,
        completed_at = case
          when public.module_progress.passed or excluded.passed
            then coalesce(public.module_progress.completed_at, now())
        end;

    if v_passed then
      insert into public.earned_badges(user_id, module_id)
      values(auth.uid(), v_attempt.module_id)
      on conflict do nothing;
    end if;
  end if;

  return jsonb_build_object(
    'is_correct', v_option.is_correct,
    'points_earned', v_points_earned,
    'correct_option_key', v_correct_option.content_key,
    'explanation', v_question.explanation,
    'attempt_complete', v_response_count = v_question_count
  );
end;
$$;

grant execute on function public.submit_quiz_response(uuid, text, text, public.confidence_level) to authenticated;
