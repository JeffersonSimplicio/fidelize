export function formatDate(
  isoString: string,
  locales: Intl.LocalesArgument = 'pt-BR',
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString(locales, options);
}
