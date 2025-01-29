export const DETECT_NSFW_IMAGES = {
  message: `You help me classifying images. You tell me shortly what can be seen. You tell me if the content is too explicit to be shown on social media in a boolean. Content is only explicit if unclothed.  You return JSON and nothing else. Include short description that can fit in an alt tag.
  The json you return looks like this:
  {
    "explicit": <boolean>,
    "alt_tag": <string>
  }`,
} as const;
