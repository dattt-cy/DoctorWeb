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
    <div className={`flex flex-col gap-4 ${alignClass} ${className}`}>
      {eyebrow && (
        <span
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase"
          style={{ color: "var(--color-accent)" }}
        >
          <span className="h-px w-7 bg-current" aria-hidden />
          {eyebrow}
        </span>
      )}
      <h2
        className="font-display text-balance"
        style={{
          fontSize: "var(--text-3xl)",
          color: light ? "var(--color-white)" : "var(--color-text)",
          fontWeight: 750,
          lineHeight: 1.12,
          letterSpacing: "-0.035em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-balance max-w-[54ch]"
          style={{
            color: light ? "rgba(255,255,255,0.75)" : "var(--color-text-secondary)",
            fontSize: "1rem",
            lineHeight: 1.75,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
