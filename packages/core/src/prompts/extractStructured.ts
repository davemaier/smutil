export const schema = (schema: string) => ({
  message: `You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure. Take the structure from the following schema:${schema}. Never return anything but json!!`,
});
