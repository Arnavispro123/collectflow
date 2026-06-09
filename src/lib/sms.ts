export interface SmsOptions {
  to: string;
  body: string;
}

export async function sendSms(options: SmsOptions): Promise<boolean> {
  console.log("[SMS Stub] Sending SMS:", options);
  return true;
}

export function generateReminder1Sms(
  invoiceNumber: string,
  amount: number,
  freelancerName: string
): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return "Hi! This is a friendly reminder from " + freelancerName + " that invoice " + invoiceNumber + " for " + formattedAmount + " is now overdue. Please arrange payment at your earliest convenience. Thank you!";
}

export function generateReminder2Sms(
  invoiceNumber: string,
  amount: number,
  daysOverdue: number,
  freelancerName: string
): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return "IMPORTANT: Invoice " + invoiceNumber + " for " + formattedAmount + " from " + freelancerName + " is now " + daysOverdue + " days overdue. Immediate payment is required.";
}

export function generateEscalationAlertSms(
  invoiceNumber: string,
  amount: number,
  daysOverdue: number,
  clientName: string
): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return "[CollectFlow Alert] Invoice " + invoiceNumber + " (" + formattedAmount + ") from " + clientName + " is " + daysOverdue + " days overdue. Review in your dashboard.";
}
