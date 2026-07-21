import { describe, expect, it } from 'vitest';
import { createPendingItem, updatePendingItemStatus } from './pending.js';

describe('pending workflow', () => {
  it('creates a pending item and records the history entry', () => {
    const pendingItems: Array<{
      id: string;
      title: string;
      description?: string;
      condominiumId: string;
      status: 'open' | 'in-progress' | 'done';
      createdAt: string;
      updatedAt: string;
    }> = [];
    const history: Array<{
      id: string;
      condominiumId: string;
      actorUserId: string;
      action: string;
      message: string;
      createdAt: string;
    }> = [];

    const created = createPendingItem(
      {
        title: 'Reparar portão',
        description: 'Portão trancando sozinho',
        condominiumId: 'condo-1',
        actorUserId: 'user-1',
      },
      pendingItems,
      history,
    );

    expect(created.title).toBe('Reparar portão');
    expect(created.status).toBe('open');
    expect(history).toHaveLength(1);
    expect(history[0]?.message).toContain('criou a pendência');
  });

  it('updates the status and records a history event', () => {
    const pendingItems: Array<{
      id: string;
      title: string;
      description?: string;
      condominiumId: string;
      status: 'open' | 'in-progress' | 'done';
      createdAt: string;
      updatedAt: string;
    }> = [
      {
        id: 'item-1',
        title: 'Limpeza do salão',
        description: 'Limpeza semanal',
        condominiumId: 'condo-1',
        status: 'open',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ];
    const history: Array<{
      id: string;
      condominiumId: string;
      actorUserId: string;
      action: string;
      message: string;
      createdAt: string;
    }> = [];

    const updated = updatePendingItemStatus('item-1', 'done', 'condo-1', 'user-1', pendingItems, history);

    expect(updated?.status).toBe('done');
    expect(history).toHaveLength(1);
    expect(history[0]?.message).toContain('marcou como done');
  });
});
