"use client";
import type { UploadResponse } from "pinata";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
   Card,
   CardBody,
   CardFooter,
   CardHeader,
   Progress,
   Tooltip
} from "@nextui-org/react";
import {
   FaFilePdf,
   FaFileWord,
   FaFileExcel,
   FaFilePowerpoint,
   FaFileLines,
   FaFileAudio,
   FaFileImage,
   FaFileVideo,
   FaFileZipper,
   FaFileCsv,
   FaFileCode,
   FaFileCircleQuestion
} from "react-icons/fa6";
import { getFileSizeRepresentation } from "@/components/common/utils";
import { pinata } from "@/components/common/pinata";

interface FileUploadEntryProps {
   file: File;
   onFileUploaded(file: UploadResponse | null): void;
}

export function FileUploadEntry({
   file,
   onFileUploaded
}: Readonly<FileUploadEntryProps>) {
   const tFileUpload = useTranslations("file_upload");
   const [mounted, setMounted] = useState<boolean>(false);
   const [isFailed, setFailed] = useState<boolean>(false);
   const [uploadedPercentage, setUploadedPercentage] = useState<number>(0);
   const fileTypeIcon = useMemo(() => {
      const className = "w-full h-full max-w-32 max-h-32";

      if (file.type === "application/pdf") {
         return <FaFilePdf className={className} />;
      } else if (file.type === "text/csv") {
         return <FaFileCsv className={className} />;
      } else if (file.type === "text/html") {
         return <FaFileCode className={className} />;
      } else if (file.type.startsWith("text/")) {
         return <FaFileLines className={className} />;
      } else if (file.type.startsWith("audio/")) {
         return <FaFileAudio className={className} />;
      } else if (file.type.startsWith("image/")) {
         return <FaFileImage className={className} />;
      } else if (file.type.startsWith("video/")) {
         return <FaFileVideo className={className} />;
      } else if (file.type.endsWith("zip")) {
         return <FaFileZipper className={className} />;
      } else if (file.type.endsWith("document") || file.type.endsWith("word")) {
         return <FaFileWord className={className} />;
      } else if (file.type.endsWith("sheet") || file.type.endsWith("excel")) {
         return <FaFileExcel className={className} />;
      } else if (
         file.type.endsWith("presentation") ||
         file.type.endsWith("powerpoint")
      ) {
         return <FaFilePowerpoint className={className} />;
      } else {
         return <FaFileCircleQuestion className={className} />;
      }
   }, [file.type]);
   const uploadFile = useCallback(() => {
      if (uploadedPercentage !== 0) {
         return;
      }

      setUploadedPercentage(0);
      setFailed(false);
      try {
         fetch("/api/key", {
            method: "GET",
            cache: "no-cache",
            headers: { accept: "application/json" }
         })
            .then((response) => {
               if (response.status === 200) {
                  setUploadedPercentage(25);

                  return response.json();
               } else {
                  setFailed(true);
                  onFileUploaded(null);
                  throw response;
               }
            })
            .then((keyData) => {
               const uploadBuilder = pinata.upload.file(file, {
                  keys: keyData.JWT,
                  metadata: {
                     name: file.name
                  }
               });

               setUploadedPercentage(50);
               uploadBuilder
                  .then((uploadResponse: UploadResponse) => {
                     setUploadedPercentage(75);
                     fetch("/api/key", {
                        method: "DELETE",
                        mode: "cors",
                        cache: "no-store",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ id: keyData.pinata_api_key })
                     })
                        .catch(console.error)
                        .finally(() => {
                           setUploadedPercentage(100);
                           onFileUploaded(uploadResponse);
                        });
                  })
                  .catch((reason) => {
                     setFailed(true);
                     onFileUploaded(null);
                     console.error(reason);
                  });
            })
            .catch(console.error);
      } catch (err) {
         console.error(err);
      }
   }, [file, onFileUploaded, uploadedPercentage]);

   useEffect(() => {
      uploadFile();
      setMounted(true);
   }, [uploadFile]);

   if (!mounted) {
      return null;
   }

   return (
      <Card
         classNames={{
            base: "border-2 border-foreground-300 w-full max-w-60",
            header: "flex flex-row justify-center",
            body: "flex flex-row flex-nowrap gap-5 justify-between",
            footer: "p-0"
         }}
      >
         <CardHeader>{fileTypeIcon}</CardHeader>
         <CardBody>
            <Tooltip content={file.name}>
               <span className="font-bold text-sm truncate">{file.name}</span>
            </Tooltip>
            <span className="font-bold text-sm text-nowrap">
               {getFileSizeRepresentation(file.size)}
            </span>
         </CardBody>
         <CardFooter>
            <Progress
               aria-label={`${tFileUpload("uploading")} ${file.name}`}
               className="w-full"
               color={
                  isFailed
                     ? "danger"
                     : uploadedPercentage === 0
                       ? "default"
                       : uploadedPercentage === 100
                         ? "success"
                         : "primary"
               }
               size="sm"
               isIndeterminate={uploadedPercentage === 0}
               isStriped={uploadedPercentage === 0}
               value={uploadedPercentage}
            />
         </CardFooter>
      </Card>
   );
}
