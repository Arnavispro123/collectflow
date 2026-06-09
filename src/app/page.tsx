"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  var [darkMode, setDarkMode] = useState(false);

  useEffect(function () {
    function readTheme() {
      setDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
    }
    readTheme();
    window.addEventListener("themechange", readTheme);
    return function () { window.removeEventListener("themechange", readTheme); };
  }, []);

  var bg = darkMode ? "#0f172a" : "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)";
  var cardBg = darkMode ? "#1e293b" : "white";
  var borderColor = darkMode ? "#334155" : "#e5e7eb";
  var textColor = darkMode ? "#e2e8f0" : "#111827";
  var secondaryText = darkMode ? "#94a3b8" : "#6b7280";
  var secondaryBtnBg = darkMode ? "#1e293b" : "white";

  return (
    <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", background: bg }}>
      <main style={{ maxWidth: "640px", width: "100%", padding: "0 24px", textAlign: "center" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "bold", letterSpacing: "-0.025em", color: textColor }}>
            <span style={{ color: "#4f46e5" }}>Collect</span>Flow
          </h1>
          <p style={{ marginTop: "16px", fontSize: "20px", color: secondaryText }}>Never miss a payment again. Automated invoice reminders for freelancers.</p>
        </div>
        <div style={{ marginBottom: "48px", display: "grid", gap: "24px", gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "24px", textAlign: "left", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontWeight: "600", color: textColor }}>Track Invoices</h3>
            <p style={{ marginTop: "4px", fontSize: "14px", color: secondaryText }}>See all your outstanding invoices at a glance.</p>
          </div>
          <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "24px", textAlign: "left", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontWeight: "600", color: textColor }}>Auto Reminders</h3>
            <p style={{ marginTop: "4px", fontSize: "14px", color: secondaryText }}>Automatic email reminders at 3, 7, and 14 days overdue.</p>
          </div>
          <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "24px", textAlign: "left", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontWeight: "600", color: textColor }}>Get Alerts</h3>
            <p style={{ marginTop: "4px", fontSize: "14px", color: secondaryText }}>Escalation alerts when payments are severely overdue.</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/login" style={{ display: "inline-block", background: "#4f46e5", color: "white", padding: "12px 32px", borderRadius: "8px", fontWeight: "500", textDecoration: "none", fontSize: "16px" }}>
            Sign In
          </Link>
          <Link href="/signup" style={{ display: "inline-block", background: secondaryBtnBg, color: "#4f46e5", padding: "12px 32px", borderRadius: "8px", fontWeight: "500", textDecoration: "none", fontSize: "16px", border: "1px solid " + borderColor }}>
            Create Account
          </Link>
        </div>
      </main>
    </div>
  );
}