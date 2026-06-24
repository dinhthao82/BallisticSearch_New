import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../userStore';

describe('userStore', () => {
  beforeEach(() => {
    useUserStore.setState({ user: null });
    localStorage.clear();
  });

  it('initial user is null', () => {
    expect(useUserStore.getState().user).toBeNull();
  });

  it('login() sets user', () => {
    useUserStore.getState().login({ id: '1', username: 'am_vu', role: 'Admin' });
    expect(useUserStore.getState().user).toMatchObject({ username: 'am_vu' });
  });

  it('logout() clears user', () => {
    useUserStore.getState().login({ id: '1', username: 'am_vu', role: 'Admin' });
    useUserStore.getState().logout();
    expect(useUserStore.getState().user).toBeNull();
  });

  it('persists user to localStorage (biq-user key)', () => {
    useUserStore.getState().login({ id: '2', username: 'jane', role: 'Agency' });
    const raw = localStorage.getItem('biq-user');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw ?? '{}') as { state?: { user?: { username?: string } } };
    expect(parsed.state?.user?.username).toBe('jane');
  });
});
