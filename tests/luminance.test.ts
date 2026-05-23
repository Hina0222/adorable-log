import { describe, it, expect } from 'vitest';
import { getTextColor } from '../src/utils/luminance';

describe('getTextColor', () => {
  it('어두운 배경 → 텍스트 흰색', () => {
    expect(getTextColor('#000000')).toBe('#ffffff');
    expect(getTextColor('#E74C3C')).toBe('#ffffff');
    expect(getTextColor('#9B59B6')).toBe('#ffffff');
  });

  it('밝은 배경 → 텍스트 검정', () => {
    expect(getTextColor('#ffffff')).toBe('#000000');
    expect(getTextColor('#F39C12')).toBe('#000000');
    expect(getTextColor('#2ECC71')).toBe('#000000');
  });
});
