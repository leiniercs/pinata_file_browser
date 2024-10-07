import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
   content: [
      "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}"
   ],
   darkMode: "class",
   theme: {
      extend: {}
   },
   plugins: [nextui()]
};
export default config;
