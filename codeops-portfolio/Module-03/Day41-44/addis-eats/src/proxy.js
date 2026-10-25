import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-config";

// Layer 1 of 3: runs before a page, layout or handler is even built. It only checks that a
// session cookie EXISTS and sends everyone else to /login, remembering where they were going.
// It proves nothing about who the person is: the page and the action verify the session.
// (Next.js 16 renamed middleware.js to proxy.js; the job, the matcher and the code are the same.)
export function proxy(request) {
  if (request.cookies.get(SESSION_COOKIE)) return NextResponse.next();

  const url = new URL("/login", request.url);
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

// Narrow on purpose: only the private routes pay for it. /menu stays public and indexable.
export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/orders/:path*", "/kitchen/:path*"],
};
