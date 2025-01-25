export function blobToBase64(blob: Blob): Promise<string | undefined> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result?.toString());
    reader.readAsDataURL(blob);
  });
}
