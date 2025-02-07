import { useCallback } from "react";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import useFetchStream from "./useFetchStream";

// Define all possible text extraction actions
export type TextExtractionAction = "address" | "event" | "schema";

// Type mapping for response types based on action
type ActionResponseTypes<S extends JSONSchema | undefined = undefined> = {
  address: {
    firstname: string;
    lastname: string;
    occupation: string;
    street: string;
    housenumber: string;
    postcode: string;
    city: string;
    country: string;
    birthday: string;
  };
  event: {
    title: string;
    participants: string[];
    location: string;
    notes: string;
    start_time: string;
    end_time: string;
  };
  schema: S extends JSONSchema ? FromSchema<S> : Record<string, unknown>;
};

export function useTextExtract<
  T extends TextExtractionAction,
  S extends JSONSchema | undefined = undefined
>(action: T, schema?: S) {
  const url = new URL(`/stream/text-extract`, process.env.API_BASE_URL);
  const { data, loading, error, fetchStream } = useFetchStream<
    ActionResponseTypes<S>[T] & Record<string, unknown>
  >(url, "application/json");

  const extract = useCallback(
    (text: string) => {
      const payload = {
        text,
        action,
        metadata: JSON.stringify({
          userTimestamp: new Date().toISOString(),
          schema: JSON.stringify(schema),
        }),
      };

      fetchStream(JSON.stringify(payload));
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
