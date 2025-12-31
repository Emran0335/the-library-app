export function getPublicIdFromUrl(url: string) {
  // Extract everything after /upload/ and remove extension
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  if (!match || match.length < 2) return null;
  return match[1]; // this is the public_id
}
