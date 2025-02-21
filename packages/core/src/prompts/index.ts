import { nsfw } from "./detectNSFW";
import { personalInfo } from "./extractPersonalInfo";
import { event } from "./extractEvent";
import { schema as imageSchema } from "./extractImage";
import { schema as textSchema } from "./extractText";
import { translate } from "./translateText";

export const prompts = {
  personalInfo,
  event,
  imageSchema,
  textSchema,
  translate,
  nsfw,
} as const;

//
