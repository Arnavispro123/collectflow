import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@collectflow.io";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!resend) {
    console.log("[Email Stub] Sending email:", options);
    return true;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export function generateReminder1Email(
  clientName: string,
  invoiceNumber: string,
  amount: number,
  dueDate: Date,
  freelancerName: string
) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  const formattedDueDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(dueDate);

  return {
    to: "",
    subject: "Payment Reminder - Invoice " + invoiceNumber,
    html:
      '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">' +
      '<h2 style="color:#4f46e5;">Payment Reminder</h2>' +
      "<p>Dear " + clientName + ",</p>" +
      "<p>This is a friendly reminder that invoice <strong>" + invoiceNumber + "</strong> for <strong>" + formattedAmount + "</strong> was due on <strong>" + formattedDueDate + "</strong>.</p>" +
      "<p>If you have already sent payment, please disregard this reminder.</p>" +
      "<p>To make a payment, please contact " + freelancerName + " directly.</p>" +
      "<br/>" +
      "<p>Best regards,</p>" +
      "<p><strong>" + freelancerName + "</strong></p>" +
      '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />' +
      '<p style="font-size:12px;color:#666;">Powered by CollectFlow</p>' +
      "</div>",
  };
}

export function generateReminder2Email(
  clientName: string,
  invoiceNumber: string,
  amount: number,
  dueDate: Date,
  daysOverdue: number,
  freelancerName: string
) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return {
    to: "",
    subject: "OVERDUE: Invoice " + invoiceNumber + " - Payment Required",
    html:
      '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">' +
      '<h2 style="color:#dc2626;">Overdue Payment Notice</h2>' +
      "<p>Dear " + clientName + ",</p>" +
      "<p>This is to inform you that invoice <strong>" + invoiceNumber + "</strong> for <strong>" + formattedAmount + "</strong> is now <strong>" + daysOverdue + " days overdue</strong>.</p>" +
      "<p>Immediate payment is requested to avoid any disruption to services.</p>" +
      "<br/>" +
      "<p>Thank you for your prompt attention to this matter.</p>" +
      "<p><strong>" + freelancerName + "</strong></p>" +
      '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />' +
      '<p style="font-size:12px;color:#666;">Powered by CollectFlow</p>' +
      "</div>",
  };
}

export function generateEscalationAlertEmail(
  freelancerEmail: string,
  clientName: string,
  invoiceNumber: string,
  amount: number,
  daysOverdue: number,
  freelancerName: string
) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return {
    to: freelancerEmail,
    subject: "ESCALATION: " + clientName + " - Invoice " + invoiceNumber + " is " + daysOverdue + " days overdue",
    html:
      '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">' +
      '<h2 style="color:#dc2626;">Escalation Alert</h2>' +
      "<p>Hi " + freelancerName + ",</p>" +
      "<p>This is an escalation alert for an outstanding invoice:</p>" +
      '<div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:16px 0;">' +
      "<p><strong>Client:</strong> " + clientName + "</p>" +
      "<p><strong>Invoice:</strong> " + invoiceNumber + "</p>" +
      "<p><strong>Amount:</strong> " + formattedAmount + "</p>" +
      "<p><strong>Days Overdue:</strong> " + daysOverdue + "</p>" +
      "</div>" +
      "<p>You may want to take direct action to collect this payment.</p>" +
      '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />' +
      '<p style="font-size:12px;color:#666;">Powered by CollectFlow</p>' +
      "</div>",
  };
}
