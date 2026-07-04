import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configure, reset } from '../src/core/config';
import { callMethod } from '../src/methods/basic';

beforeEach(() => {
  reset();
  vi.restoreAllMocks();
});

const badge = { format: '%c[Auth]%c', styles: ['background: #E74C3C; color: #ffffff; padding: 2px 6px; border-radius: 3px; font-weight: bold', ''] };

describe('callMethod', () => {
  it('enabled: false면 console 호출 안 됨', () => {
    configure({ enabled: false });
    const spy = vi.spyOn(console, 'log');
    callMethod('log', 'Auth', badge, '테스트', []);
    expect(spy).not.toHaveBeenCalled();
  });

  it('namespace enabled: false면 해당 네임스페이스만 무시', () => {
    configure({ namespaces: { Auth: { enabled: false } } });
    const spy = vi.spyOn(console, 'log');
    callMethod('log', 'Auth', badge, '테스트', []);
    expect(spy).not.toHaveBeenCalled();
  });

  it('enabled: true면 네임스페이스 프리픽스와 함께 console 호출됨', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    callMethod('log', 'Auth', badge, '테스트', []);
    expect(spy).toHaveBeenCalledWith('[Auth]', '테스트');
  });

  it('추가 인자도 그대로 전달됨', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    callMethod('log', 'Auth', badge, '테스트', [1, { id: 2 }]);
    expect(spy).toHaveBeenCalledWith('[Auth]', '테스트', 1, { id: 2 });
  });

  it('warn 메서드는 console.warn 호출', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    callMethod('warn', 'Auth', badge, '경고', []);
    expect(spy).toHaveBeenCalledWith('[Auth] ⚠️', '경고');
  });

  it('error 메서드는 console.error 호출', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    callMethod('error', 'Auth', badge, '오류', []);
    expect(spy).toHaveBeenCalledWith('[Auth] ❌', '오류');
  });

  it('info 메서드는 console.info 호출', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    callMethod('info', 'Auth', badge, '정보', []);
    expect(spy).toHaveBeenCalledWith('[Auth] ℹ️', '정보');
  });

  it('debug 메서드는 console.debug 호출', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    callMethod('debug', 'Auth', badge, '디버그', []);
    expect(spy).toHaveBeenCalledWith('[Auth] 🔍', '디버그');
  });

  it('success 메서드는 console.log 호출', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    callMethod('success', 'Auth', badge, '성공', []);
    expect(spy).toHaveBeenCalledWith('[Auth] ✅', '성공');
  });
});
