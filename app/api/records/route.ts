import { NextResponse } from "next/server";
import { createRecord, listRecords } from "@/lib/records";
import { entity } from "@/lib/entity";
import type { RecordData } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await listRecords();
    return NextResponse.json({ records });
  } catch (err) {
    return NextResponse.json({ error: message(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { data?: RecordData };
    const data = sanitize(body.data);
    const missing = entity.fields.filter((f) => f.required && !String(data[f.key] ?? "").trim());
    if (missing.length) {
      return NextResponse.json({ error: `${missing.map((f) => f.label).join("、")} 为必填` }, { status: 400 });
    }
    const record = await createRecord(data);
    return NextResponse.json({ record }, { status: 201 });
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
