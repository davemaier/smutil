import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import { useCallback } from "react";
import useFetchStream from "./useFetchStream";

interface ApiResponse {
  language: string;
  text: string;
}

const url = new URL("/stream/extract-structured", process.env.API_BASE_URL);

export function useExtractStructured<S extends JSONSchema>(
  schema: JSONSchema
): {
  data: FromSchema<S> | null;
  loading: boolean;
  error: Error | null;
  extract: (text: string) => void;
} {
  const { data, loading, error, fetchStream } = useFetchStream<ApiResponse>(
    url,
    "application/json"
  );

  const extract = useCallback(
    (text: string) => {
      fetchStream(JSON.stringify({ text, schema: JSON.stringify(schema) }));
    },
    [fetchStream, schema]
  );

  return { data: data as any, loading, error, extract };
}
