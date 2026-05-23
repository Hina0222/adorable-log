import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configure, reset } from '../src/core/config';
import { callGroup } from '../src/methods/group';

beforeEach(() => {
  reset();
  vi.restoreAllMocks();
});

describe('callGroup', () => {
  it('콜백이 throw해도 groupEnd 호출됨', () => {
    vi.spyOn(console, 'group').mockImplementation(() => {});
    const groupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    expect(() => {
      callGroup('Auth', '#E74C3C', '#ffffff', '테스트', () => {
        throw new Error('콜백 에러');
      });
    }).toThrow('콜백 에러');

    expect(groupEndSpy).toHaveBeenCalledTimes(1);
  });

  it('enabled: false면 group 호출 안 됨', () => {
    configure({ enabled: false });
    const spy = vi.spyOn(console, 'group');
    callGroup('Auth', '#E74C3C', '#ffffff', '테스트', () => {});
    expect(spy).not.toHaveBeenCalled();
  });

  it('namespace enabled: false면 group 호출 안 됨', () => {
    configure({ namespaces: { Auth: { enabled: false } } });
    const spy = vi.spyOn(console, 'group');
    callGroup('Auth', '#E74C3C', '#ffffff', '테스트', () => {});
    expect(spy).not.toHaveBeenCalled();
  });

  it('collapsed 옵션이면 groupCollapsed 사용', () => {
    const spy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    callGroup('Auth', '#E74C3C', '#ffffff', '테스트', () => {}, { collapsed: true });
    expect(spy).toHaveBeenCalled();
  });
});
