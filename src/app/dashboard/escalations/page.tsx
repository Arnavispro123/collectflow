"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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
  var [darkMode, setDarkMode] = useState(false);

  useEffect(function () {
    var savedDark = localStorage.getItem("collectflow-dark-mode");
    if (savedDark === "true") setDarkMode(true);

    supabase.auth.getUser().then(function (result) {
      if (result.data.user) {
        var uid = result.data.user.id;
        fetch("/api/escalations?userId=" + uid)
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (Array.isArray(data)) setEscalations(data);
            setLoading(false);
          })
          .catch(function () { setLoading(false); });
      } else {
        setLoading(false);
      }
    });
  }, []);

  function formatLevel(level: string) {
    if (level === "REMINDER_1") return "Reminder 1 (3 days)";
    if (level === "REMINDER_2") return "Reminder 2 (7 days)";
    if (level === "ESCALATION_ALERT") return "Escalation Alert (14 days)";
    return level;
  }

  var cardBg = darkMode ? "#1f2937" : "white";
  var borderColor = darkMode ? "#374151" : "#e5e7eb";
  var textColor = darkMode ? "#f3f4f6" : "#111827";
  var secondaryText = darkMode ? "#9ca3af" : "#6b7280";
  var tableHeadBg = darkMode ? "#111827" : "#f9fafb";

  if (loading) {
    return (
      <div style={{ padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <p style={{ color: secondaryText, fontSize: "14px" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: textColor }}>Escalation History</h1>
        <p style={{ fontSize: "14px", color: secondaryText, marginTop: "4px" }}>Track all reminders and escalation alerts sent to clients</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "20px" }}>
          <p style={{ fontSize: "13px", color: secondaryText, marginBottom: "4px" }}>Total Escalations</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: textColor }}>{escalations.length}</p>
        </div>
        <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "20px" }}>
          <p style={{ fontSize: "13px", color: secondaryText, marginBottom: "4px" }}>Reminders Sent</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#d97706" }}>
            {escalations.filter(function (e) { return e.level.startsWith("REMINDER"); }).length}
          </p>
        </div>
        <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "20px" }}>
          <p style={{ fontSize: "13px", color: secondaryText, marginBottom: "4px" }}>Escalation Alerts</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626" }}>
            {escalations.filter(function (e) { return e.level === "ESCALATION_ALERT"; }).length}
          </p>
        </div>
      </div>

      <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid " + borderColor }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: textColor }}>Escalation Log</h2>
        </div>
        {escalations.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: tableHeadBg, borderBottom: "1px solid " + borderColor }}>
              <tr>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Client</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Invoice</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Amount</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Level</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Channel</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Status</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {escalations.map(function (esc) {
                var lc = levelColors[esc.level] || { bg: "#f3f4f6", text: "#374151" };
                var sc = statusColors[esc.status] || { bg: "#f3f4f6", text: "#374151" };
                return (
                  <tr key={esc.id} style={{ borderBottom: "1px solid " + borderColor }}>
                    <td style={{ padding: "16px 24px", fontWeight: "500", color: textColor }}>{esc.invoice.clientName}</td>
                    <td style={{ padding: "16px 24px", color: secondaryText }}>{esc.invoice.invoiceNumber}</td>
                    <td style={{ padding: "16px 24px", fontWeight: "600", color: textColor }}>{formatCurrency(esc.invoice.amount)}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "500", background: lc.bg, color: lc.text }}>
                        {formatLevel(esc.level)}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", color: secondaryText, fontSize: "14px" }}>{esc.channel}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "500", background: sc.bg, color: sc.text }}>
                        {esc.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", color: secondaryText, fontSize: "14px" }}>{formatDateTime(esc.sentAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: darkMode ? "#374151" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg style={{ width: "32px", height: "32px", color: secondaryText }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: textColor, marginBottom: "8px" }}>No escalations yet</h3>
            <p style={{ color: secondaryText, fontSize: "14px" }}>Escalations and reminders will appear here once your invoices become overdue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
