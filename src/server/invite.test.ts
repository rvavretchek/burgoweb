import { describe, expect, it } from 'vitest';
import { inviteUser } from './onboarding.js';
import { changeUserRole } from './auth.js';

describe('invite and role management', () => {
  it('creates invited user with temporary password', async () => {
    const users: any[] = [];
    const res = await inviteUser({ email: 'new@example.com', displayName: 'New', role: 'member', condominiumId: 'condo-1' }, users);
    expect(res.success).toBe(true);
    expect(res.temporaryPassword).toHaveLength(10);
    expect(users.find((u) => u.email === 'new@example.com')).toBeTruthy();
  });

  it('allows admin to change role', () => {
    const users: any[] = [
      { id: 'admin-1', email: 'a@example.com', displayName: 'A', passwordHash: 'x', profileType: 'only-syndic', role: 'admin', condominiumId: 'condo-1' },
      { id: 'user-2', email: 'b@example.com', displayName: 'B', passwordHash: 'x', profileType: 'only-resident', role: 'member', condominiumId: 'condo-1' },
    ];
    const history: any[] = [];
    const changed = changeUserRole('admin-1', 'user-2', 'admin', users, history);
    expect(changed).toBeTruthy();
    expect(changed?.role).toBe('admin');
    expect(history).toHaveLength(1);
  });
});
