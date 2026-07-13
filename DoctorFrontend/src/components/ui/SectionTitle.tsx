interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
  className = "",
}: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center items-center" : "items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow && (
        <span
          className="text-xs font-semibold tracking-[0.18em] uppercase"
          style={{ color: "var(--color-accent)" }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className="font-display text-balance"
        style={{
          fontSize: "var(--text-3xl)",
          color: light ? "var(--color-white)" : "var(--color-text)",
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-balance max-w-[54ch]"
          style={{
            color: light ? "rgba(255,255,255,0.75)" : "var(--color-text-secondary)",
            fontSize: "var(--text-lg)",
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
