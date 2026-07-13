import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/app/globals.css";

import { LOCALES, SITE, isLocale } from "@/config/site";
import { contentSource } from "@/lib/content/jsonAdapter";
import { ModeProvider } from "@/lib/mode/ModeProvider";
import { Q0Provider } from "@/lib/q0/Q0Provider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { EdgeBlur } from "@/components/EdgeBlur";
import { SmoothScroll } from "@/components/SmoothScroll";
import type { Locale } from "@/types/content";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale: Locale = isLocale(params.locale) ? params.locale : "pt";
  const { development } = await contentSource.getLocaleContent(locale);
  const title = `${development.name} — ${development.tagline}`;
  const description =
    locale === "pt"
      ? "14 residências T2–T4 junto a Serralves, na Boavista, Porto. Entrega no 1.º trimestre de 2027. Apresentação privada mediante marcação."
      : "14 T2–T4 residences beside Serralves, in Boavista, Porto. Delivery in Q1 2027. Private presentation by appointment.";

  return {
    metadataBase: new URL(SITE.baseUrl),
    title,
    description,
    // Demo build — keep it out of search indexes.
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}`,
      languages: { pt: "/pt", en: "/en" },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "pt" ? "pt_PT" : "en_GB",
      siteName: "VA Properties",
      images: [{ url: "/images/hero.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { ui, development } = await contentSource.getLocaleContent(locale);

  return (
    <html lang={locale}>
      <body>
        <SmoothScroll>
          <Suspense fallback={null}>
            <ModeProvider locale={locale} preset={SITE.preset}>
              <Q0Provider development={development} ui={ui}>
                <SiteHeader ui={ui} />
                {children}
                <SiteFooter ui={ui} development={development} />
                <WhatsAppButton ui={ui} />
                <EdgeBlur />
              </Q0Provider>
            </ModeProvider>
          </Suspense>
        </SmoothScroll>
      </body>
    </html>
  );
}
