"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

var DEMO_USER_ID = "demo-user-id";

var navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/dashboard/escalations", label: "Escalations", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" },
  { href: "/dashboard/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  var pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <aside style={{ width: "240px", background: "#1e1b4b", color: "white", display: "flex", flexDirection: "column", flexShrink: 0 }}>
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
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "12px", color: "#a5b4fc" }}>
          <div style={{ marginBottom: "4px" }}>Demo User</div>
          <div style={{ color: "#818cf8", fontSize: "11px" }}>{DEMO_USER_ID}</div>
        </div>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
