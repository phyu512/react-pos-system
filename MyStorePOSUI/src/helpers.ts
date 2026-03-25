/**
 * Generates a 16-character key with a prefix and hyphen.
 * @param shortName - The 2 or 3 character prefix.
 */
export const generateKey = (shortName: string): string => {
  if (!shortName || shortName.length < 2 || shortName.length > 3) {
    throw new Error("shortName must be 2 or 3 characters long.");
  }

  const prefix = `${shortName}-`; // e.g., "ABC-" (4 chars)
  const targetLength = 16;
  const charsNeeded = targetLength - prefix.length;

  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";

  for (let i = 0; i < charsNeeded; i++) {
    randomPart += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return `${prefix}${randomPart}`;
};