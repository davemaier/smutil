import { useCallback, useEffect } from "react";
import useFetchStream from "./useFetchStream";

interface ApiResponse {
  firstname: string;
  lastname: string;
  occupation: string;
  street: string;
  housenumber: string;
  postcode: string;
  city: string;
  country: string;
  birthday: string;
}

const url = new URL("/stream/extract-address", process.env.API_BASE_URL);

export function useExtractAddress() {
  const { data, loading, error, fetchStream } = useFetchStream<ApiResponse>(
    url,
    "application/json"
  );

  useEffect(() => console.log("loading ", loading), [loading]);

  const extract = useCallback(
    (text: string) => {
      fetchStream(JSON.stringify({ text }));
    },
    [fetchStream]
  );

  return { data, loading, error, extract };
}
