import {
  anthropicSingleMessageJSON,
  anthropicSingleMessage,
  anthropicSingleImageMessage,
  type MediaType,
} from "../providers/anthropic";
import {
  openAISingleImageStream,
  openAISingleMessageStream,
  openAISingleMessageStructuredStream,
} from "../providers/openai";

// type AI = "openai" | "anthropic";

// export function singleMessageStructuredStream(ai?: AI, model?: string) {
export function singleMessageStructuredStream() {
  return openAISingleMessageStructuredStream;
}

export async function parseEvent(text: string, model?: string) {
  const system =
    'I give you event details and you return structured json and nothing else, no explanation, no markdown. You return the json in the language of the majority of the input. You suppose that I\'m living in graz. The current datetime is 26.06.2024 8:48am. If no info suppose an event takes 1h. If not time info use tomorrow 9am.\nFor a query like: dinner tomorrow with greg at noon at the opera cafe bring present for the kids\nResponse should be like:\n{\n  "event": "Dinner",\n  "participants": ["Greg"],\n  "location": "Opera Cafe",\n  "notes": "Bring present for the kids",\n  "start_time": "2024-06-27T12:00:00+02:00",\n  "end_time": "2024-06-27T13:00:00+02:00"\n}';

  return anthropicSingleMessageJSON(text, system, model);
}

export async function extractAddress(text: string, model?: string) {
  const system =
    'I give you a string of unstructured information about a person, you return it in JSON. You return nothing but the JSON. Make sure to create the ISO string for the date correctly.\nExample:\nInput:\nHans berger student am föhrengrund 11 8041 Graz 01.06.2001\n\nOutput:\n{\n  "fistname": "David",\n  "lastname": "Maier",\n  "occupation": "Student",\n  "street": "Trinklweg",\n  "housenumber": "60",\n  "postcode": "8044",\n  "city": "Weinitzen",\n  "country": "AT",\n  "birthday": "1992-06-01T00:00:00.000Z"\n}';

  return anthropicSingleMessageJSON(text, system, model);
}

export async function generateWelcomeMessage(text: string, model?: string) {
  const system =
    'I give you a string of unstructured information about a person, you return it in JSON. You return nothing but the JSON. Make sure to create the ISO string for the date correctly.\nExample:\nInput:\nHans berger student am föhrengrund 11 8041 Graz 01.06.2001\n\nOutput:\n{\n  "fistname": "David",\n  "lastname": "Maier",\n  "occupation": "Student",\n  "street": "Trinklweg",\n  "housenumber": "60",\n  "postcode": "8044",\n  "city": "Weinitzen",\n  "country": "AT",\n  "birthday": "1992-06-01T00:00:00.000Z"\n}';

  return anthropicSingleMessageJSON(text, system, model);
}

export async function checkExplicitContent(text: string, model?: string) {
  const system =
    'You are a specialist on content management. I give you text and you tell me if the text contains sexually explicit content. You return your answer as JSON and you return nothing else. You also check if the content is directed towards a specific person.\nExample answer:\n{\n  "explicit": "true",\n  "directed": "true"\n}';
  return anthropicSingleMessageJSON(text, system, model);
}

export async function summarize(text: string, model?: string) {
  const system =
    'You are a specialist on content management. I give you text and you tell me if the text contains sexually explicit content. You return your answer as JSON and you return nothing else. You also check if the content is directed towards a specific person.\nExample answer:\n{\n  "explicit": "true",\n  "directed": "true"\n}';
  return anthropicSingleMessage(text, system, model);
}

export async function translate(
  text: string,
  targetLanguage: string,
  model?: string,
) {
  const system =
    "You are a professional translator. I give you text and you translate the text to the target language. The target language is the first word in the first line. You return nothing but the translation.";

  return anthropicSingleMessage(`${targetLanguage}\n${text}`, system, model);
}

export async function translateStream(
  text: string,
  targetLanguage: string,
  model?: string,
) {
  const system =
    'You are a professional translator. I give you text and you translate the text to the target language. The target language is the first word in the first line. You return nothing but the translation. Format your response as JSON like this: {"translation": "Das ist ein Test."}';

  return openAISingleMessageStream(`${targetLanguage}\n${text}`, system, model);
}

export async function fixSpelling(text: string, model?: string) {
  const system =
    "You return the same text but with corrected spelling. You return nothing but the text.";

  return anthropicSingleMessage(text, system, model);
}

export async function classifyImage(
  image: string,
  type: MediaType,
  model?: string,
) {
  const system = `You help me classifying images. You tell me shortly what can be seen. You tell me if the content is too explicit to be shown on social media in a boolean. Content is only explicit if unclothed.  You return JSON and nothing else. Include short description that can fit in an alt tag.
  The json you return looks like this:
  {
    "explicit": <boolean>,
    "alt_tag": <string>
  }`;
  return anthropicSingleImageMessage(image, type, system, model);
}

export async function classifyImageStream(
  image: string,
  type: MediaType,
  model?: string,
) {
  const system = `You help me classifying images. You tell me shortly what can be seen. You tell me if the content is too explicit to be shown on social media in a boolean. Content is only explicit if unclothed.  You return JSON and nothing else. Include short description that can fit in an alt tag.
  The json you return looks like this:
  {
    "explicit": <boolean>,
    "alt_tag": <string>
  }`;

  return openAISingleImageStream(image, type, system, model);
}
