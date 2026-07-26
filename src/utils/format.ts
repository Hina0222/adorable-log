export interface Badge {
  format: string;
  styles: string[];
}

export function buildBadge(
  namespace: string,
  bgColor: string,
  textColor: string,
): Badge {
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
