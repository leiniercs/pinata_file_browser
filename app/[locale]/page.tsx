import type { ResolvingMetadata, Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { FileListLayout } from "@/components/file_list";

interface CustomPageProps {
   params: { locale: string };
}

export async function generateMetadata(
   { params: { locale } }: Readonly<CustomPageProps>,
   parent: ResolvingMetadata
): Promise<Metadata> {
   unstable_setRequestLocale(locale);
   const parentOpenGraph = (await parent).openGraph || {};
   const tMetadata = await getTranslations({ locale, namespace: "metadata" });
   const tHome = await getTranslations({ locale, namespace: "home.metadata" });

   return {
      title: `${tHome("title")} | ${tMetadata("title")}`,
      openGraph: { ...parentOpenGraph, title: tHome("title") }
   };
}

export default function LocalePage({
   params: { locale }
}: Readonly<CustomPageProps>) {
   return <FileListLayout locale={locale} />;
}
