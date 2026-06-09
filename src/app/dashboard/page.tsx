"use client";

import { useState, useEffect } from "react";

var DEMO_USER_ID = "demo-user-id";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateString));
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientName: "", clientEmail: "", invoiceNumber: "", amount: "", dueDate: "", description: "" });

  useEffect(() => {
    setInvoices([
      { id: "1", clientName: "Acme Corp", invoiceNumber: "INV-001", amount: 2500, dueDate: "2024-12-01", status: "OVERDUE", daysOverdue: 15 },
      { id: "2", clientName: "TechStart Inc", invoiceNumber: "INV-002", amount: 4500, dueDate: "2024-12-20", status: "OVERDUE", daysOverdue: 8 },
      { id: "3", clientName: "Design Studio", invoiceNumber: "INV-003", amount: 1200, dueDate: "2025-06-20", status: "UNPAID", daysOverdue: 0 },
      { id: "4", clientName: "Marketing Pro", invoiceNumber: "INV-004", amount: 3200, dueDate: "2024-11-15", status: "PAID", daysOverdue: 0 },
    ]);
    fetch("/api/invoices?userId=" + DEMO_USER_ID)
      .then((res) => res.json())
      .then((data) => { if (data && data.length > 0) setInvoices(data); })
      .catch(() => {});
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
    setInvoices([newInv, ...invoices]);
    setForm({ clientName: "", clientEmail: "", invoiceNumber: "", amount: "", dueDate: "", description: "" });
    setShowForm(false);

    fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newInv, userId: DEMO_USER_ID }),
    }).catch(() => {});
  }

  function markPaid(id: string) {
    setInvoices(invoices.map((inv) => inv.id === id ? { ...inv, status: "PAID", daysOverdue: 0 } : inv));
    fetch("/api/invoices", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: id, status: "PAID" }) }).catch(() => {});
  }

  function deleteInvoice(id: string) {
    setInvoices(invoices.filter((inv) => inv.id !== id));
    fetch("/api/invoices?id=" + id, { method: "DELETE" }).catch(() => {});
  }

  var totalOutstanding = invoices.filter((inv) => inv.status !== "PAID").reduce((sum, inv) => sum + inv.amount, 0);
  var totalCollected = invoices.filter((inv) => inv.status === "PAID").reduce((sum, inv) => sum + inv.amount, 0);
  var overdueCount = invoices.filter((inv) => inv.status === "OVERDUE").length;

  return (
    <div style={{ padding: "24px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>Dashboard</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>Manage your invoices and track payments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#4f46e5", color: "white", padding: "8px 16px", borderRadius: "8px", fontWeight: "500", border: "none", cursor: "pointer", fontSize: "14px" }}>
          {showForm ? "Cancel" : "+ Add Invoice"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Add New Invoice</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Client Name *</label>
                <input type="text" required value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }} placeholder="John Smith" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Client Email</label>
                <input type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }} placeholder="john@example.com" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Invoice Number *</label>
                <input type="text" required value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }} placeholder="INV-001" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Amount ($) *</label>
                <input type="number" required min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }} placeholder="1000.00" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Due Date *</label>
                <input type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }} placeholder="Website redesign" />
              </div>
            </div>
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" style={{ background: "#4f46e5", color: "white", padding: "8px 24px", borderRadius: "8px", fontWeight: "500", border: "none", cursor: "pointer" }}>Add Invoice</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Total Outstanding</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#d97706" }}>{formatCurrency(totalOutstanding)}</p>
        </div>
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Total Collected</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#16a34a" }}>{formatCurrency(totalCollected)}</p>
        </div>
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Overdue Invoices</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626" }}>{overdueCount}</p>
        </div>
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Total Invoices</p>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{invoices.length}</p>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600" }}>All Invoices</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <tr>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Invoice</th>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Client</th>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Amount</th>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Due Date</th>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Overdue</th>
              <th style={{ padding: "12px 24px", textAlign: "right", fontSize: "12px", fontWeight: "500", color: "#6b7280", textTransform: "uppercase" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px 24px", fontWeight: "500" }}>{inv.invoiceNumber}</td>
                <td style={{ padding: "16px 24px", color: "#4b5563" }}>{inv.clientName}</td>
                <td style={{ padding: "16px 24px", fontWeight: "600" }}>{formatCurrency(inv.amount)}</td>
                <td style={{ padding: "16px 24px", color: "#4b5563" }}>{formatDate(inv.dueDate)}</td>
                <td style={{ padding: "16px 24px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "500", background: inv.status === "PAID" ? "#dcfce7" : inv.status === "OVERDUE" ? "#fef2f2" : "#fefce8", color: inv.status === "PAID" ? "#166534" : inv.status === "OVERDUE" ? "#991b1b" : "#854d0e" }}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ padding: "16px 24px", fontWeight: "600", color: "#dc2626" }}>
                  {inv.daysOverdue > 0 ? inv.daysOverdue + " days" : "-"}
                </td>
                <td style={{ padding: "16px 24px", textAlign: "right" }}>
                  {inv.status !== "PAID" && (
                    <button onClick={() => markPaid(inv.id)} style={{ color: "#4f46e5", fontWeight: "500", marginRight: "12px", background: "none", border: "none", cursor: "pointer" }}>Mark Paid</button>
                  )}
                  <button onClick={() => deleteInvoice(inv.id)} style={{ color: "#dc2626", fontWeight: "500", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <p style={{ color: "#6b7280" }}>No invoices yet. Add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
