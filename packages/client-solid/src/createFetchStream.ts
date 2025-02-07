import { createSignal, Accessor } from "solid-js";
import { createStore } from "solid-js/store";
import { parse } from "./utils/partialParse.js";

interface ReadableStreamReadResult<T = Uint8Array> {
  done: boolean;
  value?: T;
}

interface FetchStreamResult<T> {
  data: T;
  setData: (data: T) => void;
  loading: Accessor<boolean>;
  error: Accessor<Error | null>;
  fetchStream: (body: BodyInit, options?: RequestInit) => Promise<void>;
}

export const createFetchStream = <T extends Record<string, unknown>>(
  url: URL | string,
  contentType?: string
): FetchStreamResult<T> => {
  const [data, setData] = createStore<T>({} as T);
  const [loading, setLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<Error | null>(null);

  const fetchStream = async (
    body: BodyInit,
    options?: RequestInit
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setData({} as T);

      const defaultOptions: RequestInit = {
        method: "POST",
        ...(contentType ? { headers: { "Content-Type": contentType } } : {}),
        body,
      };

      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported in this environment");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      // Function to process the stream
      const processStream = async ({
        done,
        value,
      }: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
        if (done) {
          return;
        }

        if (value) {
          // Decode the chunk of data
          result += decoder.decode(value, { stream: true });

          try {
            const parsedData = parse(result) as T;
            setData(parsedData);
          } catch (parseError) {
            const errorMessage =
              parseError instanceof Error
                ? parseError.message
                : "Failed to parse stream data";
            throw new Error(`Failed to parse stream data: ${errorMessage}`);
          }
        }

        const nextChunk = await reader.read();
        return processStream(nextChunk);
      };

      const firstChunk = await reader.read();
      await processStream(firstChunk);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(() => errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    setData,
    loading,
    error,
    fetchStream,
  };
};
