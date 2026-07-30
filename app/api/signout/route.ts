import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/locked", req.url), { status: 303 });
  res.cookies.set("dt_access", "", { path: "/", maxAge: 0 });
  return res;
}
