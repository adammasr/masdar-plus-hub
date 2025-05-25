
// Calculate reading time
export const estimateReadingTime = (content: string): number => {
  const plainText = content.replace(/<[^>]*>?/gm, '');
  const wordCount = plainText.split(/\s+/).length;
  const wordsPerMinute = 220; // Arabic reading speed
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
};
