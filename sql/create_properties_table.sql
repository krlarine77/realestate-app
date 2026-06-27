-- =============================================
-- 物件テーブルの作成
-- =============================================
create table properties (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references auth.users(id) on delete cascade not null,
  name       text        not null,
  rent       integer     not null,
  area       text        not null,
  rooms      text        not null,
  created_at timestamptz default now() not null
);

-- =============================================
-- Row Level Security（RLS）の有効化
-- =============================================
alter table properties enable row level security;

-- 自分が登録した物件のみ参照できる
create policy "自分の物件のみ参照可能"
  on properties for select
  using (auth.uid() = user_id);

-- 自分のuser_idで登録された物件のみ挿入できる
create policy "自分の物件のみ登録可能"
  on properties for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
create policy "自分の物件のみ更新可能"
  on properties for update
  using (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
create policy "自分の物件のみ削除可能"
  on properties for delete
  using (auth.uid() = user_id);
