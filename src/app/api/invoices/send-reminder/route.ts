import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

var prisma = null as any;
try {
  var PrismaClient = require("@prisma/client").PrismaClient;
  prisma = new PrismaClient();
} catch (e) {}

var RESEND_API_KEY = process.env.RESEND_API_KEY;
var EMAIL_FROM = process.env.EMAIL_FROM || "noreply@collectflow.io";

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log("[Email - No API Key] Would send to:", to, "Subject:", subject);
    return true;
  }
  var res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: EMAIL_FROM, to: [to], subject: subject, html: html }),
  });
  return res.ok;
}

export async function POST(request: NextRequest) {
  var body = await request.json();
  var invoiceId = body.invoiceId;

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
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!prisma) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  var invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId: user.id },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  if (!invoice.clientEmail) {
    return NextResponse.json({ error: "No email address for this client" }, { status: 400 });
  }

  var freelancerName = user.user_metadata && user.user_metadata.full_name
    ? user.user_metadata.full_name
    : user.email || "Your Freelancer";

  var now = new Date();
  var dueDate = new Date(invoice.dueDate);
  var daysOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));

  var formattedAmount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(invoice.amount);

  var subject: string;
  var html: string;

  if (daysOverdue > 0) {
    subject = "OVERDUE: Invoice " + invoice.invoiceNumber + " - Payment Required";
    html =
      '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">' +
      '<h2 style="color:#dc2626;">Overdue Payment Notice</h2>' +
      "<p>Dear " + invoice.clientName + ",</p>" +
      "<p>This is to inform you that invoice <strong>" + invoice.invoiceNumber + "</strong> for <strong>" + formattedAmount + "</strong> is now <strong>" + daysOverdue + " days overdue</strong>.</p>" +
      "<p>Immediate payment is requested to avoid any disruption to services.</p>" +
      "<br/>" +
      "<p>Thank you for your prompt attention to this matter.</p>" +
      "<p><strong>" + freelancerName + "</strong></p>" +
      '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />' +
      '<p style="font-size:12px;color:#666;">Powered by CollectFlow</p>' +
      "</div>";
  } else {
    subject = "Payment Reminder - Invoice " + invoice.invoiceNumber;
    html =
      '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">' +
      '<h2 style="color:#4f46e5;">Payment Reminder</h2>' +
      "<p>Dear " + invoice.clientName + ",</p>" +
      "<p>This is a friendly reminder that invoice <strong>" + invoice.invoiceNumber + "</strong> for <strong>" + formattedAmount + "</strong> is due on <strong>" + new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(dueDate) + "</strong>.</p>" +
      "<p>If you have already sent payment, please disregard this reminder.</p>" +
      "<p>To make a payment, please contact " + freelancerName + " directly.</p>" +
      "<br/>" +
      "<p>Best regards,</p>" +
      "<p><strong>" + freelancerName + "</strong></p>" +
      '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />' +
      '<p style="font-size:12px;color:#666;">Powered by CollectFlow</p>' +
      "</div>";
  }

  var sent = await sendEmail(invoice.clientEmail, subject, html);

  if (!sent) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  await prisma.reminderLog.create({
    data: {
      invoiceId: invoice.id,
      channel: "EMAIL",
      level: daysOverdue > 7 ? "REMINDER_2" : "REMINDER_1",
      status: "SENT",
      sentAt: new Date(),
    },
  });

  return NextResponse.json({ success: true, message: "Email sent to " + invoice.clientEmail });
}