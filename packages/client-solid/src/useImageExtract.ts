import { createFetchStream } from "./createFetchStream.js";
import { readAndCompressImage } from "./utils/resizeImage.js";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import type { ClientConfig } from "./types/config.js";
import { useHooxonMergedConfig } from "./HooxonConfigProvider.js";

// Define all possible image extraction actions
export type ImageExtractionAction = "nsfw" | "imageSchema";

// Type mapping for response types based on action
type ActionResponseTypes<S extends JSONSchema | undefined = undefined> = {
  nsfw: {
    explicit: boolean;
    alt_tag: string;
  };
  imageSchema: S extends JSONSchema
    ? FromSchema<S> & Record<string, unknown>
    : Record<string, unknown>;
};

export function useImageExtract<
  T extends ImageExtractionAction,
  S extends JSONSchema | undefined = undefined
>(action: T, schema?: S, config?: ClientConfig) {
  // Merge local config with global config
  const mergedConfig = useHooxonMergedConfig(config);
  const baseUrl = mergedConfig?.apiUrl || process.env["API_BASE_URL"];
  const url = new URL(`/stream/image-extract`, baseUrl);
  const { data, loading, error, fetchStream } = createFetchStream<
    ActionResponseTypes[T]
  >(url, undefined, mergedConfig?.apiKey);

  const extract = async (image: File) => {
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
  };

  return {
    data,
    loading,
    error,
    extract,
  };
}
