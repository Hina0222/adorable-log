import { isEnabled } from '../core/config';
import { METHOD_STYLES } from '../core/styles';
import { supportsStyles } from '../utils/detect';

type MethodName = keyof typeof METHOD_STYLES;

export function callMethod(
  method: MethodName,
  namespace: string,
  badge: { format: string; styles: string[] },
  message: unknown,
  args: unknown[],
): void {
  if (!isEnabled(namespace)) return;

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
    consoleFn(`${badge.format}${prefix}`, ...badge.styles, message, ...args);
  } else {
    consoleFn(`[${namespace}]${prefix}`, message, ...args);
  }
}
