type StreamCreator = () => Promise<ReadableStream<Uint8Array>>;

const cache = new Map<number | bigint, string>();

export async function getOrCreateStream(
  cacheKey: number | bigint,
  streamCreator: StreamCreator
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
      const lines = chunkString.split("\n");
      const chunkContent = lines
        .filter((line) => line.startsWith("data:"))
        .filter((line) => !line.startsWith("data: [DONE]"))
        .map((line) => JSON.parse(line.split("data:")[1]))
        .map((data) => data.choices[0].delta.content)
        .filter(
          (content) => !["```", "```json", "json", "\n"].includes(content)
        );
      chunkContent.forEach((content) => controller.enqueue(content));
      chunkContent.forEach((content) => (fullContent += content));
    },
    flush() {
      //cache.set(cacheKey, fullContent);
      // console.log(fullContent);
    },
  });

  return originalStream.pipeThrough(transformStream);
}
