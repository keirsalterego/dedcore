"use client";
import React from "react";

export default function GradientBackground() {
  React.useEffect(() => {
    // Set default center if not already set
    document.body.style.setProperty("--gradient-x", "50%");
    document.body.style.setProperty("--gradient-y", "50%");
    const handleMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      document.body.style.setProperty("--gradient-x", `${x * 100}%`);
      document.body.style.setProperty("--gradient-y", `${y * 100}%`);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 animate-hue-rotate"
      style={{
        background:
          "radial-gradient(ellipse 140% 300% at var(--gradient-x,50%) var(--gradient-y,50%), #00eaff44 0%, #00eaff22 40%, #1e293b 100%)",
        transition: "background 0.3s cubic-bezier(.4,2,.6,1)",
      }}
    />
  );
} 