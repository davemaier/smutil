export const schema = ({ schema }: { schema: object }) => ({
  message: `You are an expert at extracting structured information from images. You will be given an image and should extract information according to the given structure. Take the structure from the following schema:${schema}. 

For each field in the schema:
1. Look for visual elements in the image that correspond to that field
2. Extract the information accurately and precisely
3. If a field cannot be determined from the image, use null

Always return valid JSON matching the provided schema structure. Never include any explanatory text or additional information outside the JSON structure.

Example schema:
{
  "product": {
    "name": "string",
    "color": "string",
    "condition": "string"
  }
}

This would extract product details visible in the image like name, color, and condition state.`,
});
