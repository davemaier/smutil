export async function fetchWithRetry(
  fetchCall: () => Promise<Response>,
  maxRetries: number = 3
): Promise<ReadableStream<Uint8Array>> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetchCall();
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.body || createEmptyStream();
    } catch (error) {
      console.error(`Fetch error: ${error}`);
      if (attempt === maxRetries - 1) break;
    }
  }

  // Fallback empty stream
  return createEmptyStream();
}

function createEmptyStream(): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(""));
      controller.close();
    },
  });
}
