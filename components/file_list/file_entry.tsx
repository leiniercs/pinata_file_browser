"use client";
import type { UploadResponse } from "pinata";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Tooltip } from "@nextui-org/react";
import { MdCloudDownload, MdDeleteForever } from "react-icons/md";
import { FilePreview } from "@/components/file_list/file_preview";
import { GlobalContext } from "@/components/contexts/global";
import { getFileSizeRepresentation } from "@/components/common/utils";

interface FileListEntryProps {
   file: UploadResponse;
}

export function FileListEntry({ file }: Readonly<FileListEntryProps>) {
   const { setSelectedFile, removeFile, fileDetailsDialog } =
      useContext(GlobalContext);
   const [mounted, setMounted] = useState<boolean>(false);
   const [isDownloading, setDownloading] = useState<boolean>(false);
   const [isDeleting, setDeleting] = useState<boolean>(false);
   const onClick = useCallback(() => {
      setSelectedFile(file);
      fileDetailsDialog.onOpen();
   }, [file, fileDetailsDialog, setSelectedFile]);
   const onDownloadClick = useCallback(() => {
      setDownloading(true);

      fetch(`/api/file/${file.cid}`, {
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
   }, [file.cid]);
   const onDeleteClick = useCallback(() => {
      setDeleting(true);

      fetch("/api/file", {
         method: "DELETE",
         mode: "cors",
         cache: "no-store",
         headers: { "content-type": "application/json" },
         body: JSON.stringify({ id: file.id })
      })
         .then((response) => {
            if (response.status === 200) {
               removeFile(file);
            } else {
               throw response;
            }
         })
         .catch(console.error)
         .finally(() => {
            setDeleting(false);
         });
   }, [file, removeFile]);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return null;
   }

   return (
      <Card
         classNames={{
            base: "border-2 border-foreground-300 w-full max-w-44 overflow-hidden",
            header: "relative flex flex-row justify-center p-0",
            body: "flex flex-row flex-nowrap gap-5 justify-between"
         }}
         isHoverable
         isPressable
         isDisabled={isDeleting}
         onClick={onClick}
      >
         <CardHeader>
            <Button
               as="div"
               className="absolute top-0 left-0 border-t-0 border-l-0 rounded-tr-none rounded-bl-none"
               color="success"
               variant="faded"
               isIconOnly
               isLoading={isDownloading}
               onClick={onDownloadClick}
            >
               <MdCloudDownload className="w-5 h-5" />
            </Button>
            <FilePreview file={file} width={173} height={128} onlyImage />
            <Button
               as="div"
               className="absolute top-0 right-0 border-t-0 border-r-0 rounded-tl-none rounded-br-none"
               color="danger"
               variant="faded"
               isIconOnly
               isLoading={isDeleting}
               onClick={onDeleteClick}
            >
               <MdDeleteForever className="w-5 h-5" />
            </Button>
         </CardHeader>
         <CardBody>
            <Tooltip content={file.name}>
               <span className="font-bold text-sm truncate">{file.name}</span>
            </Tooltip>
            <span className="font-bold text-sm text-nowrap">
               {getFileSizeRepresentation(file.size)}
            </span>
         </CardBody>
      </Card>
   );
}
