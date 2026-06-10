import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  var body = await request.json();
  var email = body.email;
  var password = body.password;

  var response = NextResponse.json({ success: true });

  var supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set(name, value, {
            path: options?.path || "/",
            maxAge: options?.maxAge || 60 * 60 * 24 * 7,
            sameSite: options?.sameSite || "lax",
            httpOnly: options?.httpOnly !== undefined ? options.httpOnly : false,
            secure: options?.secure !== undefined ? options.secure : false,
          });
        },
        remove(name: string, options: any) {
          response.cookies.delete(name);
        },
      },
    }
  );

  var { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return response;
}