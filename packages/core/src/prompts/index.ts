import { DETECT_NSFW_IMAGES } from "./detectNSFW";
import { EXTRACT_ADDRESS } from "./extractAddress";
import { EXTRACT_EVENT } from "./extractEvent";
import { EXTRACT_STRUCTURED } from "./extractStructured";
import { TRANSLATE_TEXT } from "./translateText";

export const prompts = {
  EXTRACT_ADDRESS,
  EXTRACT_EVENT,
  EXTRACT_STRUCTURED,
  TRANSLATE_TEXT,
  DETECT_NSFW_IMAGES,
} as const;
