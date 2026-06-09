create function public.start_quiz_attempt(module_slug text)
returns uuid language plpgsql security definer set search_path = public as $$
declare module_record public.modules; attempt_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into module_record from public.modules where slug = module_slug and status = 'available';
  if not found then raise exception 'Module is not available'; end if;
  select id into attempt_id from public.quiz_attempts where user_id = auth.uid() and module_id = module_record.id and status = 'in_progress';
  if attempt_id is null then
    insert into public.quiz_attempts(user_id, module_id) values(auth.uid(), module_record.id) returning id into attempt_id;
  end if;
  return attempt_id;
end;
$$;

create function public.submit_quiz_response(attempt_id uuid, question_key text, option_key text, answer_confidence public.confidence_level)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  attempt_record public.quiz_attempts;
  question_record public.questions;
  option_record public.question_options;
  correct_option public.question_options;
  earned integer;
  response_count integer;
  question_count integer;
  total_score integer;
  did_pass boolean;
begin
  select * into attempt_record from public.quiz_attempts where id = attempt_id and user_id = auth.uid() and status = 'in_progress' for update;
  if not found then raise exception 'Active attempt not found'; end if;
  select * into question_record from public.questions where content_key = question_key and module_id = attempt_record.module_id;
  if not found then raise exception 'Question does not belong to attempt module'; end if;
  select * into option_record from public.question_options where content_key = option_key and question_id = question_record.id;
  if not found then raise exception 'Option does not belong to question'; end if;
  select * into correct_option from public.question_options where question_id = question_record.id and is_correct;
  earned := case when option_record.is_correct then question_record.points else 0 end;
  insert into public.quiz_responses(attempt_id, question_id, selected_option_id, confidence, is_correct, points_earned)
  values(attempt_id, question_id, option_id, answer_confidence, option_record.is_correct, earned);
  select count(*) into response_count from public.quiz_responses where quiz_responses.attempt_id = submit_quiz_response.attempt_id;
  select count(*) into question_count from public.questions where module_id = attempt_record.module_id;
  if response_count = question_count then
    select coalesce(sum(points_earned), 0) into total_score from public.quiz_responses where quiz_responses.attempt_id = submit_quiz_response.attempt_id;
    select total_score >= pass_threshold into did_pass from public.modules where id = attempt_record.module_id;
    update public.quiz_attempts set status = 'completed', score = total_score, passed = did_pass, completed_at = now() where id = attempt_record.id;
    insert into public.module_progress(user_id, module_id, attempt_count, best_score, passed, completed_at)
    values(auth.uid(), attempt_record.module_id, 1, total_score, did_pass, case when did_pass then now() end)
    on conflict(user_id, module_id) do update set attempt_count = module_progress.attempt_count + 1, best_score = greatest(module_progress.best_score, excluded.best_score), passed = module_progress.passed or excluded.passed, completed_at = case when module_progress.passed or excluded.passed then coalesce(module_progress.completed_at, now()) end;
    if did_pass then insert into public.earned_badges(user_id, module_id) values(auth.uid(), attempt_record.module_id) on conflict do nothing; end if;
  end if;
  return jsonb_build_object('is_correct', option_record.is_correct, 'points_earned', earned, 'correct_option_key', correct_option.content_key, 'explanation', question_record.explanation, 'attempt_complete', response_count = question_count);
end;
$$;

grant execute on function public.start_quiz_attempt(text) to authenticated;
grant execute on function public.submit_quiz_response(uuid, text, text, public.confidence_level) to authenticated;
