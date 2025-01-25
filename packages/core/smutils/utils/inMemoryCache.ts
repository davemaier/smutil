type StreamCreator = () => Promise<ReadableStream<Uint8Array>>;

const cache = new Map<number | bigint, string>();

export async function getOrCreateStream(
  cacheKey: number | bigint,
  streamCreator: StreamCreator,
): Promise<ReadableStream<Uint8Array> | string> {
  if (cache.has(cacheKey)) {
    // Cache hit: return cached content as string
    const cachedContent = cache.get(cacheKey)!;
    return cachedContent;
  }

  // Cache miss: create new stream and cache its content
  const originalStream = await streamCreator();
  let fullContent = "";

  const transformStream = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const chunkString = new TextDecoder().decode(chunk);
      const chunkContent =
        JSON.parse(chunkString).choices[0].delta.content || "";
      fullContent += chunkContent;
      controller.enqueue(chunkContent);
    },
    flush() {
      cache.set(cacheKey, fullContent);
    },
  });

  return originalStream.pipeThrough(transformStream);
}
