import { NextRequest, NextResponse } from "next/server";

// 「链接带密码」登录门。
//   - 没设 ACCESS_TOKEN  → 门是关着的（不拦），第 1、2 步阶段就这样。
//   - 设了 ACCESS_TOKEN  → 只有带 ?key=<密码> 的链接能进；进去后写 cookie，之后免输入。
// 这样「加登录」这一步只是配置一个环境变量，不用改代码，最稳。

const COOKIE = "dt_access";

export function middleware(req: NextRequest) {
  const token = process.env.ACCESS_TOKEN;
  if (!token) return NextResponse.next();

  const { pathname, searchParams } = req.nextUrl;

  // 已经持有有效 cookie：放行
  if (req.cookies.get(COOKIE)?.value === token) return NextResponse.next();

  // 链接里带了正确的 key：写 cookie，并把 key 从地址栏抹掉
  if (searchParams.get("key") === token) {
    const clean = req.nextUrl.clone();
    clean.searchParams.delete("key");
    const res = NextResponse.redirect(clean);
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  // 锁定页本身要能打开
  if (pathname.startsWith("/locked")) return NextResponse.next();

  return NextResponse.redirect(new URL("/locked", req.url));
}

export const config = {
  // 静态资源不拦
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
