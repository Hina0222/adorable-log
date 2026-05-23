export function supportsStyles(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Chrome|Firefox|Safari/.test(ua);
}
