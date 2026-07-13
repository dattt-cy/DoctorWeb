"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Phone, MessageCircle, MapPin, Search } from "lucide-react";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { DOCTOR_INFO } from "@/constants/doctor";

function smoothScrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerH = document.querySelector("header")?.offsetHeight ?? 0;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH;
  window.scrollTo({ top, behavior: "smooth" });
}

const NAV_LINKS = [
  { label: "TRANG CHỦ", href: "/", sectionId: null },
  { label: "DỊCH VỤ PHÒNG KHÁM", href: "#chuyen-mon", sectionId: "chuyen-mon" },
  { label: "ĐỘI NGŨ BÁC SĨ", href: "#ve-toi", sectionId: "ve-toi" },
  { label: "TIN TỨC", href: "/blog", sectionId: null },
  { label: "LIÊN HỆ", href: "#lien-he", sectionId: "lien-he" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  // ── Scroll state: trực tiếp update data-attribute, không qua React state ──
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    el.dataset.scrolled = window.scrollY > 50 ? "true" : "false";
    // Bật transition SAU khi paint lần đầu (2 RAF = sau first paint)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.dataset.loaded = "true";
      })
    );
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        el.dataset.scrolled = window.scrollY > 50 ? "true" : "false";
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Active section tracking ──
  useEffect(() => {
    if (!isHomePage) return;
    const sectionIds = NAV_LINKS.map((l) => l.sectionId).filter(Boolean) as string[];
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [isHomePage]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, link: typeof NAV_LINKS[number]) => {
      setMenuOpen(false);
      if (link.sectionId) {
        e.preventDefault();
        if (isHomePage) {
          smoothScrollToId(link.sectionId);
        } else {
          router.push(`/#${link.sectionId}`);
        }
      }
    },
    [isHomePage, router]
  );

  useEffect(() => {
    if (isHomePage && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const timer = setTimeout(() => {
        smoothScrollToId(id);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isHomePage]);

  const scrollToBooking = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isHomePage) {
        e.preventDefault();
        smoothScrollToId("dat-lich");
      }
    },
    [isHomePage]
  );

  const isActive = (link: typeof NAV_LINKS[number]) => {
    if (link.href === "/" && pathname === "/" && !activeSection) return true;
    if (link.href === "/blog" && pathname.startsWith("/blog")) return true;
    if (link.sectionId && activeSection === link.sectionId) return true;
    return false;
  };

  return (
    <>
      {/* ── Tầng 1: Super top bar — scroll tự nhiên, không sticky ── */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-10 gap-4">

            {/* Trái: hotline + email */}
            <div className="flex items-center gap-0 text-xs divide-x" style={{ color: "var(--color-text-secondary)", "--tw-divide-opacity": "1" } as React.CSSProperties}>
              <a
                href={`tel:${DOCTOR_INFO.phone}`}
                className="flex items-center gap-1.5 pr-3 transition-colors hover:text-[var(--color-primary)]"
              >
                <Phone size={12} style={{ color: "var(--color-primary)", flexShrink: 0 }} aria-hidden />
                <span className="font-semibold" style={{ color: "var(--color-primary)" }}>{DOCTOR_INFO.phone}</span>
              </a>
              <a
                href={DOCTOR_INFO.socialLinks.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 pl-3 transition-colors hover:text-[var(--color-primary)]"
              >
                <MessageCircle size={12} style={{ flexShrink: 0 }} aria-hidden />
                Zalo: {DOCTOR_INFO.phone}
              </a>
            </div>

            {/* Phải: địa chỉ + social icons */}
            <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <span className="hidden lg:flex items-center gap-1">
                <MapPin size={11} style={{ color: "var(--color-primary)", flexShrink: 0 }} aria-hidden />
                {DOCTOR_INFO.address}
              </span>

              {/* Separator */}
              <span className="hidden lg:block w-px h-4" style={{ backgroundColor: "var(--color-border)" }} />

              <SocialIcons links={DOCTOR_INFO.socialLinks} size="sm" theme="light" />
            </div>
          </div>
        </div>
      </div>

      <header ref={headerRef} data-scrolled="false" className="sticky top-0 inset-x-0 z-50 w-full">

      {/* ── Tầng 2: Logo + search + booking ── */}
      <div
        className="nav-logobar"
        style={{
          backgroundColor: "var(--color-white)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="container h-full">
          <div className="flex items-center justify-between h-full gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div
                className="nav-logo-badge rounded-[var(--radius-md)] flex items-center justify-center text-white font-bold shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                BS
              </div>
              <div className="hidden sm:block overflow-hidden">
                <p className="font-display font-bold leading-tight truncate text-sm" style={{ color: "var(--color-text)" }}>
                  {DOCTOR_INFO.name}
                </p>
                <p className="nav-logo-sub text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>
                  {DOCTOR_INFO.specialty}
                </p>
              </div>
            </Link>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-md items-center relative">
              <input
                type="search"
                placeholder="Nhập từ khoá tìm kiếm"
                className="w-full pl-4 pr-11 py-2.5 rounded-[var(--radius-full)] text-sm transition-colors duration-150"
                style={{
                  border: "1.5px solid var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                  color: "var(--color-text)",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
              <button
                aria-label="Tìm kiếm"
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                style={{ color: "var(--color-primary)" }}
              >
                <Search size={17} aria-hidden />
              </button>
            </div>

            {/* Booking + hamburger */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={isHomePage ? "#dat-lich" : "/#dat-lich"}
                onClick={scrollToBooking}
                className="nav-booking-btn hidden sm:inline-flex items-center justify-center font-bold text-white rounded-[var(--radius-md)] tracking-wide transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                ĐẶT LỊCH HẸN
              </Link>

              <button
                className="md:hidden flex flex-col justify-center gap-1.5 p-2 -mr-1"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Mở menu"
              >
                {[
                  menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none",
                  undefined,
                  menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none",
                ].map((transform, i) =>
                  transform !== undefined ? (
                    <span
                      key={i}
                      className="block w-5 h-0.5 rounded-full transition-all duration-300 origin-center"
                      style={{ backgroundColor: "var(--color-text)", transform }}
                    />
                  ) : (
                    <span
                      key={i}
                      className="block w-5 h-0.5 rounded-full transition-all duration-300"
                      style={{ backgroundColor: "var(--color-text)", opacity: menuOpen ? 0 : 1 }}
                    />
                  )
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tầng 3: Navigation bar (teal) ── */}
      <div className="hidden md:block w-full" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="container">
          <nav className="flex items-center" style={{ height: "44px" }}>
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="relative h-full flex items-center px-5 text-xs font-semibold tracking-wide cursor-pointer select-none group"
                  style={{
                    color: active ? "var(--color-accent)" : "rgba(255,255,255,0.88)",
                    borderBottom: `2px solid ${active ? "var(--color-accent)" : "transparent"}`,
                    transition: "color 150ms ease, border-color 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = "#fff";
                      el.style.borderBottomColor = "rgba(255,255,255,0.35)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = "rgba(255,255,255,0.88)";
                      el.style.borderBottomColor = "transparent";
                    }
                  }}
                >
                  {link.label}
                </a>
              );
            })}

          </nav>
        </div>
      </div>

      {/* ── Mobile menu (CSS transition, không dùng conditional render) ── */}
      <div
        style={{
          maxHeight: menuOpen ? "480px" : "0px",
          overflow: "hidden",
          transition: "max-height 350ms cubic-bezier(0.4,0,0.2,1)",
          backgroundColor: "rgba(250,250,247,0.98)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--color-border)",
          willChange: "max-height",
        }}
      >
        <nav className="container flex flex-col py-3 gap-0.5">
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            return (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-3 rounded-[var(--radius-md)] text-sm font-medium cursor-pointer transition-colors"
                style={{
                  color: active ? "var(--color-primary)" : "var(--color-text-secondary)",
                  backgroundColor: active ? "var(--color-primary-light)" : "transparent",
                }}
                onClick={(e) => handleNavClick(e, link)}
              >
                {link.label}
              </a>
            );
          })}
          <div
            className="px-4 pt-3 pb-2 flex flex-col gap-3 border-t mt-1"
            style={{ borderColor: "var(--color-border)" }}
          >
            <Link
              href={isHomePage ? "#dat-lich" : "/#dat-lich"}
              onClick={(e) => { setMenuOpen(false); scrollToBooking(e); }}
              className="flex items-center justify-center font-bold text-sm text-white rounded-[var(--radius-md)] py-3 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              ĐẶT LỊCH HẸN
            </Link>
            <div className="flex items-center justify-between">
              <a href={`tel:${DOCTOR_INFO.phone}`} className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                <Phone size={13} aria-hidden /> {DOCTOR_INFO.phone}
              </a>
              <SocialIcons links={DOCTOR_INFO.socialLinks} size="sm" theme="light" />
            </div>
          </div>
        </nav>
      </div>

    </header>
    </>
  );
}
