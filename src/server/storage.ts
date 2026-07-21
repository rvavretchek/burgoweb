import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { StoredCondominium, StoredUser } from './onboarding.js';
import type { HistoryEntry, PendingItem } from './pending.js';

export interface StoredData {
  users: StoredUser[];
  condominiums: StoredCondominium[];
  pendingItems: PendingItem[];
  history: HistoryEntry[];
}

export function createEmptyStore(): StoredData {
  return {
    users: [],
    condominiums: [],
    pendingItems: [],
    history: [],
  };
}

export async function loadStore(): Promise<StoredData> {
  const filePath = path.resolve(process.cwd(), 'data', 'storage.json');

  if (!existsSync(filePath)) {
    const initialStore = createEmptyStore();
    await saveStore(initialStore, filePath);
    return initialStore;
  }

  const raw = readFileSync(filePath, 'utf8');

  try {
    const parsed = JSON.parse(raw) as Partial<StoredData>;
    return {
      users: parsed.users ?? [],
      condominiums: parsed.condominiums ?? [],
      pendingItems: parsed.pendingItems ?? [],
      history: parsed.history ?? [],
    };
  } catch {
    return createEmptyStore();
  }
}

export async function saveStore(store: StoredData, filePath = path.resolve(process.cwd(), 'data', 'storage.json')): Promise<void> {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(store, null, 2));
}
