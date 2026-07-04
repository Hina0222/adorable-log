export interface AlogConfig {
  enabled: boolean;
  collapsed: boolean;
  namespaces: Record<string, { color?: string; enabled?: boolean }>;
}

const DEFAULT_CONFIG: AlogConfig = {
  enabled: true,
  collapsed: true,
  namespaces: {},
};

let _config: AlogConfig = { ...DEFAULT_CONFIG, namespaces: {} };
// configure/reset마다 증가 — 인스턴스가 캐싱한 badge의 무효화 판단에 사용
let _version = 0;

export function configure(options: Partial<AlogConfig>): void {
  const namespaces = { ..._config.namespaces };
  for (const [name, nsOptions] of Object.entries(options.namespaces ?? {})) {
    namespaces[name] = { ...namespaces[name], ...nsOptions };
  }
  _config = {
    enabled: options.enabled ?? _config.enabled,
    collapsed: options.collapsed ?? _config.collapsed,
    namespaces,
  };
  _version++;
}

export function getConfig(): AlogConfig {
  return _config;
}

export function getVersion(): number {
  return _version;
}

export function reset(): void {
  _config = { ...DEFAULT_CONFIG, namespaces: {} };
  _version++;
}

export function isEnabled(namespace: string): boolean {
  if (!_config.enabled) return false;
  return _config.namespaces[namespace]?.enabled !== false;
}
