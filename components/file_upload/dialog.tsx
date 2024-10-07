"use client";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
   Button,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader
} from "@nextui-org/react";
import { MdClose } from "react-icons/md";
import { FileUploadDropbox } from "@/components/file_upload/dropbox";
import { GlobalContext } from "@/components/contexts/global";

export function FileUploadDialog() {
   const { fileUploadDialog } = useContext(GlobalContext);
   const tCommon = useTranslations("common");
   const tFileUpload = useTranslations("file_upload");
   const [mounted, setMounted] = useState<boolean>(false);
   const onCloseClick = useCallback(() => {
      fileUploadDialog.onClose();
   }, [fileUploadDialog]);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return null;
   }

   return (
      <Modal
         classNames={{
            body: "flex flex-col gap-6",
            header: "flex justify-between",
            footer: "flex justify-between"
         }}
         closeButton={<></>}
         isDismissable={false}
         isOpen={fileUploadDialog.isOpen}
         onOpenChange={onCloseClick}
      >
         <ModalContent>
            <ModalHeader>
               {tFileUpload("title")}
               <Button
                  className="border-0"
                  color="danger"
                  variant="ghost"
                  radius="full"
                  size="sm"
                  isIconOnly
                  onClick={onCloseClick}
               >
                  <MdClose className="h-5 w-5 text-foreground" />
               </Button>
            </ModalHeader>
            <ModalBody>
               <FileUploadDropbox onUploadingFinished={onCloseClick} />
            </ModalBody>
            <ModalFooter>
               <Button color="default" onClick={onCloseClick}>
                  {tCommon("cancel")}
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
}
