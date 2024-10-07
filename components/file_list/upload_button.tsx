"use client";
import { useCallback, useContext } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@nextui-org/react";
import { MdUpload } from "react-icons/md";
import { GlobalContext } from "@/components/contexts/global";

export function UploadButton() {
   const { files, fileUploadDialog } = useContext(GlobalContext);
   const tFileUpload = useTranslations("file_upload");
   const onUploadClick = useCallback(() => {
      fileUploadDialog.onOpen();
   }, [fileUploadDialog]);

   if (files.length === 0) {
      return null;
   }

   return (
      <Button
         color="default"
         variant="flat"
         startContent={<MdUpload className="w-5 h-5" />}
         onClick={onUploadClick}
      >
         {tFileUpload("upload")}
      </Button>
   );
}
