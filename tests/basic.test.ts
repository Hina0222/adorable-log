import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configure, reset } from '../src/core/config';
import { callMethod } from '../src/methods/basic';

beforeEach(() => {
  reset();
  vi.restoreAllMocks();
});

describe('callMethod', () => {
  it('enabled: false면 console 호출 안 됨', () => {
    configure({ enabled: false });
    const spy = vi.spyOn(console, 'log');
    callMethod('log', 'Auth', '#E74C3C', '#ffffff', '테스트', []);
    expect(spy).not.toHaveBeenCalled();
  });

  it('namespace enabled: false면 해당 네임스페이스만 무시', () => {
    configure({ namespaces: { Auth: { enabled: false } } });
    const spy = vi.spyOn(console, 'log');
    callMethod('log', 'Auth', '#E74C3C', '#ffffff', '테스트', []);
    expect(spy).not.toHaveBeenCalled();
  });

  it('enabled: true면 console 호출됨', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    callMethod('log', 'Auth', '#E74C3C', '#ffffff', '테스트', []);
    expect(spy).toHaveBeenCalled();
  });

  it('warn 메서드는 console.warn 호출', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    callMethod('warn', 'Auth', '#E74C3C', '#ffffff', '경고', []);
    expect(spy).toHaveBeenCalled();
  });

  it('error 메서드는 console.error 호출', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    callMethod('error', 'Auth', '#E74C3C', '#ffffff', '오류', []);
    expect(spy).toHaveBeenCalled();
  });

  it('info 메서드는 console.info 호출', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    callMethod('info', 'Auth', '#E74C3C', '#ffffff', '정보', []);
    expect(spy).toHaveBeenCalled();
  });

  it('debug 메서드는 console.debug 호출', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    callMethod('debug', 'Auth', '#E74C3C', '#ffffff', '디버그', []);
    expect(spy).toHaveBeenCalled();
  });

  it('success 메서드는 console.log 호출', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    callMethod('success', 'Auth', '#E74C3C', '#ffffff', '성공', []);
    expect(spy).toHaveBeenCalled();
  });
});
