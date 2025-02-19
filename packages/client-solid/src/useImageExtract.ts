import { createFetchStream } from "./createFetchStream.js";
import { readAndCompressImage } from "./utils/resizeImage.js";
import { FromSchema, JSONSchema } from "json-schema-to-ts";

// Define all possible image extraction actions
export type ImageExtractionAction = "nsfw" | "schema";

// Type mapping for response types based on action
type ActionResponseTypes<S extends JSONSchema | undefined = undefined> = {
  nsfw: {
    explicit: boolean;
    alt_tag: string;
  };
  schema: S extends JSONSchema
    ? FromSchema<S> & Record<string, unknown>
    : Record<string, unknown>;
};

export function useImageExtract<
  T extends ImageExtractionAction,
  S extends JSONSchema | undefined = undefined
>(action: T, schema?: S) {
  const url = new URL(`/stream/image-extract`, process.env["API_BASE_URL"]);
  const { data, loading, error, fetchStream } =
    createFetchStream<ActionResponseTypes[T]>(url);

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
