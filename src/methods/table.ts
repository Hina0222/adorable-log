import { getConfig, isEnabled } from '../core/config';
import { supportsStyles } from '../utils/detect';

export function callTable(
  namespace: string,
  badge: { format: string; styles: string[] },
  label: string,
  data: unknown[],
  columns?: string[],
): void {
  if (!isEnabled(namespace)) return;

  const groupFn = getConfig().collapsed ? console.groupCollapsed : console.group;

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
