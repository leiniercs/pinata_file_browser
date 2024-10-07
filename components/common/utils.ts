export function getFileSizeRepresentation(size: number): string {
   if (size < 1e3) {
      return `${size} bytes`;
   } else if (size >= 1e3 && size < 1e6) {
      return `${(size / 1e3).toFixed(2)} KB`;
   } else if (size >= 1e6 && size < 1e9) {
      return `${(size / 1e6).toFixed(2)} MB`;
   } else {
      return `${(size / 1e9).toFixed(2)} GB`;
   }
}

export async function getOptimizedThumbnailURL(
   cid: string,
   width: number,
   height: number
): Promise<string> {
   try {
      const response = await fetch("/api/thumbnail", {
         method: "POST",
         mode: "cors",
         cache: "no-store",
         headers: {
            accept: "application/json",
            "content-type": "application/json"
         },
         body: JSON.stringify({ cid, width, height })
      });

      const thumbnailData = await response.json();

      return thumbnailData.url as string;
   } catch (err) {
      console.error(err);

      return "";
   }
}
