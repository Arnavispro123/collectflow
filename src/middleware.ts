import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  var supabaseResponse = NextResponse.next({ request: request });

  var supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(function (cookie) {
            request.cookies.set(cookie.name, cookie.value);
          });
          supabaseResponse = NextResponse.next({ request: request });
          cookiesToSet.forEach(function (cookie) {
            supabaseResponse.cookies.set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    }
  );

  var {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/api/invoices") ||
      request.nextUrl.pathname.startsWith("/api/escalations"))
  ) {
    var url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    var url2 = request.nextUrl.clone();
    url2.pathname = "/dashboard";
    return NextResponse.redirect(url2);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/api/invoices/:path*", "/api/escalations/:path*"],
};
