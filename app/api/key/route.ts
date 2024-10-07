import { NextRequest, NextResponse } from "next/server";
import { ErrorCodes } from "@/components/common/error";
import { pinata } from "@/components/common/pinata";

export async function GET() {
   try {
      const uuid = crypto.randomUUID();
      const keyData = await pinata.keys.create({
         keyName: uuid.toString(),
         permissions: {
            endpoints: {
               pinning: {
                  pinFileToIPFS: true
               }
            }
         },
         maxUses: 1
      });

      return NextResponse.json(keyData, { status: 200 });
   } catch (err) {
      console.error(err);

      return NextResponse.json(
         { code: ErrorCodes.FAILED_CREATING_API_KEY },
         { status: 500 }
      );
   }
}

export async function DELETE(req: NextRequest) {
   try {
      if (req.headers.get("Content-Type") !== "application/json") {
         return NextResponse.json(
            { code: ErrorCodes.MALFORMED_REQUEST },
            { status: 400 }
         );
      }

      const { id } = await req.json();
      const response = await pinata.keys.revoke([id]);

      return NextResponse.json(response, { status: 200 });
   } catch (err) {
      console.error(err);

      return NextResponse.json(
         { code: ErrorCodes.FAILED_CREATING_API_KEY },
         { status: 500 }
      );
   }
}
