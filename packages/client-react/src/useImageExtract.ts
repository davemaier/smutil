import { useCallback } from "react";
import useFetchStream from "./useFetchStream";
import { readAndCompressImage } from "./utils/resizeImage";

// Define all possible image extraction actions
export type ImageExtractionAction = "nsfw";

// Type mapping for response types based on action
type ActionResponseTypes = {
  nsfw: {
    explicit: boolean;
    alt_tag: string;
  };
};

export function useImageExtract<T extends ImageExtractionAction>(action: T) {
  const url = new URL(`/stream/image-extract`, process.env.API_BASE_URL);
  const { data, loading, error, fetchStream } =
    useFetchStream<ActionResponseTypes[T]>(url);

  const extract = useCallback(
    async (image: File) => {
      const resizedImage = await readAndCompressImage(image, {
        quality: 0.5,
        maxWidth: 800,
        maxHeight: 800,
      });
      const data = new FormData();

      data.append("image", resizedImage);
      data.append("action", action);

      fetchStream(data);
    },
    [action, fetchStream]
  );

  return {
    data,
    loading,
    error,
    extract,
  };
}
