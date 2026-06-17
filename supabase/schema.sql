create table if not exists generated_experiences (
  id text primary key,
  template_id text not null,
  category text not null,
  creator_name text not null,
  receiver_name text not null,
  relationship_tag text not null default '',
  show_creator_name boolean not null default true,
  tone text not null,
  theme text not null,
  custom_messages jsonb not null default '{}'::jsonb,
  final_message text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  images jsonb not null default '[]'::jsonb,
  analytics jsonb not null default '{"opened":0,"completed":0,"selectedChoices":{},"finalCtaClicks":0,"templateUsed":""}'::jsonb,
  reaction text not null default ''
);

alter table generated_experiences
add column if not exists images jsonb not null default '[]'::jsonb;
alter table generated_experiences
add column if not exists relationship_tag text not null default '';
alter table generated_experiences
add column if not exists show_creator_name boolean not null default true;
alter table generated_experiences
add column if not exists reaction text not null default '';

create table if not exists analytics_events (
  id bigserial primary key,
  experience_id text references generated_experiences(id) on delete cascade,
  event_type text not null,
  template_id text,
  choice text,
  created_at timestamptz not null default now()
);

alter table generated_experiences enable row level security;
alter table analytics_events enable row level security;

drop policy if exists "Public can read generated experiences" on generated_experiences;
create policy "Public can read generated experiences"
on generated_experiences for select
using (true);

drop policy if exists "Public can create generated experiences" on generated_experiences;
create policy "Public can create generated experiences"
on generated_experiences for insert
with check (true);

drop policy if exists "Public can update minimal analytics" on generated_experiences;
create policy "Public can update minimal analytics"
on generated_experiences for update
using (true)
with check (true);

drop policy if exists "Public can insert analytics events" on analytics_events;
create policy "Public can insert analytics events"
on analytics_events for insert
with check (true);
