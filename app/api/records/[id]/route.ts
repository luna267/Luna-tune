import { NextResponse } from "next/server";
import { deleteRecord, updateRecord } from "@/lib/records";
import { entity } from "@/lib/entity";
import type { RecordData } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as { data?: RecordData };
    const data = sanitize(body.data);
    const missing = entity.fields.filter((f) => f.required && !String(data[f.key] ?? "").trim());
    if (missing.length) {
      return NextResponse.json({ error: `${missing.map((f) => f.label).join("、")} 为必填` }, { status: 400 });
    }
    const record = await updateRecord(id, data);
    if (!record) return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    return NextResponse.json({ record });
  } catch (err) {
    return NextResponse.json({ error: message(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const ok = await deleteRecord(id);
    if (!ok) return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: message(err) }, { status: 500 });
  }
}

function sanitize(input: RecordData | undefined): RecordData {
  const out: RecordData = {};
  for (const f of entity.fields) {
    const v = input?.[f.key];
    out[f.key] = v === undefined || v === "" ? null : v;
  }
  return out;
}

function message(err: unknown): string {
  return err instanceof Error ? err.message : "未知错误";
}
