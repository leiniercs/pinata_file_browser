import { NextRequest, NextResponse } from "next/server";
import { ErrorCodes } from "@/components/common/error";
import { pinata } from "@/components/common/pinata";

export async function DELETE(req: NextRequest) {
   try {
      if (req.headers.get("Content-Type") !== "application/json") {
         return NextResponse.json(
            { code: ErrorCodes.MALFORMED_REQUEST },
            { status: 400 }
         );
      }

      const { id } = await req.json();
      const response = await pinata.files.delete([id]);

      return NextResponse.json(response, { status: 200 });
   } catch (err) {
      console.error(err);

      return NextResponse.json(
         { code: ErrorCodes.FAILED_DELETING_FILE },
         { status: 500 }
      );
   }
}
