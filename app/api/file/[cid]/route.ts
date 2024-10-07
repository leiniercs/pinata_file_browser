import { NextRequest, NextResponse } from "next/server";
import { ErrorCodes } from "@/components/common/error";
import { pinata } from "@/components/common/pinata";

interface CustomRouteParams {
   params: {
      cid: string;
   };
}

export async function GET(
   req: NextRequest,
   { params: { cid } }: Readonly<CustomRouteParams>
) {
   try {
      const fileURL = await pinata.gateways.createSignedURL({
         cid,
         expires: 30
      });

      return NextResponse.json({ url: fileURL }, { status: 200 });
   } catch (err) {
      console.error(err);

      return NextResponse.json(
         { code: ErrorCodes.FAILED_GETTING_FILE },
         { status: 500 }
      );
   }
}
