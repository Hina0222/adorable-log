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
// configure는 앱 초기화 시 1회 호출 계약 — 두 번째 호출부터 경고 후 무시
let _configured = false;

export function configure(options: Partial<AlogConfig>): void {
  if (_configured) {
    console.warn('[adorable-log] configure() should only be called once — this call is ignored.');
    return;
  }
  _configured = true;

  const namespaces: AlogConfig['namespaces'] = {};
  for (const [name, nsOptions] of Object.entries(options.namespaces ?? {})) {
    namespaces[name] = { ...nsOptions };
  }
  _config = {
    enabled: options.enabled ?? DEFAULT_CONFIG.enabled,
    collapsed: options.collapsed ?? DEFAULT_CONFIG.collapsed,
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
  _configured = false;
  _version++;
}

export function isEnabled(namespace: string): boolean {
  if (!_config.enabled) return false;
  return _config.namespaces[namespace]?.enabled !== false;
}
