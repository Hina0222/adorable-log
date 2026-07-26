import { describe, it, expect } from 'vitest';
import { hashColor, normalizeColor } from '../src/utils/color';

describe('normalizeColor', () => {
  it("'#' 없는 3/6자리 hex에 '#'을 붙임", () => {
    expect(normalizeColor('E74C3C')).toBe('#E74C3C');
    expect(normalizeColor('fff')).toBe('#fff');
  });

  it('그 외 형식은 그대로 반환', () => {
    expect(normalizeColor('#E74C3C')).toBe('#E74C3C');
    expect(normalizeColor('#fff')).toBe('#fff');
    expect(normalizeColor('yellow')).toBe('yellow');
    expect(normalizeColor('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)');
  });
});

// hex 색상을 HSL hue(0–360)로 역산 — 빨강 제외 불변식 검증용
function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  return (h * 60 + 360) % 360;
}

describe('hashColor', () => {
  it('같은 네임스페이스는 항상 같은 색상 반환', () => {
    expect(hashColor('Auth')).toBe(hashColor('Auth'));
    expect(hashColor('Cart')).toBe(hashColor('Cart'));
  });

  it('hex 형식으로 반환됨', () => {
    expect(hashColor('Auth')).toMatch(/^#[0-9a-f]{6}$/i);
    expect(hashColor('API')).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('Auth와 Cart는 다른 색상', () => {
    expect(hashColor('Auth')).not.toBe(hashColor('Cart'));
  });

  it('빈 문자열도 처리됨', () => {
    expect(hashColor('')).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('빨강 색상대를 제외함 (hue 20–340, 반올림 오차 ±1)', () => {
    // 해시가 문자 코드에 선형이라 'ns0'~'ns99' 같은 연속 이름은 hue가 좁은 구간에 몰림 —
    // 고정 시드 의사난수 문자열로 hue 전 구간을 커버해야 회귀(예: % 360)를 잡는다
    let seed = 42;
    const next = () => (seed = (seed * 1103515245 + 12345) >>> 0);
    for (let i = 0; i < 100; i++) {
      let name = '';
      const len = (next() % 8) + 2;
      for (let j = 0; j < len; j++) name += String.fromCharCode(97 + (next() % 26));
      const hue = hexToHue(hashColor(name));
      expect(hue).toBeGreaterThanOrEqual(19);
      expect(hue).toBeLessThanOrEqual(341);
    }
  });
});
