import { createFetchStream } from "./createFetchStream.js";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import type { ClientConfig } from "./types/config.js";
import { useSmutilMergedConfig } from "./SmutilConfigProvider.js";

// Define all possible text extraction actions
export type TextExtractionAction = "personalInfo" | "event" | "textSchema";

// Type mapping for response types based on action
type ActionResponseTypes<S extends JSONSchema | undefined = undefined> = {
  personalInfo: {
    firstname: string;
    lastname: string;
    occupation: string;
    street: string;
    housenumber: string;
    postcode: string;
    city: string;
    country: string;
    birthday: string;
    email: string;
    phone: string;
  } & Record<string, unknown>;
  event: {
    title: string;
    participants: string[];
    location: string;
    notes: string;
    start_time: string;
    end_time: string;
    recurrence: string | null;
    timezone: string;
    alerts: string[];
    category: string;
    status: string;
    description: string;
  } & Record<string, unknown>;
  textSchema: S extends JSONSchema
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
>(action: T, schema?: S, config?: ClientConfig) {
  // Merge local config with global config
  const mergedConfig = useSmutilMergedConfig(config);
  const baseUrl = mergedConfig?.apiUrl || process.env["API_BASE_URL"];
  const url = new URL(`/stream/text-extract`, baseUrl);
  const { data, loading, error, fetchStream } = createFetchStream<
    ActionResponseTypes<S>[T]
  >(url, "application/json");

  const extract = (text: string) => {
    const payload = {
      text,
      action,
      metadata: JSON.stringify({
        ...(action === "event" && {
          userTimestamp: new Date().toISOString(),
        }),
        ...(action === "textSchema" && {
          userTimestamp: new Date().toISOString(),
          schema: JSON.stringify(schema),
        }),
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
