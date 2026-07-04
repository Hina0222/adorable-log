import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configure, reset } from '../src/core/config';
import { callBanner } from '../src/methods/banner';

beforeEach(() => {
  reset();
  vi.restoreAllMocks();
});

const badge = { format: '%c[Auth]%c', styles: ['background: #E74C3C; color: #ffffff; padding: 2px 6px; border-radius: 3px; font-weight: bold', ''] };

describe('callBanner', () => {
  it('enabled: false면 console 호출 안 됨', () => {
    configure({ enabled: false });
    const spy = vi.spyOn(console, 'log');
    callBanner('Auth', badge, '#E74C3C', '시작');
    expect(spy).not.toHaveBeenCalled();
  });

  it('namespace enabled: false면 해당 네임스페이스만 무시', () => {
    configure({ namespaces: { Auth: { enabled: false } } });
    const spy = vi.spyOn(console, 'log');
    callBanner('Auth', badge, '#E74C3C', '시작');
    expect(spy).not.toHaveBeenCalled();
  });

  it('폴백 환경에서는 플레인 배너로 출력됨', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    callBanner('Auth', badge, '#E74C3C', '시작');
    expect(spy).toHaveBeenCalledWith('[Auth] *** 시작 ***');
  });
});
