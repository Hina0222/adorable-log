import { getConfig, isEnabled } from '../core/config';
import { supportsStyles } from '../utils/detect';

export function callTable(
  namespace: string,
  badge: { format: string; styles: string[] },
  label: string,
  data: unknown[],
  columns?: string[],
  options?: { collapsed?: boolean },
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
