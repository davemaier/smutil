import { useCallback } from "react";
import useFetchStream from "./createFetchStream";
import { readAndCompressImage } from "./utils/resizeImage";

interface ApiResponse extends Record<string, unknown> {
  explicit: boolean;
  alt_tag: string;
}

const url = new URL(
  "/api/stream/classify-image",
  import.meta.env.VITE_API_BASE_URL
);

export function useClassifyImage() {
  const { data, loading, error, fetchStream } =
    useFetchStream<ApiResponse>(url);

  const uploadImage = useCallback(
    async (image: File) => {
      const resizedImage = await readAndCompressImage(image, {
        quality: 0.5,
        maxWidth: 800,
        maxHeight: 800,
      });
      const data = new FormData();

      data.append("image", resizedImage);

      fetchStream(data);
    },
    [fetchStream]
  );

  return { uploadImage, data, loading, error };
}
