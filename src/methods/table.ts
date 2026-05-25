import { getConfig } from '../core/config';
import { supportsStyles } from '../utils/detect';

export function callTable(
  namespace: string,
  badge: { format: string; styles: string[] },
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
    groupFn(`${badge.format} ${label}`, ...badge.styles);
  } else {
    groupFn(`[${namespace}] ${label}`);
  }

  try {
    console.table(data, columns);
  } finally {
    console.groupEnd();
  }
}
