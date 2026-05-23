import { getConfig } from './config';
import { hashColor } from '../utils/color';
import { getTextColor } from '../utils/luminance';
import { callMethod } from '../methods/basic';
import { callGroup } from '../methods/group';
import { callTable } from '../methods/table';
import { callBanner } from '../methods/banner';

export class AlogInstance {
  private namespace: string;
  private bgColor: string;
  private textColor: string;

  constructor(namespace: string, options?: { color?: string }) {
    this.namespace = namespace;

    const nsConfig = getConfig().namespaces[namespace];
    const resolved = options?.color ?? nsConfig?.color ?? hashColor(namespace);
    this.bgColor = resolved;
    this.textColor = getTextColor(resolved);
  }

  log(message: unknown, ...args: unknown[]): void {
    callMethod('log', this.namespace, this.bgColor, this.textColor, message, args);
  }

  info(message: unknown, ...args: unknown[]): void {
    callMethod('info', this.namespace, this.bgColor, this.textColor, message, args);
  }

  warn(message: unknown, ...args: unknown[]): void {
    callMethod('warn', this.namespace, this.bgColor, this.textColor, message, args);
  }

  error(message: unknown, ...args: unknown[]): void {
    callMethod('error', this.namespace, this.bgColor, this.textColor, message, args);
  }

  success(message: unknown, ...args: unknown[]): void {
    callMethod('success', this.namespace, this.bgColor, this.textColor, message, args);
  }

  debug(message: unknown, ...args: unknown[]): void {
    callMethod('debug', this.namespace, this.bgColor, this.textColor, message, args);
  }

  group(label: string, callback: () => void, options?: { collapsed?: boolean }): void {
    callGroup(this.namespace, this.bgColor, this.textColor, label, callback, options);
  }

  table(label: string, data: unknown[], columns?: string[]): void {
    callTable(this.namespace, this.bgColor, this.textColor, label, data, columns);
  }

  banner(title: string): void {
    callBanner(this.namespace, this.bgColor, this.textColor, title);
  }
}
