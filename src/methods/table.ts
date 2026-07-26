import { getConfig, isEnabled, type CollapseOptions } from '../core/config';
import { supportsStyles } from '../utils/detect';
import type { Badge } from '../utils/format';

export function callTable(
  namespace: string,
  badge: Badge,
  label: string,
  data: unknown[],
  columns?: string[],
  options?: CollapseOptions,
): void {
  if (!isEnabled(namespace)) return;

  const collapsed = options?.collapsed ?? getConfig().collapsed;
  const groupFn = collapsed ? console.groupCollapsed : console.group;

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
