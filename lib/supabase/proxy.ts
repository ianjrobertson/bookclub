import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";
import { getMemberSession } from "../member-session";

const MEMBER_ROUTES = ["/board", "/discussion"];

const PUBLIC_ROUTES = ["/", "/join", "/auth"];

function isPublic(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

function isMemberRoute(pathname: string): boolean {
  return MEMBER_ROUTES.some((p) => pathname.startsWith(p));
}


export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Member routes: check book_club_session cookie
  if (isMemberRoute(pathname)) {
    const session = await getMemberSession(request);
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/error";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  // Public routes: always allow through
  if (isPublic(pathname)) {
    return NextResponse.next({ request });
  }

  // Admin routes (and everything else): check Supabase session
  let supabaseResponse = NextResponse.next({ request });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not run code between createServerClient and getClaims().
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
