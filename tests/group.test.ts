import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configure, reset } from '../src/core/config';
import { callGroup } from '../src/methods/group';

beforeEach(() => {
  reset();
  vi.restoreAllMocks();
});

const badge = { format: '%c[Auth]%c', styles: ['background: #E74C3C; color: #ffffff; padding: 2px 6px; border-radius: 3px; font-weight: bold', ''] };

describe('callGroup', () => {
  it('콜백이 throw해도 groupEnd 호출됨', () => {
    vi.spyOn(console, 'group').mockImplementation(() => {});
    const groupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    expect(() => {
      callGroup('Auth', badge, '테스트', () => {
        throw new Error('콜백 에러');
      });
    }).toThrow('콜백 에러');

    expect(groupEndSpy).toHaveBeenCalledTimes(1);
  });

  it('enabled: false면 group 호출 안 됨', () => {
    configure({ enabled: false });
    const spy = vi.spyOn(console, 'group');
    callGroup('Auth', badge, '테스트', () => {});
    expect(spy).not.toHaveBeenCalled();
  });

  it('namespace enabled: false면 group 호출 안 됨', () => {
    configure({ namespaces: { Auth: { enabled: false } } });
    const spy = vi.spyOn(console, 'group');
    callGroup('Auth', badge, '테스트', () => {});
    expect(spy).not.toHaveBeenCalled();
  });

  it('enabled: false여도 콜백은 실행됨 (그룹 래핑 없이)', () => {
    configure({ enabled: false });
    const callback = vi.fn();
    const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    const collapsedSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const endSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    callGroup('Auth', badge, '테스트', callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(groupSpy).not.toHaveBeenCalled();
    expect(collapsedSpy).not.toHaveBeenCalled();
    expect(endSpy).not.toHaveBeenCalled();
  });

  it('namespace enabled: false여도 콜백은 실행됨 (그룹 래핑 없이)', () => {
    configure({ namespaces: { Auth: { enabled: false } } });
    const callback = vi.fn();
    const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    const collapsedSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const endSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    callGroup('Auth', badge, '테스트', callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(groupSpy).not.toHaveBeenCalled();
    expect(collapsedSpy).not.toHaveBeenCalled();
    expect(endSpy).not.toHaveBeenCalled();
  });

  it('collapsed 옵션이면 groupCollapsed 사용', () => {
    const spy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    callGroup('Auth', badge, '테스트', () => {}, { collapsed: true });
    expect(spy).toHaveBeenCalled();
  });

  it('옵션이 없으면 전역 기본값(collapsed: true)으로 groupCollapsed 사용', () => {
    const collapsedSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    callGroup('Auth', badge, '테스트', () => {});
    expect(collapsedSpy).toHaveBeenCalledTimes(1);
    expect(groupSpy).not.toHaveBeenCalled();
  });

  it('collapsed: false 옵션이면 console.group 사용', () => {
    const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    callGroup('Auth', badge, '테스트', () => {}, { collapsed: false });
    expect(groupSpy).toHaveBeenCalledTimes(1);
  });
});
