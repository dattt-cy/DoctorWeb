/**
 * Cấu hình site dùng chung cho SEO (metadata, sitemap, JSON-LD).
 * Khi deploy domain thật, đặt biến môi trường NEXT_PUBLIC_SITE_URL = "https://tenmien-cua-ban.vn"
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://phongkhamnhivita.vn"
).replace(/\/$/, "");

export const SITE = {
  name: "Phòng khám Nhi Vita",
  shortName: "Nhi Vita",
  doctor: "ThS.BS. Nguyễn Thị Phương Thảo",
  locale: "vi_VN",
  /** Khu vực phục vụ — phục vụ SEO địa phương */
  area: {
    street: "522 Phạm Hùng",
    ward: "Hòa Xuân",
    district: "Cẩm Lệ",
    city: "Đà Nẵng",
    region: "Đà Nẵng",
    country: "VN",
    /** Toạ độ gần đúng khu Hòa Xuân, Cẩm Lệ, Đà Nẵng */
    geo: { lat: 15.9886, lng: 108.2353 },
  },
  ogImage: "/images/bac-si.jpg",
} as const;

/** Trả về URL tuyệt đối từ một path tương đối */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
