import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { UploadButton } from "@/components/file_list/upload_button";
import { FileList } from "@/components/file_list/file_list";

interface CustomComponentProps {
   locale: string;
}

export async function FileListLayout({
   locale
}: Readonly<CustomComponentProps>) {
   unstable_setRequestLocale(locale);
   const tFileList = await getTranslations("file_list");

   return (
      <Card
         classNames={{
            base: "w-full",
            header: "flex justify-between item-center font-bold capitalize"
         }}
      >
         <CardHeader>
            {tFileList("title")}
            <UploadButton />
         </CardHeader>
         <CardBody>
            <FileList />
         </CardBody>
      </Card>
   );
}
