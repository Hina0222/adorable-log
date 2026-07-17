import { describe, it, expect, vi, afterEach } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('supportsStyles', () => {
  it('window가 없으면 false', async () => {
    vi.resetModules();
    const { supportsStyles } = await import('../src/utils/detect');
    expect(supportsStyles()).toBe(false);
  });

  it('브라우저 UA면 true이고 결과가 캐싱됨', async () => {
    vi.resetModules();
    vi.stubGlobal('window', {});
    vi.stubGlobal('navigator', { userAgent: 'Chrome' });
    const { supportsStyles } = await import('../src/utils/detect');
    expect(supportsStyles()).toBe(true);

    // 전역이 사라져도 캐싱된 결과가 유지됨
    vi.unstubAllGlobals();
    expect(supportsStyles()).toBe(true);
  });

  it('window만 있고 navigator가 없으면 크래시 없이 false', async () => {
    vi.resetModules();
    vi.stubGlobal('window', {});
    vi.stubGlobal('navigator', undefined);
    const { supportsStyles } = await import('../src/utils/detect');
    expect(supportsStyles()).toBe(false);
  });

  it('지원 목록에 없는 UA면 false', async () => {
    vi.resetModules();
    vi.stubGlobal('window', {});
    vi.stubGlobal('navigator', { userAgent: 'UnknownBrowser' });
    const { supportsStyles } = await import('../src/utils/detect');
    expect(supportsStyles()).toBe(false);
  });
});
