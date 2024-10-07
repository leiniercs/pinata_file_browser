import type { LocaleProps } from "@/components/common/locales";
import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { locales } from "@/components/common/locales";

function getLocale(requestedLanguages: string) {
   const languages = new Negotiator({
      headers: { "accept-language": requestedLanguages }
   }).languages();
   const defaultLocale = "en";

   return match(
      languages,
      locales.map((value: LocaleProps) => value.code),
      defaultLocale
   );
}

export function middleware(request: NextRequest): NextResponse {
   const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
   const cspHeader = `
      default-src 'self';
      script-src 'self' ${
         process.env.NODE_ENV === "production"
            ? `'nonce-${nonce}' 'strict-dynamic'`
            : "'unsafe-inline' 'unsafe-eval'"
      };
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https://assets.pinata.cloud https://*.mypinata.cloud;
      font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
      media-src 'self' https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL};
      connect-src 'self' https://api.pinata.cloud https://uploads.pinata.cloud https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL};
      frame-src 'self';
      object-src 'none';
      frame-ancestors 'none';
      upgrade-insecure-requests;`;
   const contentSecurityPolicyHeaderValue = cspHeader
      .replace(/\s{2,}/g, " ")
      .trim();
   const requestHeaders = new Headers(request.headers);
   const { pathname } = request.nextUrl;
   const pathnameHasLocale = locales.some(
      (locale: LocaleProps) =>
         pathname.startsWith(`/${locale.code}/`) ||
         pathname === `/${locale.code}`
   );

   requestHeaders.set("X-Nonce", nonce);
   requestHeaders.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue
   );

   if (pathnameHasLocale) {
      const nextResponse = NextResponse.next({
         request: {
            headers: requestHeaders
         }
      });

      nextResponse.headers.set(
         "Content-Security-Policy",
         contentSecurityPolicyHeaderValue
      );

      return nextResponse;
   }

   const locale = getLocale(request.headers.get("accept-language") || "en");

   request.nextUrl.pathname = `/${locale}${pathname}`;

   return NextResponse.redirect(request.nextUrl);
}

export const config = {
   matcher: [
      {
         source: "/((?!api|_next|images).*)",
         missing: [
            { type: "header", key: "next-router-prefetch" },
            { type: "header", key: "purpose", value: "prefetch" }
         ]
      }
   ]
};
