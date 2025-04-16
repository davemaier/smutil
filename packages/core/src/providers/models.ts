export const models = {
  LIQUID_LARGE: {
    providers: ["Liquid", "Lambda"],
    model: "liquid/lfm-40b",
  },
  CLAUDE_HAIKU_3: {
    providers: ["Anthropic"],
    model: "anthropic/claude-3-haiku",
  },
  CLAUDE_3_5_SONNET: {
    providers: ["Anthropic"],
    model: "anthropic/claude-3.5-sonnet",
  },

  GPT_4O_MINI: {
    providers: ["OpenAI"],
    model: "openai/gpt-4o-mini",
  },
  MISTRAL_SMALL_3_BORING: {
    providers: ["Mistral", "DeepInfra"],
    model: "mistralai/mistral-small-24b-instruct-2501",
    temperature: 0,
    top_p: 0.2,
    structured_output: true,
  },
  MISTRAL_SMALL_3_NORMAL: {
    providers: ["Mistral", "DeepInfra"],
    model: "mistralai/mistral-small-3.1-24b-instruct",
    temperature: 1.0,
    top_p: 0.9,
    structured_output: true,
  },
  GEMINI_2_FLASH: {
    providers: ["Google AI Studio"],
    model: "google/gemini-2.0-flash-001",
  },
  GEMINI_2_FLASH_LITE: {
    providers: ["Google AI Studio"],
    model: "google/gemini-2.0-flash-lite-001",
  },
  LAMA_4_SCOUT_GROQ: {
    providers: ["Groq"],
    model: "meta-llama/llama-4-scout",
  },
  GEMMA3: {
    providers: ["Google AI Studio"],
    model: "google/gemma-3-4b-it",
  },
};

export interface ModelSpecifier {
  model: string;
  providers: string[];
  temperature?: number;
  top_p?: number;
  structured_output?: boolean;
}
