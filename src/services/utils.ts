/**
 * Checks if a string starts with '/' and removes it if present.
 *
 * @param {string} input - The input string to check and modify.
 * @returns {string} - The modified string without the leading '/'.
 */
export function removeLeadingSlash(input: string): string {
  if (input.startsWith("/")) {
    return input.slice(1); // Remove the leading '/'
  }
  return input; // Return the string unchanged if it doesn't start with '/'
}

export const convertBase64ToAudio = (base64: string) => {
  // Remove "data:audio/mp3;base64," prefix if included
  const cleanBase64 = base64.replace(/^data:audio\/\w+;base64,/, "");

  // Convert base64 to a binary buffer
  const byteCharacters = atob(cleanBase64);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));

  const byteArray = new Uint8Array(byteNumbers);

  // Create a blob from the byte array
  const blob = new Blob([byteArray], { type: "audio/mp3" });

  // Convert to an object URL
  const url = URL.createObjectURL(blob);
  // setAudioUrl(url);
  return url;
};
