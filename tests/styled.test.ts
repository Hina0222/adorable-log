import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reset } from '../src/core/config';
import { callMethod } from '../src/methods/basic';
import { callGroup } from '../src/methods/group';
import { callTable } from '../src/methods/table';
import { callBanner } from '../src/methods/banner';
import { buildBadge } from '../src/utils/format';

vi.mock('../src/utils/detect', () => ({ supportsStyles: () => true }));

beforeEach(() => {
  reset();
  vi.restoreAllMocks();
});

const badge = buildBadge('Auth', '#E74C3C', '#ffffff');

describe('styled 경로 (%c)', () => {
  it('callMethod: 배지 포맷, 스타일 2개, 메시지 순서로 전달됨', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    callMethod('log', 'Auth', badge, '테스트', []);
    expect(spy).toHaveBeenCalledWith('%c[Auth]%c', badge.styles[0], '', '테스트');
  });

  it('callMethod: 아이콘 있는 메서드는 포맷 뒤에 아이콘이 붙음', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    callMethod('warn', 'Auth', badge, '경고', []);
    expect(spy).toHaveBeenCalledWith('%c[Auth]%c ⚠️', badge.styles[0], '', '경고');
  });

  it('callGroup: 라벨이 배지 포맷과 함께 전달되고 groupEnd 호출됨', () => {
    const groupSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const endSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    callGroup('Auth', badge, '라벨', () => {});
    expect(groupSpy).toHaveBeenCalledWith('%c[Auth]%c 라벨', badge.styles[0], '');
    expect(endSpy).toHaveBeenCalledTimes(1);
  });

  it('callTable: 배지 라벨 그룹 안에서 console.table 호출됨', () => {
    const groupSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {});
    const endSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    const data = [{ name: '🍔', price: 30 }];
    callTable('Auth', badge, '목록', data, ['name']);
    expect(groupSpy).toHaveBeenCalledWith('%c[Auth]%c 목록', badge.styles[0], '');
    expect(tableSpy).toHaveBeenCalledWith(data, ['name']);
    expect(endSpy).toHaveBeenCalledTimes(1);
  });

  it('callBanner: %c 3개와 스타일 인자 3개(배지 2 + 타이틀 1)가 짝을 이룸', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    callBanner('Auth', badge, '#E74C3C', '타이틀');
    expect(spy).toHaveBeenCalledTimes(1);
    const call = spy.mock.calls[0];
    const format = call[0] as string;
    expect(format).toBe('%c[Auth]%c %c타이틀');
    expect((format.match(/%c/g) ?? [])).toHaveLength(3);
    expect(call).toHaveLength(4); // 포맷 1개 + 스타일 3개
    expect(call[3]).toContain('border: 1px solid #E74C3C');
    expect(call[3]).toContain('color: #E74C3C');
  });
});
