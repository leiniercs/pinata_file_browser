"use client";
import type { Selection } from "@nextui-org/react";
import type { LocaleProps } from "@/components/common/locales";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
   Avatar,
   Button,
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownTrigger
} from "@nextui-org/react";
import { FaLanguage } from "react-icons/fa6";
import { locales } from "@/components/common/locales";
import { usePathname, useRouter } from "@/components/common/navigation";

export function LanguageSwitcher() {
   const locale = useLocale();
   const pathname = usePathname();
   const tHeader = useTranslations("header");
   const router = useRouter();
   const rawSearchParams: ReadonlyURLSearchParams = useSearchParams();
   const searchParams: string =
      rawSearchParams.size > 0 ? `?${rawSearchParams.toString()}` : "";

   return (
      <Dropdown>
         <DropdownTrigger>
            <Button color="default" variant="light" isIconOnly>
               <FaLanguage size="24px" />
            </Button>
         </DropdownTrigger>
         <DropdownMenu
            aria-label={tHeader("languages.language-selection")}
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={[`${locale}`]}
            onSelectionChange={(keys: Selection) => {
               router.push(`/${pathname}${searchParams}`, {
                  locale: Array.from(keys)[0] as string
               });
            }}
         >
            {locales.map((value: LocaleProps) => (
               <DropdownItem
                  key={value.code}
                  className="capitalize"
                  dir={value.rtl ? "rtl" : ""}
                  startContent={
                     <Avatar src={`/images/languages/${value.code}.svg`} />
                  }
                  title={new Intl.DisplayNames(value.code, {
                     type: "language"
                  }).of(value.code)}
               />
            ))}
         </DropdownMenu>
      </Dropdown>
   );
}
