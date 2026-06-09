import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  var body = await request.json();
  var email = body.email;
  var password = body.password;

  var supabaseResponse = NextResponse.json({ success: true });

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
            supabaseResponse.cookies.set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    }
  );

  var { error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return supabaseResponse;
}