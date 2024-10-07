"use client";
import type { AbstractIntlMessages } from "next-intl";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "@/components/common/navigation";
import { GlobalProvider } from "@/components/contexts/global";

type LocaleProps = {
   children: ReactNode;
   locale: string;
   messages: AbstractIntlMessages;
};

export function Providers({
   children,
   locale,
   messages
}: Readonly<LocaleProps>): JSX.Element {
   const { push } = useRouter();

   return (
      <NextIntlClientProvider
         locale={locale}
         messages={messages}
         timeZone="UTC"
      >
         <ThemeProvider attribute="class" defaultTheme="dark">
            <NextUIProvider locale={locale} navigate={push}>
               <GlobalProvider>{children}</GlobalProvider>
            </NextUIProvider>
         </ThemeProvider>
      </NextIntlClientProvider>
   );
}
