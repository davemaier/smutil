import { nsfw } from "./detectNSFW";
import { address } from "./extractAddress";
import { event } from "./extractEvent";
import { schema } from "./extractStructured";
import { translate } from "./translateText";

export const prompts = {
  address,
  event,
  schema,
  translate,
  nsfw,
} as const;
