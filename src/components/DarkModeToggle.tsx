"use client";

import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  var [dark, setDark] = useState(false);

  useEffect(function () {
    var saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      setDark(true);
    }
  }, []);

  function toggle() {
    if (dark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
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
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "1px solid #e5e7eb",
        background: dark ? "#1e293b" : "white",
        color: dark ? "#fbbf24" : "#6b7280",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        fontSize: "18px",
        transition: "all 0.2s",
      }}
    >
      {dark ? "\u2600" : "\u263E"}
    </button>
  );
}