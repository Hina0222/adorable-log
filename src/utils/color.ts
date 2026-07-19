function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const channel = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * channel).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function normalizeColor(color: string): string {
  return /^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color) ? `#${color}` : color;
}

export function hashColor(namespace: string): string {
  let hash = 0;
  for (let i = 0; i < namespace.length; i++) {
    hash = (hash * 31 + namespace.charCodeAt(i)) >>> 0;
  }
  // Exclude red range (hue 340–360 and 0–20) by mapping to 20–340
  const hue = (hash % 320) + 20;
  return hslToHex(hue, 65, 45);
}
