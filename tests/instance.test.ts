import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configure, reset } from '../src/core/config';
import { AlogInstance } from '../src/core/AlogInstance';
import { create } from '../src/index';
import { hashColor } from '../src/utils/color';

vi.mock('../src/utils/detect', () => ({ supportsStyles: () => true }));

beforeEach(() => {
  reset();
  vi.restoreAllMocks();
});

// 인스턴스로 한 번 로깅해서 콘솔에 전달된 배지 스타일 문자열을 얻는다
function loggedBadgeStyle(instance: AlogInstance): string {
  const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  instance.log('테스트');
  const style = spy.mock.calls[0][1] as string;
  spy.mockRestore();
  return style;
}

describe('AlogInstance 색상 우선순위', () => {
  it('create 옵션이 최우선', () => {
    configure({ namespaces: { Auth: { color: '#aaaaaa' } } });
    const instance = new AlogInstance('Auth', { color: '#ff0000' });
    expect(loggedBadgeStyle(instance)).toContain('background: #ff0000');
  });

  it('configure 네임스페이스 색상이 해시보다 우선 (옵션 미지정 시)', () => {
    configure({ namespaces: { Auth: { color: '#bbbbbb' } } });
    const instance = new AlogInstance('Auth');
    expect(loggedBadgeStyle(instance)).toContain('background: #bbbbbb');
  });

  it('옵션, configure 모두 없으면 해시 색상 사용', () => {
    const instance = new AlogInstance('Auth');
    expect(loggedBadgeStyle(instance)).toContain(`background: ${hashColor('Auth')}`);
  });
});

describe('create', () => {
  it('AlogInstance를 반환하고 배지 포맷으로 로깅함', () => {
    const log = create('API');
    expect(log).toBeInstanceOf(AlogInstance);
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    log.log('메시지');
    expect(spy).toHaveBeenCalledWith('%c[API]%c', expect.stringContaining('background:'), '', '메시지');
  });
});
