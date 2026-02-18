/**
 * Parse a date string of the form "YYYY-MM-DD" and return a Date
 * object using the local timezone (month is 0-indexed).
 *
 * The built-in `new Date('YYYY-MM-DD')` treats the string as UTC,
 * which leads to off-by-one errors when converting to local locale
 * dates. This helper avoids that by constructing the date
 * explicitly.
 */
export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format a string in "YYYY-MM-DD" into a localized date string
 * using the given locale and options (default pt-BR short/long).
 */
export function formatLocalDate(isoDate: string, locale = 'pt-BR', options?: Intl.DateTimeFormatOptions) {
  if (!isoDate) return '';
  const date = parseLocalDate(isoDate);
  return date.toLocaleDateString(locale, options);
}
