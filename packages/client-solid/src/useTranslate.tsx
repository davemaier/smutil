import { createSignal, onCleanup } from "solid-js";
import { createFetchStream } from "./createFetchStream.js";
import { createStore, reconcile, unwrap } from "solid-js/store";

export function useTranslate(lang: string) {
  // Create signals for target language and translation context.
  const [targetLang, setTargetLang] = createSignal(lang);
  const [pending, setPending] = createStore<Record<string, string>>({});
  const [existing, setExisting] = createStore<Record<string, string>>({});

  const { data, setData, error, fetchStream } = createFetchStream<
    Record<string, { t: string; l: string }>
  >(
    new URL("/stream/translate", process.env["API_BASE_URL"]),
    "application/json"
  );

  // Reset our translation context whenever the target language changes.
  const setTargetLanguage = (lang: string) => {
    setTargetLang(lang);
    setPending(unwrap(existing));
    executeBatch();
  };

  // Batch execution: if there is work to do, send the batch.
  const executeBatch = () => {
    if (Object.keys(pending).length === 0) return;
    fetchStream(
      JSON.stringify({
        texts: unwrap(pending),
        targetLanguage: targetLang(),
      })
    );

    setPending(reconcile({}));
  };

  let timeout: ReturnType<typeof setTimeout> | undefined;

  const scheduleBatch = () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(executeBatch, 50);
  };

  const loading = (id: string) => {
    return data[id]?.l !== targetLang();
  };

  const isBaseLang = (text: string, baseLang?: string) => {
    return baseLang && baseLang.toLowerCase() === targetLang().toLowerCase();
  };
  // The translation function `t` returns JSX elements.
  const t = (text: string, baseLang?: string) => {
    const id = Math.random().toString(36).slice(2, 6);
    setData({ [id]: { t: text, l: baseLang ?? "" } });

    setPending((prev) => ({ ...prev, [id]: text }));
    setExisting((prev) => ({ ...prev, [id]: text }));
    scheduleBatch();

    return (
      <span
        data-translation-loading={!isBaseLang(text, baseLang) && loading(id)}
      >
        {isBaseLang(text, baseLang) || loading(id) ? text : data[id]?.t}
      </span>
    );
  };

  // Cleanup our timer when the component using this hook unmounts.
  onCleanup(() => {
    if (timeout) clearTimeout(timeout);
  });

  return {
    t,
    loading,
    error,
    setTargetLanguage,
    currentLanguage: targetLang,
  };
}
