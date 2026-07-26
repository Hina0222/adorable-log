import { getConfig, isEnabled, type CollapseOptions } from '../core/config';
import { supportsStyles } from '../utils/detect';
import type { Badge } from '../utils/format';

export function callGroup(
  namespace: string,
  badge: Badge,
  label: string,
  callback: () => void,
  options?: CollapseOptions,
): void {
  // 로깅이 꺼져 있어도 콜백 안의 코드는 실행되어야 한다 — 그룹 래핑만 생략
  if (!isEnabled(namespace)) {
    callback();
    return;
  }

  const collapsed = options?.collapsed ?? getConfig().collapsed;
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
