import type { ReactNode } from "react";
import type { Metadata } from "next";
import type { LocaleProps } from "@/components/common/locales";
import { headers } from "next/headers";
import {
   getMessages,
   getTranslations,
   unstable_setRequestLocale
} from "next-intl/server";
import { locales } from "@/components/common/locales";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { FileUploadDialog } from "@/components/file_upload/dialog";
import { FileDetailsDialog } from "@/components/file_list/details_dialog";
import "./globals.css";

interface CustomMetadataProps {
   params: { locale: string };
}

interface CustomLayoutProps {
   children: ReactNode;
   params: { locale: string };
}

interface AlternateLanguages {
   [key: string]: string;
}

export async function generateStaticParams() {
   return locales.map((value: LocaleProps) => ({
      locale: value.code
   }));
}

export async function generateMetadata({
   params: { locale }
}: Readonly<CustomMetadataProps>): Promise<Metadata> {
   const currentHostname = headers().get("host") as string;
   unstable_setRequestLocale(locale);
   const tMetadata = await getTranslations({ locale, namespace: "metadata" });
   const urlBase: string = `https://${currentHostname}`;
   const favIcon: string = `${urlBase}/images/logos/logo-color-icononly-nobackground.svg`;
   const ogImage: string = `${urlBase}/images/logos/logo-color-nobackground.svg`;
   const alternateLanguages: AlternateLanguages = {};

   for (const _locale of locales) {
      alternateLanguages[_locale.code] = `${urlBase}/${_locale.code}`;
   }

   return {
      title: {
         default: tMetadata("title"),
         template: `%s | ${tMetadata("title")}`
      },
      description: tMetadata("description"),
      keywords: tMetadata("keywords"),
      icons: {
         icon: favIcon,
         shortcut: favIcon,
         apple: favIcon
      },
      openGraph: {
         type: "website",
         locale: locale,
         siteName: tMetadata("title"),
         title: tMetadata("title"),
         description: tMetadata("description"),
         images: [ogImage]
      },
      alternates: {
         canonical: urlBase,
         languages: alternateLanguages
      },
      robots: {
         index: true,
         follow: true,
         googleBot: {
            index: true,
            follow: true
         }
      }
   };
}

export default async function LocaleLayout({
   children,
   params: { locale }
}: Readonly<CustomLayoutProps>) {
   unstable_setRequestLocale(locale);
   const nonce = headers().get("x-nonce") as string;
   const messages = await getMessages({ locale });
   const _locale = locales.find((value: LocaleProps) => value.code === locale);

   return (
      <html
         className="dark"
         style={{ colorScheme: "dark" }}
         lang={locale}
         dir={_locale?.rtl ? "rtl" : undefined}
      >
         <head>
            <meta name="nonce" content={nonce} />
         </head>
         <body className="antialiased">
            <Providers locale={locale} messages={messages}>
               <Header />
               <main className="mx-auto w-full max-w-screen-lg py-10 px-2">
                  {children}
               </main>
               <FileUploadDialog />
               <FileDetailsDialog />
            </Providers>
         </body>
      </html>
   );
}
