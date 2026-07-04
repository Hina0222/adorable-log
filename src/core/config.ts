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

export function configure(options: Partial<AlogConfig>): void {
  const namespaces = { ..._config.namespaces };
  for (const [name, nsOptions] of Object.entries(options.namespaces ?? {})) {
    namespaces[name] = { ...namespaces[name], ...nsOptions };
  }
  _config = {
    ..._config,
    ...options,
    namespaces,
  };
}

export function getConfig(): AlogConfig {
  return _config;
}

export function reset(): void {
  _config = { ...DEFAULT_CONFIG, namespaces: {} };
}
