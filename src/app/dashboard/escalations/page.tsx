"use client";

import { useState, useEffect } from "react";

var DEMO_USER_ID = "demo-user-id";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDateTime(dateString: string) {
  var d = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

var levelColors: Record<string, { bg: string; text: string }> = {
  REMINDER_1: { bg: "#fefce8", text: "#854d0e" },
  REMINDER_2: { bg: "#fff7ed", text: "#9a3412" },
  ESCALATION_ALERT: { bg: "#fef2f2", text: "#991b1b" },
};

var statusColors: Record<string, { bg: string; text: string }> = {
  SENT: { bg: "#dcfce7", text: "#166534" },
  PENDING: { bg: "#fefce8", text: "#854d0e" },
  FAILED: { bg: "#fef2f2", text: "#991b1b" },
};

export default function EscalationsPage() {
  var [escalations, setEscalations] = useState<any[]>([]);
  var [loading, setLoading] = useState(true);

  useEffect(function () {
    setEscalations([
      {
        id: "1",
        level: "REMINDER_1",
        channel: "EMAIL",
        status: "SENT",
        sentAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        invoice: { clientName: "Acme Corp", invoiceNumber: "INV-001", amount: 2500, dueDate: "2024-12-01", status: "OVERDUE" },
      },
      {
        id: "2",
        level: "REMINDER_2",
        channel: "EMAIL",
        status: "SENT",
        sentAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        invoice: { clientName: "Acme Corp", invoiceNumber: "INV-001", amount: 2500, dueDate: "2024-12-01", status: "OVERDUE" },
      },
      {
        id: "3",
        level: "ESCALATION_ALERT",
        channel: "EMAIL",
        status: "SENT",
        sentAt: new Date().toISOString(),
        invoice: { clientName: "TechStart Inc", invoiceNumber: "INV-002", amount: 4500, dueDate: "2024-12-20", status: "OVERDUE" },
      },
    ]);
    fetch("/api/escalations?userId=" + DEMO_USER_ID)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.length > 0) setEscalations(data);
        setLoading(false);
      })
      .catch(function () { setLoading(false); });
  }, []);

  function formatLevel(level: string) {
    if (level === "REMINDER_1") return "Reminder 1 (3 days)";
    if (level === "REMINDER_2") return "Reminder 2 (7 days)";
    if (level === "ESCALATION_ALERT") return "Escalation Alert (14 days)";
    return level;
  }

  return (
    <div style={{ padding: "24px 32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>Escalation History</h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>Track all reminders and escalation alerts sent to clients</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Total Escalations</p>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{escalations.length}</p>
        </div>
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Reminders Sent</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#d97706" }}>
            {escalations.filter(function (e) { return e.level.startsWith("REMINDER"); }).length}
          </p>
        </div>
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Escalation Alerts</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626" }}>
            {escalations.filter(function (e) { return e.level === "ESCALATION_ALERT"; }).length}
          </p>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600" }}>Escalation Log</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <tr>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Client</th>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Invoice</th>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Amount</th>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Level</th>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Channel</th>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Sent At</th>
            </tr>
          </thead>
          <tbody>
            {escalations.map(function (esc) {
              var lc = levelColors[esc.level] || { bg: "#f3f4f6", text: "#374151" };
              var sc = statusColors[esc.status] || { bg: "#f3f4f6", text: "#374151" };
              return (
                <tr key={esc.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "16px 24px", fontWeight: "500" }}>{esc.invoice.clientName}</td>
                  <td style={{ padding: "16px 24px", color: "#4b5563" }}>{esc.invoice.invoiceNumber}</td>
                  <td style={{ padding: "16px 24px", fontWeight: "600" }}>{formatCurrency(esc.invoice.amount)}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "500", background: lc.bg, color: lc.text }}>
                      {formatLevel(esc.level)}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", color: "#4b5563", fontSize: "14px" }}>{esc.channel}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "500", background: sc.bg, color: sc.text }}>
                      {esc.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", color: "#4b5563", fontSize: "14px" }}>{formatDateTime(esc.sentAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {escalations.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <p style={{ color: "#6b7280" }}>No escalation history yet. Escalations appear once invoices become overdue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
