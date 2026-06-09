import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    var { searchParams } = new URL(request.url);
    var userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    var escalations = await prisma.escalationLog.findMany({
      where: { userId: userId },
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
