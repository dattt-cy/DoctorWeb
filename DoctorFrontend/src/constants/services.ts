import type { Service } from "@/types/service";

export const SERVICES: Service[] = [
  {
    id: "ho-hap",
    title: "Hô hấp",
    description: "Khám và điều trị các bệnh lý đường hô hấp thường gặp ở trẻ em.",
    icon: "lungs",
    featured: true,
    size: "large",
  },
  {
    id: "tieu-hoa",
    title: "Tiêu hóa",
    description: "Tư vấn và điều trị rối loạn tiêu hóa, đau bụng, tiêu chảy và táo bón ở trẻ.",
    icon: "nutrition",
    size: "medium",
  },
  {
    id: "da-lieu",
    title: "Da liễu",
    description: "Thăm khám các vấn đề về da thường gặp ở trẻ sơ sinh và trẻ nhỏ.",
    icon: "stethoscope",
    size: "medium",
  },
  {
    id: "di-ung",
    title: "Dị ứng",
    description: "Chẩn đoán, tư vấn và điều trị các biểu hiện dị ứng ở trẻ em.",
    icon: "vaccine",
    size: "small",
  },
  {
    id: "tai-mui-hong",
    title: "Tai Mũi Họng",
    description: "Khám và điều trị các bệnh lý tai, mũi, họng thường gặp ở trẻ.",
    icon: "stethoscope",
    size: "small",
  },
  {
    id: "dinh-duong",
    title: "Dinh dưỡng",
    description: "Đánh giá tăng trưởng và tư vấn chế độ dinh dưỡng phù hợp theo độ tuổi.",
    icon: "growth",
    size: "wide",
  },
];
