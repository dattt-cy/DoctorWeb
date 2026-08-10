import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, ClipboardList, HeartPulse, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
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
        <section className="relative overflow-hidden border-b border-orange-100 bg-[#fffaf5] py-16 md:py-24">
          <div className="pointer-events-none absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-orange-200/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-[20%] h-56 w-56 rounded-full bg-cyan-100/50 blur-3xl" />
          <div className="container">
            <Link href="/#chuyen-mon" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-600">
              <ArrowLeft size={17} /> Tất cả dịch vụ
            </Link>
            <div className="relative grid items-end gap-10 lg:grid-cols-[1fr_360px]">
              <div className="max-w-3xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Chuyên môn Nhi khoa</p>
              <h1 className="text-4xl font-extrabold leading-tight text-slate-950 md:text-6xl">Khám {service.title} cho trẻ em</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{service.introduction}</p>
              <Link href="/#dat-lich" className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 font-bold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500">
                Đặt lịch khám <ArrowRight size={18} />
              </Link>
              </div>
              <aside className="rounded-3xl border border-white/80 bg-white/85 p-6 shadow-xl shadow-orange-900/5 backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"><Stethoscope size={25} /></div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Thăm khám cá thể hóa</p>
                <p className="mt-2 text-lg font-bold leading-7 text-slate-950">Không chỉ xử lý triệu chứng, bác sĩ tìm nguyên nhân và hướng dẫn cha mẹ theo dõi trẻ tại nhà.</p>
                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm text-slate-500"><ShieldCheck size={18} className="text-emerald-600" /> Tư vấn phù hợp theo độ tuổi</div>
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
            <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
              <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm md:p-9">
                <div className="flex items-center gap-3"><HeartPulse className="text-orange-600" size={30} /><h3 className="text-xl font-bold text-slate-950">Nên đặt lịch thăm khám</h3></div>
                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  {service.whenToVisit.map((item, index) => <div key={item} className="rounded-2xl bg-orange-50/70 p-5"><span className="text-xs font-extrabold text-orange-500">0{index + 1}</span><p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{item}</p></div>)}
                </div>
              </article>
              <article className="rounded-3xl bg-slate-950 p-7 text-white shadow-lg md:p-9">
                <div className="flex items-center gap-3 text-amber-300"><AlertTriangle size={27} /><h3 className="text-xl font-bold text-white">Dấu hiệu cần xử trí ngay</h3></div>
                <ul className="mt-6 space-y-4">{service.urgentSigns.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />{item}</li>)}</ul>
                <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-slate-400">Nếu trẻ có dấu hiệu nguy hiểm, hãy đưa trẻ đến cơ sở cấp cứu gần nhất; không chờ lịch hẹn trực tuyến.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="border-y border-orange-100 bg-white py-14 md:py-20">
          <div className="container grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-orange-100 bg-[#fffaf5] p-7">
              <HeartPulse className="text-orange-600" size={30} />
              <h2 className="mt-5 text-xl font-bold text-slate-950">Vấn đề thường gặp</h2>
              <ul className="mt-5 space-y-3">
                {service.commonConditions.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><Check className="mt-1 shrink-0 text-orange-500" size={16} />{item}</li>)}
              </ul>
            </article>
            <article className="rounded-3xl border border-cyan-100 bg-cyan-50/40 p-7">
              <ClipboardList className="text-cyan-700" size={30} />
              <h2 className="mt-5 text-xl font-bold text-slate-950">Quy trình thăm khám</h2>
              <ol className="mt-5 space-y-4">
                {service.examinationSteps.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-700">{index + 1}</span>{item}</li>)}
              </ol>
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
              <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-7 text-white shadow-lg shadow-orange-500/15">
                <p className="font-bold">Bạn vẫn chưa chắc tình trạng của bé?</p>
                <p className="mt-2 text-sm leading-6 text-white/80">Đặt lịch để bác sĩ thăm khám và tư vấn kế hoạch chăm sóc phù hợp.</p>
                <Link href="/#dat-lich" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-50">Đặt lịch khám <ArrowRight size={16} /></Link>
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
