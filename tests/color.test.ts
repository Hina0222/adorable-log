import { describe, it, expect } from 'vitest';
import { hashColor } from '../src/utils/color';

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
});
