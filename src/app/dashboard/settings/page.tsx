"use client";

import { useState } from "react";

export default function SettingsPage() {
  var [settings, setSettings] = useState({
    emailReminders: true,
    smsReminders: false,
    reminder3Days: true,
    reminder7Days: true,
    escalationAlert14Days: true,
    freelancerName: "Demo Freelancer",
    freelancerEmail: "demo@collectflow.io",
    reminderTone: "friendly",
    autoMarkOverdue: true,
    reminderTimezone: "America/New_York",
  });
  var [saved, setSaved] = useState(false);

  function handleToggle(key: string) {
    setSettings(function (prev) {
      return { ...prev, [key]: !prev[key as keyof typeof prev] };
    });
    setSaved(false);
  }

  function handleTextChange(key: string, value: string) {
    setSettings(function (prev) {
      return { ...prev, [key]: value };
    });
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(function () { setSaved(false); }, 3000);
  }

  function Toggle({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: () => void }) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #f3f4f6" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{label}</div>
          <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>{description}</div>
        </div>
        <button
          onClick={onChange}
          style={{
            width: "44px",
            height: "24px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            position: "relative",
            background: value ? "#4f46e5" : "#d1d5db",
            transition: "background 0.2s",
            flexShrink: 0,
          }}
        >
          <div style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "white",
            position: "absolute",
            top: "2px",
            left: value ? "22px" : "2px",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px", maxWidth: "800px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>Settings</h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>Configure your notification preferences and account settings</p>
      </div>

      {saved && (
        <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#166534", fontSize: "14px" }}>
          Settings saved successfully!
        </div>
      )}

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600" }}>Notification Channels</h2>
        </div>
        <div style={{ padding: "8px 24px" }}>
          <Toggle
            label="Email Reminders"
            description="Send reminder emails to clients when invoices are overdue"
            value={settings.emailReminders}
            onChange={function () { handleToggle("emailReminders"); }}
          />
          <Toggle
            label="SMS Reminders"
            description="Send text message reminders to clients via Twilio"
            value={settings.smsReminders}
            onChange={function () { handleToggle("smsReminders"); }}
          />
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600" }}>Escalation Schedule</h2>
        </div>
        <div style={{ padding: "8px 24px" }}>
          <Toggle
            label="Reminder at 3 Days Overdue"
            description="Send a friendly reminder email 3 days after the due date"
            value={settings.reminder3Days}
            onChange={function () { handleToggle("reminder3Days"); }}
          />
          <Toggle
            label="Reminder at 7 Days Overdue"
            description="Send a firmer reminder email 7 days after the due date"
            value={settings.reminder7Days}
            onChange={function () { handleToggle("reminder7Days"); }}
          />
          <Toggle
            label="Escalation Alert at 14 Days"
            description="Notify yourself via email when an invoice is 14+ days overdue"
            value={settings.escalationAlert14Days}
            onChange={function () { handleToggle("escalationAlert14Days"); }}
          />
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600" }}>Your Information</h2>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>Your Name</label>
            <input
              type="text"
              value={settings.freelancerName}
              onChange={function (e) { handleTextChange("freelancerName", e.target.value); }}
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>Your Email</label>
            <input
              type="email"
              value={settings.freelancerEmail}
              onChange={function (e) { handleTextChange("freelancerEmail", e.target.value); }}
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>Reminder Tone</label>
            <select
              value={settings.reminderTone}
              onChange={function (e) { handleTextChange("reminderTone", e.target.value); }}
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: "white" }}
            >
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="firm">Firm</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>Timezone</label>
            <select
              value={settings.reminderTimezone}
              onChange={function (e) { handleTextChange("reminderTimezone", e.target.value); }}
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: "white" }}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600" }}>Automation</h2>
        </div>
        <div style={{ padding: "8px 24px" }}>
          <Toggle
            label="Auto-Mark as Overdue"
            description="Automatically update invoice status to OVERDUE when the due date passes"
            value={settings.autoMarkOverdue}
            onChange={function () { handleToggle("autoMarkOverdue"); }}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          style={{ background: "#4f46e5", color: "white", padding: "10px 24px", borderRadius: "8px", fontWeight: "500", border: "none", cursor: "pointer", fontSize: "14px" }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
