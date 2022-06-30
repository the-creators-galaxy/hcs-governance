/**
 * Checks the text input for a value, if it contains
 * text, the trimmed text will be returned, if null
 * or whitespace, 'n/a' will be returned instead.
 * 
 * @param text input text to examine.
 * @returns the input text or 'n/a' if empty.
 */
export function trimOptionalText(text: string | undefined) {
  if (text) {
    text = text.trim();
    if (text.length !== 0) {
      return text;
    }
  }
  return 'n/a';
}
