import { BurgowebApiClient, type ApiProblem, type CreateCondominiumInput } from '@burgoweb/api-client';
import { Link } from '@tanstack/react-router';
import { FormEvent, useRef, useState } from 'react';

type UiErrorKind = 'validation' | 'offline' | 'conflict' | 'unavailable' | 'failed';
type State =
  | { kind: 'form' }
  | { kind: 'submitting' }
  | { kind: 'pending'; message: string; requestId: string; email: string; resumed: boolean }
  | { kind: 'error'; errorKind: UiErrorKind; problem: ApiProblem; fields?: Record<string, string[]> };

const KEY = 'burgoweb:onboarding-key';
const RECOVERY_KEY = 'burgoweb:verification-recovery';

function validationErrors(input: CreateCondominiumInput): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!input.fullName.trim()) errors.fullName = ['Informe seu nome completo.'];
  if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) errors.email = ['Informe um e-mail válido.'];
  if (!input.condominiumName.trim()) errors.condominiumName = ['Informe o nome do condomínio.'];
    if (input.password.length < 12) errors.password = ['Use pelo menos 12 caracteres.'];
  if (!input.authorityDeclarationAccepted) errors.authorityDeclarationAccepted = ['Confirme a declaração obrigatória.'];
  return errors;
}

function classify(problem: ApiProblem): UiErrorKind {
  if (problem.status === 409) return 'conflict';
  if (problem.status === 410) return 'failed';
  if (problem.status === 422) return 'validation';
  return 'unavailable';
}

function normalizeProblem(caught: unknown): ApiProblem {
  if (caught && typeof caught === 'object' && typeof (caught as ApiProblem).status === 'number' && typeof (caught as ApiProblem).title === 'string') return caught as ApiProblem;
  return { type: 'network-uncertain', title: 'Não foi possível confirmar a solicitação', status: 503, detail: 'A conexão foi interrompida. Seus dados foram preservados; tente novamente com a mesma solicitação.' };
}

