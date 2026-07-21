import { useMemo, useState, type FormEvent } from 'react';

const profileOptions = [
  { value: 'only-syndic', label: 'Só síndico' },
  { value: 'only-resident', label: 'Só morador' },
  { value: 'resident-owner', label: 'Morador e proprietário' },
  { value: 'resident-owner-syndic', label: 'Morador, proprietário e síndico' },
];

interface OnboardingResponse {
  success: boolean;
  temporaryPassword: string;
  suggestedName?: string;
  inviteEmailSent: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  profileType: string;
  condominiumId: string;
}

interface CondominiumProfile {
  id: string;
  name: string;
  city?: string;
}

interface PendingItem {
  id: string;
  title: string;
  description?: string;
  condominiumId: string;
  status: 'open' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

interface HistoryEntry {
  id: string;
  condominiumId: string;
  actorUserId: string;
  action: string;
  message: string;
  createdAt: string;
}

function App() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profileType, setProfileType] = useState(profileOptions[0].value);
  const [condominiumName, setCondominiumName] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentCondominium, setCurrentCondominium] = useState<CondominiumProfile | null>(null);
  const [pendingTitle, setPendingTitle] = useState('');
  const [pendingDescription, setPendingDescription] = useState('');
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const apiBaseUrl = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:3001', []);

  const loadCondominiumFeed = async (condominiumId: string) => {
    const [pendingsResponse, historyResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/api/condominiums/${condominiumId}/pendings`),
      fetch(`${apiBaseUrl}/api/condominiums/${condominiumId}/history`),
    ]);

    const pendings = (await pendingsResponse.json()) as PendingItem[];
    const history = (await historyResponse.json()) as HistoryEntry[];
    setPendingItems(pendings);
    setHistoryEntries(history);
  };

  const handleOnboarding = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('idle');
    setMessage(null);

    const response = await fetch(`${apiBaseUrl}/api/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, displayName, profileType, condominiumName, city }),
    });

    const payload = (await response.json()) as OnboardingResponse & { error?: unknown };
    if (!response.ok) {
      setStatus('error');
      setMessage('Não foi possível concluir o cadastro.');
      return;
    }

    setStatus('success');
    setMessage(`Condomínio criado com sucesso. Senha temporária: ${payload.temporaryPassword}`);
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch(`${apiBaseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setLoginMessage('Não foi possível entrar.');
      return;
    }

    setCurrentUser(payload.user);
    setCurrentCondominium(payload.condominium);
    setLoginMessage(`Login realizado com sucesso para ${payload.user.displayName}.`);
    await loadCondominiumFeed(payload.condominium.id);
  };

  const handleCreatePending = async (event: FormEvent) => {
    event.preventDefault();
    if (!currentCondominium || !currentUser) {
      return;
    }

    const response = await fetch(`${apiBaseUrl}/api/condominiums/${currentCondominium.id}/pendings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: pendingTitle, description: pendingDescription, actorUserId: currentUser.id }),
    });

    if (!response.ok) {
      setPendingMessage('Não foi possível criar a pendência.');
      return;
    }

    setPendingTitle('');
    setPendingDescription('');
    setPendingMessage('Pendência criada com sucesso.');
    await loadCondominiumFeed(currentCondominium.id);
  };

  const handleStatusChange = async (itemId: string, status: PendingItem['status']) => {
    if (!currentCondominium || !currentUser) {
      return;
    }

    const response = await fetch(`${apiBaseUrl}/api/condominiums/${currentCondominium.id}/pendings/${itemId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, actorUserId: currentUser.id }),
    });

    if (!response.ok) {
      setPendingMessage('Não foi possível atualizar a pendência.');
      return;
    }

    setPendingMessage('Status atualizado.');
    await loadCondominiumFeed(currentCondominium.id);
  };

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">MVP inicial</p>
        <h1>Burgoweb</h1>
        <p>Crie a conta administrativa do condomínio e comece a organizar a rotina com transparência.</p>
      </section>

      <section className="card-grid">
        <form className="panel" onSubmit={handleOnboarding}>
          <h2>Cadastro do condomínio</h2>
          <label>
            E-mail pessoal
            <input value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Nome completo
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required />
          </label>
          <label>
            Papel no condomínio
            <select value={profileType} onChange={(event) => setProfileType(event.target.value)}>
              {profileOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Nome do condomínio
            <input value={condominiumName} onChange={(event) => setCondominiumName(event.target.value)} required />
          </label>
          <label>
            Cidade (opcional)
            <input value={city} onChange={(event) => setCity(event.target.value)} />
          </label>
          <button type="submit">Criar conta</button>
          {message ? <p className={`notice ${status}`}>{message}</p> : null}
        </form>

        <form className="panel" onSubmit={handleLogin}>
          <h2>Entrar</h2>
          <label>
            E-mail
            <input value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} required />
          </label>
          <label>
            Senha
            <input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required />
          </label>
          <button type="submit">Entrar</button>
          {loginMessage ? <p className="notice success">{loginMessage}</p> : null}
        </form>
      </section>

      {currentCondominium ? (
        <section className="panel workflow-panel">
          <div className="workflow-heading">
            <h2>Pendências e histórico</h2>
            <p>Condomínio {currentCondominium.name}</p>
          </div>

          <form className="workflow-form" onSubmit={handleCreatePending}>
            <label>
              Título
              <input value={pendingTitle} onChange={(event) => setPendingTitle(event.target.value)} required />
            </label>
            <label>
              Descrição
              <textarea value={pendingDescription} onChange={(event) => setPendingDescription(event.target.value)} />
            </label>
            <button type="submit">Adicionar pendência</button>
            {pendingMessage ? <p className="notice success">{pendingMessage}</p> : null}
          </form>

          <div className="workflow-columns">
            <div>
              <h3>Pendências abertas</h3>
              <ul className="item-list">
                {pendingItems.map((item) => (
                  <li key={item.id} className="item-card">
                    <div>
                      <strong>{item.title}</strong>
                      {item.description ? <p>{item.description}</p> : null}
                    </div>
                    <div className="item-actions">
                      <select value={item.status} onChange={(event) => handleStatusChange(item.id, event.target.value as PendingItem['status'])}>
                        <option value="open">Aberta</option>
                        <option value="in-progress">Em andamento</option>
                        <option value="done">Concluída</option>
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Histórico</h3>
              <ul className="item-list">
                {historyEntries.map((entry) => (
                  <li key={entry.id} className="history-card">
                    <p>{entry.message}</p>
                    <span>{new Date(entry.createdAt).toLocaleString('pt-BR')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default App;
