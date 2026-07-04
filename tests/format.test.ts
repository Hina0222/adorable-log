import { describe, it, expect } from 'vitest';
import { buildBadge } from '../src/utils/format';

describe('buildBadge', () => {
  it('%c 배지 포맷과 리셋용 빈 스타일을 만든다', () => {
    const badge = buildBadge('Auth', '#E74C3C', '#ffffff');
    expect(badge.format).toBe('%c[Auth]%c');
    expect(badge.styles).toHaveLength(2);
    expect(badge.styles[0]).toContain('background: #E74C3C');
    expect(badge.styles[0]).toContain('color: #ffffff');
    expect(badge.styles[1]).toBe('');
  });
});
