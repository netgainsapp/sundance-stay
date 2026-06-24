import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-session";
import { verifyBoardToken, BOARD_COOKIE_NAME } from "@/lib/board-session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Waitlist gate: require cookie to access full site
  const gatedRoutes = ["/stay", "/last-minute", "/services", "/concierge", "/guides", "/blog", "/neighborhoods", "/list-your-home", "/advertise", "/contact"];
  const isGated = gatedRoutes.some((route) => pathname.startsWith(route));
  if (isGated) {
    const hasJoinedWaitlist = req.cookies.get("waitlist_joined")?.value === "true";
    if (!hasJoinedWaitlist) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("gated", "true");
      return NextResponse.redirect(url);
    }
  }

  // Authenticated marketplace area (post, inbox). Browsing the board is public.
  if (pathname.startsWith("/board/new") || pathname.startsWith("/board/inbox")) {
    const boardToken = req.cookies.get(BOARD_COOKIE_NAME)?.value;
    if (await verifyBoardToken(boardToken)) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/board/signin";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // Admin console. Only check auth for /admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // The login page must stay public so the operator can sign in.
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/stay/:path*",
    "/last-minute/:path*",
    "/services/:path*",
    "/concierge/:path*",
    "/guides/:path*",
    "/blog/:path*",
    "/neighborhoods/:path*",
    "/list-your-home/:path*",
    "/advertise/:path*",
    "/contact/:path*",
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
