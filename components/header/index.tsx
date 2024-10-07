import { Suspense } from "react";
import {
   Image,
   Navbar,
   NavbarBrand,
   NavbarContent,
   NavbarItem
} from "@nextui-org/react";
import { ThemeSwitcher } from "@/components/header/theme_switcher";
import { LanguageSwitcher } from "@/components/header/language_switcher";

export async function Header() {
   return (
      <Navbar
         classNames={{ wrapper: "px-4" }}
         maxWidth="lg"
         isBordered
         shouldHideOnScroll
      >
         <NavbarContent justify="start">
            <NavbarBrand className="pl-0">
               <Image src="/images/pinata.svg" alt="Pinata Logo" height={32} />
            </NavbarBrand>
         </NavbarContent>
         <NavbarContent justify="end">
            <NavbarItem>
               <ThemeSwitcher />
            </NavbarItem>
            <NavbarItem>
               <Suspense>
                  <LanguageSwitcher />
               </Suspense>
            </NavbarItem>
         </NavbarContent>
      </Navbar>
   );
}
