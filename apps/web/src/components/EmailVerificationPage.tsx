import { BurgowebApiClient, type ApiProblem } from '@burgoweb/api-client';
import { Link } from '@tanstack/react-router';
import { FormEvent, useEffect, useRef, useState } from 'react';

type State = 'loading' | 'ready' | 'processing' | 'activated' | 'unavailable' | 'uncertain';
const RECOVERY_KEY = 'burgoweb:verification-recovery';

export function EmailVerificationPage({ apiClient }: { apiClient?: Pick<BurgowebApiClient, 'confirmEmailVerification' | 'resendEmailVerification'> } = {}) {
  const [token, setToken] = useState<string>();
  const [state, setState] = useState<State>('loading');
  const [resendMessage, setResendMessage] = useState('');
  const [requestId, setRequestId] = useState('');
  const [email, setEmail] = useState('');
  const resultRef = useRef<HTMLElement>(null);
  const resendRef = useRef<HTMLParagraphElement>(null);
  const busy = useRef(false);
  const client = () => apiClient ?? new BurgowebApiClient(window.fetch.bind(window));

  useEffect(() => {
    const value = new URLSearchParams(window.location.hash.slice(1)).get('token') ?? undefined;
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
    try { const recovery = JSON.parse(sessionStorage.getItem(RECOVERY_KEY) ?? '{}') as { requestId?: string; email?: string }; setRequestId(recovery.requestId ?? ''); setEmail(recovery.email ?? ''); } catch { sessionStorage.removeItem(RECOVERY_KEY); }
    setToken(value); setState(value ? 'ready' : 'unavailable');
  }, []);
  useEffect(() => { if (['activated', 'unavailable', 'uncertain'].includes(state)) resultRef.current?.focus(); }, [state]);

  async function confirm() {
    if (!token || busy.current) return;
    busy.current = true; setState('processing');
    try { await client().confirmEmailVerification(token); setToken(undefined); setState('activated'); }
    catch (caught) { setToken(undefined); setState((caught as ApiProblem)?.status === 410 ? 'unavailable' : 'uncertain'); }
    finally { busy.current = false; }
  }

  async function resend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy.current) return;
    busy.current = true;
    try { const result = await client().resendEmailVerification(requestId.trim(), email.trim().toLowerCase()); setResendMessage(result.message); }
    catch { setResendMessage('Não foi possível concluir agora. Confira sua conexão e tente novamente.'); }
    finally { busy.current = false; requestAnimationFrame(() => resendRef.current?.focus()); }
  }

  return <main id="conteudo-principal" className="onboarding-shell">
    <Link className="back-link" to="/">← Voltar para a página inicial</Link>
    <section className="onboarding-card" aria-labelledby="verification-title">
      <p className="eyebrow">Verificação de e-mail</p><h1 id="verification-title">Confirme o controle do seu e-mail</h1>
      {state === 'loading' && <p role="status">Preparando a confirmação…</p>}
      {state === 'ready' && <><p>Abrir este link não altera sua Conta. Confirme explicitamente para concluir a ativação.</p><button type="button" onClick={confirm}>Confirmar meu e-mail</button></>}
      {state === 'processing' && <p role="status" aria-live="polite">Confirmando com segurança…</p>}
      {state === 'activated' && <section ref={resultRef} tabIndex={-1} className="orientation" aria-labelledby="activated-title"><h2 id="activated-title">E-mail confirmado</h2><p>Você comprovou o controle deste canal e a gestão inicial foi ativada. O acesso autenticado será o próximo passo.</p><p>Esta verificação não certifica identidade civil, eleição, mandato ou legitimidade jurídica.</p></section>}
      {state === 'unavailable' && <section ref={resultRef} tabIndex={-1} className="error-summary" aria-labelledby="unavailable-title"><h2 id="unavailable-title">Este link não está disponível</h2><p>Use o link mais recente recebido por e-mail. Se você acabou de fazer o cadastro, abra a caixa de entrada informada naquela etapa.</p></section>}
      {state === 'uncertain' && <section ref={resultRef} tabIndex={-1} className="error-summary" aria-labelledby="uncertain-title"><h2 id="uncertain-title">Não foi possível confirmar o resultado</h2><p>Confira sua conexão. Para evitar repetição incerta, solicite um novo e-mail antes de tentar novamente.</p></section>}
      {state !== 'activated' && <form onSubmit={resend} noValidate><h2>Não recebeu a mensagem?</h2><p>Use o código exibido ao final do cadastro. Se você veio diretamente do cadastro, os campos já estarão preenchidos.</p><label htmlFor="requestId">Código da solicitação</label><span id="requestId-help" className="field-help">É o código no formato 00000000-0000-0000-0000-000000000000 mostrado após criar a solicitação. Não é o e-mail nem o nome do condomínio.</span><input id="requestId" name="requestId" required autoComplete="off" aria-describedby="requestId-help" value={requestId} onChange={event => setRequestId(event.target.value)} /><label htmlFor="verificationEmail">E-mail usado no cadastro</label><span id="verificationEmail-help" className="field-help">A nova mensagem só será enviada ao endereço originalmente cadastrado.</span><input id="verificationEmail" name="email" type="email" required autoComplete="email" aria-describedby="verificationEmail-help" value={email} onChange={event => setEmail(event.target.value)} /><button type="submit">Enviar outro e-mail de verificação</button></form>}
      <p ref={resendRef} tabIndex={-1} role="status" aria-live="polite">{resendMessage}</p>
    </section>
  </main>;
}
