create or replace function public.start_quiz_attempt(module_slug text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_module_id uuid;
  v_attempt_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select m.id
  into v_module_id
  from public.modules as m
  where m.slug = $1
    and m.status = 'available';

  if not found then
    raise exception 'Module is not available';
  end if;

  insert into public.quiz_attempts(user_id, module_id)
  values(auth.uid(), v_module_id)
  on conflict(user_id, module_id)
    where status = 'in_progress'
    do nothing
  returning id into v_attempt_id;

  if v_attempt_id is null then
    select a.id
    into v_attempt_id
    from public.quiz_attempts as a
    where a.user_id = auth.uid()
      and a.module_id = v_module_id
      and a.status = 'in_progress';
  end if;

  return v_attempt_id;
end;
$$;

revoke all on function public.start_quiz_attempt(text) from public, anon;
grant execute on function public.start_quiz_attempt(text) to authenticated;
