import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SITE, SITE_URL, absoluteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bác sĩ Nhi Hòa Xuân, Đà Nẵng — ThS.BS. Nguyễn Thị Phương Thảo",
    template: "%s | Phòng khám Nhi Vita",
  },
  description:
    "Bác sĩ Nhi khoa tại 522 Phạm Hùng, Hòa Xuân, Cẩm Lệ, Đà Nẵng. ThS.BS. Nguyễn Thị Phương Thảo khám và tư vấn dinh dưỡng, hô hấp, chăm sóc sức khỏe trẻ em. Hotline/Zalo: 0919.083.332.",
  keywords: [
    "bác sĩ nhi Hòa Xuân",
    "bác sĩ nhi Đà Nẵng",
    "phòng khám nhi Hòa Xuân",
    "bác sĩ nhi khoa Cẩm Lệ",
    "khám nhi Hòa Xuân",
    "phòng khám nhi 522 Phạm Hùng",
    "tư vấn sức khỏe trẻ em Đà Nẵng",
    "ThS.BS. Nguyễn Thị Phương Thảo",
  ],
  authors: [{ name: SITE.doctor }],
  creator: SITE.doctor,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE_URL,
    siteName: SITE.name,
    title: "Bác sĩ Nhi Hòa Xuân, Đà Nẵng — ThS.BS. Nguyễn Thị Phương Thảo",
    description:
      "Bác sĩ Nhi khoa tại 522 Phạm Hùng, Hòa Xuân, Đà Nẵng. Khám và tư vấn dinh dưỡng, chăm sóc sức khỏe trẻ em. Hotline/Zalo: 0919.083.332.",
    images: [{ url: absoluteUrl(SITE.ogImage), width: 1200, height: 630, alt: SITE.doctor }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bác sĩ Nhi Hòa Xuân, Đà Nẵng — ThS.BS. Nguyễn Thị Phương Thảo",
    description:
      "Bác sĩ Nhi khoa tại Hòa Xuân, Đà Nẵng. Nhận khám bệnh tại nhà, tư vấn chăm sóc sức khỏe trẻ em.",
    images: [absoluteUrl(SITE.ogImage)],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
