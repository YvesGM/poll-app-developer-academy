alter table public.votes
  add column if not exists poll_id uuid;

update public.votes
set poll_id = poll_options.poll_id
from public.poll_options
where public.votes.option_id = poll_options.id
  and public.votes.poll_id is null;

alter table public.votes
  alter column poll_id set not null;

alter table public.votes
  add column if not exists voter_token uuid;

update public.votes
set voter_token = gen_random_uuid()
where voter_token is null;

alter table public.votes
  alter column voter_token set not null;

create index if not exists votes_poll_id_idx
  on public.votes(poll_id);

create unique index if not exists poll_options_id_poll_id_unique_idx
  on public.poll_options(id, poll_id);

create unique index if not exists votes_poll_voter_unique_idx
  on public.votes(poll_id, voter_token);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'votes_poll_id_fkey'
      and conrelid = 'public.votes'::regclass
  ) then
    alter table public.votes
      add constraint votes_poll_id_fkey
      foreign key (poll_id)
      references public.polls(id)
      on delete cascade;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'votes_option_poll_fkey'
      and conrelid = 'public.votes'::regclass
  ) then
    alter table public.votes
      add constraint votes_option_poll_fkey
      foreign key (option_id, poll_id)
      references public.poll_options(id, poll_id)
      on delete cascade;
  end if;
end
$$;

revoke select on table public.votes from anon, authenticated;
revoke insert on table public.votes from anon, authenticated;

grant select (id, poll_id, option_id, created_at)
  on table public.votes
  to anon, authenticated;

grant insert (poll_id, option_id, voter_token)
  on table public.votes
  to anon, authenticated;

drop policy if exists "Votes can be created for open polls" on public.votes;

create policy "Votes can be created for open polls"
  on public.votes
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.poll_options
      join public.polls on polls.id = poll_options.poll_id
      where poll_options.id = votes.option_id
        and poll_options.poll_id = votes.poll_id
        and polls.closed = false
    )
  );

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'polls'
  ) then
    alter publication supabase_realtime add table public.polls;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'poll_options'
  ) then
    alter publication supabase_realtime add table public.poll_options;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'votes'
  ) then
    alter publication supabase_realtime add table public.votes;
  end if;
end
$$;
