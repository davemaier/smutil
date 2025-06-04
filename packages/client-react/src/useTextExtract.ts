import { useCallback } from "react";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import useFetchStream from "./useFetchStream";
import type { ClientConfig } from "./types/config";
import { useAiHooksMergedConfig } from "./AiHooksConfigProvider";

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
  };
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
  };
  textSchema: S extends JSONSchema ? FromSchema<S> : Record<string, unknown>;
};

export function useTextExtract<
  T extends TextExtractionAction,
  S extends JSONSchema | undefined = undefined
>(action: T, schema?: S, config?: ClientConfig) {
  // Merge local config with global config
  const mergedConfig = useAiHooksMergedConfig(config);
  const baseUrl = mergedConfig?.apiUrl || process.env.API_BASE_URL;
  const apiKey = mergedConfig?.apiKey;
  const url = new URL(`/stream/text-extract`, baseUrl);
  const { data, loading, error, fetchStream } = useFetchStream<
    ActionResponseTypes<S>[T] & Record<string, unknown>
  >(url, "application/json", apiKey); // Pass apiKey here

  const extract = useCallback(
    (text: string) => {
      const payload = {
        text,
        action,
        metadata: JSON.stringify({
          ...(action === "event" && {
            userTimestamp: new Date().toISOString(),
          }),
          ...(action === "textSchema" && {
            schema: JSON.stringify(schema),
          }),
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
