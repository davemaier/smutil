import useFetchStream from "./createFetchStream";

interface ApiResponse extends Record<string, unknown> {
  language: string;
  text: string;
}

const url = new URL("/stream/translate", process.env.API_BASE_URL);

export function useTranslate() {
  const { data, loading, error, fetchStream } = useFetchStream<ApiResponse>(
    url,
    "application/json"
  );

  const translate = (text: string, language: string) => {
    fetchStream(JSON.stringify({ text, targetLanguage: language }));
  };

  return { data, loading, error, translate };
}
