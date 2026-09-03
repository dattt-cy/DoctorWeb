import React from "react";
import AdminChrome from "@/components/admin/AdminChrome";

export const metadata = {
  title: { absolute: "Quản trị | NhiVita" },
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminChrome>{children}</AdminChrome>;
}
