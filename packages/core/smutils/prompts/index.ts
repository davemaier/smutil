import { extractAddress } from "./extractAddress";
import { extractEvent } from "./extractEvent";
import { extractStructured } from "./extractStructured";
import { translateText } from "./translateText";

export const prompts = {
  extractAddress,
  extractEvent,
  translateText,
  extractStructured,
} as const;
