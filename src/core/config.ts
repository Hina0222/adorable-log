export interface PlogConfig {
  enabled: boolean;
  collapsed: boolean;
  namespaces: Record<string, { color?: string; enabled?: boolean }>;
}

const DEFAULT_CONFIG: PlogConfig = {
  enabled: true,
  collapsed: true,
  namespaces: {},
};

let _config: PlogConfig = { ...DEFAULT_CONFIG, namespaces: {} };

export function configure(options: Partial<PlogConfig>): void {
  _config = {
    ..._config,
    ...options,
    namespaces: {
      ..._config.namespaces,
      ...options.namespaces,
    },
  };
}

export function getConfig(): PlogConfig {
  return _config;
}

export function reset(): void {
  _config = { ...DEFAULT_CONFIG, namespaces: {} };
}
