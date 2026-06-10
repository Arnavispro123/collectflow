"use client";

import { useState, useEffect } from "react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateString));
}

export default function DashboardPage() {
  var [invoices, setInvoices] = useState<any[]>([]);
  var [showForm, setShowForm] = useState(false);
  var [form, setForm] = useState({ clientName: "", clientEmail: "", invoiceNumber: "", amount: "", dueDate: "", description: "" });
  var [userId, setUserId] = useState("");
  var [loading, setLoading] = useState(true);
  var [darkMode, setDarkMode] = useState(false);
  var [sendingId, setSendingId] = useState("");
  var [sendResult, setSendResult] = useState("");

  useEffect(function () {
    function readTheme() {
      setDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
    }
    readTheme();
    window.addEventListener("themechange", readTheme);

    fetch("/api/auth/user")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.id) {
          setUserId(data.id);
          fetch("/api/invoices")
            .then(function (res) { return res.json(); })
            .then(function (data) {
              if (Array.isArray(data)) setInvoices(data);
              setLoading(false);
            })
            .catch(function () { setLoading(false); });
        } else {
          setLoading(false);
        }
      })
      .catch(function () { setLoading(false); });

    return function () { window.removeEventListener("themechange", readTheme); };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    var newInv = {
      id: String(Date.now()),
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      invoiceNumber: form.invoiceNumber,
      amount: parseFloat(form.amount),
      dueDate: form.dueDate,
      status: "UNPAID",
      daysOverdue: 0,
    };
    setInvoices([newInv].concat(invoices));
    setForm({ clientName: "", clientEmail: "", invoiceNumber: "", amount: "", dueDate: "", description: "" });
    setShowForm(false);

    fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName: form.clientName, clientEmail: form.clientEmail, invoiceNumber: form.invoiceNumber, amount: form.amount, dueDate: form.dueDate, description: form.description }),
    }).then(function () {
      fetch("/api/invoices")
        .then(function (res) { return res.json(); })
        .then(function (data) { if (Array.isArray(data)) setInvoices(data); })
        .catch(function () {});
    }).catch(function () {});
  }

  function markPaid(id: string) {
    setInvoices(invoices.map(function (inv) { return inv.id === id ? { status: "PAID", daysOverdue: 0, clientName: inv.clientName, clientEmail: inv.clientEmail, invoiceNumber: inv.invoiceNumber, amount: inv.amount, dueDate: inv.dueDate, id: inv.id } : inv; }));
    fetch("/api/invoices", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: id, status: "PAID" }) }).catch(function () {});
  }

  function deleteInvoice(id: string) {
    setInvoices(invoices.filter(function (inv) { return inv.id !== id; }));
    fetch("/api/invoices?id=" + id, { method: "DELETE" }).catch(function () {});
  }

  function sendReminder(invoiceId: string) {
    setSendingId(invoiceId);
    setSendResult("");
    fetch("/api/invoices/send-reminder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId: invoiceId }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          setSendResult("Email sent successfully!");
        } else {
          setSendResult(data.error || "Failed to send");
        }
        setSendingId("");
        setTimeout(function () { setSendResult(""); }, 3000);
      })
      .catch(function () {
        setSendResult("Failed to send email");
        setSendingId("");
        setTimeout(function () { setSendResult(""); }, 3000);
      });
  }

  var totalOutstanding = invoices.filter(function (inv) { return inv.status !== "PAID"; }).reduce(function (sum, inv) { return sum + inv.amount; }, 0);
  var totalCollected = invoices.filter(function (inv) { return inv.status === "PAID"; }).reduce(function (sum, inv) { return sum + inv.amount; }, 0);
  var overdueCount = invoices.filter(function (inv) { return inv.status === "OVERDUE"; }).length;

  var cardBg = darkMode ? "#1f2937" : "white";
  var borderColor = darkMode ? "#374151" : "#e5e7eb";
  var textColor = darkMode ? "#f3f4f6" : "#111827";
  var secondaryText = darkMode ? "#9ca3af" : "#6b7280";
  var tableHeadBg = darkMode ? "#111827" : "#f9fafb";
  var inputBg = darkMode ? "#374151" : "white";

  if (loading) {
    return (
      <div style={{ padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <p style={{ color: secondaryText, fontSize: "14px" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px" }}>
      {sendResult && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", zIndex: 9999,
          background: sendResult === "Email sent successfully!" ? "#dcfce7" : "#fef2f2",
          border: "1px solid " + (sendResult === "Email sent successfully!" ? "#bbf7d0" : "#fecaca"),
          borderRadius: "8px", padding: "12px 20px",
          color: sendResult === "Email sent successfully!" ? "#166534" : "#991b1b",
          fontSize: "14px", fontWeight: "500",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>
          {sendResult}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: textColor }}>Dashboard</h1>
          <p style={{ fontSize: "14px", color: secondaryText, marginTop: "4px" }}>Manage your invoices and track payments</p>
        </div>
        <button onClick={function () { setShowForm(!showForm); }} style={{ background: "#4f46e5", color: "white", padding: "8px 16px", borderRadius: "8px", fontWeight: "500", border: "none", cursor: "pointer", fontSize: "14px" }}>
          {showForm ? "Cancel" : "+ Add Invoice"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: textColor }}>Add New Invoice</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: textColor }}>Client Name *</label>
                <input type="text" required value={form.clientName} onChange={function (e) { setForm({ clientName: e.target.value, clientEmail: form.clientEmail, invoiceNumber: form.invoiceNumber, amount: form.amount, dueDate: form.dueDate, description: form.description }); }} style={{ width: "100%", border: "1px solid " + borderColor, borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: inputBg, color: textColor, boxSizing: "border-box" }} placeholder="John Smith" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: textColor }}>Client Email</label>
                <input type="email" value={form.clientEmail} onChange={function (e) { setForm({ clientName: form.clientName, clientEmail: e.target.value, invoiceNumber: form.invoiceNumber, amount: form.amount, dueDate: form.dueDate, description: form.description }); }} style={{ width: "100%", border: "1px solid " + borderColor, borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: inputBg, color: textColor, boxSizing: "border-box" }} placeholder="john@example.com" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: textColor }}>Invoice Number *</label>
                <input type="text" required value={form.invoiceNumber} onChange={function (e) { setForm({ clientName: form.clientName, clientEmail: form.clientEmail, invoiceNumber: e.target.value, amount: form.amount, dueDate: form.dueDate, description: form.description }); }} style={{ width: "100%", border: "1px solid " + borderColor, borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: inputBg, color: textColor, boxSizing: "border-box" }} placeholder="INV-001" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: textColor }}>Amount ($) *</label>
                <input type="number" required min="0" step="0.01" value={form.amount} onChange={function (e) { setForm({ clientName: form.clientName, clientEmail: form.clientEmail, invoiceNumber: form.invoiceNumber, amount: e.target.value, dueDate: form.dueDate, description: form.description }); }} style={{ width: "100%", border: "1px solid " + borderColor, borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: inputBg, color: textColor, boxSizing: "border-box" }} placeholder="1000.00" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: textColor }}>Due Date *</label>
                <input type="date" required value={form.dueDate} onChange={function (e) { setForm({ clientName: form.clientName, clientEmail: form.clientEmail, invoiceNumber: form.invoiceNumber, amount: form.amount, dueDate: e.target.value, description: form.description }); }} style={{ width: "100%", border: "1px solid " + borderColor, borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: inputBg, color: textColor, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: textColor }}>Description</label>
                <input type="text" value={form.description} onChange={function (e) { setForm({ clientName: form.clientName, clientEmail: form.clientEmail, invoiceNumber: form.invoiceNumber, amount: form.amount, dueDate: form.dueDate, description: e.target.value }); }} style={{ width: "100%", border: "1px solid " + borderColor, borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: inputBg, color: textColor, boxSizing: "border-box" }} placeholder="Website redesign" />
              </div>
            </div>
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" style={{ background: "#4f46e5", color: "white", padding: "8px 24px", borderRadius: "8px", fontWeight: "500", border: "none", cursor: "pointer" }}>Add Invoice</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "20px" }}>
          <p style={{ fontSize: "13px", color: secondaryText, marginBottom: "4px" }}>Total Outstanding</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#d97706" }}>{formatCurrency(totalOutstanding)}</p>
        </div>
        <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "20px" }}>
          <p style={{ fontSize: "13px", color: secondaryText, marginBottom: "4px" }}>Total Collected</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#16a34a" }}>{formatCurrency(totalCollected)}</p>
        </div>
        <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "20px" }}>
          <p style={{ fontSize: "13px", color: secondaryText, marginBottom: "4px" }}>Overdue Invoices</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626" }}>{overdueCount}</p>
        </div>
        <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "20px" }}>
          <p style={{ fontSize: "13px", color: secondaryText, marginBottom: "4px" }}>Total Invoices</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: textColor }}>{invoices.length}</p>
        </div>
      </div>

      <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid " + borderColor }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: textColor }}>All Invoices</h2>
        </div>
        {invoices.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: tableHeadBg, borderBottom: "1px solid " + borderColor }}>
              <tr>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Invoice</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Client</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Email</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Amount</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Due Date</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Status</th>
                <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Overdue</th>
                <th style={{ padding: "12px 24px", textAlign: "right", fontSize: "12px", fontWeight: "500", color: secondaryText, textTransform: "uppercase" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(function (inv) {
                return (
                  <tr key={inv.id} style={{ borderBottom: "1px solid " + borderColor }}>
                    <td style={{ padding: "16px 24px", fontWeight: "500", color: textColor }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: "16px 24px", color: secondaryText }}>{inv.clientName}</td>
                    <td style={{ padding: "16px 24px", color: secondaryText, fontSize: "13px" }}>{inv.clientEmail || "-"}</td>
                    <td style={{ padding: "16px 24px", fontWeight: "600", color: textColor }}>{formatCurrency(inv.amount)}</td>
                    <td style={{ padding: "16px 24px", color: secondaryText }}>{formatDate(inv.dueDate)}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "500", background: inv.status === "PAID" ? "#dcfce7" : inv.status === "OVERDUE" ? "#fef2f2" : "#fefce8", color: inv.status === "PAID" ? "#166534" : inv.status === "OVERDUE" ? "#991b1b" : "#854d0e" }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 24px", fontWeight: "600", color: "#dc2626" }}>
                      {inv.daysOverdue > 0 ? inv.daysOverdue + " days" : "-"}
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      {inv.status !== "PAID" && inv.clientEmail && (
                        <button
                          onClick={function () { sendReminder(inv.id); }}
                          disabled={sendingId === inv.id}
                          style={{
                            color: sendingId === inv.id ? "#9ca3af" : "#059669",
                            fontWeight: "500",
                            marginRight: "12px",
                            background: "none",
                            border: "none",
                            cursor: sendingId === inv.id ? "not-allowed" : "pointer",
                            fontSize: "13px",
                          }}
                        >
                          {sendingId === inv.id ? "Sending..." : "Send Reminder"}
                        </button>
                      )}
                      {inv.status !== "PAID" && (
                        <button onClick={function () { markPaid(inv.id); }} style={{ color: "#4f46e5", fontWeight: "500", marginRight: "12px", background: "none", border: "none", cursor: "pointer" }}>Mark Paid</button>
                      )}
                      <button onClick={function () { deleteInvoice(inv.id); }} style={{ color: "#dc2626", fontWeight: "500", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: darkMode ? "#374151" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg style={{ width: "32px", height: "32px", color: secondaryText }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: textColor, marginBottom: "8px" }}>No invoices yet</h3>
            <p style={{ color: secondaryText, fontSize: "14px", marginBottom: "20px" }}>Get started by adding your first invoice to track.</p>
            <button onClick={function () { setShowForm(true); }} style={{ background: "#4f46e5", color: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "500", border: "none", cursor: "pointer", fontSize: "14px" }}>
              + Add Your First Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
