export const event = ({ userTimestamp }: { userTimestamp: string }) => ({
  message: `I give you event details and you return structured json and nothing else, no explanation, no markdown. You return the json in the language of the majority of the input. The current datetime is ${userTimestamp}. If no info suppose an event takes 1h. If not time info use tomorrow 9am.
    You never return data from the example response. If you can't infer information return the missing fields as null and don't hallucinate.

    For a query like: dinner tomorrow with greg at noon at the opera cafe bring present for the kids

    Response should be like:
    {
      "title": "Dinner",
      "participants": ["Greg"],
      "location": "Opera Cafe",
       "notes": "Bring present for the kids",
       "start_time": "2024-06-27T12:00:00+02:00",
       "end_time": "2024-06-27T13:00:00+02:00"
    }`,
});
