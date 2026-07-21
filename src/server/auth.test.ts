import { describe, expect, it } from 'vitest';
import { isActorInCondominium } from './auth.js';

describe('auth helpers', () => {
  it('returns true when user belongs to condominium', () => {
    const users = [
      { id: 'user-1', email: 'a@example.com', displayName: 'A', passwordHash: 'x', profileType: 'only-syndic', role: 'admin', condominiumId: 'condo-1' },
    ];

    expect(isActorInCondominium('user-1', 'condo-1', users as any)).toBe(true);
  });

  it('returns false when user is not found or belongs elsewhere', () => {
    const users = [
      { id: 'user-2', email: 'b@example.com', displayName: 'B', passwordHash: 'x', profileType: 'only-resident', role: 'member', condominiumId: 'condo-2' },
    ];

    expect(isActorInCondominium('user-2', 'condo-1', users as any)).toBe(false);
    expect(isActorInCondominium('missing', 'condo-1', users as any)).toBe(false);
  });
});
