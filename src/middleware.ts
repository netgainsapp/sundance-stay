import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-session";
import { verifyBoardToken, BOARD_COOKIE_NAME } from "@/lib/board-session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Authenticated marketplace area (post, inbox). Browsing the board is public.
  if (pathname.startsWith("/board/new") || pathname.startsWith("/board/inbox")) {
    const boardToken = req.cookies.get(BOARD_COOKIE_NAME)?.value;
    if (await verifyBoardToken(boardToken)) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/board/signin";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // Admin console. The login page must stay public so the operator can sign in.
  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return NextResponse.next();
  }
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (await verifySessionToken(token)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin",
    "/api/admin/:path*",
    "/board/new",
    "/board/new/:path*",
    "/board/inbox",
    "/board/inbox/:path*",
  ],
};
