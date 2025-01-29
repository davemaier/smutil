type GetMessageParams = {
  language: string;
};

export const TRANSLATE_TEXT = {
  getMessage: ({
    language,
  }: GetMessageParams) => `You are a professional translator.
  I give you text and you translate the text to the target language.
  The target language is ${language} in the first line.
  You return data in JSON format according to the schema.`,
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      translation: {
        type: "string",
        description: "The translated text",
      },
      language: {
        type: "string",
        description: "The language of the translation",
      },
    },
    required: ["translation", "language"],
    additionalProperties: false,
  },
};
