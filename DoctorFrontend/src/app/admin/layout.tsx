import React from "react";
import AdminChrome from "@/components/admin/AdminChrome";

export const metadata = {
  title: "Quản trị nội dung - DoctorWeb",
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminChrome>{children}</AdminChrome>;
}
