import { Elysia, t } from "elysia";
import {
  classifyImage,
  classifyImageStream,
  extractAddress,
  singleMessageStructuredStream,
} from "./smutils";
import { cors } from "@elysiajs/cors";
import type { MediaType } from "./providers/anthropic";
import { validateJWT } from "./smutils/utils/validateJWT";
import { decodeJwt } from "jose";
import { db } from "./db/db";
import { domains } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { prompts } from "./smutils/prompts";
import { redisClient } from "./db/redis";
import { isRateLimitAllowed } from "./smutils/utils/rateLimit";
import { getOrCreateStream } from "./smutils/utils/inMemoryCache";

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
  .decorate("db", db)
  .decorate("redisClient", redisClient)
  .get("/", ({ redirect }) => redirect("https://smutil.motile.dev"))
  .group(
    "/app",
    {
      cookie: t.Object({
        hanko: t.String(),
      }),
    },
    (app) =>
      app
        .use(
          cors({
            origin: ({ headers }) =>
              headers.get("Origin") === "http://localhost:5173" ||
              headers.get("Origin") === "https://smutil-app.onrender.com",
            credentials: true,
            allowedHeaders: ["Content-Type"],
          }),
        )
        .onBeforeHandle(async ({ set, cookie: { hanko } }) => {
          if (!(await validateJWT(hanko.value)))
            return (set.status = "Unauthorized");
        })
        .resolve(({ cookie: { hanko } }) => {
          return { user: decodeJwt(hanko.toString() ?? "") };
        })
        .get("/domains", ({ user, db }) => {
          const test = db.query.domains.findMany({
            where: eq(domains.userId, user.sub ?? ""),
          });
          return test;
        })
        .get("/domain/:id", ({ db, user, params: { id } }) => {
          return db.query.domains.findFirst({
            where: and(eq(domains.userId, user.sub ?? ""), eq(domains.id, id)),
          });
        }),
  )
  .group("/api", (app) => {
    return (
      app
        .use(cors())
        .onRequest(async ({ request, redisClient, set }) => {
          const ip = request.headers.get("true-client-ip") ?? "";
          const isAllowed = await isRateLimitAllowed(ip, redisClient);

          if (!isAllowed) {
            set.status = 429;
            return "Rate limit exceeded";
          }
        })
        //Check if the path is free
        .onRequest(({ request, set }) => {
          const url = request.url.replace(/\/$/, ""); // Remove trailing slash if it exists
          const path = url.split("/").pop();

          if (!path || !freePaths.includes(path)) {
            set.status = 401;
            return "Unauthorized";
          }
        })
        .group("/stream", (app) =>
          app
            .use(cors())
            .post(
              "/extract-address",
              async ({ set, body: { text } }) => {
                const cacheKey = Bun.hash(`extract-address ${text}`);

                const prompt = prompts.extractAddress;

                return await getOrCreateStream(cacheKey, () =>
                  singleMessageStructuredStream()(
                    text,
                    prompt.message,
                    prompt.schema,
                  ),
                );
              },
              simpleTextBody,
            )
            .post(
              "/extract-event",
              async ({ set, body: { text } }) => {
                const cacheKey = Bun.hash(`extract-event ${text}`);

                const prompt = prompts.extractEvent;
                return await getOrCreateStream(cacheKey, () =>
                  singleMessageStructuredStream()(
                    text,
                    prompt.message,
                    prompt.schema,
                  ),
                );
              },
              simpleTextBody,
            )
            .post(
              "/translate",
              async ({ set, body: { text, targetLanguage } }) => {
                const cacheKey = Bun.hash(
                  `translate ${text} to ${targetLanguage}`,
                );

                const prompt = prompts.translateText;
                return await getOrCreateStream(cacheKey, () =>
                  singleMessageStructuredStream()(
                    text,
                    prompt.getMessage({ language: targetLanguage }),
                    prompt.schema,
                  ),
                );
              },
              {
                body: t.Object({
                  text: t.String(),
                  targetLanguage: t.String(),
                }),
              },
            )
            .post(
              "/classify-image",
              async function* ({ body: { image } }) {
                const buffer = await image[0].arrayBuffer();

                const base64 = Buffer.from(buffer).toString("base64");
                if (!base64)
                  throw new Error("Failed to convert image to base64");
                const imageStream = await classifyImageStream(
                  base64,
                  image[0].type as MediaType,
                );

                for await (const delta of imageStream) {
                  yield delta;
                }
              },
              {
                body: t.Object({
                  image: t.Files(),
                }),
              },
            )
            .post(
              "/extract-structured/",
              async function* ({ body: { text, schema } }) {
                const cacheKey = Bun.hash(`extract ${text} with ${schema}`);

                const prompt = prompts.extractStructured;
                return await getOrCreateStream(cacheKey, () =>
                  singleMessageStructuredStream()(text, prompt.message, schema),
                );
              },
              {
                body: t.Object({
                  text: t.String(),
                  schema: t.String(),
                }),
              },
            ),
        )
        //non stream endpoints
        .post(
          "/extract-address",
          async ({ body: { text } }) => {
            const result = await extractAddress(text);
            return result;
          },
          simpleTextBody,
        )
        .post(
          "/classify-image",
          async ({ body: { image } }) => {
            const buffer = await image[0].arrayBuffer();

            const base64 = Buffer.from(buffer).toString("base64");
            if (!base64) throw new Error("Failed to convert image to base64");
            const result = await classifyImage(
              base64,
              image[0].type as MediaType,
            );

            return { result };
          },
          {
            body: t.Object({
              image: t.Files(),
            }),
          },
        )
    );
  })

  .listen(process.env.PORT ?? 3000);

export type App = typeof app;
