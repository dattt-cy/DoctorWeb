import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/admin/login";
  const hasSession = Boolean(request.cookies.get("doctor_admin_session")?.value);

  if (!isLogin && !hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (isLogin && hasSession) {
    return NextResponse.redirect(new URL("/admin/blog", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
