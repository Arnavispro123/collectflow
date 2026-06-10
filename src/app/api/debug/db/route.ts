import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

  var { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ step: "auth", error: "No user from Supabase" });
  }

  try {
    var dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      var created = await prisma.user.create({
        data: { id: user.id, email: user.email || "" },
      });
      dbUser = created;
    }
  } catch (e: any) {
    return NextResponse.json({ step: "user_upsert", error: e.message, code: e.code });
  }

  try {
    var invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        clientName: "Test Client",
        invoiceNumber: "TEST-001",
        amount: 100,
        dueDate: new Date(),
      },
    });
    await prisma.invoice.delete({ where: { id: invoice.id } });
    return NextResponse.json({ step: "all_ok", userId: user.id, email: user.email });
  } catch (e: any) {
    return NextResponse.json({ step: "invoice_test", error: e.message, code: e.code });
  }
}