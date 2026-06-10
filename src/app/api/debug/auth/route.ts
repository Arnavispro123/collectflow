import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  var cookies = request.cookies.getAll();
  var details = cookies.map(function (c) {
    return { name: c.name, len: c.value.length };
  });

  var supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set() {},
        remove() {},
      },
    }
  );

  var { data, error } = await supabase.auth.getUser();

  return NextResponse.json({
    hasUser: !!data.user,
    userId: data.user ? data.user.id : null,
    userEmail: data.user ? data.user.email : null,
    error: error ? error.message : null,
    cookieCount: cookies.length,
    cookies: details,
  });
}