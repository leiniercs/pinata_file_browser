"use client";
import type { ChangeEvent, DragEvent } from "react";
import type { UploadResponse } from "pinata";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@nextui-org/react";
import { MdCloudUpload } from "react-icons/md";
import { FileUploadEntry } from "@/components/file_upload/file_entry";
import { GlobalContext } from "@/components/contexts/global";

interface FileUploadDropboxProps {
   onUploadingFinished?(): void;
}

export function FileUploadDropbox({
   onUploadingFinished
}: Readonly<FileUploadDropboxProps>) {
   const { setFiles } = useContext(GlobalContext);
   const tFileUpload = useTranslations("file_upload");
   const [mounted, setMounted] = useState<boolean>(false);
   const [filesSelected, setFilesSelected] = useState<File[]>([]);
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [filesUploaded, setFilesUploaded] = useState<
      Array<UploadResponse | null>
   >([]);
   const refFile = useRef<HTMLInputElement>(null);
   const onChooseFileClick = useCallback(() => {
      refFile.current?.click();
   }, []);
   const onFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.files) {
         setFilesSelected(
            event.currentTarget.files.length > 0
               ? Array.from(event.currentTarget.files)
               : []
         );

         event.currentTarget.value = "";
      }
   }, []);
   const onFileUploaded = useCallback(
      (uploadedFile: UploadResponse | null) => {
         setFilesUploaded((prevState: Array<UploadResponse | null>) => {
            const proposedState: Array<UploadResponse | null> = [
               ...prevState,
               uploadedFile
            ];

            if (proposedState.length === filesSelected.length) {
               setFilesSelected([]);
               setTimeout(() => {
                  setFiles((prevState: UploadResponse[]) => [
                     ...prevState,
                     ...(proposedState.filter(
                        (state: UploadResponse | null) => state !== null
                     ) as UploadResponse[])
                  ]);
                  setFilesUploaded([]);

                  if (onUploadingFinished) {
                     onUploadingFinished();
                  }
               }, 1000);
            }

            return proposedState;
         });
      },
      [filesSelected.length, onUploadingFinished, setFiles]
   );
   const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (event.dataTransfer.files.length > 0) {
         setFilesSelected(Array.from(event.dataTransfer.files));
      }

      event.currentTarget.dataset.drag = undefined;
   }, []);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return null;
   }

   return (
      <div
         className="data-[drag='true']:bg-content2 border-2 border-dashed border-foreground-500 p-10 rounded-lg flex flex-col gap-5 justify-center items-center"
         onDragOver={(event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.currentTarget.dataset.drag = "true";
         }}
         onDragLeave={(event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.currentTarget.dataset.drag = undefined;
         }}
         onDrop={onDrop}
      >
         {filesSelected.length === 0 ? (
            <>
               <MdCloudUpload className="h-40 w-40" />
               <div className="flex flex-col items-center gap-2">
                  <span className="font-bold text-lg">
                     {tFileUpload("drop_files_here")}
                  </span>
                  <Button
                     className="font-semibold italic"
                     size="md"
                     onClick={onChooseFileClick}
                  >
                     {tFileUpload("choose_files")}
                  </Button>
               </div>
               <input
                  ref={refFile}
                  type="file"
                  multiple
                  hidden
                  onChange={onFileChange}
               />
            </>
         ) : (
            <div className="flex gap-10 flex-wrap justify-center overflow-auto">
               {filesSelected.map((file: File, index: number) => (
                  <FileUploadEntry
                     key={index}
                     file={file}
                     onFileUploaded={onFileUploaded}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
