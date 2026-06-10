"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  var [settings, setSettings] = useState({
    emailReminders: true,
    smsReminders: false,
    reminder3Days: true,
    reminder7Days: true,
    escalationAlert14Days: true,
    freelancerName: "",
    freelancerEmail: "",
    reminderTone: "friendly",
    autoMarkOverdue: true,
    reminderTimezone: "America/New_York",
  });
  var [saved, setSaved] = useState(false);
  var [darkMode, setDarkMode] = useState(false);

  useEffect(function () {
    function readTheme() {
      setDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
    }
    readTheme();
    window.addEventListener("themechange", readTheme);

    fetch("/api/auth/user")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.email) {
          var name = data.name || "";
          var email = data.email || "";
          setSettings(function (prev) {
            return { freelancerName: name, freelancerEmail: email, emailReminders: prev.emailReminders, smsReminders: prev.smsReminders, reminder3Days: prev.reminder3Days, reminder7Days: prev.reminder7Days, escalationAlert14Days: prev.escalationAlert14Days, reminderTone: prev.reminderTone, autoMarkOverdue: prev.autoMarkOverdue, reminderTimezone: prev.reminderTimezone };
          });
        }
      })
      .catch(function () {});

    return function () { window.removeEventListener("themechange", readTheme); };
  }, []);

  function handleToggle(key: string) {
    setSettings(function (prev) {
      var newVal = !prev[key as keyof typeof prev];
      var updated = Object.assign({}, prev);
      (updated as any)[key] = newVal;
      return updated;
    });
    setSaved(false);
  }

  function handleTextChange(key: string, value: string) {
    setSettings(function (prev) {
      var updated = Object.assign({}, prev);
      (updated as any)[key] = value;
      return updated;
    });
    setSaved(false);
  }

  function toggleDarkMode() {
    var newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("themechange"));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(function () { setSaved(false); }, 3000);
  }

  var cardBg = darkMode ? "#1f2937" : "white";
  var borderColor = darkMode ? "#374151" : "#e5e7eb";
  var textColor = darkMode ? "#f3f4f6" : "#111827";
  var secondaryText = darkMode ? "#9ca3af" : "#6b7280";
  var inputBg = darkMode ? "#374151" : "white";

  return (
    <div style={{ padding: "24px 32px", maxWidth: "800px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: textColor }}>Settings</h1>
        <p style={{ fontSize: "14px", color: secondaryText, marginTop: "4px" }}>Configure your notification preferences and account settings</p>
      </div>

      {saved && (
        <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#166534", fontSize: "14px" }}>
          Settings saved successfully!
        </div>
      )}

      <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, marginBottom: "24px" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid " + borderColor }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: textColor }}>Appearance</h2>
        </div>
        <div style={{ padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: textColor }}>Dark Mode</div>
              <div style={{ fontSize: "13px", color: secondaryText, marginTop: "2px" }}>Switch between light and dark theme</div>
            </div>
            <button
              onClick={toggleDarkMode}
              style={{
                width: "44px",
                height: "24px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                position: "relative",
                background: darkMode ? "#4f46e5" : "#d1d5db",
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
                left: darkMode ? "22px" : "2px",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, marginBottom: "24px" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid " + borderColor }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: textColor }}>Notification Channels</h2>
        </div>
        <div style={{ padding: "8px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid " + (darkMode ? "#374151" : "#f3f4f6") }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: textColor }}>Email Reminders</div>
              <div style={{ fontSize: "13px", color: secondaryText, marginTop: "2px" }}>Send reminder emails to clients when invoices are overdue</div>
            </div>
            <button onClick={function () { handleToggle("emailReminders"); }} style={{ width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer", position: "relative", background: settings.emailReminders ? "#4f46e5" : "#d1d5db", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: settings.emailReminders ? "22px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: textColor }}>SMS Reminders</div>
              <div style={{ fontSize: "13px", color: secondaryText, marginTop: "2px" }}>Send text message reminders to clients via Twilio</div>
            </div>
            <button onClick={function () { handleToggle("smsReminders"); }} style={{ width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer", position: "relative", background: settings.smsReminders ? "#4f46e5" : "#d1d5db", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: settings.smsReminders ? "22px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, marginBottom: "24px" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid " + borderColor }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: textColor }}>Escalation Schedule</h2>
        </div>
        <div style={{ padding: "8px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid " + (darkMode ? "#374151" : "#f3f4f6") }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: textColor }}>Reminder at 3 Days Overdue</div>
              <div style={{ fontSize: "13px", color: secondaryText, marginTop: "2px" }}>Send a friendly reminder email 3 days after the due date</div>
            </div>
            <button onClick={function () { handleToggle("reminder3Days"); }} style={{ width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer", position: "relative", background: settings.reminder3Days ? "#4f46e5" : "#d1d5db", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: settings.reminder3Days ? "22px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid " + (darkMode ? "#374151" : "#f3f4f6") }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: textColor }}>Reminder at 7 Days Overdue</div>
              <div style={{ fontSize: "13px", color: secondaryText, marginTop: "2px" }}>Send a firmer reminder email 7 days after the due date</div>
            </div>
            <button onClick={function () { handleToggle("reminder7Days"); }} style={{ width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer", position: "relative", background: settings.reminder7Days ? "#4f46e5" : "#d1d5db", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: settings.reminder7Days ? "22px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: textColor }}>Escalation Alert at 14 Days</div>
              <div style={{ fontSize: "13px", color: secondaryText, marginTop: "2px" }}>Notify yourself via email when an invoice is 14+ days overdue</div>
            </div>
            <button onClick={function () { handleToggle("escalationAlert14Days"); }} style={{ width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer", position: "relative", background: settings.escalationAlert14Days ? "#4f46e5" : "#d1d5db", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: settings.escalationAlert14Days ? "22px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, marginBottom: "24px" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid " + borderColor }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: textColor }}>Your Information</h2>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: textColor }}>Your Name</label>
            <input
              type="text"
              value={settings.freelancerName}
              onChange={function (e) { handleTextChange("freelancerName", e.target.value); }}
              style={{ width: "100%", border: "1px solid " + borderColor, borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: inputBg, color: textColor, boxSizing: "border-box" }}
              placeholder="Your name"
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: textColor }}>Your Email</label>
            <input
              type="email"
              value={settings.freelancerEmail}
              readOnly
              style={{ width: "100%", border: "1px solid " + borderColor, borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: darkMode ? "#2d3748" : "#f9fafb", color: secondaryText, boxSizing: "border-box", cursor: "not-allowed" }}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: textColor }}>Reminder Tone</label>
            <select
              value={settings.reminderTone}
              onChange={function (e) { handleTextChange("reminderTone", e.target.value); }}
              style={{ width: "100%", border: "1px solid " + borderColor, borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: inputBg, color: textColor, boxSizing: "border-box" }}
            >
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="firm">Firm</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px", color: textColor }}>Timezone</label>
            <select
              value={settings.reminderTimezone}
              onChange={function (e) { handleTextChange("reminderTimezone", e.target.value); }}
              style={{ width: "100%", border: "1px solid " + borderColor, borderRadius: "8px", padding: "8px 12px", fontSize: "14px", background: inputBg, color: textColor, boxSizing: "border-box" }}
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

      <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, marginBottom: "24px" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid " + borderColor }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: textColor }}>Automation</h2>
        </div>
        <div style={{ padding: "8px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: textColor }}>Auto-Mark as Overdue</div>
              <div style={{ fontSize: "13px", color: secondaryText, marginTop: "2px" }}>Automatically update invoice status to OVERDUE when the due date passes</div>
            </div>
            <button onClick={function () { handleToggle("autoMarkOverdue"); }} style={{ width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer", position: "relative", background: settings.autoMarkOverdue ? "#4f46e5" : "#d1d5db", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: settings.autoMarkOverdue ? "22px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
            </button>
          </div>
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
