"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

var navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/dashboard/escalations", label: "Escalations", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" },
  { href: "/dashboard/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  var pathname = usePathname();
  var router = useRouter();
  var [userEmail, setUserEmail] = useState("");
  var [userName, setUserName] = useState("");
  var [darkMode, setDarkMode] = useState(false);
  var [loading, setLoading] = useState(true);

  useEffect(function () {
    function readTheme() {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      setDarkMode(isDark);
    }
    readTheme();
    window.addEventListener("themechange", readTheme);

    fetch("/api/auth/user")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.email) {
          setUserEmail(data.email);
          setUserName(data.name || "");
        }
        setLoading(false);
      })
      .catch(function () { setLoading(false); });

    return function () { window.removeEventListener("themechange", readTheme); };
  }, []);

  function toggleDarkMode() {
    var newMode = !darkMode;
    if (newMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
    setDarkMode(newMode);
    window.dispatchEvent(new Event("themechange"));
  }

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  var displayEmail = userEmail || "user@example.com";
  var displayName = userName || userEmail.split("@")[0] || "User";

  var bgColor = darkMode ? "#0f172a" : "#f9fafb";
  var sidebarBg = darkMode ? "#0f172a" : "#1e1b4b";
  var cardBg = darkMode ? "#1e293b" : "white";
  var borderColor = darkMode ? "#334155" : "#e5e7eb";
  var textColor = darkMode ? "#e2e8f0" : "#111827";
  var secondaryText = darkMode ? "#94a3b8" : "#6b7280";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bgColor }}>
      <aside style={{ width: "240px", background: sidebarBg, color: "white", display: "flex", flexDirection: "column", flexShrink: 0, borderRight: darkMode ? "1px solid #1e293b" : "none" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Link href="/dashboard" style={{ textDecoration: "none", color: "white", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "#4f46e5", color: "white", fontWeight: "bold", borderRadius: "8px", padding: "4px 12px", fontSize: "14px" }}>CF</div>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>CollectFlow</span>
          </Link>
        </div>
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map(function(item) {
            var active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  textDecoration: "none",
                  color: active ? "white" : "#a5b4fc",
                  background: active ? "#4f46e5" : "transparent",
                  fontSize: "14px",
                  fontWeight: active ? "600" : "400",
                  transition: "background 0.15s",
                }}
              >
                <svg style={{ width: "20px", height: "20px", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button
            onClick={toggleDarkMode}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: "rgba(255,255,255,0.08)",
              color: "#a5b4fc",
              fontSize: "13px",
              width: "100%",
              marginBottom: "4px",
            }}
          >
            {darkMode ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600", color: "white", flexShrink: 0 }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</div>
              <div style={{ fontSize: "11px", color: "#818cf8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayEmail}</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              background: "transparent",
              color: "#a5b4fc",
              fontSize: "13px",
              textAlign: "left",
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: bgColor, color: textColor }}>
        {children}
      </div>
    </div>
  );
}