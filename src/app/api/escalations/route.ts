import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import prisma from "@/lib/prisma";

async function getUserId(request: NextRequest): Promise<string | null> {
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
  return user ? user.id : null;
}

export async function GET(request: NextRequest) {
  try {
    var userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    var escalations = await prisma.escalationLog.findMany({
      where: { invoice: { userId: userId } },
      include: {
        invoice: {
          select: {
            id: true,
            clientName: true,
            invoiceNumber: true,
            amount: true,
            dueDate: true,
            status: true,
          },
        },
      },
      orderBy: { sentAt: "desc" },
    });

    var formatted = escalations.map(function (e) {
      return {
        id: e.id,
        level: e.level,
        channel: e.channel,
        status: e.status,
        sentAt: e.sentAt.toISOString(),
        errorMessage: e.errorMessage,
        invoice: {
          id: e.invoice.id,
          clientName: e.invoice.clientName,
          invoiceNumber: e.invoice.invoiceNumber,
          amount: Number(e.invoice.amount),
          dueDate: e.invoice.dueDate.toISOString(),
          status: e.invoice.status,
        },
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching escalations:", error);
    return NextResponse.json({ error: "Failed to fetch escalations" }, { status: 500 });
  }
}