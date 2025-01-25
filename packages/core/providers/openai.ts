import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function openAISingleMessageStructuredStream(
  text: string,
  system: string,
  schema: any,
  model: string = "gpt-4o-2024-08-06",
) {
  const stream = await openai.chat.completions.create({
    model,
    stream: true,
    max_tokens: 1000,
    temperature: 0,
    response_format: {
      type: "json_schema",
      json_schema: {
        strict: true,
        schema: typeof schema === "string" ? JSON.parse(schema) : schema,
        name: "research_paper_extraction",
      },
    },
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: system,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text,
          },
        ],
      },
    ],
  });

  return stream.toReadableStream();
}

export async function* openAISingleMessageStream(
  text: string,
  system: string,
  model: string = "gpt-4o-mini",
) {
  const stream = await openai.chat.completions.create({
    model,

    stream: true,
    max_tokens: 1000,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: system,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text,
          },
        ],
      },
    ],
  });

  for await (const chunk of stream) {
    yield chunk.choices[0]?.delta?.content || "";
  }
}

export async function* openAISingleImageStream(
  image: string,
  _type: string,
  system: string,
  model: string = "gpt-4o-mini",
) {
  const stream = await openai.chat.completions.create({
    model,
    stream: true,
    response_format: { type: "json_object" },
    max_tokens: 1000,
    temperature: 1,
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: system,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${image}`,
            },
          },
        ],
      },
    ],
  });

  for await (const chunk of stream) {
    yield chunk.choices[0]?.delta?.content || "";
  }
}
