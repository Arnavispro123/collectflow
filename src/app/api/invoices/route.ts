import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import prisma from "@/lib/prisma";

async function getAuth(request: NextRequest): Promise<{ id: string; email: string } | null> {
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
  if (!user) return null;
  return { id: user.id, email: user.email || "" };
}

export async function GET(request: NextRequest) {
  try {
    var auth = await getAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    var invoices = await prisma.invoice.findMany({
      where: { userId: auth.id },
      orderBy: { dueDate: "desc" },
    });

    var now = new Date();
    var invoicesWithOverdue = invoices.map(function (invoice) {
      var dueDate = new Date(invoice.dueDate);
      var diffTime = now.getTime() - dueDate.getTime();
      var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        ...invoice,
        amount: Number(invoice.amount),
        daysOverdue: invoice.status !== "PAID" && diffDays > 0 ? diffDays : 0,
      };
    });

    return NextResponse.json(invoicesWithOverdue);
  } catch (error: any) {
    console.error("Error fetching invoices:", error.message);
    return NextResponse.json({ error: error.message || "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    var auth = await getAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await prisma.user.upsert({
      where: { id: auth.id },
      update: { email: auth.email },
      create: { id: auth.id, email: auth.email },
    });

    var body = await request.json();
    var invoice = await prisma.invoice.create({
      data: {
        userId: auth.id,
        clientName: body.clientName,
        clientEmail: body.clientEmail || null,
        clientPhone: body.clientPhone || null,
        invoiceNumber: body.invoiceNumber,
        amount: parseFloat(body.amount),
        currency: body.currency || "USD",
        dueDate: new Date(body.dueDate),
        description: body.description || null,
      },
    });
    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.error("Error creating invoice:", error.message, error.code);
    return NextResponse.json({ error: error.message || "Failed to create invoice" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    var auth = await getAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    var body = await request.json();
    var { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
    }
    var invoice = await prisma.invoice.update({ where: { id }, data: updateData });
    return NextResponse.json(invoice);
  } catch (error: any) {
    console.error("Error updating invoice:", error.message);
    return NextResponse.json({ error: error.message || "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    var auth = await getAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    var { searchParams } = new URL(request.url);
    var id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
    }
    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting invoice:", error.message);
    return NextResponse.json({ error: error.message || "Failed to delete invoice" }, { status: 500 });
  }
}