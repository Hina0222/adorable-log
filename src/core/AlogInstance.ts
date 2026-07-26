import {getConfig, getVersion, type CollapseOptions} from './config';
import {hashColor, normalizeColor} from '../utils/color';
import {getTextColor} from '../utils/luminance';
import {buildBadge, type Badge} from '../utils/format';
import {callMethod} from '../methods/basic';
import {callGroup} from '../methods/group';
import {callTable} from '../methods/table';
import {callBanner} from '../methods/banner';

export interface CreateOptions {
  color?: string;
}

export class AlogInstance {
  private namespace: string;
  private explicitColor?: string;
  private bgColor!: string;
  private badge!: Badge;
  private configVersion: number;

  constructor(namespace: string, options?: CreateOptions) {
    this.namespace = namespace;
    this.explicitColor = options?.color;
    this.configVersion = getVersion();
    this.resolveBadge();
  }

  private resolveBadge(): void {
    const nsConfig = getConfig().namespaces[this.namespace];
    const resolved = normalizeColor(this.explicitColor ?? nsConfig?.color ?? hashColor(this.namespace));
    this.bgColor = resolved;
    const textColor = getTextColor(resolved);
    this.badge = buildBadge(this.namespace, this.bgColor, textColor);
  }

  // create 옵션 색상이 없으면 configure로 색이 늦게 지정돼도 반영되도록,
  // config가 바뀐 뒤 첫 호출에서만 badge를 재계산한다
  private currentBadge(): Badge {
    if (this.explicitColor === undefined && getVersion() !== this.configVersion) {
      this.configVersion = getVersion();
      this.resolveBadge();
    }
    return this.badge;
  }

  log(message: unknown, ...args: unknown[]): void {
    callMethod('log', this.namespace, this.currentBadge(), message, args);
  }

  info(message: unknown, ...args: unknown[]): void {
    callMethod('info', this.namespace, this.currentBadge(), message, args);
  }

  warn(message: unknown, ...args: unknown[]): void {
    callMethod('warn', this.namespace, this.currentBadge(), message, args);
  }

  error(message: unknown, ...args: unknown[]): void {
    callMethod('error', this.namespace, this.currentBadge(), message, args);
  }

  success(message: unknown, ...args: unknown[]): void {
    callMethod('success', this.namespace, this.currentBadge(), message, args);
  }

  debug(message: unknown, ...args: unknown[]): void {
    callMethod('debug', this.namespace, this.currentBadge(), message, args);
  }

  group(label: string, callback: () => void, options?: CollapseOptions): void {
    callGroup(this.namespace, this.currentBadge(), label, callback, options);
  }

  table(label: string, data: unknown[], columns?: string[], options?: CollapseOptions): void {
    callTable(this.namespace, this.currentBadge(), label, data, columns, options);
  }

  banner(title: string): void {
    const badge = this.currentBadge();
    callBanner(this.namespace, badge, this.bgColor, title);
  }
}
