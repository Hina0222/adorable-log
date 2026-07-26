import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configure, reset } from '../src/core/config';
import { callTable } from '../src/methods/table';

beforeEach(() => {
  reset();
  vi.restoreAllMocks();
});

const badge = { format: '%c[Auth]%c', styles: ['background: #E74C3C; color: #ffffff; padding: 2px 6px; border-radius: 3px; font-weight: bold', ''] };
const data = [{ name: '🍔', price: 30 }];

describe('callTable', () => {
  it('enabled: false면 group/table 호출 안 됨', () => {
    configure({ enabled: false });
    const groupSpy = vi.spyOn(console, 'groupCollapsed');
    const tableSpy = vi.spyOn(console, 'table');
    callTable('Auth', badge, '목록', data);
    expect(groupSpy).not.toHaveBeenCalled();
    expect(tableSpy).not.toHaveBeenCalled();
  });

  it('namespace enabled: false면 해당 네임스페이스만 무시', () => {
    configure({ namespaces: { Auth: { enabled: false } } });
    const groupSpy = vi.spyOn(console, 'groupCollapsed');
    const tableSpy = vi.spyOn(console, 'table');
    callTable('Auth', badge, '목록', data);
    expect(groupSpy).not.toHaveBeenCalled();
    expect(tableSpy).not.toHaveBeenCalled();
  });

  it('라벨 그룹 안에서 console.table이 데이터/컬럼과 함께 호출됨', () => {
    const groupSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const tableSpy = vi.spyOn(console, 'table').mockImplementation(() => {});
    const endSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    callTable('Auth', badge, '목록', data, ['name']);
    expect(groupSpy).toHaveBeenCalledWith('[Auth] 목록');
    expect(tableSpy).toHaveBeenCalledWith(data, ['name']);
    expect(endSpy).toHaveBeenCalledTimes(1);
  });

  it('collapsed: false 설정이면 console.group 사용', () => {
    configure({ collapsed: false });
    const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'table').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    callTable('Auth', badge, '목록', data);
    expect(groupSpy).toHaveBeenCalledWith('[Auth] 목록');
  });

  it('collapsed: false 옵션이면 console.group 사용', () => {
    const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'table').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    callTable('Auth', badge, '목록', data, undefined, { collapsed: false });
    expect(groupSpy).toHaveBeenCalledTimes(1);
  });

  it('collapsed: true 옵션이면 전역 설정(collapsed: false)보다 우선함', () => {
    configure({ collapsed: false });
    const collapsedSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const groupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    vi.spyOn(console, 'table').mockImplementation(() => {});
    vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    callTable('Auth', badge, '목록', data, undefined, { collapsed: true });
    expect(collapsedSpy).toHaveBeenCalledTimes(1);
    expect(groupSpy).not.toHaveBeenCalled();
  });

  it('console.table이 throw해도 groupEnd 호출됨', () => {
    vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    vi.spyOn(console, 'table').mockImplementation(() => {
      throw new Error('테이블 에러');
    });
    const endSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    expect(() => callTable('Auth', badge, '목록', data)).toThrow('테이블 에러');
    expect(endSpy).toHaveBeenCalledTimes(1);
  });
});
