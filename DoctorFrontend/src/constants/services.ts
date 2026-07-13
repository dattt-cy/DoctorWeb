import type { Service } from "@/types/service";

export const SERVICES: Service[] = [
  {
    id: "nhi-tong-quat",
    title: "Nhi tổng quát",
    description: "Khám, tư vấn và điều trị toàn diện các bệnh lý thường gặp ở trẻ em từ sơ sinh đến 16 tuổi.",
    icon: "stethoscope",
    featured: true,
    size: "large",
  },
  {
    id: "dinh-duong",
    title: "Dinh dưỡng trẻ em",
    description: "Tư vấn chế độ ăn, xử lý biếng ăn, suy dinh dưỡng và thừa cân cho trẻ.",
    icon: "nutrition",
    size: "medium",
  },
  {
    id: "tiem-chung",
    title: "Tiêm chủng phòng bệnh",
    description: "Lịch tiêm chủng chuẩn theo WHO, tư vấn vắc-xin phù hợp độ tuổi.",
    icon: "vaccine",
    size: "medium",
  },
  {
    id: "ho-hap",
    title: "Hô hấp nhi",
    description: "Điều trị viêm phổi, hen suyễn, viêm phế quản và các bệnh đường hô hấp.",
    icon: "lungs",
    size: "small",
  },
  {
    id: "phat-trien",
    title: "Phát triển tâm lý",
    description: "Đánh giá và hỗ trợ phát triển ngôn ngữ, vận động, nhận thức của trẻ.",
    icon: "brain",
    size: "small",
  },
  {
    id: "tu-van",
    title: "Tư vấn phát triển toàn diện",
    description: "Theo dõi tăng trưởng, tư vấn nuôi dưỡng và chăm sóc trẻ theo từng giai đoạn phát triển.",
    icon: "growth",
    size: "wide",
  },
];
