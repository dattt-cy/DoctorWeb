import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, HeartPulse, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";
import { SERVICES } from "@/constants/services";
import { absoluteUrl } from "@/lib/site";

type ServicePageProps = { params: Promise<{ slug: string }> };

function findService(slug: string) {
  return SERVICES.find((service) => service.id === slug);
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};

  const title = `Khám ${service.title} cho trẻ em`;
  return {
    title,
    description: service.description,
    alternates: { canonical: `/dich-vu/${service.id}` },
    openGraph: {
      title,
      description: service.description,
      url: absoluteUrl(`/dich-vu/${service.id}`),
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  const relatedServices = SERVICES.filter((item) => item.id !== service.id).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="bg-[var(--color-surface-alt)]">
        <section className="relative overflow-hidden border-b border-orange-100 bg-[#fffaf5] py-12 md:py-16">
          <div className="pointer-events-none absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-orange-200/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-[20%] h-56 w-56 rounded-full bg-cyan-100/50 blur-3xl" />
          <div className="container">
            <Link href="/#chuyen-mon" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-600">
              <ArrowLeft size={17} /> Tất cả dịch vụ
            </Link>
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_340px]">
              <div className="max-w-3xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Chuyên môn Nhi khoa</p>
              <h1 className="text-4xl font-extrabold leading-[1.12] text-slate-950 md:text-5xl">Khám {service.title} cho trẻ em</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">{service.introduction}</p>
              <Link href="/#dat-lich" className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500">
                Đặt lịch khám <ArrowRight size={18} />
              </Link>
              </div>
              <aside className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-xl shadow-orange-900/5 backdrop-blur">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"><Stethoscope size={23} /></div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Thăm khám cá thể hóa</p>
                <p className="mt-2 text-base font-bold leading-6 text-slate-950">Không chỉ xử lý triệu chứng, bác sĩ tìm nguyên nhân và hướng dẫn cha mẹ theo dõi trẻ tại nhà.</p>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500"><ShieldCheck size={18} className="text-emerald-600" /> Tư vấn phù hợp theo độ tuổi</div>
              </aside>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container">
            <div className="mb-9 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Hiểu đúng tình trạng của trẻ</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 md:text-4xl">Khi nào cha mẹ nên đưa trẻ đi khám?</h2>
              <p className="mt-4 leading-7 text-slate-600">Khám sớm giúp phân biệt tình trạng có thể chăm sóc tại nhà với những dấu hiệu cần can thiệp y tế.</p>
            </div>
            <div>
              <article className="rounded-3xl border border-orange-100 bg-white p-8 shadow-sm md:p-11">
                <div className="flex items-center gap-4"><HeartPulse className="text-orange-600" size={36} /><h3 className="text-2xl font-bold text-slate-950 md:text-3xl">Nên đặt lịch thăm khám</h3></div>
                <div className="mt-9 grid gap-5 sm:grid-cols-3">
                  {service.whenToVisit.map((item, index) => <div key={item} className="flex min-h-40 flex-col justify-center rounded-2xl bg-orange-50/70 p-6 md:p-7"><span className="text-sm font-extrabold text-orange-500">0{index + 1}</span><p className="mt-4 text-base font-semibold leading-7 text-slate-700 md:text-lg">{item}</p></div>)}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="border-y border-orange-100 bg-white py-14 md:py-20">
          <div className="container grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-orange-100 bg-[#fffaf5] p-7">
              <HeartPulse className="text-orange-600" size={30} />
              <h2 className="mt-5 text-xl font-bold text-slate-950">Vấn đề thường gặp</h2>
              <ul className="mt-5 space-y-3">
                {service.commonConditions.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><Check className="mt-1 shrink-0 text-orange-500" size={16} />{item}</li>)}
              </ul>
            </article>
            <article className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-7">
              <ShieldCheck className="text-emerald-600" size={30} />
              <h2 className="mt-5 text-xl font-bold text-slate-950">Cha mẹ cần lưu ý</h2>
              <ul className="mt-5 space-y-3">
                {service.parentNotes.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><Check className="mt-1 shrink-0 text-emerald-600" size={16} />{item}</li>)}
              </ul>
            </article>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"><Sparkles size={24} /></div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Giải đáp cùng bác sĩ</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 md:text-4xl">Điều cha mẹ thường băn khoăn</h2>
              <p className="mt-4 max-w-md leading-7 text-slate-600">Thông tin giúp gia đình chuẩn bị tốt hơn trước buổi khám. Chẩn đoán và điều trị vẫn cần dựa trên tình trạng thực tế của từng trẻ.</p>
            </div>
            <div className="space-y-4">
              {service.faqs.map((faq, index) => (
                <article key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">{index + 1}</span><div><h3 className="text-lg font-bold text-slate-950">{faq.question}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p></div></div>
                </article>
              ))}
              <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-[#fff8f1] p-7 shadow-sm">
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-200/45" />
                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-lg font-bold text-slate-950">Bạn vẫn chưa chắc tình trạng của bé?</p><p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">Bác sĩ sẽ thăm khám và cùng gia đình chọn hướng chăm sóc phù hợp, không vội vàng điều trị khi chưa cần thiết.</p></div>
                  <Link href="/#dat-lich" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600">Đặt lịch khám <ArrowRight size={16} /></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-orange-100 bg-white py-14 md:py-20">
          <div className="container">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Khám toàn diện</p><h2 className="mt-2 text-3xl font-bold text-slate-950">Dịch vụ liên quan</h2></div>
              <Link href="/#chuyen-mon" className="hidden items-center gap-2 text-sm font-bold text-orange-600 sm:flex">Xem tất cả <ArrowRight size={16} /></Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {relatedServices.map((item) => (
                <Link key={item.id} href={`/dich-vu/${item.id}`} className="group rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500">
                  <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{item.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orange-600">Tìm hiểu dịch vụ <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatbotButton />
    </>
  );
}
