"use client";
import type { UploadResponse } from "pinata";
import { useContext } from "react";
import { FileUploadDropbox } from "@/components/file_upload/dropbox";
import { FileListEntry } from "@/components/file_list/file_entry";
import { GlobalContext } from "@/components/contexts/global";

export function FileList() {
   const { files } = useContext(GlobalContext);

   return (
      <>
         {files.length === 0 ? (
            <FileUploadDropbox />
         ) : (
            <div className="flex flex-wrap gap-5 justify-evenly md:justify-start">
               {files.map((file: UploadResponse, index: number) => (
                  <FileListEntry key={index} file={file} />
               ))}
            </div>
         )}
      </>
   );
}
