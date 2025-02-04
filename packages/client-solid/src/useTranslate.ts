import { createSignal, createEffect, onCleanup } from "solid-js";
import { createFetchStream } from "./createFetchStream";

export function useTranslate(initialLang: string) {
  const [targetLang, setTargetLang] = createSignal(initialLang);
  const [translations, setTranslations] = createSignal<Record<string, string>>(
    {}
  );
  const [pending, setPending] = createSignal<Set<string>>(new Set());
  const [inFlight, setInFlight] = createSignal<Set<string>>(new Set());
  let timeoutId: number | undefined;

  const url = new URL(`/stream/translate`, process.env.API_BASE_URL);
  const { data, loading, error, fetchStream } = createFetchStream<
    Record<string, string>
  >(url, "application/json");

  // Reset translations when language changes
  createEffect(() => {
    targetLang();
    setTranslations({});
    setPending(new Set<string>());
    setInFlight(new Set<string>());
    clearTimeout(timeoutId);
  });

  createEffect(() => {
    if (!loading() && data()) {
      setTranslations((prev) => ({ ...prev, ...data() }));
      setInFlight(new Set<string>());
    }
  });

  const batchTranslate = () => {
    const texts = Array.from(pending());
    if (texts.length === 0) return;

    setInFlight(new Set(texts));
    setPending(new Set<string>());

    fetchStream(
      JSON.stringify({
        texts,
        targetLanguage: targetLang(),
      })
    );
  };

  const t = (text: string) => {
    const translated = translations()[text];
    if (translated) return translated;

    if (!pending().has(text) && !inFlight().has(text)) {
      setPending((prev) => new Set([...prev, text]));
    }

    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(batchTranslate, 100);

    return text;
  };

  onCleanup(() => clearTimeout(timeoutId));

  return {
    t,
    loading,
    error,
    setTargetLanguage: setTargetLang, // Corrected function name
    currentLanguage: targetLang,
  };
}
