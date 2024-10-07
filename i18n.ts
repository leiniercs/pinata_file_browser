import type { LocaleProps } from "@/components/common/locales";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/components/common/locales";

export default getRequestConfig(async ({ locale }) => {
   if (!locales.find((value: LocaleProps) => value.code === locale)) {
      notFound();
   }

   return {
      messages: (await import(`./messages/${locale}.json`)).default
   };
});
