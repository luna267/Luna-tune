import { neon } from "@neondatabase/serverless";
import { seedRecords } from "./seed";
import type { RecordData, RecordRow } from "./types";

// 数据访问层。
//   - 设了 DATABASE_URL  → 走 Neon（云数据库），数据持久。
//   - 没设 DATABASE_URL  → 走内存里的示例数据（第 1 步），重启即重置。
// 上层（页面、API）不关心用的是哪个，调用方式完全一样。

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

let memory: RecordRow[] | null = null;
function mem(): RecordRow[] {
  if (memory === null) {
    memory = seedRecords.map((r) => ({ ...r, data: { ...r.data } }));
  }
  return memory;
}

let ensured = false;
async function ensureTable() {
  if (!sql || ensured) return;
  await sql`
    create table if not exists records (
      id text primary key,
      data jsonb not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  ensured = true;
}

type DbRow = { id: string; data: RecordData; updated_at: string | Date };
function fromDb(r: DbRow): RecordRow {
  return { id: r.id, data: r.data, updatedAt: new Date(r.updated_at).toISOString() };
}

function newId(): string {
  return globalThis.crypto.randomUUID();
}

export async function listRecords(): Promise<RecordRow[]> {
  if (sql) {
    await ensureTable();
    const rows = (await sql`select id, data, updated_at from records order by updated_at desc`) as DbRow[];
    return rows.map(fromDb);
  }
  return [...mem()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getRecord(id: string): Promise<RecordRow | null> {
  if (sql) {
    await ensureTable();
    const rows = (await sql`select id, data, updated_at from records where id = ${id}`) as DbRow[];
    return rows[0] ? fromDb(rows[0]) : null;
  }
  return mem().find((r) => r.id === id) ?? null;
}

export async function createRecord(data: RecordData): Promise<RecordRow> {
  const id = newId();
  if (sql) {
    await ensureTable();
    const rows = (await sql`
      insert into records (id, data, updated_at)
      values (${id}, ${JSON.stringify(data)}::jsonb, now())
      returning id, data, updated_at
    `) as DbRow[];
    return fromDb(rows[0]);
  }
  const row: RecordRow = { id, data, updatedAt: new Date().toISOString() };
  mem().unshift(row);
  return row;
}

export async function updateRecord(id: string, data: RecordData): Promise<RecordRow | null> {
  if (sql) {
    await ensureTable();
    const rows = (await sql`
      update records set data = ${JSON.stringify(data)}::jsonb, updated_at = now()
      where id = ${id}
      returning id, data, updated_at
    `) as DbRow[];
    return rows[0] ? fromDb(rows[0]) : null;
  }
  const row = mem().find((r) => r.id === id);
  if (!row) return null;
  row.data = data;
  row.updatedAt = new Date().toISOString();
  return row;
}

export async function deleteRecord(id: string): Promise<boolean> {
  if (sql) {
    await ensureTable();
    const rows = (await sql`delete from records where id = ${id} returning id`) as { id: string }[];
    return rows.length > 0;
  }
  const store = mem();
  const i = store.findIndex((r) => r.id === id);
  if (i === -1) return false;
  store.splice(i, 1);
  return true;
}
