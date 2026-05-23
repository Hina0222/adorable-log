import { getConfig } from '../core/config';
import { METHOD_STYLES } from '../core/styles';
import { buildBadge } from '../utils/format';
import { supportsStyles } from '../utils/detect';

type MethodName = keyof typeof METHOD_STYLES;

export function callMethod(
  method: MethodName,
  namespace: string,
  bgColor: string,
  textColor: string,
  message: unknown,
  args: unknown[],
): void {
  const config = getConfig();
  if (!config.enabled) return;

  const nsConfig = config.namespaces[namespace];
  if (nsConfig?.enabled === false) return;

  const { icon } = METHOD_STYLES[method];
  let consoleFn = console.log;
  switch (method) {
    case 'debug':   consoleFn = console.debug; break;
    case 'info':    consoleFn = console.info;  break;
    case 'warn':    consoleFn = console.warn;  break;
    case 'error':   consoleFn = console.error; break;
  }

  const prefix = icon ? ` ${icon}` : '';

  if (supportsStyles()) {
    const { format, styles } = buildBadge(namespace, bgColor, textColor);
    consoleFn(`${format}${prefix}`, ...styles, message, ...args);
  } else {
    consoleFn(`[${namespace}]${prefix}`, message, ...args);
  }
}
