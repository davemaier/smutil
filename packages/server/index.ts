import { cors } from "@elysiajs/cors";
import {
  getSingleImageStructuredStream,
  getSingleMessageStructuredStream,
  prompts,
} from "@smutil/core";
import { Elysia, t } from "elysia";
import { getOrCreateStream } from "./utils/inMemoryCache";

const simpleTextBody = {
  body: t.Object({
    text: t.String(),
  }),
};

const freePaths = [
  "extract-event",
  "extract-address",
  "classify-image",
  "translate",
];

const app = new Elysia()

  .use(cors())
  .onRequest(async ({ request, set }) => {
    const ip = request.headers.get("true-client-ip") ?? "";
    // const isAllowed = await isRateLimitAllowed(ip, redisClient);

    const isAllowed = true;
    if (!isAllowed) {
      set.status = 429;
      return "Rate limit exceeded";
    }
  })
  .group("/stream", (app) =>
    app
      .use(cors())
      .post(
        "/extract-address",
        async ({ body: { text } }) => {
          const cacheKey = Bun.hash(`extract-address ${text}`);

          const prompt = prompts.EXTRACT_ADDRESS;

          return getOrCreateStream(cacheKey, async () =>
            getSingleMessageStructuredStream()(prompt.message, text)
          );
        },
        simpleTextBody
      )
      .post(
        "/extract-event",
        async ({ body: { text } }) => {
          const cacheKey = Bun.hash(`extract-event ${text}`);

          const prompt = prompts.EXTRACT_EVENT;

          return getOrCreateStream(cacheKey, async () =>
            getSingleMessageStructuredStream()(prompt.message, text)
          );
        },
        simpleTextBody
      )
      .post(
        "/translate",
        async ({ body: { text, targetLanguage } }) => {
          const cacheKey = Bun.hash(`translate ${text} to ${targetLanguage}`);

          const prompt = prompts.TRANSLATE_TEXT;

          return await getOrCreateStream(cacheKey, () =>
            getSingleMessageStructuredStream()(
              prompt.getMessage({ language: targetLanguage }),
              text
            )
          );
        },
        {
          body: t.Object({
            text: t.String(),
            targetLanguage: t.String(),
          }),
        }
      )
      .post(
        "/classify-image",
        async ({ body: { image } }) => {
          const buffer = await image[0].arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");

          if (!base64) throw new Error("Failed to convert image to base64");

          const cacheKey = Bun.hash(`classify-image ${base64}`);

          return getOrCreateStream(cacheKey, async () =>
            getSingleImageStructuredStream()(
              prompts.DETECT_NSFW_IMAGES.message,
              base64
            )
          );
        },
        {
          body: t.Object({
            image: t.Files(),
          }),
        }
      )
      .post(
        "/extract-structured/",
        async function* ({ body: { text, schema } }) {
          const cacheKey = Bun.hash(`extract ${text} with ${schema}`);

          const prompt = prompts.EXTRACT_STRUCTURED;
          return await getOrCreateStream(cacheKey, () =>
            getSingleMessageStructuredStream()(prompt.getMessage(schema), text)
          );
        },
        {
          body: t.Object({
            text: t.String(),
            schema: t.String(),
          }),
        }
      )
  )
  .listen(process.env.PORT ?? 3000);

export type App = typeof app;
