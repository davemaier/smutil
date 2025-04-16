export const event = ({ userTimestamp }: { userTimestamp: string }) => ({
  message: `Convert text to event JSON. Output MUST be raw JSON only. No text. Nomarkdown. No leading sentence, no backticks.
Current time: ${userTimestamp}. Use input language.

REQUIRED JSON STRUCTURE & RULES:
{
  "title": "", // Short event name. Infer.
  "participants": [], // Array of names.
  "location": "", // Venue/address.
  "notes": "", // Additional context.
  "start_time": "", // ISO 8601 w/ offset. Default: tomorrow 9am if unspecified.
  "end_time": "", // ISO 8601 w/ offset. Default: start_time + 1h if unspecified.
  "recurrence": null, // Recurrence rule (e.g., "weekly") or null.
  "timezone": "", // IANA timezone (e.g., "Europe/Paris"). Infer if possible.
  "alerts": [], // Array of reminders (e.g., ["30 minutes before"]).
  "category": "", // Event type (e.g., "personal"). Infer.
  "status": "", // "confirmed", "tentative", "cancelled". Default: "confirmed".
  "description": "" // Detailed summary if provided.
}

- Fill fields based on input. Use "" or null/[] for missing/uncertain fields. Don't hallucinate.
- Never add comments or explanations outside the JSON structure.

EXAMPLE (Input -> Output):
Input: "Dinner tomorrow with Greg at noon at Opera Cafe. Bring presents for the kids."
Output (assuming current date 2024-06-26, local timezone Europe/Paris +02:00):
{
  "title": "Dinner",
  "participants": ["Greg"],
  "location": "Opera Cafe",
  "notes": "Bring presents for the kids",
  "start_time": "2024-06-27T12:00:00+02:00",
  "end_time": "2024-06-27T13:00:00+02:00",
  "recurrence": null,
  "timezone": "Europe/Paris",
  "alerts": [],
  "category": "personal",
  "status": "confirmed",
  "description": ""
}

INPUT TO PROCESS:`,
});
