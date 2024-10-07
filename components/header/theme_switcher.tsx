"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Switch, Tooltip } from "@nextui-org/react";
import { FaSun, FaMoon } from "react-icons/fa6";

export function ThemeSwitcher() {
   const tHeader = useTranslations("header");
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState<boolean>(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return null;
   }

   return (
      <Tooltip
         content={
            <div className="flex flex-col gap-1">
               <span>
                  {tHeader("current-theme")}: {tHeader(theme)}
               </span>
               <span>{tHeader("click-to-toggle")}</span>
            </div>
         }
      >
         <Switch
            size="lg"
            color="default"
            thumbIcon={({ isSelected, className }) =>
               isSelected ? (
                  <FaSun className={className} />
               ) : (
                  <FaMoon className={className} />
               )
            }
            isSelected={theme !== "dark"}
            onValueChange={(isSelected: boolean) => {
               setTheme(isSelected ? "light" : "dark");
            }}
         ></Switch>
      </Tooltip>
   );
}
