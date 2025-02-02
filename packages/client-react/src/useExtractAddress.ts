import { useCallback } from "react";
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
  const { data, setData, loading, error, fetchStream } =
    useFetchStream<ApiResponse>(url, "application/json");

  const extract = useCallback(
    (text: string) => {
      fetchStream(JSON.stringify({ text }));
    },
    [fetchStream]
  );

  return { data, setData, loading, error, extract };
}
