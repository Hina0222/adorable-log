let cached: boolean | null = null;

export function supportsStyles(): boolean {
  if (cached === null) {
    cached =
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      /Chrome|Firefox|Safari/.test(navigator.userAgent);
  }
  return cached;
}
