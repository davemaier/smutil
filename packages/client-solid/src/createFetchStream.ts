import { createSignal, Accessor } from "solid-js";
import { parse } from "./utils/partialParse";

interface ReadableStreamReadResult<T = Uint8Array> {
  done: boolean;
  value?: T;
}

interface FetchStreamResult<T> {
  data: Accessor<T | null>;
  loading: Accessor<boolean>;
  error: Accessor<Error | null>;
  fetchStream: (body: BodyInit) => Promise<void>;
}

const createFetchStream = <T extends Record<string, unknown>>(
  url: URL | string,
  contentType?: string
): FetchStreamResult<T> => {
  const [data, setData] = createSignal<T | null>(null);
  const [loading, setLoading] = createSignal<boolean>(false);
  const [error, setError] = createSignal<Error | null>(null);

  const fetchStream = async (body: BodyInit): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setData(null);

      const response = await fetch(url, {
        method: "POST",
        ...(contentType ? { headers: { "Content-Type": contentType } } : {}),
        body,
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
            // Process the chunk with proper type assertion
            const parsedData = parse(result) as T;
            setData(() => parsedData);
          } catch (parseError) {
            const errorMessage =
              parseError instanceof Error
                ? parseError.message
                : "Failed to parse stream data";
            throw new Error(`Failed to parse stream data: ${errorMessage}`);
          }
        }

        // Read the next chunk
        const nextChunk = await reader.read();
        return processStream(nextChunk);
      };

      // Start reading the stream
      const firstChunk = await reader.read();
      await processStream(firstChunk);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(() => error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchStream,
  };
};

export default createFetchStream;
