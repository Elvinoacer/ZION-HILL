/**
 * Utility functions for sanitizing user inputs.
 * Prevents XSS by stripping HTML tags and limiting allowed characters.
 */

/**
 * Strips all HTML tags from a string.
 * @param input The string to sanitize.
 * @returns The sanitized string.
 */
export function stripHtmlTags(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  // Basic regex to remove HTML tags
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes a name by stripping HTML, removing non-alphanumeric characters
 * (except spaces, hyphens, and apostrophes), and trimming whitespace.
 * @param name The name to sanitize.
 * @returns The sanitized name.
 */
export function sanitizeName(name: string): string {
  if (typeof name !== 'string') {
    return '';
  }

  // 1. Strip HTML tags
  let sanitized = stripHtmlTags(name);

  // 2. Remove characters that are not letters, numbers, spaces, hyphens, apostrophes, or periods
  // This allows names like "O'Brien", "Mary Jane", and "Martin Luther King Jr."
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-'.]/g, '');

  // 3. Collapse multiple spaces into one
  sanitized = sanitized.replace(/\s+/g, ' ');

  // 4. Trim leading/trailing whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Validates that a name contains only allowed characters.
 * Does not modify the input, only checks its validity.
 * @param name The name to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidName(name: string): boolean {
  if (typeof name !== 'string' || name.length === 0) {
    return false;
  }
  // A valid name only contains letters, spaces, hyphens, apostrophes, and periods.
  // It should not start or end with a special character.
  const pattern = /^[a-zA-Z][a-zA-Z\s\-'.]{0,98}[a-zA-Z.]?$/;
  // Max length 100, must start with a letter
  return pattern.test(name) && name.length >= 2 && name.length <= 100;
}
