import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST() {
  var supabaseResponse = NextResponse.json({ success: true });

  var supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(function (cookie) {
            supabaseResponse.cookies.set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    }
  );

  await supabase.auth.signOut();

  return supabaseResponse;
}