"use client";

import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  var [dark, setDark] = useState(false);

  useEffect(function () {
    var saved = localStorage.getItem("theme");
    var isDark = saved === "dark" || document.documentElement.getAttribute("data-theme") === "dark";
    setDark(isDark);
  }, []);

  function toggle() {
    var newDark = !dark;
    setDark(newDark);
    if (newDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("themechange"));
  }

  return (
    <button
      onClick={toggle}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 9999,
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        border: dark ? "1px solid #475569" : "1px solid #e5e7eb",
        background: dark ? "#1e293b" : "white",
        color: dark ? "#fbbf24" : "#6b7280",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: dark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
        fontSize: "20px",
        transition: "all 0.2s",
      }}
    >
      {dark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
    </button>
  );
}