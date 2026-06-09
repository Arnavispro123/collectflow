import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  var { searchParams, origin } = new URL(request.url);
  var code = searchParams.get("code");
  var next = searchParams.get("next") || "/dashboard";

  if (code) {
    var supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
      }
    );

    var { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(origin + next);
    }
  }

  return NextResponse.redirect(origin + "/login");
}
