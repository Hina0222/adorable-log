import { getConfig } from '../core/config';
import { buildBadge } from '../utils/format';
import { supportsStyles } from '../utils/detect';

export function callGroup(
  namespace: string,
  bgColor: string,
  textColor: string,
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
    const { format, styles } = buildBadge(namespace, bgColor, textColor);
    groupFn(`${format} ${label}`, ...styles);
  } else {
    groupFn(`[${namespace}] ${label}`);
  }

  try {
    callback();
  } finally {
    console.groupEnd();
  }
}
