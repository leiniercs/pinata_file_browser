import { NextRequest, NextResponse } from "next/server";
import { ErrorCodes } from "@/components/common/error";
import { pinata } from "@/components/common/pinata";

export async function POST(req: NextRequest) {
   try {
      if (req.headers.get("Content-Type") !== "application/json") {
         return NextResponse.json(
            { code: ErrorCodes.MALFORMED_REQUEST },
            { status: 400 }
         );
      }

      const { cid, width, height } = await req.json();
      const optimizedImageURL = await pinata.gateways
         .createSignedURL({ cid, expires: 30 })
         .optimizeImage({
            width,
            height,
            animation: false,
            fit: "cover",
            format: "webp"
         });

      return NextResponse.json({ url: optimizedImageURL }, { status: 200 });
   } catch (err) {
      console.error(err);

      return NextResponse.json(
         { code: ErrorCodes.FAILED_CREATING_SIGNED_URL },
         { status: 500 }
      );
   }
}
