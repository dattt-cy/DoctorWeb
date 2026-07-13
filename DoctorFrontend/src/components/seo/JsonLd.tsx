import { SITE, SITE_URL, absoluteUrl } from "@/lib/site";
import { DOCTOR_INFO } from "@/constants/doctor";

/**
 * Structured data Schema.org cho SEO địa phương.
 * Khai báo bác sĩ (Physician) gắn với khu vực Hòa Xuân, Cẩm Lệ, Đà Nẵng
 * để Google hiểu đây là cơ sở y tế phục vụ địa phương.
 */
export function ClinicJsonLd() {
  const phone = DOCTOR_INFO.phone.replace(/[.\s]/g, "");
  const tel = `+84${phone.replace(/^0/, "")}`;

  const data = {
    "@context": "https://schema.org",
    "@type": ["Physician", "MedicalBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}/#clinic`,
    name: `${SITE.name} — ${SITE.doctor}`,
    alternateName: SITE.doctor,
    url: SITE_URL,
    image: absoluteUrl(SITE.ogImage),
    description:
      "Bác sĩ Nhi khoa tại 522 Phạm Hùng, Hòa Xuân, Cẩm Lệ, Đà Nẵng. Khám và tư vấn dinh dưỡng, hô hấp và chăm sóc sức khỏe trẻ em.",
    medicalSpecialty: "Pediatric",
    telephone: tel,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE.area.street}, ${SITE.area.ward}`,
      addressLocality: SITE.area.district,
      addressRegion: SITE.area.city,
      addressCountry: SITE.area.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.area.geo.lat,
      longitude: SITE.area.geo.lng,
    },
    areaServed: [
      { "@type": "City", name: "Đà Nẵng" },
      { "@type": "AdministrativeArea", name: "Hòa Xuân, Cẩm Lệ, Đà Nẵng" },
    ],
    availableService: DOCTOR_INFO.currentPositions.map((s) => ({
      "@type": "MedicalProcedure",
      name: s,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "12:00",
      },
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Trường Đại học Y Dược, Đại học Huế",
    },
    worksFor: {
      "@type": "Hospital",
      name: DOCTOR_INFO.hospital,
    },
    sameAs: [DOCTOR_INFO.socialLinks.facebook].filter((u) => u && u !== "#"),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
