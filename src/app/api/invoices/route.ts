import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { dueDate: "desc" },
    });

    const now = new Date();
    const invoicesWithOverdue = invoices.map((invoice) => {
      const dueDate = new Date(invoice.dueDate);
      const diffTime = now.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        ...invoice,
        amount: Number(invoice.amount),
        daysOverdue: invoice.status !== "PAID" && diffDays > 0 ? diffDays : 0,
      };
    });

    return NextResponse.json(invoicesWithOverdue);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const invoice = await prisma.invoice.create({
      data: {
        userId: body.userId || "demo-user-id",
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
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
    }
    const invoice = await prisma.invoice.update({ where: { id }, data: updateData });
    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
    }
    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
