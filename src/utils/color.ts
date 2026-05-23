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

export function hashColor(namespace: string): string {
  let hash = 0;
  for (let i = 0; i < namespace.length; i++) {
    hash = (hash * 31 + namespace.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return hslToHex(hue, 65, 45);
}
