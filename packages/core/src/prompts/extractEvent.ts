export const event = ({ userTimestamp }: { userTimestamp: string }) => ({
  message: `Convert the user's input into structured JSON. Follow these rules:
  1. Use the language of the input.
  2. Infer fields from context. If uncertain, return missing fields as "" and don't hallucinate.
  3. Time defaults: Duration = 1h if unspecified; time = tomorrow 9am if no time given.
  4. Use ISO 8601 timestamps with timezone offsets
  5. The current date and time is ${userTimestamp}.
  6. Never reuse data from examples.

  **Required Fields**:
  - title: Short event name (e.g., "Dinner").
  - participants: Array of names (e.g., ["Greg"]).
  - location: Venue name or address.
  - notes: Additional context (e.g., "Bring present for the kids").
  - start_time: ISO 8601 timestamp.
  - end_time: ISO 8601 timestamp (start_time + 1h if missing).
  - recurrence: Recurrence rule (e.g., "weekly") or null.
  - timezone: IANA timezone (e.g., "Europe/Paris") if location-specific.
  - alerts: Array of reminders (e.g., ["30 minutes before"]).
  - category: Event type (e.g., "personal", "meeting").
  - status: "confirmed", "tentative", or "cancelled".
  - description: Detailed summary if provided.

  **Example**:
  Input: "Dinner tomorrow with Greg at noon at Opera Cafe. Bring presents for the kids."
  Output:
  {
    "title": "Dinner",
    "participants": ["Greg"],
    "location": "Opera Cafe",
    "notes": "Bring presents for the kids",
    "start_time": "2024-06-27T12:00:00+02:00",
    "end_time": "2024-06-27T13:00:00+02:00",
    "recurrence": null,
    "timezone": "Europe/Paris",
    "alerts": ["30 minutes before"],
    "category": "personal",
    "status": "confirmed",
    "description": null
  }`,
});
