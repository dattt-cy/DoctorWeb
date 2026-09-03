"use client";

import Image from "next/image";
import Link from "next/link";

interface VitaLogoProps {
  theme?: "light" | "dark";
  href?: string | null;
  size?: "sm" | "md";
}

const sizes = {
  sm: { mark: 38, text: "text-[22px]", subtitle: "text-[9px]" },
  md: { mark: 36, text: "text-[21px]", subtitle: "text-[9px]" },
};

export function VitaLogo({ theme = "light", href = "/", size = "md" }: VitaLogoProps) {
  const dimensions = sizes[size];
  const logo = (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="relative block shrink-0"
        style={{ width: dimensions.mark, height: dimensions.mark }}
        aria-hidden="true"
      >
        <Image
          src="/images/brand/vita-mark.png"
          alt=""
          width={dimensions.mark}
          height={dimensions.mark}
          priority
          className="block object-contain transition-transform duration-200 group-hover:scale-[1.03]"
        />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className={`font-black tracking-[0.08em] ${dimensions.text}`} style={{ color: theme === "dark" ? "#fff" : "#202124" }}>
          VITA <span style={{ color: "#f97316" }}>· NHI</span>
        </span>
        <span className={`mt-1 font-bold tracking-[0.16em] ${dimensions.subtitle}`} style={{ color: theme === "dark" ? "rgba(255,255,255,0.82)" : "#9ca3af" }}>
          PHÒNG KHÁM CHUYÊN KHOA
        </span>
      </span>
    </span>
  );

  if (!href) return logo;

  return (
    <Link href={href} aria-label="Trang chủ Phòng khám Nhi VITA" className="group inline-flex shrink-0">
      {logo}
    </Link>
  );
}
