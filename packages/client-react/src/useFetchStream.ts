import { useCallback, useState } from "react";
import { parse } from "./utils/partialParseOld";

interface ReadableStreamReadResult<T> {
  done: boolean;
  value: T | undefined;
}

const useFetchStream = <T>(url: URL, contentType?: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error] = useState<Error | null>(null);

  const fetchStream = useCallback(
    (body: BodyInit) => {
      setLoading(true);
      fetch(url, {
        method: "POST",
        ...(contentType ? { headers: { "Content-Type": contentType } } : {}),
        body,
      })
        .then((response) => {
          if (!response.body) {
            throw new Error("ReadableStream not supported in this environment");
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let result = "";

          // Function to process the stream
          function processStream({
            done,
            value,
          }: ReadableStreamReadResult<Uint8Array>): Promise<void> {
            if (done) {
              return Promise.resolve();
            }

            if (value) {
              // Decode the chunk of data
              result += decoder.decode(value, { stream: true });

              // Process the chunk (for example, log it)
              setData(parse(result));
            }

            // Read the next chunk
            // eslint-disable-next-line
            // @ts-ignore
            return reader.read().then(processStream);
          }

          // Start reading the stream
          // eslint-disable-next-line
          // @ts-ignore
          return reader.read().then(processStream);
        })
        .finally(() => setLoading(false));
    },
    [url, contentType]
  );

  return { data, loading, error, fetchStream };
};

export default useFetchStream;
