import type { BlogPost } from "@/types/post";

export const MOCK_POSTS: BlogPost[] = [
  {
    slug: "tre-bieng-an-nguyen-nhan-va-giai-phap",
    title: "Trẻ biếng ăn: Nguyên nhân thực sự và giải pháp hiệu quả từ chuyên gia",
    excerpt:
      "Biếng ăn là nỗi lo của hầu hết phụ huynh Việt Nam. Nhưng không phải lúc nào cũng do trẻ lười — đôi khi nguyên nhân đến từ những yếu tố mà cha mẹ chưa nhận ra.",
    content: `
## Biếng ăn là gì?

Biếng ăn ở trẻ em là tình trạng trẻ từ chối ăn, ăn rất ít hoặc chỉ chấp nhận một số loại thức ăn nhất định. Tình trạng này có thể xảy ra ở mọi độ tuổi nhưng phổ biến nhất ở trẻ từ 1–5 tuổi.

## Nguyên nhân thường gặp

- **Tâm lý áp lực**: Trẻ bị ép ăn quá nhiều, dẫn đến phản ứng chống đối.
- **Thiếu vi chất**: Thiếu kẽm, sắt hoặc vitamin D làm giảm cảm giác thèm ăn.
- **Bệnh lý nền**: Viêm họng, rối loạn tiêu hóa làm trẻ khó chịu khi ăn.
- **Phương pháp cho ăn chưa phù hợp**: Kết cấu thức ăn không phù hợp với độ tuổi.

## Giải pháp

1. Tạo không khí bữa ăn vui vẻ, không áp lực
2. Đa dạng hóa thực phẩm, thay đổi cách chế biến
3. Để trẻ tự khám phá thức ăn (Baby-led weaning)
4. Bổ sung vi chất theo chỉ định của bác sĩ
5. Thăm khám chuyên khoa nếu tình trạng kéo dài trên 1 tháng
    `,
    category: "Dinh dưỡng",
    coverImage: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80&auto=format&fit=crop",
    publishedAt: "2026-04-10",
    readingTime: 5,
    featured: true,
  },
  {
    slug: "lich-tiem-chung-cho-tre-nam-2026",
    title: "Lịch tiêm chủng đầy đủ cho trẻ năm 2026 — Cập nhật mới nhất từ Bộ Y tế",
    excerpt:
      "Bộ Y tế vừa cập nhật phác đồ tiêm chủng quốc gia 2026. Đây là những thay đổi quan trọng cha mẹ cần biết để bảo vệ trẻ tốt nhất.",
    content: `
## Tại sao tiêm chủng quan trọng?

Tiêm chủng là biện pháp phòng bệnh hiệu quả và an toàn nhất, giúp trẻ xây dựng hệ miễn dịch chống lại các bệnh truyền nhiễm nguy hiểm.

## Lịch tiêm theo độ tuổi

### Sơ sinh (0–7 ngày)
- Vắc-xin Viêm gan B mũi 1
- Vắc-xin BCG (Lao)

### 2 tháng tuổi
- Vắc-xin Bạch hầu – Ho gà – Uốn ván – Viêm gan B – Hib – Bại liệt (6 trong 1)
- Vắc-xin Rota virus uống (liều 1)
    `,
    category: "Tiêm chủng",
    coverImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&auto=format&fit=crop",
    publishedAt: "2026-04-02",
    readingTime: 7,
  },
  {
    slug: "hen-suyen-o-tre-em-dieu-cha-me-can-biet",
    title: "Hen suyễn ở trẻ em: Những điều cha mẹ nhất định phải biết",
    excerpt:
      "Hen suyễn là bệnh hô hấp mạn tính phổ biến nhất ở trẻ em. Hiểu đúng để kiểm soát tốt và tránh những đợt cấp nguy hiểm.",
    content: `
## Hen suyễn là gì?

Hen suyễn (asthma) là tình trạng viêm mạn tính đường thở, làm co thắt phế quản và gây khó thở tái phát.

## Nhận biết triệu chứng ở trẻ

- Ho về đêm hoặc sáng sớm
- Thở khò khè, thở nhanh
- Nặng ngực, mệt khi gắng sức
- Hay bị viêm phổi tái phát
    `,
    category: "Hô hấp",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop",
    publishedAt: "2026-03-25",
    readingTime: 6,
  },
  {
    slug: "phat-trien-ngon-ngu-tre-1-3-tuoi",
    title: "Phát triển ngôn ngữ trẻ 1–3 tuổi: Mốc quan trọng và cách kích thích",
    excerpt:
      "Giai đoạn 1–3 tuổi là giai đoạn vàng phát triển ngôn ngữ. Cha mẹ có thể làm gì để đồng hành cùng trẻ trong hành trình này?",
    content: `
## Các mốc phát triển ngôn ngữ bình thường

### 12 tháng
- Nói được 1–3 từ có nghĩa
- Hiểu "không" và các yêu cầu đơn giản

### 18 tháng
- Vốn từ 10–20 từ
- Chỉ vào đồ vật khi được hỏi

### 24 tháng
- Kết hợp 2 từ (ví dụ: "Mẹ ơi", "Ăn cơm")
- Vốn từ 50+ từ
    `,
    category: "Phát triển",
    coverImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80&auto=format&fit=crop",
    publishedAt: "2026-03-18",
    readingTime: 8,
  },
  {
    slug: "sot-o-tre-em-khi-nao-can-di-bac-si",
    title: "Sốt ở trẻ em: Khi nào cần đến gặp bác sĩ ngay?",
    excerpt:
      "Sốt là phản ứng bảo vệ tự nhiên của cơ thể, nhưng đôi khi là dấu hiệu cần can thiệp y tế kịp thời. Đây là những dấu hiệu nguy hiểm không được bỏ qua.",
    content: `
## Sốt bao nhiêu độ là bình thường?

Nhiệt độ bình thường của trẻ dao động từ 36.5°C – 37.5°C. Sốt khi nhiệt độ ≥ 38°C.

## Khi nào cần đến bác sĩ ngay?

- Trẻ dưới 3 tháng tuổi sốt bất kỳ mức nào
- Sốt > 39°C không hạ sau 1 giờ dùng thuốc
- Co giật do sốt
- Khó thở, tím tái
- Không đáp ứng, lờ đờ, không tỉnh táo
    `,
    category: "Phòng bệnh",
    coverImage: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80&auto=format&fit=crop",
    publishedAt: "2026-03-10",
    readingTime: 4,
  },
];

export const POST_CATEGORIES = ["Tất cả", "Dinh dưỡng", "Tiêm chủng", "Hô hấp", "Phát triển", "Phòng bệnh"];
