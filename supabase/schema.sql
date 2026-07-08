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
  reaction text not null default '',
  together_since timestamptz,
  custom_password text not null default '',
  password_question text not null default '',
  password_answer text not null default ''
);

alter table generated_experiences
add column if not exists images jsonb not null default '[]'::jsonb;
alter table generated_experiences
add column if not exists relationship_tag text not null default '';
alter table generated_experiences
add column if not exists show_creator_name boolean not null default true;
alter table generated_experiences
add column if not exists reaction text not null default '';
alter table generated_experiences
add column if not exists together_since timestamptz;
alter table generated_experiences
add column if not exists custom_password text not null default '';
alter table generated_experiences
add column if not exists password_question text not null default '';
alter table generated_experiences
add column if not exists password_answer text not null default '';

alter table generated_experiences
add column if not exists reply_text text not null default '';
alter table generated_experiences
add column if not exists reply_reaction text not null default '';

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

-- ─── Private Chat (Rooms + Messages) ───

create table if not exists chat_rooms (
  id text primary key,
  code text unique not null,
  created_at timestamptz not null default now()
);

alter table chat_rooms enable row level security;

drop policy if exists "Anyone can read chat rooms" on chat_rooms;
create policy "Anyone can read chat rooms"
on chat_rooms for select
using (true);

drop policy if exists "Anyone can insert chat rooms" on chat_rooms;
create policy "Anyone can insert chat rooms"
on chat_rooms for insert
with check (true);

create table if not exists chat_messages (
  id bigserial primary key,
  room_id text references chat_rooms(id) on delete cascade not null,
  session_id text not null,
  nickname text not null,
  message_type text not null default 'text',
  content text,
  file_url text,
  file_name text,
  file_size integer,
  deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_messages_room_id on chat_messages(room_id);

alter table chat_messages enable row level security;

drop policy if exists "Anyone can read chat messages" on chat_messages;
create policy "Anyone can read chat messages"
on chat_messages for select
using (true);

drop policy if exists "Anyone can insert chat messages" on chat_messages;
create policy "Anyone can insert chat messages"
on chat_messages for insert
with check (true);

drop policy if exists "Anyone can update chat messages" on chat_messages;
create policy "Anyone can update chat messages"
on chat_messages for update
using (true)
with check (true);

-- Enable realtime for new messages
alter table chat_messages replica identity full;

alter table chat_messages add column if not exists edited_at timestamptz;
alter table chat_messages add column if not exists reactions jsonb not null default '{}'::jsonb;

-- ─── Chain / Group Messages ───

alter table generated_experiences
add column if not exists is_chain boolean not null default false;
alter table generated_experiences
add column if not exists chain_target integer not null default 0;
alter table generated_experiences
add column if not exists chain_completed boolean not null default false;

create table if not exists chain_messages (
  id bigserial primary key,
  experience_id text references generated_experiences(id) on delete cascade not null,
  contributor_name text not null default 'Someone',
  message text not null,
  contribution_type text not null default 'text',
  sequence_number integer not null default 0,
  created_at timestamptz not null default now()
);

alter table chain_messages enable row level security;

drop policy if exists "Public can read chain messages" on chain_messages;
create policy "Public can read chain messages"
on chain_messages for select
using (true);

drop policy if exists "Public can insert chain messages" on chain_messages;
create policy "Public can insert chain messages"
on chain_messages for insert
with check (true);

create index if not exists idx_chain_messages_experience_id on chain_messages(experience_id);

-- ─── Creator Journey Dashboard ───

alter table analytics_events add column if not exists metadata jsonb default '{}'::jsonb;
alter table analytics_events add column if not exists duration_ms integer;

drop policy if exists "Public can read analytics events" on analytics_events;
create policy "Public can read analytics events"
on analytics_events for select
using (true);

create index if not exists idx_analytics_events_experience_id on analytics_events(experience_id);

-- ─── View-Once Messages ───

alter table generated_experiences
add column if not exists view_once boolean not null default false;
alter table generated_experiences
add column if not exists viewed_at timestamptz;

-- ─── Vibe Reactions ───

alter table generated_experiences
add column if not exists vibe_emoji text not null default '';
alter table generated_experiences
add column if not exists vibe_audio_url text not null default '';

-- ─── Cross-Device Drafts (Session Resume) ───

create table if not exists drafts (
  id text primary key,
  resume_code text unique not null,
  template_id text not null default '',
  form_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_drafts_resume_code on drafts(resume_code);

alter table drafts enable row level security;

drop policy if exists "Public can read drafts by resume code" on drafts;
create policy "Public can read drafts by resume code"
on drafts for select
using (true);

drop policy if exists "Public can upsert drafts" on drafts;
create policy "Public can upsert drafts"
on drafts for insert
with check (true);

drop policy if exists "Public can update drafts" on drafts;
create policy "Public can update drafts"
on drafts for update
using (true)
with check (true);
