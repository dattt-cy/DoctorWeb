import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ClipboardList, HeartPulse, ShieldCheck } from "lucide-react";
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
        <section className="border-b border-orange-100 bg-gradient-to-br from-orange-50 via-white to-cyan-50 py-16 md:py-24">
          <div className="container">
            <Link href="/#chuyen-mon" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-600">
              <ArrowLeft size={17} /> Tất cả dịch vụ
            </Link>
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Chuyên môn Nhi khoa</p>
              <h1 className="text-4xl font-extrabold leading-tight text-slate-950 md:text-6xl">Khám {service.title} cho trẻ em</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{service.introduction}</p>
              <Link href="/#dat-lich" className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 font-bold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500">
                Đặt lịch khám <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="container grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm">
              <HeartPulse className="text-orange-600" size={30} />
              <h2 className="mt-5 text-xl font-bold text-slate-950">Vấn đề thường gặp</h2>
              <ul className="mt-5 space-y-3">
                {service.commonConditions.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><Check className="mt-1 shrink-0 text-orange-500" size={16} />{item}</li>)}
              </ul>
            </article>
            <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm">
              <ClipboardList className="text-cyan-700" size={30} />
              <h2 className="mt-5 text-xl font-bold text-slate-950">Quy trình thăm khám</h2>
              <ol className="mt-5 space-y-4">
                {service.examinationSteps.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-700">{index + 1}</span>{item}</li>)}
              </ol>
            </article>
            <article className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm">
              <ShieldCheck className="text-emerald-600" size={30} />
              <h2 className="mt-5 text-xl font-bold text-slate-950">Cha mẹ cần lưu ý</h2>
              <ul className="mt-5 space-y-3">
                {service.parentNotes.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><Check className="mt-1 shrink-0 text-emerald-600" size={16} />{item}</li>)}
              </ul>
            </article>
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
