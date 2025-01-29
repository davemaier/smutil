import OpenAI from "openai";

export function genericSingleMessageStream(provider: OpenAI, model: string) {
  return async function* (text: string, system: string) {
    const stream = await provider.chat.completions.create({
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
  };
}

export async function* openAISingleImageStream(
  image: string,
  _type: string,
  provider: OpenAI,
  system: string,
  model: string = "gpt-4o-mini"
) {
  const stream = await provider.chat.completions.create({
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
