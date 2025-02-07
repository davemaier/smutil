import React, { useState, useEffect, useCallback, useRef } from "react";
import useFetchStream from "./useFetchStream";

interface TranslationContext {
  translations: Map<string, { t: string }>;
  pending: Map<string, string>;
  inFlight: Map<string, string>;
}

export function useTranslate(initialLang: string) {
  const [targetLang, setTargetLang] = useState(initialLang);
  const [_, forceUpdate] = useState(0); // Now properly used for triggering updates

  const contextRef = useRef<TranslationContext>({
    translations: new Map(),
    pending: new Map(),
    inFlight: new Map(),
  });
  const timeoutRef = useRef<number>();
  const loadingRef = useRef(false);
  // const updateKeyRef = useRef(0);

  const { data, loading, error, fetchStream } = useFetchStream<
    Record<string, { t: string }>
  >(new URL("/stream/translate", process.env.API_BASE_URL), "application/json");

  // Sync loading state
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // Language change handler
  useEffect(() => {
    contextRef.current = {
      translations: new Map(),
      pending: new Map(),
      inFlight: new Map(),
    };
    loadingRef.current = false;
    clearTimeout(timeoutRef.current);
    forceUpdate((prev) => prev + 1); // Use functional update
  }, [targetLang]);

  // Data processing
  useEffect(() => {
    if (!loading && data) {
      const newTranslations = new Map(contextRef.current.translations);
      Object.entries(data).forEach(([key, value]) =>
        newTranslations.set(key, value)
      );

      contextRef.current = {
        translations: newTranslations,
        pending: contextRef.current.pending,
        inFlight: contextRef.current.inFlight,
      };

      forceUpdate((prev) => prev + 1);
      scheduleBatch();
    }
  }, [data, loading]);

  // Batch processing
  const executeBatch = useCallback(async () => {
    if (loadingRef.current || contextRef.current.pending.size === 0) return;

    const batch = Array.from(contextRef.current.pending);
    contextRef.current = {
      ...contextRef.current,
      pending: new Map(),
      inFlight: new Map(batch),
    };

    loadingRef.current = true;
    forceUpdate((prev) => prev + 1);

    fetchStream(
      JSON.stringify({
        texts: batch.reduce((acc, [id, text]) => {
          acc[id] = text;
          return acc;
        }, {} as Record<string, string>),
        targetLanguage: targetLang,
      })
    );
  }, [targetLang, fetchStream]);

  const scheduleBatch = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (!loadingRef.current && contextRef.current.pending.size > 0) {
      timeoutRef.current = window.setTimeout(executeBatch, 50);
    }
  }, [executeBatch]);

  // Translation function
  const t = useCallback(
    (text: string, baseLang?: string): JSX.Element => {
      const id = hashString(text);

      if (baseLang?.toLowerCase() === targetLang.toLowerCase()) {
        return <span>{text}</span>;
      }

      const translated = contextRef.current.translations.get(id)?.t;
      if (translated) return <span>{translated}</span>;

      const isLoading =
        contextRef.current.pending.has(id) ||
        contextRef.current.inFlight.has(id);

      if (!isLoading) {
        contextRef.current.pending.set(id, text);
        scheduleBatch();
        forceUpdate((prev) => prev + 1);
      }

      return isLoading ? (
        <span data-translation-loading>{text}</span>
      ) : (
        <span>{text}</span>
      );
    },
    [targetLang, scheduleBatch]
  );

  // Cleanup
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return {
    t,
    loading: loadingRef.current,
    error,
    setTargetLanguage: setTargetLang,
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
