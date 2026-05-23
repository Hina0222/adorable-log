import { getConfig } from '../core/config';
import { buildBadge } from '../utils/format';
import { supportsStyles } from '../utils/detect';

export function callBanner(
  namespace: string,
  bgColor: string,
  textColor: string,
  title: string,
): void {
  const config = getConfig();
  if (!config.enabled) return;

  const nsConfig = config.namespaces[namespace];
  if (nsConfig?.enabled === false) return;

  if (supportsStyles()) {
    const { format, styles } = buildBadge(namespace, bgColor, textColor);
    const titleStyle = [
      `border: 1px solid ${bgColor}`,
      `color: ${bgColor}`,
      'padding: 3px 10px',
      'border-radius: 4px',
      'font-weight: bold',
    ].join('; ');
    console.log(`${format} %c${title}`, ...styles, titleStyle);
  } else {
    console.log(`[${namespace}] *** ${title} ***`);
  }
}
