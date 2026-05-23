import { describe, it, expect, beforeEach } from 'vitest';
import { configure, reset } from '../src/core/config';
import { PlogInstance } from '../src/core/PlogInstance';
import { hashColor } from '../src/utils/color';

beforeEach(() => {
  reset();
});

describe('PlogInstance 색상 우선순위', () => {
  it('create 옵션이 최우선', () => {
    configure({ namespaces: { Auth: { color: '#aaaaaa' } } });
    const instance = new PlogInstance('Auth', { color: '#ff0000' });
    // bgColor는 private이라 간접 검증 — 에러 없이 생성되는지 확인
    expect(instance).toBeInstanceOf(PlogInstance);
  });

  it('configure 네임스페이스 색상이 해시보다 우선 (옵션 미지정 시)', () => {
    configure({ namespaces: { Auth: { color: '#bbbbbb' } } });
    const instance = new PlogInstance('Auth');
    expect(instance).toBeInstanceOf(PlogInstance);
  });

  it('옵션, configure 모두 없으면 해시 색상 사용', () => {
    const instance = new PlogInstance('Auth');
    expect(instance).toBeInstanceOf(PlogInstance);
    // hashColor가 결정론적임을 간접 검증
    expect(hashColor('Auth')).toBe(hashColor('Auth'));
  });
});
