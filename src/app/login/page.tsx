"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  var router = useRouter();
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [error, setError] = useState("");
  var [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    var { error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ background: "#4f46e5", color: "white", fontWeight: "bold", borderRadius: "8px", padding: "6px 14px", fontSize: "18px" }}>CF</div>
            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>CollectFlow</span>
          </Link>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "8px" }}>Sign in to manage your invoices</p>
        </div>

        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "24px", color: "#111827" }}>Welcome back</h1>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", color: "#991b1b", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "6px", color: "#374151" }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={function (e) { setEmail(e.target.value); }}
                style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                placeholder="you@example.com"
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "6px", color: "#374151" }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={function (e) { setPassword(e.target.value); }}
                style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
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

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#4f46e5", fontWeight: "500", textDecoration: "none" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
