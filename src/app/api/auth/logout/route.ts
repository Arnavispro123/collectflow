import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST() {
  var response = NextResponse.json({ success: true });

  var supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get() {
          return undefined;
        },
        set() {},
        remove() {},
      },
    }
  );

  await supabase.auth.signOut();

  var cookieName = "sb-xschsqycuuaztocradhj-auth-token";
  response.cookies.delete(cookieName);

  return response;
}