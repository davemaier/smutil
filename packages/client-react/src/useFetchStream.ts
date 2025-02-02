import { createSignal } from "solid-js";
import { parse } from "./utils/partialParse";

function useFetchStream<T>(url: URL, contentType?: string) {
  const [data, setData] = createSignal<T | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);

  const fetchStream = async (body: BodyInit) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: contentType ? { "Content-Type": contentType } : undefined,
        body,
      });

      if (!response.body) throw new Error("ReadableStream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setData(parse(result));
      }
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, setData, loading, error, fetchStream };
}

export default useFetchStream;
