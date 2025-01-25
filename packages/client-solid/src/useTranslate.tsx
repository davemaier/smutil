import { useCallback } from "react";
import useFetchStream from "./createFetchStream";

interface ApiResponse {
  language: string;
  text: string;
}

const url = new URL("/api/stream/translate", import.meta.env.VITE_API_BASE_URL);

export function useTranslate() {
  const { data, loading, error, fetchStream } = useFetchStream<ApiResponse>(
    url,
    "application/json"
  );

  const translate = useCallback(
    (text: string, language: string) => {
      fetchStream(JSON.stringify({ text, targetLanguage: language }));
    },
    [fetchStream]
  );

  return { data, loading, error, translate };
}
