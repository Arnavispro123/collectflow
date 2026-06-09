import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, generateReminder1Email, generateReminder2Email, generateEscalationAlertEmail } from "@/lib/email";

function getDaysOverdue(dueDate: Date): number {
  var now = new Date();
  var due = new Date(dueDate);
  var diffTime = now.getTime() - due.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

async function processOverdueInvoices() {
  var result = { processed: 0, remindersSent: 0, escalationsSent: 0, errors: [] as string[] };

  try {
    var overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: { in: ["UNPAID", "OVERDUE"] },
        dueDate: { lt: new Date() },
      },
      include: {
        user: true,
        escalations: { orderBy: { sentAt: "desc" }, take: 1 },
      },
    });

    console.log("Found " + overdueInvoices.length + " overdue invoices to process");

    for (var i = 0; i < overdueInvoices.length; i++) {
      var invoice = overdueInvoices[i];
      result.processed++;
      var daysOverdue = getDaysOverdue(invoice.dueDate);
      var lastEscalation = invoice.escalations[0];
      var lastEscalationDays = lastEscalation ? getDaysOverdue(lastEscalation.sentAt) : 0;

      try {
        if (daysOverdue >= 3 && lastEscalationDays < 3) {
          if (invoice.clientEmail) {
            var emailContent = generateReminder1Email(
              invoice.clientName,
              invoice.invoiceNumber,
              Number(invoice.amount),
              invoice.dueDate,
              invoice.user.name || "Freelancer"
            );
            await sendEmail({ to: invoice.clientEmail, subject: emailContent.subject, html: emailContent.html });
          }
          await prisma.escalationLog.create({
            data: { userId: invoice.userId, invoiceId: invoice.id, level: "REMINDER_1", channel: "EMAIL", status: "SENT" },
          });
          result.remindersSent++;
          console.log("Sent Reminder 1 for " + invoice.invoiceNumber);
        }

        if (daysOverdue >= 7 && lastEscalationDays < 7) {
          if (invoice.clientEmail) {
            var emailContent2 = generateReminder2Email(
              invoice.clientName,
              invoice.invoiceNumber,
              Number(invoice.amount),
              invoice.dueDate,
              daysOverdue,
              invoice.user.name || "Freelancer"
            );
            await sendEmail({ to: invoice.clientEmail, subject: emailContent2.subject, html: emailContent2.html });
          }
          await prisma.escalationLog.create({
            data: { userId: invoice.userId, invoiceId: invoice.id, level: "REMINDER_2", channel: "EMAIL", status: "SENT" },
          });
          await prisma.invoice.update({ where: { id: invoice.id }, data: { status: "OVERDUE" } });
          result.remindersSent++;
          console.log("Sent Reminder 2 for " + invoice.invoiceNumber);
        }

        if (daysOverdue >= 14 && lastEscalationDays < 14) {
          var emailContent3 = generateEscalationAlertEmail(
            invoice.user.email,
            invoice.clientName,
            invoice.invoiceNumber,
            Number(invoice.amount),
            daysOverdue,
            invoice.user.name || "Freelancer"
          );
          await sendEmail({ to: emailContent3.to, subject: emailContent3.subject, html: emailContent3.html });
          await prisma.escalationLog.create({
            data: { userId: invoice.userId, invoiceId: invoice.id, level: "ESCALATION_ALERT", channel: "EMAIL", status: "SENT" },
          });
          result.escalationsSent++;
          console.log("Sent Escalation Alert for " + invoice.invoiceNumber);
        }
      } catch (error) {
        var errorMessage = error instanceof Error ? error.message : "Unknown error";
        result.errors.push("Failed to process " + invoice.invoiceNumber + ": " + errorMessage);
      }
    }
  } catch (error) {
    var errorMessage2 = error instanceof Error ? error.message : "Unknown error";
    result.errors.push("Failed to fetch overdue invoices: " + errorMessage2);
  }

  return result;
}

export async function GET(request: NextRequest) {
  try {
    var authHeader = request.headers.get("authorization");
    var cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== "Bearer " + cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting cron job: Checking overdue invoices...");
    var startTime = Date.now();
    var result = await processOverdueInvoices();
    var duration = Date.now() - startTime;
    console.log("Cron job completed in " + duration + "ms:", result);

    return NextResponse.json({ success: true, duration: duration + "ms", ...result });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}