export function OnboardingStartPage({ apiClient }: { apiClient?: Pick<BurgowebApiClient, 'createCondominium'> } = {}) {
  const [state, setState] = useState<State>({ kind: 'form' });
  const [showPassword, setShowPassword] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submittingRef = useRef(false);

  function focusError() { requestAnimationFrame(() => errorRef.current?.focus()); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    const form = new FormData(event.currentTarget);
    const input: CreateCondominiumInput = { fullName: String(form.get('fullName')), email: String(form.get('email')), condominiumName: String(form.get('condominiumName')), password: String(form.get('password')), authorityDeclarationAccepted: form.get('authorityDeclarationAccepted') === 'on' };
    const fields = validationErrors(input);
    if (String(form.get('confirmPassword')) !== input.password) fields.confirmPassword = ['As senhas precisam ser iguais.'];
    if (Object.keys(fields).length) {
      setState({ kind: 'error', errorKind: 'validation', fields, problem: { type: 'validation', title: 'Revise os campos indicados', status: 422, detail: 'Há informações obrigatórias que precisam de atenção.' } }); focusError(); return;
    }
    if (!navigator.onLine) {
      setState({ kind: 'error', errorKind: 'offline', problem: { type: 'offline', title: 'Você está sem conexão', status: 0, detail: 'Seus dados foram preservados. Reconecte-se e tente novamente com a mesma solicitação.' } }); focusError(); return;
    }
    const existingKey = sessionStorage.getItem(KEY);
    const key = existingKey ?? crypto.randomUUID();
    sessionStorage.setItem(KEY, key);
    submittingRef.current = true; setState({ kind: 'submitting' });
    try {
      const browserClient = apiClient ?? new BurgowebApiClient(window.fetch.bind(window));
      const result = await browserClient.createCondominium(input, key);
      sessionStorage.removeItem(KEY);
      sessionStorage.setItem(RECOVERY_KEY, JSON.stringify({ requestId: result.requestId, email: input.email.trim().toLowerCase() }));
      setState({ kind: 'pending', message: result.message, requestId: result.requestId, email: input.email.trim().toLowerCase(), resumed: Boolean(existingKey) });
    } catch (caught) {
      const problem = normalizeProblem(caught);
      setState({ kind: 'error', errorKind: classify(problem), problem, fields: problem.errors }); focusError();
    } finally { submittingRef.current = false; }
  }

  function retry() { formRef.current?.requestSubmit(); }
  function restart() { sessionStorage.removeItem(KEY); setState({ kind: 'form' }); }

  if (state.kind === 'pending') return <main id="conteudo-principal" className="onboarding-shell"><section className="state-panel" aria-labelledby="estado-titulo"><h1 id="estado-titulo">{state.resumed ? 'Solicitação retomada e pendente' : 'Solicitação pendente'}</h1><p>{state.message}</p><p>Enviamos a verificação para <strong>{state.email}</strong>. Abra a mensagem e use o botão recebido por e-mail.</p><p>O acesso interno continuará bloqueado até a verificação.</p><p className="request-id"><strong>Código da solicitação:</strong> {state.requestId}</p><p className="field-help">Guarde este código somente para solicitar outro e-mail, se necessário.</p><Link to="/">Voltar à página inicial</Link></section></main>;

  const fields = state.kind === 'error' ? state.fields ?? {} : {};
  const describedBy = (field: string, help: string) => `${help}${fields[field] ? ` ${field}-error` : ''}`;
  return <main id="conteudo-principal" className="onboarding-shell">
    <Link className="back-link" to="/">← Voltar para a página inicial</Link>
    <section className="onboarding-card" aria-labelledby="comecar-titulo">
      <p className="eyebrow">Começar no Burgoweb</p><h1 id="comecar-titulo">Crie sua Conta e seu Condomínio</h1>
      <p>Informe apenas os dados necessários. Seu condomínio ficará pendente até você verificar o controle do e-mail.</p>
      <div className="orientation" role="note"><strong>Nada foi criado ainda.</strong><span>Chegar a esta página não cria Conta, Condomínio ou autoridade. O envio do formulário é que inicia a solicitação.</span></div>
      {state.kind === 'error' && <div className="error-summary" role="alert" tabIndex={-1} ref={errorRef}><h2>{state.problem.title}</h2><p>{state.problem.detail}</p>{state.problem.requestId && <p>Referência: {state.problem.requestId}</p>}{state.errorKind !== 'validation' && state.errorKind !== 'conflict' && state.errorKind !== 'failed' && <button type="button" onClick={retry}>Tentar novamente com a mesma solicitação</button>}{(state.errorKind === 'conflict' || state.errorKind === 'failed') && <button type="button" onClick={restart}>Iniciar uma nova tentativa</button>}</div>}
      <form ref={formRef} onSubmit={submit} noValidate aria-busy={state.kind === 'submitting'}>
        <label htmlFor="fullName">Nome completo</label><span id="fullName-help" className="field-help">Da pessoa responsável pela solicitação.</span><input id="fullName" name="fullName" autoComplete="name" aria-describedby={describedBy('fullName', 'fullName-help')} aria-invalid={Boolean(fields.fullName)} />{fields.fullName && <span id="fullName-error" className="field-error">{fields.fullName[0]}</span>}
        <label htmlFor="email">E-mail</label><span id="email-help" className="field-help">Será verificado antes de qualquer ativação.</span><input id="email" name="email" type="email" autoComplete="email" aria-describedby={describedBy('email', 'email-help')} aria-invalid={Boolean(fields.email)} />{fields.email && <span id="email-error" className="field-error">{fields.email[0]}</span>}
        <label htmlFor="condominiumName">Nome do condomínio</label><span id="condominiumName-help" className="field-help">O nome é apenas de exibição e pode se repetir.</span><input id="condominiumName" name="condominiumName" aria-describedby={describedBy('condominiumName', 'condominiumName-help')} aria-invalid={Boolean(fields.condominiumName)} />{fields.condominiumName && <span id="condominiumName-error" className="field-error">{fields.condominiumName[0]}</span>}
        <label htmlFor="password">Senha</label><span id="password-help" className="field-help">Use pelo menos 12 caracteres. Você pode colar ou usar um gerenciador.</span><div className="password-row"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" aria-describedby={describedBy('password', 'password-help')} aria-invalid={Boolean(fields.password)} /><button type="button" className="secondary-action" aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Ocultar' : 'Mostrar'} senha</button></div>{fields.password && <span id="password-error" className="field-error">{fields.password[0]}</span>}
        <label htmlFor="confirmPassword">Confirme a senha</label><span id="confirmPassword-help" className="field-help">Digite novamente para evitar erro de digitação.</span><input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" aria-describedby={describedBy('confirmPassword', 'confirmPassword-help')} aria-invalid={Boolean(fields.confirmPassword)} />{fields.confirmPassword && <span id="confirmPassword-error" className="field-error">{fields.confirmPassword[0]}</span>}
        <div className="declaration"><input id="authorityDeclarationAccepted" name="authorityDeclarationAccepted" type="checkbox" aria-describedby={describedBy('authorityDeclarationAccepted', 'declaration-help')} aria-invalid={Boolean(fields.authorityDeclarationAccepted)} /><label htmlFor="authorityDeclarationAccepted">Declaro que possuo autoridade para iniciar esta organização.</label><p id="declaration-help">Esta declaração não certifica identidade civil, mandato, eleição ou legitimidade jurídica.</p>{fields.authorityDeclarationAccepted && <span id="authorityDeclarationAccepted-error" className="field-error">{fields.authorityDeclarationAccepted[0]}</span>}</div>
        <button type="submit" disabled={state.kind === 'submitting'}>{state.kind === 'submitting' ? 'Registrando…' : 'Criar solicitação pendente'}</button>
      </form>
    </section>
  </main>;
}
