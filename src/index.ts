import { AlogInstance, type CreateOptions } from './core/AlogInstance';
import { configure } from './core/config';

export type { AlogConfig, NamespaceConfig } from './core/config';
export type { CreateOptions } from './core/AlogInstance';
export { AlogInstance };
export { configure };

export function create(namespace: string, options?: CreateOptions): AlogInstance {
  return new AlogInstance(namespace, options);
}
