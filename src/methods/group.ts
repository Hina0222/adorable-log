import { getConfig } from '../core/config';
import { supportsStyles } from '../utils/detect';

export function callGroup(
  namespace: string,
  badge: { format: string; styles: string[] },
  label: string,
  callback: () => void,
  options?: { collapsed?: boolean },
): void {
  const config = getConfig();
  if (!config.enabled) return;

  const nsConfig = config.namespaces[namespace];
  if (nsConfig?.enabled === false) return;

  const collapsed = options?.collapsed ?? config.collapsed;
  const groupFn = collapsed ? console.groupCollapsed : console.group;

  if (supportsStyles()) {
    groupFn(`${badge.format} ${label}`, ...badge.styles);
  } else {
    groupFn(`[${namespace}] ${label}`);
  }

  try {
    callback();
  } finally {
    console.groupEnd();
  }
}
