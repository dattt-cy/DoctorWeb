"use client";

import Link from "next/link";

interface VitaLogoProps {
  theme?: "light" | "dark";
  href?: string | null;
  size?: "sm" | "md";
}

const cfg = {
  sm: { badge: 42, cross: 18, vitaFs: "1.15rem", subFs: "0.57rem", gap: 11, radius: 12 },
  md: { badge: 52, cross: 22, vitaFs: "1.4rem",  subFs: "0.63rem", gap: 14, radius: 14 },
};

export function VitaLogo({ theme = "light", href = "/", size = "md" }: VitaLogoProps) {
  const isDark = theme === "dark";
  const c = cfg[size];

  const inner = (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: c.gap, textDecoration: "none" }}
      className="group"
    >
      {/* ── Badge ── */}
      <span
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: c.badge,
          height: c.badge,
          borderRadius: c.radius,
          background: "linear-gradient(145deg, #ff9240 0%, #e8702a 55%, #cc5d1a 100%)",
          flexShrink: 0,
          boxShadow: isDark
            ? "0 6px 20px rgba(232,112,42,0.5)"
            : "0 4px 16px rgba(232,112,42,0.38), inset 0 1px 0 rgba(255,255,255,0.25)",
          overflow: "hidden",
          transition: "transform 200ms ease, box-shadow 200ms ease",
        }}
        className="group-hover:scale-105 group-hover:shadow-orange-400"
      >
        {/* Gloss overlay */}
        <span
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "55%",
            background: "linear-gradient(rgba(255,255,255,0.2), transparent)",
            borderRadius: `${c.radius}px ${c.radius}px 0 0`,
            pointerEvents: "none",
          }}
        />

        {/* Medical cross — 2 clean rounded rects */}
        <svg
          width={c.cross}
          height={c.cross}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Vertical bar */}
          <rect x="9" y="1" width="6" height="22" rx="3" fill="white" />
          {/* Horizontal bar */}
          <rect x="1" y="9" width="22" height="6" rx="3" fill="white" />
          {/* Tiny heart at center — warmth */}
          <path
            d="M12 13.8 C11.4 13.1 10 13.1 10 14.2 C10 15 12 16.4 12 16.4 C12 16.4 14 15 14 14.2 C14 13.1 12.6 13.1 12 13.8Z"
            fill="rgba(232,112,42,0.7)"
          />
        </svg>
      </span>

      {/* ── Wordmark ── */}
      <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* VITA + NHI inline */}
        <span style={{ display: "flex", alignItems: "baseline", gap: 5, lineHeight: 1 }}>
          <span
            style={{
              fontSize: c.vitaFs,
              fontWeight: 900,
              letterSpacing: "0.08em",
              color: isDark ? "#ffffff" : "#1a1a18",
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              lineHeight: 1,
            }}
          >
            VITA
          </span>
          {/* Orange separator dot */}
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: "var(--color-primary)",
              display: "inline-block",
              flexShrink: 0,
              marginBottom: 2,
            }}
          />
          <span
            style={{
              fontSize: `calc(${c.vitaFs} * 0.72)`,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "var(--color-primary)",
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              lineHeight: 1,
            }}
          >
            NHI
          </span>
        </span>

        {/* Subtitle */}
        <span
          style={{
            fontSize: c.subFs,
            fontWeight: 500,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: isDark ? "rgba(255,255,255,0.45)" : "#9ca3af",
            lineHeight: 1,
          }}
        >
          Phòng khám chuyên khoa
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Trang chủ Phòng Khám Nhi VITA" style={{ display: "inline-flex" }}>
        {inner}
      </Link>
    );
  }

  return inner;
}
