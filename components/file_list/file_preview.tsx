import type { UploadResponse } from "pinata";
import { useEffect, useState } from "react";
import { Image } from "@nextui-org/react";
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
import { getOptimizedThumbnailURL } from "@/components/common/utils";

interface FileListEntryProps {
   file: UploadResponse;
   width: number;
   height: number;
   onlyImage?: boolean;
}

function ImageThumbnail({ file, width, height }: Readonly<FileListEntryProps>) {
   const [url, setUrl] = useState<string>("");

   useEffect(() => {
      getOptimizedThumbnailURL(file.cid, width, height).then((url) =>
         setUrl(url)
      );
   }, [file.cid, height, width]);

   return (
      <Image
         classNames={{ wrapper: "-z-10" }}
         width={width}
         height={height}
         src={url}
         alt={file.name}
         radius="none"
      />
   );
}

function MediaPlayer({ file, width, height }: Readonly<FileListEntryProps>) {
   const [url, setUrl] = useState<string>("");

   useEffect(() => {
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
         .then((json) => setUrl(json.url))
         .catch(console.error);
   }, [file.cid]);

   return (
      <>
         {url.length > 0 ? (
            <video src={url} controls width={width} height={height}></video>
         ) : (
            <video controls width={width} height={height}></video>
         )}
      </>
   );
}

export function FilePreview({
   file,
   width,
   height,
   onlyImage
}: Readonly<FileListEntryProps>) {
   const className = "w-full h-full max-w-44 max-h-32 pt-3 -z-10";
   const fileType = file.mime_type.split(";")[0];

   if (fileType === "application/pdf") {
      return <FaFilePdf className={className} />;
   } else if (fileType === "text/csv") {
      return <FaFileCsv className={className} />;
   } else if (fileType === "text/html") {
      return <FaFileCode className={className} />;
   } else if (fileType.startsWith("text/")) {
      return <FaFileLines className={className} />;
   } else if (fileType.startsWith("audio/") || fileType === "application/ogg") {
      if (onlyImage) {
         return <FaFileAudio className={className} />;
      } else {
         return <MediaPlayer file={file} width={width} height={height} />;
      }
   } else if (fileType.startsWith("image/svg")) {
      return <FaFileImage className={className} />;
   } else if (fileType.startsWith("image/")) {
      return <ImageThumbnail file={file} width={width} height={height} />;
   } else if (fileType.startsWith("video/")) {
      if (onlyImage) {
         return <FaFileVideo className={className} />;
      } else {
         return <MediaPlayer file={file} width={width} height={height} />;
      }
   } else if (fileType.endsWith("zip")) {
      return <FaFileZipper className={className} />;
   } else if (fileType.endsWith("document") || fileType.endsWith("word")) {
      return <FaFileWord className={className} />;
   } else if (fileType.endsWith("sheet") || fileType.endsWith("excel")) {
      return <FaFileExcel className={className} />;
   } else if (
      fileType.endsWith("presentation") ||
      fileType.endsWith("powerpoint")
   ) {
      return <FaFilePowerpoint className={className} />;
   } else {
      return <FaFileCircleQuestion className={className} />;
   }
}
