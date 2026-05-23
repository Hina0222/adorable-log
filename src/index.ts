import { PlogInstance } from './core/PlogInstance';
import { configure } from './core/config';

export type { PlogConfig } from './core/config';
export { configure };

export function create(namespace: string, options?: { color?: string }): PlogInstance {
  return new PlogInstance(namespace, options);
}
