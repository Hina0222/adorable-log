import {getConfig} from './config';
import {hashColor} from '../utils/color';
import {getTextColor} from '../utils/luminance';
import {buildBadge} from '../utils/format';
import {callMethod} from '../methods/basic';
import {callGroup} from '../methods/group';
import {callTable} from '../methods/table';
import {callBanner} from '../methods/banner';

export class AlogInstance {
  private namespace: string;
  private bgColor: string;
  private textColor: string;
  private badge: { format: string; styles: string[] };

  constructor(namespace: string, options?: { color?: string }) {
    this.namespace = namespace;

    const nsConfig = getConfig().namespaces[namespace];
    const resolved = options?.color ?? nsConfig?.color ?? hashColor(namespace);
    this.bgColor = resolved;
    this.textColor = getTextColor(resolved);
    this.badge = buildBadge(this.namespace, this.bgColor, this.textColor);
  }

  log(message: unknown, ...args: unknown[]): void {
    callMethod('log', this.namespace, this.badge, message, args);
  }

  info(message: unknown, ...args: unknown[]): void {
    callMethod('info', this.namespace, this.badge, message, args);
  }

  warn(message: unknown, ...args: unknown[]): void {
    callMethod('warn', this.namespace, this.badge, message, args);
  }

  error(message: unknown, ...args: unknown[]): void {
    callMethod('error', this.namespace, this.badge, message, args);
  }

  success(message: unknown, ...args: unknown[]): void {
    callMethod('success', this.namespace, this.badge, message, args);
  }

  debug(message: unknown, ...args: unknown[]): void {
    callMethod('debug', this.namespace, this.badge, message, args);
  }

  group(label: string, callback: () => void, options?: { collapsed?: boolean }): void {
    callGroup(this.namespace, this.badge, label, callback, options);
  }

  table(label: string, data: unknown[], columns?: string[]): void {
    callTable(this.namespace, this.badge, label, data, columns);
  }

  banner(title: string): void {
    callBanner(this.namespace, this.badge, this.bgColor, title);
  }
}
