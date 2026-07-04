import { AlogInstance } from './core/AlogInstance';
import { configure } from './core/config';

export type { AlogConfig } from './core/config';
export { AlogInstance };
export { configure };

export function create(namespace: string, options?: { color?: string }): AlogInstance {
  return new AlogInstance(namespace, options);
}
