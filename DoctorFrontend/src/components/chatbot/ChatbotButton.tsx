"use client";

import { useState } from "react";

export function ChatbotButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {showTooltip && (
        <div
          className="px-4 py-3 rounded-[var(--radius-lg)] text-sm max-w-52 text-center"
          style={{
            backgroundColor: "var(--color-text)",
            color: "var(--color-white)",
            boxShadow: "var(--shadow-hover)",
          }}
        >
          <p className="font-medium">Tư vấn sức khỏe AI</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
            Sắp ra mắt — đang phát triển
          </p>
        </div>
      )}

      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-[var(--duration-normal)] hover:scale-110 active:scale-95"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "white",
          boxShadow: "0 4px 20px rgba(232,112,42,0.4)",
        }}
        aria-label="Tư vấn sức khỏe AI"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h.01" />
          <path d="M12 10h.01" />
          <path d="M16 10h.01" />
        </svg>

        {/* Coming soon dot */}
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          !
        </span>
      </button>
    </div>
  );
}
