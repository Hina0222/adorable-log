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

describe('configure가 create 이후에 호출되어도 색상 반영', () => {
  it('create 후 configure로 지정한 네임스페이스 색상이 반영됨', () => {
    const instance = new AlogInstance('Auth');
    configure({ namespaces: { Auth: { color: '#123456' } } });
    expect(loggedBadgeStyle(instance)).toContain('background: #123456');
  });

  it('create 옵션 색상은 이후 configure보다 계속 우선함', () => {
    const instance = new AlogInstance('Auth', { color: '#ff0000' });
    configure({ namespaces: { Auth: { color: '#00ff00' } } });
    expect(loggedBadgeStyle(instance)).toContain('background: #ff0000');
  });

  it('색상과 무관한 configure 후에는 해시 색상이 유지됨', () => {
    const instance = new AlogInstance('Auth');
    configure({ collapsed: false });
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
