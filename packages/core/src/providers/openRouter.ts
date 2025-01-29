import { fetchWithRetry } from "../utils/fetchWithRetry";
import type { ModelSpecifier } from "./models";

type Content =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image_url";
      image_url: {
        url: string;
      };
    };

const OPEN_ROUTER_API_URL = "https://openrouter.ai/api/v1";
const COMPLETIONS_URL = `${OPEN_ROUTER_API_URL}/chat/completions`;

export function getOpenRouterSingleMessageStream(modelSpec: ModelSpecifier) {
  return async (system: string, text: string) =>
    fetchWithRetry(() =>
      fetch(
        COMPLETIONS_URL,
        getSingleMessageStreamFetchInit(
          [{ text: `${system} ${text}`, type: "text" }],
          modelSpec
        )
      )
    );
}

export function getOpenRouterSingleImageStream(modelSpec: ModelSpecifier) {
  return async (system: string, image: string) =>
    fetchWithRetry(() =>
      fetch(
        COMPLETIONS_URL,
        getSingleMessageStreamFetchInit(
          [
            { text: system, type: "text" },
            {
              image_url: { url: `data:image/jpeg;base64,${image}` },
              type: "image_url",
            },
          ],
          modelSpec
        )
      )
    );
}

function getSingleMessageStreamFetchInit(
  content: Content[],
  modelSpec: ModelSpecifier
) {
  return {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelSpec.model,
      provider: {
        data_collection: "deny",
        order: modelSpec.providers,
      },
      messages: [{ role: "user", content }],
      stream: true, // Ensure streaming is enabled
    }),
  };
}
