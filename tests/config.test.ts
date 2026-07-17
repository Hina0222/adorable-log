import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configure, getConfig, reset } from '../src/core/config';

beforeEach(() => {
  reset();
  vi.restoreAllMocks();
});

describe('configure', () => {
  it('설정 변경이 반영됨', () => {
    configure({ enabled: false });
    const config = getConfig();
    expect(config.enabled).toBe(false);
  });

  it('한 번의 호출로 여러 네임스페이스를 설정함', () => {
    configure({
      namespaces: {
        Auth: { color: '#ff0000' },
        Cart: { color: '#00ff00', enabled: false },
      },
    });
    const config = getConfig();
    expect(config.namespaces.Auth?.color).toBe('#ff0000');
    expect(config.namespaces.Cart?.color).toBe('#00ff00');
    expect(config.namespaces.Cart?.enabled).toBe(false);
  });

  it('enabled: undefined는 무시되고 기본값이 유지됨', () => {
    configure({ enabled: undefined });
    expect(getConfig().enabled).toBe(true);
  });

  it('collapsed: undefined는 무시되고 기본값이 유지됨', () => {
    configure({ collapsed: undefined });
    expect(getConfig().collapsed).toBe(true);
  });

  it('두 번째 호출은 경고 후 무시됨', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    configure({ enabled: false, namespaces: { Auth: { color: '#ff0000' } } });
    configure({ enabled: true, namespaces: { Auth: { color: '#00ff00' }, Cart: { color: '#0000ff' } } });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const config = getConfig();
    expect(config.enabled).toBe(false);
    expect(config.namespaces.Auth?.color).toBe('#ff0000');
    expect(config.namespaces.Cart).toBeUndefined();
  });

  it('넘긴 네임스페이스 객체를 나중에 변이해도 내부 설정은 바뀌지 않음', () => {
    const auth = { color: '#ff0000' };
    configure({ namespaces: { Auth: auth } });
    auth.color = '#000000';
    expect(getConfig().namespaces.Auth?.color).toBe('#ff0000');
  });
});

describe('reset', () => {
  it('기본값으로 복원되고 configure를 경고 없이 다시 호출할 수 있음', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    configure({ enabled: false });
    reset();

    const config = getConfig();
    expect(config.enabled).toBe(true);
    expect(config.namespaces).toEqual({});

    configure({ enabled: false });
    expect(warnSpy).not.toHaveBeenCalled();
    expect(getConfig().enabled).toBe(false);
  });
});
