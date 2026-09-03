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
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "dDox9g1NOk31nSoGkKSdLFmIpptMm5MebN4QuILhTfE",
  },
  title: {
    default: "NhiVita – Bác sĩ Nhi Hòa Xuân, Đà Nẵng",
    template: "%s | NhiVita",
  },
  description:
    "Phòng khám Nhi Vita tại 522 Phạm Hùng, Hòa Xuân, Đà Nẵng. ThS.BS. Nguyễn Thị Phương Thảo khám và tư vấn sức khỏe trẻ em.",
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
    title: "NhiVita – Bác sĩ Nhi Hòa Xuân, Đà Nẵng",
    description:
      "Phòng khám Nhi Vita tại 522 Phạm Hùng, Hòa Xuân, Đà Nẵng. Khám và tư vấn sức khỏe trẻ em.",
    images: [{ url: absoluteUrl(SITE.ogImage), width: 1200, height: 630, alt: SITE.doctor }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NhiVita – Bác sĩ Nhi Hòa Xuân, Đà Nẵng",
    description:
      "Khám Nhi tại Hòa Xuân, Cẩm Lệ, Đà Nẵng cùng ThS.BS. Nguyễn Thị Phương Thảo.",
    images: [absoluteUrl(SITE.ogImage)],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
