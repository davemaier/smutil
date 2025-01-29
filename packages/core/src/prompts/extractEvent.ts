export const EXTRACT_EVENT = {
  message: `I give you event details and you return structured json and nothing else, no explanation, no markdown. You return the json in the language of the majority of the input. You suppose that I\'m living in graz. The current datetime is 26.06.2024 8:48am. If no info suppose an event takes 1h. If not time info use tomorrow 9am.
    You never return data from the example response. If you can't infer information return the missing fields as null and don't hallucinate.

    For a query like: dinner tomorrow with greg at noon at the opera cafe bring present for the kids

    Response should be like:
    {
      "event": "Dinner",
      "participants": ["Greg"],
      "location": "Opera Cafe",
       "notes": "Bring present for the kids",
       "start_time": "2024-06-27T12:00:00+02:00",
       "end_time": "2024-06-27T13:00:00+02:00"
    }`,
  schema: {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      event: {
        type: "string",
        description: "Name of the event",
      },
      participants: {
        type: "array",
        items: {
          type: "string",
        },
        description: "List of participants",
      },
      location: {
        type: "string",
        description: "Location of the event",
      },
      notes: {
        type: "string",
        description: "Additional notes for the event",
      },
      start_time: {
        type: "string",
        description: "Start time of the event in ISO 8601 format",
      },
      end_time: {
        type: "string",
        description: "End time of the event in ISO 8601 format",
      },
    },
    required: [
      "event",
      "participants",
      "location",
      "notes",
      "start_time",
      "end_time",
    ],
    additionalProperties: false,
  },
};
