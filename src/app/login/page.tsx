"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [error, setError] = useState("");
  var [loading, setLoading] = useState(false);
  var [darkMode, setDarkMode] = useState(false);

  useEffect(function () {
    function readTheme() {
      setDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
    }
    readTheme();
    window.addEventListener("themechange", readTheme);
    return function () { window.removeEventListener("themechange", readTheme); };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      var res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });

      var data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  var bg = darkMode ? "#0f172a" : "linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)";
  var cardBg = darkMode ? "#1e293b" : "white";
  var borderColor = darkMode ? "#334155" : "#e5e7eb";
  var textColor = darkMode ? "#e2e8f0" : "#111827";
  var secondaryText = darkMode ? "#94a3b8" : "#6b7280";
  var labelColor = darkMode ? "#cbd5e1" : "#374151";
  var inputBg = darkMode ? "#0f172a" : "white";
  var inputBorder = darkMode ? "#475569" : "#d1d5db";

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: bg }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ background: "#4f46e5", color: "white", fontWeight: "bold", borderRadius: "8px", padding: "6px 14px", fontSize: "18px" }}>CF</div>
            <span style={{ fontSize: "24px", fontWeight: "bold", color: textColor }}>CollectFlow</span>
          </Link>
          <p style={{ color: secondaryText, fontSize: "14px", marginTop: "8px" }}>Sign in to manage your invoices</p>
        </div>

        <div style={{ background: cardBg, borderRadius: "12px", border: "1px solid " + borderColor, padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "24px", color: textColor }}>Welcome back</h1>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", color: "#991b1b", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "6px", color: labelColor }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={function (e) { setEmail(e.target.value); }}
                style={{ width: "100%", border: "1px solid " + inputBorder, borderRadius: "8px", padding: "10px 12px", fontSize: "14px", boxSizing: "border-box", outline: "none", background: inputBg, color: textColor }}
                placeholder="you@example.com"
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "6px", color: labelColor }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={function (e) { setPassword(e.target.value); }}
                style={{ width: "100%", border: "1px solid " + inputBorder, borderRadius: "8px", padding: "10px 12px", fontSize: "14px", boxSizing: "border-box", outline: "none", background: inputBg, color: textColor }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#818cf8" : "#4f46e5",
                color: "white",
                padding: "10px 16px",
                borderRadius: "8px",
                fontWeight: "500",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: secondaryText }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#4f46e5", fontWeight: "500", textDecoration: "none" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}