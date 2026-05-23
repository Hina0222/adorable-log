import { getConfig } from '../core/config';
import { buildBadge } from '../utils/format';
import { supportsStyles } from '../utils/detect';

export function callTable(
  namespace: string,
  bgColor: string,
  textColor: string,
  label: string,
  data: unknown[],
  columns?: string[],
): void {
  const config = getConfig();
  if (!config.enabled) return;

  const nsConfig = config.namespaces[namespace];
  if (nsConfig?.enabled === false) return;

  const groupFn = config.collapsed ? console.groupCollapsed : console.group;

  if (supportsStyles()) {
    const { format, styles } = buildBadge(namespace, bgColor, textColor);
    groupFn(`${format} ${label}`, ...styles);
  } else {
    groupFn(`[${namespace}] ${label}`);
  }

  try {
    console.table(data, columns);
  } finally {
    console.groupEnd();
  }
}
