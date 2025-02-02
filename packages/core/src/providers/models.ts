export const models = {
  LIQUID_LARGE: {
    providers: ["Liquid", "Lambda"],
    model: "liquid/lfm-40b",
  },
  CLAUDE_HAIKU_3: {
    providers: ["Anthropic"],
    model: "anthropic/claude-3-haiku",
  },
  GPT_4O_MINI: {
    providers: ["OpenAI"],
    model: "openai/gpt-4o-mini",
  },
  MISTRAL_SMALL_3: {
    providers: ["Mistral", "DeepInfra"],
    model: "mistralai/mistral-small-24b-instruct-2501",
  },
};

export interface ModelSpecifier {
  model: string;
  providers: string[];
}
