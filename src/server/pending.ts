import { randomBytes } from 'node:crypto';

export type PendingStatus = 'open' | 'in-progress' | 'done';

export interface PendingItem {
  id: string;
  title: string;
  description?: string;
  condominiumId: string;
  status: PendingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  condominiumId: string;
  actorUserId: string;
  action: string;
  message: string;
  createdAt: string;
}

export interface CreatePendingInput {
  title: string;
  description?: string;
  condominiumId: string;
  actorUserId: string;
}

export function createPendingItem(
  input: CreatePendingInput,
  pendingItems: PendingItem[],
  history: HistoryEntry[],
): PendingItem {
  const now = new Date().toISOString();
  const item: PendingItem = {
    id: `pending-${randomBytes(3).toString('hex')}`,
    title: input.title.trim(),
    description: input.description?.trim(),
    condominiumId: input.condominiumId,
    status: 'open',
    createdAt: now,
    updatedAt: now,
  };

  pendingItems.push(item);
  history.push({
    id: `history-${randomBytes(3).toString('hex')}`,
    condominiumId: input.condominiumId,
    actorUserId: input.actorUserId,
    action: 'pending-created',
    message: `${input.actorUserId} criou a pendência “${item.title}”.`,
    createdAt: now,
  });

  return item;
}

export function updatePendingItemStatus(
  itemId: string,
  status: PendingStatus,
  condominiumId: string,
  actorUserId: string,
  pendingItems: PendingItem[],
  history: HistoryEntry[],
): PendingItem | undefined {
  const item = pendingItems.find((entry) => entry.id === itemId && entry.condominiumId === condominiumId);
  if (!item) {
    return undefined;
  }

  const now = new Date().toISOString();
  item.status = status;
  item.updatedAt = now;

  history.push({
    id: `history-${randomBytes(3).toString('hex')}`,
    condominiumId,
    actorUserId,
    action: 'pending-status-updated',
    message: `${actorUserId} marcou como ${status} a pendência “${item.title}”.`,
    createdAt: now,
  });

  return item;
}
