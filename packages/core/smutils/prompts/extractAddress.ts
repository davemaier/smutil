export const extractAddress = {
  message: `I give you a string of unstructured information about a person, you return it in JSON. The result must be valid json and is interpreted by a machine. Don't return markup artefacts.' Make sure to create the ISO string for the date correctly.
  Example:
  Input:
  Hans berger student am föhrengrund 11 8041 Graz 01.06.2001
  Output:
  {
    "fistname": "Hans",
    "lastname": "Berger",
    "occupation": "Student",
    "street": "Am Föhrengrund",
    "housenumber": "11",
    "postcode": "8041",
    "city": "Graz",
    "country": "AT",
    "birthday": "2001-06-01T00:00:00.000Z"
  }`,
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      firstname: {
        type: "string",
      },
      lastname: {
        type: "string",
      },
      occupation: {
        type: "string",
      },
      street: {
        type: "string",
      },
      housenumber: {
        type: "string",
      },
      postcode: {
        type: "string",
      },
      city: {
        type: "string",
      },
      country: {
        type: "string",
      },
      birthday: {
        type: "string",
      },
    },
    required: [
      "firstname",
      "lastname",
      "occupation",
      "street",
      "housenumber",
      "postcode",
      "city",
      "country",
      "birthday",
    ],
    additionalProperties: false,
  },
} as const;
