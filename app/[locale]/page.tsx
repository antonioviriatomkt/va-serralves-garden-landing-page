import { notFound } from "next/navigation";
import { SITE, isLocale } from "@/config/site";
import { contentSource } from "@/lib/content/jsonAdapter";
import { PageComposition } from "@/components/PageComposition";

export default async function DevelopmentPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();

  const { development, ui } = await contentSource.getLocaleContent(
    params.locale,
  );
  const composition = await contentSource.getComposition(SITE.preset);

  return (
    <PageComposition composition={composition} content={development} ui={ui} />
  );
}
