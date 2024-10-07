"use client";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
   Button,
   Modal,
   ModalBody,
   ModalContent,
   ModalFooter,
   ModalHeader,
   Tooltip
} from "@nextui-org/react";
import { MdClose } from "react-icons/md";
import { MdCloudDownload, MdDeleteForever } from "react-icons/md";
import { FilePreview } from "@/components/file_list/file_preview";
import { GlobalContext } from "@/components/contexts/global";
import { getFileSizeRepresentation } from "@/components/common/utils";

interface FieldRepresentationProps {
   label: string;
   value: string;
}

function FieldRepresentation({
   label,
   value
}: Readonly<FieldRepresentationProps>) {
   return (
      <div className="flex flex-nowrap gap-3">
         <span className="font-bold text-nowrap">{label}:</span>
         <Tooltip classNames={{ content: "p-2 bg-content2" }} content={value}>
            <span className="truncate">{value}</span>
         </Tooltip>
      </div>
   );
}
export function FileDetailsDialog() {
   const { fileDetailsDialog, selectedFile, setSelectedFile, removeFile } =
      useContext(GlobalContext);
   const tCommon = useTranslations("common");
   const tFileDetails = useTranslations("file_details");
   const [mounted, setMounted] = useState<boolean>(false);
   const [isDownloading, setDownloading] = useState<boolean>(false);
   const [isDeleting, setDeleting] = useState<boolean>(false);
   const onCloseClick = useCallback(() => {
      setSelectedFile({
         cid: "",
         created_at: new Date().toISOString(),
         group_id: "",
         id: "",
         mime_type: "",
         name: "",
         number_of_files: 0,
         size: 0,
         user_id: ""
      });
      setDownloading(false);
      setDeleting(false);
      fileDetailsDialog.onClose();
   }, [fileDetailsDialog, setSelectedFile]);
   const onDownloadClick = useCallback(() => {
      setDownloading(true);

      fetch(`/api/file/${selectedFile.cid}`, {
         method: "GET",
         mode: "cors",
         cache: "no-store",
         headers: { accept: "application/json" }
      })
         .then((response) => {
            if (response.status === 200) {
               return response.json();
            } else {
               throw response;
            }
         })
         .then((json) => window.open(json.url, "_blank"))
         .catch(console.error)
         .finally(() => {
            setDownloading(false);
         });
   }, [selectedFile.cid]);
   const onDeleteClick = useCallback(() => {
      setDeleting(true);

      fetch("/api/file", {
         method: "DELETE",
         mode: "cors",
         cache: "no-store",
         headers: { "content-type": "application/json" },
         body: JSON.stringify({ id: selectedFile.id })
      })
         .then((response) => {
            if (response.status === 200) {
               removeFile(selectedFile);
               onCloseClick();
            } else {
               throw response;
            }
         })
         .catch(console.error)
         .finally(() => {
            setDeleting(false);
         });
   }, [selectedFile, removeFile, onCloseClick]);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return null;
   }

   return (
      <Modal
         classNames={{
            header: "flex justify-between",
            body: "flex flex-col gap-6 ",
            footer: "flex justify-between"
         }}
         closeButton={<></>}
         isDismissable={false}
         isOpen={fileDetailsDialog.isOpen}
         onOpenChange={onCloseClick}
      >
         <ModalContent>
            <ModalHeader>
               {tFileDetails("title")}
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
               <div className="flex justify-center">
                  <FilePreview file={selectedFile} width={400} height={200} />
               </div>
               <div className="flex flex-col gap-3">
                  <FieldRepresentation
                     label={tFileDetails("file_name")}
                     value={selectedFile.name}
                  />
                  <div className="flex justify-between">
                     <FieldRepresentation
                        label={tFileDetails("size")}
                        value={getFileSizeRepresentation(selectedFile.size)}
                     />
                     <FieldRepresentation
                        label={tFileDetails("mime_type")}
                        value={selectedFile.mime_type.split(";")[0]}
                     />
                  </div>
                  <FieldRepresentation
                     label={tFileDetails("cid")}
                     value={selectedFile.cid}
                  />
                  <FieldRepresentation
                     label={tFileDetails("creation_date")}
                     value={new Date(selectedFile.created_at).toLocaleString()}
                  />
               </div>
            </ModalBody>
            <ModalFooter>
               <Button color="default" variant="faded" onClick={onCloseClick}>
                  {tCommon("cancel")}
               </Button>
               <div className="flex gap-4">
                  <Button
                     color="success"
                     variant="faded"
                     endContent={<MdCloudDownload className="w-5 h-5" />}
                     isLoading={isDownloading}
                     onClick={onDownloadClick}
                  >
                     {tCommon("download")}
                  </Button>
                  <Button
                     color="danger"
                     variant="faded"
                     endContent={<MdDeleteForever className="w-5 h-5" />}
                     isLoading={isDeleting}
                     onClick={onDeleteClick}
                  >
                     {tCommon("delete")}
                  </Button>
               </div>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
}
