import { useCallback } from "react";
import useFetchStream from "./useFetchStream";

// Define the structure of your API response
interface ApiResponse {
  event: string;
  participants: string[];
  location: string;
  notes: string;
  start_time: string;
  end_time: string;
}

const url = new URL(
  "/api/stream/extract-event",
  import.meta.env.VITE_API_BASE_URL,
);

export function useExtractEvent() {
  const { data, loading, error, fetchStream } = useFetchStream<ApiResponse>(
    url,
    "application/json",
  );

  const extract = useCallback(
    (text: string) => {
      fetchStream(JSON.stringify({ text }));
    },
    [fetchStream],
  );

  return { data, loading, error, extract };
}
