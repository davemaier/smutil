import Anthropic from "@anthropic-ai/sdk";
import EventIterator from "event-iterator";

const anthropic = new Anthropic({});

export function anthropicSingleMessageStream(
  text: string,
  system: string,
  model: string = "claude-3-haiku-20240307",
) {
  return new Promise<EventIterator<string>>((resolve) => {
    resolve(
      new EventIterator(({ push, stop }) => {
        anthropic.messages
          .stream({
            model,
            max_tokens: 1000,
            temperature: 0,
            system,
            messages: [
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
          })
          .on("text", (textDelta) => {
            push(textDelta);
          })
          .on("end", () => stop);
      }),
    );
  });
}

export async function anthropicSingleMessage(
  text: string,
  system: string,
  model: string = "claude-3-haiku-20240307",
) {
  const msg = await anthropic.messages.create({
    model,
    max_tokens: 1000,
    temperature: 0,
    system,
    messages: [
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
  if (msg.content[0]?.type !== "text")
    throw new Error("No content in response");

  return msg.content[0].text;
}

export async function anthropicSingleMessageJSON(
  text: string,
  system: string,
  model: string = "claude-3-haiku-20240307",
) {
  return JSON.parse(await anthropicSingleMessage(text, system, model));
}

export type MediaType = "image/png" | "image/jpeg" | "image/gif" | "image/webp";

export async function anthropicSingleImageMessage(
  image: string,
  type: MediaType,
  system: string,
  model: string = "claude-3-haiku-20240307",
) {
  const msg = await anthropic.messages.create({
    model,
    max_tokens: 1000,
    temperature: 0,
    system,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: type,
              data: image,
            },
          },
        ],
      },
    ],
  });
  console.log(msg);
  if (msg.content[0]?.type !== "text")
    throw new Error("No content in response");

  return msg.content[0].text;
}

export function anthropicSingleImageStream(
  image: string,
  type: MediaType,
  system: string,
  model: string = "claude-3-haiku-20240307",
) {
  return new Promise<EventIterator<string>>((resolve) => {
    resolve(
      new EventIterator(({ push, stop }) => {
        anthropic.messages
          .stream({
            model,
            max_tokens: 1000,
            temperature: 0,
            system,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: type,
                      data: image,
                    },
                  },
                ],
              },
            ],
          })
          .on("text", (textDelta) => {
            push(textDelta);
          })
          .on("end", () => stop);
      }),
    );
  });
}
