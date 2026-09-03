import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, Clock3, MapPin, Phone, ShieldAlert, Stethoscope } from "lucide-react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";
import { Button } from "@/components/ui/Button";
import { SERVICES } from "@/constants/services";
import { DOCTOR_INFO } from "@/constants/doctor";
import { absoluteUrl } from "@/lib/site";

type ServicePageProps = { params: Promise<{ slug: string }> };
const findService = (slug: string) => SERVICES.find((service) => service.id === slug);

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = findService((await params).slug);
  if (!service) return {};
  const title = `Khám ${service.title} cho trẻ em`;
  return { title, description: service.description, alternates: { canonical: `/dich-vu/${service.id}` }, openGraph: { title, description: service.description, url: absoluteUrl(`/dich-vu/${service.id}`), type: "website" } };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const service = findService((await params).slug);
  if (!service) notFound();
  const relatedServices = SERVICES.filter((item) => item.id !== service.id).slice(0, 3);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Dịch vụ Nhi khoa", item: absoluteUrl("/#chuyen-mon") },
      { "@type": "ListItem", position: 3, name: `Khám ${service.title}`, item: absoluteUrl(`/dich-vu/${service.id}`) },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <Navbar />
    <main className="bg-white">
      <section className="border-b border-stone-200 bg-[#faf7f4]">
        <div className="container py-10 md:py-14 lg:py-16">
          <Link href="/#chuyen-mon" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-orange-700"><ArrowLeft size={16} /> Danh sách chuyên khoa</Link>
          <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-orange-700"><span className="h-px w-7 bg-orange-600" /> Chuyên môn Nhi khoa</p>
              <h1 className="mt-5 max-w-2xl text-[2.5rem] font-bold leading-[1.08] tracking-[-0.04em] text-slate-950 md:text-[3.35rem]">Khám {service.title} cho trẻ em</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">{service.introduction}</p>
            </div>
            <div className="border-l-2 border-orange-500 pl-5">
              <p className="text-sm font-semibold text-slate-950">Thăm khám trực tiếp bởi bác sĩ Nhi khoa</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Đánh giá tình trạng, giải thích rõ hướng xử trí và cách theo dõi trẻ tại nhà.</p>
            </div>
          </div>
          <div className="mt-10 grid border-y border-stone-200 sm:grid-cols-3">
            <Fact icon={<Stethoscope size={18} />} label="Hình thức" value="Khám trực tiếp" />
            <Fact icon={<Clock3 size={18} />} label="Thời gian khám" value="Theo lịch hẹn" />
            <Fact icon={<MapPin size={18} />} label="Địa điểm" value="Hòa Xuân, Đà Nẵng" />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="min-w-0">
            <section>
              <SectionHeading eyebrow="Dấu hiệu cần lưu ý" title="Khi nào cha mẹ nên đưa trẻ đi khám?" description="Khám sớm giúp phân biệt tình trạng có thể chăm sóc tại nhà với những dấu hiệu cần được bác sĩ đánh giá." />
              <ol className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
                {service.whenToVisit.map((item, index) => <li key={item} className="grid grid-cols-[44px_1fr] gap-4 py-5 md:py-6"><span className="font-mono text-sm font-bold text-orange-600">{String(index + 1).padStart(2, "0")}</span><p className="font-semibold leading-7 text-slate-800">{item}</p></li>)}
              </ol>
            </section>

            <section className="mt-14 grid gap-10 border-b border-stone-200 pb-14 md:grid-cols-2">
              <InfoList title="Vấn đề thường gặp" items={service.commonConditions} />
              <div className="border-stone-200 md:border-l md:pl-10"><InfoList title="Chuẩn bị trước khi khám" items={service.parentNotes} /></div>
            </section>

            <section className="mt-14">
              <SectionHeading eyebrow="Thông tin tham khảo" title="Câu hỏi thường gặp" description="Các câu trả lời dưới đây mang tính định hướng và không thay thế cho thăm khám trực tiếp." />
              <div className="mt-7 divide-y divide-stone-200 border-y border-stone-200">
                {service.faqs.map((faq, index) => <details key={faq.question} className="group py-1" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-semibold text-slate-900"><span>{faq.question}</span><ChevronDown size={18} className="shrink-0 text-orange-600 transition-transform group-open:rotate-180" /></summary><p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-slate-600">{faq.answer}</p></details>)}
              </div>
            </section>

            <aside className="mt-12 flex gap-4 border border-orange-200 bg-orange-50/60 p-5 md:p-6">
              <ShieldAlert className="mt-0.5 shrink-0 text-orange-700" size={22} />
              <div><p className="font-bold text-slate-950">Khi nào cần đưa trẻ đi cấp cứu?</p><p className="mt-2 text-sm leading-6 text-slate-600">Đưa trẻ đến cơ sở y tế gần nhất nếu có khó thở, tím tái, li bì, co giật, mất nước nặng hoặc diễn tiến nhanh bất thường.</p></div>
            </aside>
          </div>

          <aside className="h-fit border border-stone-200 bg-[#fffdfb] p-6 lg:sticky lg:top-32">
            <CalendarDays className="text-orange-600" size={24} />
            <h2 className="mt-5 text-xl font-bold text-slate-950">Đặt lịch khám</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Chọn ngày và giờ phù hợp. Phòng khám sẽ liên hệ xác nhận lịch hẹn.</p>
            <Button asChild size="lg" className="mt-6 w-full"><Link href="/#dat-lich">Chọn lịch khám <ArrowRight size={17} /></Link></Button>
            <div className="mt-6 border-t border-stone-200 pt-5"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Cần tư vấn thêm?</p><a href={`tel:${DOCTOR_INFO.phone}`} className="mt-3 flex items-center gap-3 font-bold text-slate-950 hover:text-orange-700"><Phone size={17} className="text-orange-600" /> {DOCTOR_INFO.phone}</a></div>
          </aside>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-[#faf7f4] py-12 md:py-16">
        <div className="container">
          <div className="flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-700">Chuyên khoa khác</p><h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Dịch vụ liên quan</h2></div><Link href="/#chuyen-mon" className="hidden items-center gap-2 text-sm font-bold text-orange-700 sm:flex">Xem tất cả <ArrowRight size={16} /></Link></div>
          <div className="mt-8 grid border-y border-stone-200 md:grid-cols-3">
            {relatedServices.map((item, index) => <Link key={item.id} href={`/dich-vu/${item.id}`} className={`group py-7 md:px-7 ${index > 0 ? "border-t border-stone-200 md:border-l md:border-t-0" : "md:pl-0"}`}><h3 className="font-bold text-slate-950 transition-colors group-hover:text-orange-700">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-700">Xem chi tiết <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span></Link>)}
          </div>
        </div>
      </section>
    </main>
    <Footer /><ChatbotButton />
  </>;
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 py-4 sm:border-l sm:border-stone-200 sm:px-6 sm:first:border-l-0 sm:first:pl-0"><span className="text-orange-600">{icon}</span><div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p></div></div>;
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return <div><h2 className="text-xl font-bold tracking-tight text-slate-950">{title}</h2><ul className="mt-5 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><Check className="mt-1 shrink-0 text-orange-600" size={15} /> {item}</li>)}</ul></div>;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-700">{eyebrow}</p><h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] text-slate-950 md:text-3xl">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">{description}</p></div>;
}
