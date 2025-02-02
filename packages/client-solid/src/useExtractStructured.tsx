import createFetchStream from "./createFetchStream";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { Accessor } from "solid-js";

// Add index signature to satisfy Record<string, unknown>
interface ApiResponse extends Record<string, unknown> {
  language: string;
  text: string;
}

const url = new URL("/stream/extract-structured", process.env.API_BASE_URL);

export function useExtractStructured<S extends JSONSchema>(
  schema: JSONSchema
): {
  data: Accessor<FromSchema<S> | null>;
  loading: Accessor<boolean>;
  error: Accessor<Error | null>;
  extract: (text: string) => void;
} {
  const { data, loading, error, fetchStream } = createFetchStream<ApiResponse>(
    url,
    "application/json"
  );

  const extract = (text: string) => {
    fetchStream(JSON.stringify({ text, schema: JSON.stringify(schema) }));
  };

  return {
    data: () => data() as FromSchema<S> | null,
    loading,
    error,
    extract,
  };
}
