import type { StoredUser } from './onboarding.js';
import { randomBytes } from 'node:crypto';

export function isActorInCondominium(actorUserId: string, condominiumId: string, users: StoredUser[]): boolean {
  if (!actorUserId || !condominiumId) return false;
  const actor = users.find((u) => u.id === actorUserId);
  if (!actor) return false;
  return actor.condominiumId === condominiumId;
}

export function getUserById(actorUserId: string, users: StoredUser[]): StoredUser | undefined {
  return users.find((u) => u.id === actorUserId);
}

export function changeUserRole(
  actorUserId: string,
  targetUserId: string,
  newRole: 'admin' | 'member',
  users: StoredUser[],
  history: { id: string; condominiumId: string; actorUserId: string; action: string; message: string; createdAt: string }[],
): StoredUser | undefined {
  const actor = getUserById(actorUserId, users);
  const target = getUserById(targetUserId, users);
  if (!actor || !target) return undefined;
  if (actor.condominiumId !== target.condominiumId) return undefined;
  if (actor.role !== 'admin') return undefined;

  target.role = newRole;
  const now = new Date().toISOString();
  history.push({
    id: `history-${randomBytes(3).toString('hex')}`,
    condominiumId: actor.condominiumId,
    actorUserId: actorUserId,
    action: 'user-role-changed',
    message: `${actorUserId} alterou o papel de ${targetUserId} para ${newRole}.`,
    createdAt: now,
  });

  return target;
}
