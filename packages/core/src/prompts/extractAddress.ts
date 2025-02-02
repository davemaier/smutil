export const EXTRACT_ADDRESS = {
  message: `I'll give you a string of unstructured information about a person, you return it in JSON. The result must be valid json and is interpreted by a machine. Don't return markup, only json! If you return anything additional to json I will be very angry at you. Make sure to create the ISO string for the date correctly. Use the correct timezone according to country and date. When you think about the date think in steps like this: Then the date: "20 7 92". The user mentioned using the country to infer the date format. Austria uses DD.MM.YYYY. So 20.07.1992. The ISO date would be "1992-07-20T00:00:00.000Z". If there is no information about a field in the text, return it as "". Make the country ISO 3166-1 A3 conform. Don't add fields that are not in the example. Make sure to get the city right.
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
