import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/config/site";

/**
 * Adds the locale prefix to any un-prefixed path. `/` → `/pt` (default),
 * `/anything` → `/pt/anything`. Localized paths pass through untouched.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, static assets and any file with an extension.
  matcher: ["/((?!_next|images|favicon.ico|robots.txt|.*\\..*).*)"],
};
