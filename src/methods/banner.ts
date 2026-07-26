import { isEnabled } from '../core/config';
import { supportsStyles } from '../utils/detect';
import type { Badge } from '../utils/format';

export function callBanner(
  namespace: string,
  badge: Badge,
  bgColor: string,
  title: string,
): void {
  if (!isEnabled(namespace)) return;

  if (supportsStyles()) {
    const titleStyle = [
      `border: 1px solid ${bgColor}`,
      `color: ${bgColor}`,
      'padding: 3px 10px',
      'border-radius: 4px',
      'font-weight: bold',
    ].join('; ');
    console.log(`${badge.format} %c${title}`, ...badge.styles, titleStyle);
  } else {
    console.log(`[${namespace}] *** ${title} ***`);
  }
}
