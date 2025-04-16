import { useCallback } from "react";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import useFetchStream from "./useFetchStream";
import { readAndCompressImage } from "./utils/resizeImage";
import type { ClientConfig } from "./types/config";
import { useSmutilMergedConfig } from "./SmutilConfigProvider";

// Define all possible image extraction actions
export type ImageExtractionAction = "nsfw" | "imageSchema";

// Type mapping for response types based on action
type ActionResponseTypes<S extends JSONSchema | undefined = undefined> = {
  nsfw: {
    explicit: boolean;
    alt_tag: string;
  };
  imageSchema: S extends JSONSchema ? FromSchema<S> : Record<string, unknown>;
};

export function useImageExtract<
  T extends ImageExtractionAction,
  S extends JSONSchema | undefined = undefined
>(action: T, schema?: S, config?: ClientConfig) {
  // Merge local config with global config
  const mergedConfig = useSmutilMergedConfig(config);
  const baseUrl = mergedConfig?.apiUrl || process.env.API_BASE_URL;
  const apiKey = mergedConfig?.apiKey;
  const url = new URL(`/stream/image-extract`, baseUrl);
  const { data, loading, error, fetchStream } = useFetchStream<
    ActionResponseTypes<S>[T] & Record<string, unknown>
  >(url, undefined, apiKey); // Pass apiKey here

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
      data.append(
        "metadata",
        JSON.stringify({
          userTimestamp: new Date().toISOString(),
          schema: schema ? JSON.stringify(schema) : undefined,
        })
      );

      fetchStream(data);
    },
    [action, schema, fetchStream]
  );

  return {
    data,
    loading,
    error,
    extract,
  };
}