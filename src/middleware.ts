import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  var supabaseResponse = NextResponse.next({ request: request });

  var supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name: value ? name : name, value: value, ...options });
          supabaseResponse.cookies.set(name, value, {
            path: options?.path || "/",
            maxAge: options?.maxAge,
            sameSite: options?.sameSite || "lax",
          });
        },
        remove(name: string, options: any) {
          request.cookies.delete(name);
          supabaseResponse.cookies.delete(name);
        },
      },
    }
  );

  var {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    var url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};