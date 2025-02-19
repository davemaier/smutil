import { nsfw } from "./detectNSFW";
import { address } from "./extractAddress";
import { event } from "./extractEvent";
import { schema as imageSchema } from "./extractImage";
import { schema as textSchema } from "./extractText";
import { translate } from "./translateText";

export const prompts = {
  address,
  event,
  imageSchema,
  textSchema,
  translate,
  nsfw,
} as const;

//
