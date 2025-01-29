import { models, type ModelSpecifier } from "./providers/models";
import {
  getOpenRouterSingleImageStream,
  getOpenRouterSingleMessageStream,
} from "./providers/openRouter";

export { prompts } from "./prompts";
export { models } from "./providers/models";

export function getSingleMessageStructuredStream(
  model: ModelSpecifier = models.CLAUDE_HAIKU_3
) {
  return getOpenRouterSingleMessageStream(model);
}

export function getSingleImageStructuredStream(
  model: ModelSpecifier = models.GPT_4O_MINI
) {
  return getOpenRouterSingleImageStream(model);
}
