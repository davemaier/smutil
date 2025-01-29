import { useCallback } from "react";
import useFetchStream from "./useFetchStream";

interface ApiResponse {
  language: string;
  text: string;
}

const url = new URL("/stream/translate", process.env.API_BASE_URL);

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
