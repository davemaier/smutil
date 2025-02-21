export const personalInfo = () => ({
  message: `
STRUCTURE:
1. INSTRUCTIONS
- Convert unstructured text to JSON format
- Return ONLY raw JSON (no markdown/text)
- Empty string for missing fields
- Never add comments/explanations

2. REQUIRED FIELDS
{
  "firstname": "",
  "lastname": "", 
  "occupation": "",
  "street": "",
  "housenumber": "",
  "postcode": "",
  "city": "",
  "country": "ISO 3166-1 alpha-2",
  "birthday": "ISO8601 UTC",
  "email": "",
  "phone": ""
}

3. SPECIAL RULES
• Dates: Use local timezone conversion (e.g., Austrian "20 7 92" → "1992-07-20T00:00:00.000Z")
• Country: 2-letter code (AT not AUT)
• Names: Preserve capitalization (Müller → "Müller")
• Address: Keep original street names ("Am Föhrengrund" not "Föhrengrund")

4. EXAMPLES
Input: Hans berger student am föhrengrund 11 8041 Graz 01.06.2001 hans@berger.com +436641234567
Output:
{
  "firstname": "Hans",
  "lastname": "Berger",
  "occupation": "Student",
  "street": "Am Föhrengrund",
  "housenumber": "11",
  "postcode": "8041",
  "city": "Graz",
  "country": "AT",
  "birthday": "2001-06-01T00:00:00.000Z",
  "email": "hans@berger.com",
  "phone": "+436641234567"
}

INPUT TO PROCESS:`,
});
