alter table public.profiles enable row level security;
alter table public.modules enable row level security;
alter table public.lesson_sections enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.cheat_sheet_items enable row level security;
alter table public.levels enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_responses enable row level security;
alter table public.module_progress enable row level security;
alter table public.earned_badges enable row level security;

create policy "authenticated users read catalog" on public.modules for select to authenticated using (true);
create policy "authenticated users read lessons" on public.lesson_sections for select to authenticated using (true);
create policy "authenticated users read questions" on public.questions for select to authenticated using (true);
create policy "authenticated users read safe options" on public.question_options for select to authenticated using (true);
create policy "authenticated users read cheat sheets" on public.cheat_sheet_items for select to authenticated using (exists (select 1 from public.module_progress p where p.user_id = auth.uid() and p.module_id = module_id and p.passed));
create policy "authenticated users read levels" on public.levels for select to authenticated using (true);

create policy "users read own profile" on public.profiles for select using (id = auth.uid());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "users read own attempts" on public.quiz_attempts for select using (user_id = auth.uid());
create policy "users read own responses" on public.quiz_responses for select using (exists (select 1 from public.quiz_attempts a where a.id = attempt_id and a.user_id = auth.uid()));
create policy "users read own progress" on public.module_progress for select using (user_id = auth.uid());
create policy "users read own badges" on public.earned_badges for select using (user_id = auth.uid());

revoke all on public.question_options from anon, authenticated;
grant select(id, question_id, sort_order, label) on public.question_options to authenticated;
grant select on public.modules, public.lesson_sections, public.questions, public.cheat_sheet_items, public.levels to authenticated;
grant select, update(display_name) on public.profiles to authenticated;
grant select on public.quiz_attempts, public.quiz_responses, public.module_progress, public.earned_badges to authenticated;
