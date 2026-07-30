-- 在 Neon 上建表。第 2 步迁移数据库时执行（或让 Claude 帮你执行）。
-- 通用结构：一张 records 表，业务字段都放在 data (jsonb) 里。
-- 这样换部门（HR / 财务 / 法务）只改前端的 lib/entity.ts，不用改数据库。

create table if not exists records (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists records_updated_at_idx on records (updated_at desc);
