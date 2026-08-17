import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { BurgowebApiClient, type AccountSession, type ApiProblem } from '@burgoweb/api-client';

const api = new BurgowebApiClient();
const CSRF_KEY = 'burgoweb.csrf';
type Confirmation = { kind: 'session'; item: AccountSession } | { kind: 'others' };

export function AccountSessionsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<AccountSession[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<Confirmation>();
  const [busy, setBusy] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);

  async function csrf(forceRefresh = false) {
    if (!forceRefresh) {
      const saved = sessionStorage.getItem(CSRF_KEY);
      if (saved) return saved;
    }
    const session = await api.getSession();
    sessionStorage.setItem(CSRF_KEY, session.csrfToken);
    return session.csrfToken;
  }

  async function withCurrentCsrf<T>(mutation: (token: string) => Promise<T>): Promise<T> {
    try {
      return await mutation(await csrf());
    } catch (reason) {
      if ((reason as ApiProblem).status !== 403) throw reason;
      sessionStorage.removeItem(CSRF_KEY);
      return mutation(await csrf(true));
    }
  }

  async function load() {
    setState('loading');
    try {
      setItems(await api.listAccountSessions());
      setState('ready');
    } catch (reason) {
      if ((reason as ApiProblem).status === 401) {
        sessionStorage.removeItem(CSRF_KEY);
        await navigate({ to: '/entrar', replace: true });
        return;
      }
      setState('error');
    }
    queueMicrotask(() => heading.current?.focus());
  }

  useEffect(() => { void load(); }, []);

  async function confirmRevocation() {
    if (!confirmation || busy) return;
    setBusy(true);
    setMessage('');
    setError('');
    try {
      if (confirmation.kind === 'session') {
        const item = confirmation.item;
        await withCurrentCsrf(token => api.revokeAccountSession(item.publicId, token));
        if (item.current) {
          sessionStorage.removeItem(CSRF_KEY);
          await navigate({ to: '/entrar', replace: true });
          return;
        }
        setMessage('Sessão encerrada.');
      } else {
        const result = await withCurrentCsrf(token => api.revokeOtherAccountSessions(token));
        setMessage(`${result.revokedCount} sessão(ões) encerrada(s).`);
      }
      setConfirmation(undefined);
      await load();
    } catch (reason) {
      if ((reason as ApiProblem).status === 401) {
        sessionStorage.removeItem(CSRF_KEY);
        await navigate({ to: '/entrar', replace: true });
        return;
      }
      setError('Não foi possível confirmar a revogação. A sessão não foi apresentada como encerrada.');
      queueMicrotask(() => errorSummary.current?.focus());
    } finally {
      setBusy(false);
    }
  }

  return <main id="conteudo-principal" className="onboarding-shell">
    <div className="authenticated-bar"><Link to="/condominios">Condomínio ativo e seleção</Link></div>
    <section className="onboarding-card">
      <p className="eyebrow">Conta e sessões</p>
      <h1 ref={heading} tabIndex={-1}>Controle suas sessões</h1>
      <p>A última atividade é aproximada. Endereço e dados técnicos completos não são exibidos.</p>
      {message && <p role="status">{message}</p>}
      {state === 'loading' && <p role="status">Carregando sessões…</p>}
      {state === 'error' && <div className="error-summary" role="alert"><h2>Não foi possível carregar</h2><button type="button" onClick={() => void load()}>Tentar novamente</button></div>}
      {state === 'ready' && <>
        <button type="button" className="secondary-action" onClick={() => setConfirmation({ kind: 'others' })}>Encerrar todas as demais sessões</button>
        {items.length === 0
          ? <p className="orientation">Nenhuma sessão foi encontrada. Atualize a página ou entre novamente se esperava ver a sessão atual.</p>
          : <ul className="tenant-list">{items.map(item => <li key={item.publicId}>
              <strong>{item.current ? 'Esta sessão' : 'Outra sessão'}</strong>
              <span>Criada em {new Date(item.createdAt).toLocaleString('pt-BR')} · última atividade {new Date(item.lastActivityAt).toLocaleString('pt-BR')} · {item.state}</span>
              <button type="button" className="secondary-action" onClick={() => setConfirmation({ kind: 'session', item })}>Encerrar {item.current ? 'esta sessão' : 'sessão'}</button>
            </li>)}</ul>}
      </>}
      {confirmation && <div className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="revocation-title" aria-describedby="revocation-detail">
        <h2 id="revocation-title">Confirmar encerramento</h2>
        <p id="revocation-detail">{confirmation.kind === 'others'
          ? 'Todas as demais sessões serão encerradas; esta sessão atual será mantida.'
          : confirmation.item.current
            ? 'Esta sessão será encerrada agora e você precisará entrar novamente.'
            : 'A sessão selecionada será encerrada e seus tokens deixarão de autorizar acesso.'}</p>
        {error && <div ref={errorSummary} tabIndex={-1} className="error-summary" role="alert"><h3>Não foi possível encerrar</h3><p>{error}</p></div>}
        <div className="form-actions">
          <button type="button" disabled={busy} onClick={() => void confirmRevocation()}>{busy ? 'Encerrando…' : 'Confirmar encerramento'}</button>
          <button type="button" className="secondary-action" disabled={busy} onClick={() => { setConfirmation(undefined); setError(''); }}>Cancelar</button>
        </div>
      </div>}
    </section>
  </main>;
}
