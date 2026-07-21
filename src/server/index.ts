import cors from 'cors';
import express, { type Request, type Response } from 'express';
import { createOnboardingRecord, onboardingSchema, verifyPassword } from './onboarding.js';
import { createPendingItem, updatePendingItemStatus, type PendingStatus } from './pending.js';
import { isActorInCondominium, getUserById } from './auth.js';
import { changeUserRole } from './auth.js';
import { loadStore, saveStore } from './storage.js';

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

const store = await loadStore();

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, message: 'Burgoweb API online' });
});

app.post('/api/onboarding', async (req: Request, res: Response) => {
  const parsed = onboardingSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const result = await createOnboardingRecord(parsed.data, store.users, store.condominiums);
    await saveStore(store);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  const user = store.users.find((entry) => entry.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const validPassword = await verifyPassword(user.passwordHash, password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  return res.json({ success: true, user, condominium: store.condominiums.find((condominium) => condominium.id === user.condominiumId) });
});

app.get('/api/condominiums/:id/pendings', (req: Request, res: Response) => {
  const condominium = store.condominiums.find((entry) => entry.id === req.params.id);
  if (!condominium) {
    return res.status(404).json({ error: 'Condomínio não encontrado.' });
  }

  const pendings = store.pendingItems.filter((item) => item.condominiumId === condominium.id);
  return res.json(pendings);
});

app.post('/api/condominiums/:id/pendings', async (req: Request, res: Response) => {
  const condominium = store.condominiums.find((entry) => entry.id === req.params.id);
  if (!condominium) {
    return res.status(404).json({ error: 'Condomínio não encontrado.' });
  }

  const { title, description, actorUserId } = req.body as { title?: string; description?: string; actorUserId?: string };
  if (!title?.trim() || !actorUserId?.trim()) {
    return res.status(400).json({ error: 'Título e usuário são obrigatórios.' });
  }

  // verify actor exists and belongs to condominium
  const actor = getUserById(actorUserId.trim(), store.users);
  if (!actor || actor.condominiumId !== condominium.id) {
    return res.status(403).json({ error: 'Usuário não autorizado para esse condomínio.' });
  }

  const created = createPendingItem(
    {
      title: title.trim(),
      description,
      condominiumId: condominium.id,
      actorUserId: actorUserId.trim(),
    },
    store.pendingItems,
    store.history,
  );
  await saveStore(store);
  return res.status(201).json(created);
});

app.post('/api/condominiums/:id/invite', async (req: Request, res: Response) => {
  const condominium = store.condominiums.find((entry) => entry.id === req.params.id);
  if (!condominium) return res.status(404).json({ error: 'Condomínio não encontrado.' });

  const { email, role, actorUserId, displayName } = req.body as { email?: string; role?: 'admin' | 'member'; actorUserId?: string; displayName?: string };
  if (!email?.trim() || !actorUserId?.trim()) return res.status(400).json({ error: 'E-mail e usuário do ator são obrigatórios.' });

  const actor = getUserById(actorUserId.trim(), store.users);
  if (!actor || actor.condominiumId !== condominium.id || actor.role !== 'admin') {
    return res.status(403).json({ error: 'Somente administradores podem convidar usuários.' });
  }

  const { inviteUser } = await import('./onboarding.js');
  const result = await inviteUser({ email: email.trim(), displayName, role, condominiumId: condominium.id }, store.users as any);
  store.history.push({ id: `history-${Math.random().toString(16).slice(2, 8)}`, condominiumId: condominium.id, actorUserId: actorUserId.trim(), action: 'user-invited', message: `${actorUserId} convidou ${email}`, createdAt: new Date().toISOString() });
  await saveStore(store);
  return res.status(201).json(result);
});

app.patch('/api/condominiums/:id/users/:userId/role', async (req: Request, res: Response) => {
  const condominium = store.condominiums.find((entry) => entry.id === req.params.id);
  if (!condominium) return res.status(404).json({ error: 'Condomínio não encontrado.' });

  const { newRole, actorUserId } = req.body as { newRole?: 'admin' | 'member'; actorUserId?: string };
  if (!newRole || !actorUserId?.trim()) return res.status(400).json({ error: 'Papel e usuário do ator são obrigatórios.' });

  const actor = getUserById(actorUserId.trim(), store.users);
  if (!actor || actor.condominiumId !== condominium.id || actor.role !== 'admin') {
    return res.status(403).json({ error: 'Somente administradores podem alterar papéis.' });
  }

  const targetUserId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const changed = changeUserRole(actorUserId.trim(), targetUserId, newRole, store.users as any, store.history as any);
  if (!changed) return res.status(404).json({ error: 'Usuário alvo não encontrado ou não autorizado.' });

  await saveStore(store);
  return res.json(changed);
});

app.patch('/api/condominiums/:id/pendings/:itemId/status', async (req: Request, res: Response) => {
  const condominiumId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const itemId = Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId;
  const condominium = store.condominiums.find((entry) => entry.id === condominiumId);
  if (!condominium) {
    return res.status(404).json({ error: 'Condomínio não encontrado.' });
  }

  const { status, actorUserId } = req.body as { status?: PendingStatus; actorUserId?: string };
  if (!status || !actorUserId?.trim()) {
    return res.status(400).json({ error: 'Status e usuário são obrigatórios.' });
  }

  // verify actor exists and belongs to condominium
  const actor2 = getUserById(actorUserId.trim(), store.users);
  if (!actor2 || actor2.condominiumId !== condominium.id) {
    return res.status(403).json({ error: 'Usuário não autorizado para esse condomínio.' });
  }

  const updated = updatePendingItemStatus(itemId, status, condominium.id, actorUserId.trim(), store.pendingItems, store.history);
  if (!updated) {
    return res.status(404).json({ error: 'Pendência não encontrada.' });
  }

  await saveStore(store);
  return res.json(updated);
});

app.get('/api/condominiums/:id/history', (req: Request, res: Response) => {
  const condominium = store.condominiums.find((entry) => entry.id === req.params.id);
  if (!condominium) {
    return res.status(404).json({ error: 'Condomínio não encontrado.' });
  }

  const history = store.history.filter((entry) => entry.condominiumId === condominium.id);
  return res.json(history);
});

app.listen(port, () => {
  console.log(`Burgoweb API listening on port ${port}`);
});
