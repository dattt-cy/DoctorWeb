import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NhiVita – Phòng khám Nhi khoa",
    short_name: "NhiVita",
    description: "Phòng khám Nhi tại Hòa Xuân, Cẩm Lệ, Đà Nẵng.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f97316",
    icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  };
}
