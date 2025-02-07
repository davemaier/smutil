import { createFetchStream } from "./createFetchStream.js";
import { FromSchema, JSONSchema } from "json-schema-to-ts";

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
  } & Record<string, unknown>;
  event: {
    title: string;
    participants: string[];
    location: string;
    notes: string;
    start_time: string;
    end_time: string;
  } & Record<string, unknown>;
  schema: S extends JSONSchema
    ? FromSchema<S> & Record<string, unknown>
    : Record<string, unknown>;
};

// type ExtractParams<
//   T extends TextExtractionAction,
//   S extends JSONSchema | undefined = undefined
// > = T extends "schema" ? { text: string; schema: S } : { text: string };

export function useTextExtract<
  T extends TextExtractionAction,
  S extends JSONSchema | undefined = undefined
>(action: T, schema?: S) {
  const url = new URL(`/stream/text-extract`, process.env["API_BASE_URL"]);
  const { data, loading, error, fetchStream } = createFetchStream<
    ActionResponseTypes<S>[T]
  >(url, "application/json");

  const extract = (text: string) => {
    const payload = {
      text,
      action,
      metadata: JSON.stringify({
        userTimestamp: new Date().toISOString(),
        schema: JSON.stringify(schema),
      }),
    };

    fetchStream(JSON.stringify(payload));
  };

  return {
    data,
    loading,
    error,
    extract,
  };
}
