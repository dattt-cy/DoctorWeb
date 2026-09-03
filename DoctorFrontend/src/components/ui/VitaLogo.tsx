"use client";

import Image from "next/image";
import Link from "next/link";

interface VitaLogoProps {
  theme?: "light" | "dark";
  href?: string | null;
  size?: "sm" | "md";
}

const sizes = {
  sm: { width: 54, height: 57 },
  md: { width: 78, height: 82 },
};

export function VitaLogo({ theme = "light", href = "/", size = "md" }: VitaLogoProps) {
  const dimensions = sizes[size];
  const logo = (
    <Image
      src="/images/brand/vita-logo.png"
      alt="VITA – Phòng khám Nhi"
      width={dimensions.width}
      height={dimensions.height}
      priority={size === "sm"}
      className="h-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
      style={{
        width: dimensions.width,
        filter: theme === "dark" ? "drop-shadow(0 4px 12px rgba(0,0,0,0.18))" : undefined,
      }}
    />
  );

  if (!href) return logo;

  return (
    <Link href={href} aria-label="Trang chủ Phòng khám Nhi VITA" className="group inline-flex shrink-0">
      {logo}
    </Link>
  );
}
