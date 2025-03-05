import { createSignal, onCleanup } from "solid-js";
import { createFetchStream } from "./createFetchStream.js";
import { createStore, reconcile, unwrap } from "solid-js/store";
import type { ClientConfig } from "./types/config.js";
import { useSmutilMergedConfig } from "./SmutilConfigProvider.js";

export function useTranslate(lang?: string, config?: ClientConfig) {
  // Create signals for target language and translation context.
  const [pending, setPending] = createStore<Record<string, string>>({});
  const [existing, setExisting] = createStore<Record<string, string>>({});

  // Merge local config with global config
  const mergedConfig = useSmutilMergedConfig(config);

  // Use provided language, or fall back to config language, or default to 'en'
  const [targetLang, setTargetLang] = createSignal(
    lang || mergedConfig?.language || "en"
  );

  const baseUrl = mergedConfig?.apiUrl || process.env["API_BASE_URL"];
  const { data, setData, error, fetchStream } = createFetchStream<
    Record<string, { t: string; l: string }>
  >(new URL("/stream/translate", baseUrl), "application/json");

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
        action: "translateUI",
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

  const isBaseLang = (baseLang?: string) => {
    return baseLang && baseLang.toLowerCase() === targetLang().toLowerCase();
  };
  // The translation function `t` returns JSX elements.
  const t = (text: string, baseLang?: string) => {
    const id = hashString(text);
    setData({ [id]: { t: text, l: baseLang ?? "" } });

    setPending((prev) => ({ ...prev, [id]: text }));
    setExisting((prev) => ({ ...prev, [id]: text }));
    scheduleBatch();

    return (
      <span data-translation-loading={!isBaseLang(baseLang) && loading(id)}>
        {isBaseLang(baseLang) || loading(id) ? text : data[id]?.t}
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

const hashString = (s: string): string => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  // 36^4 === 1679616, so using modulo ensures a max of 4 base36 digits.
  return (Math.abs(h) % 1679616).toString(36).padStart(4, "0");
};
