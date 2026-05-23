export function buildBadge(
  namespace: string,
  bgColor: string,
  textColor: string,
): { format: string; styles: string[] } {
  const badgeStyle = [
    `background: ${bgColor}`,
    `color: ${textColor}`,
    'padding: 2px 6px',
    'border-radius: 3px',
    'font-weight: bold',
  ].join('; ');

  return {
    format: `%c[${namespace}]%c`,
    styles: [badgeStyle, ''],
  };
}
