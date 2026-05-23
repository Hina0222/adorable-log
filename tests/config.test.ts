import { describe, it, expect, beforeEach } from 'vitest';
import { configure, getConfig, reset } from '../src/core/config';

beforeEach(() => {
  reset();
});

describe('configure', () => {
  it('설정 변경이 반영됨', () => {
    configure({ enabled: false });
    const config = getConfig();
    expect(config.enabled).toBe(false);
  });

  it('namespaces는 병합됨', () => {
    configure({ namespaces: { Auth: { color: '#ff0000' } } });
    configure({ namespaces: { Cart: { color: '#00ff00' } } });
    const config = getConfig();
    expect(config.namespaces.Auth?.color).toBe('#ff0000');
    expect(config.namespaces.Cart?.color).toBe('#00ff00');
  });
});

describe('reset', () => {
  it('기본값으로 복원됨', () => {
    configure({ enabled: false });
    reset();
    const config = getConfig();
    expect(config.enabled).toBe(true);
    expect(config.namespaces).toEqual({});
  });
});
