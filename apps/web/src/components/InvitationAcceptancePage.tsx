import { FormEvent,useEffect,useRef,useState } from 'react';
import { Link } from '@tanstack/react-router';
import { BurgowebApiClient,type ApiProblem } from '@burgoweb/api-client';

type AcceptanceState='ready'|'processing'|'accepted-new'|'accepted-existing'|'retry'|'unavailable';

export function InvitationAcceptancePage(){
  const[token,setToken]=useState(''),[password,setPassword]=useState(''),[state,setState]=useState<AcceptanceState>('ready'),[tenant,setTenant]=useState(''),[retryMessage,setRetryMessage]=useState('');
  const heading=useRef<HTMLElement>(null);
  useEffect(()=>{const value=new URLSearchParams(location.hash.slice(1)).get('token')??'';history.replaceState(history.state,'',location.pathname+location.search);setToken(value);if(!value)setState('unavailable');},[]);
  useEffect(()=>{if(['accepted-new','accepted-existing','retry','unavailable'].includes(state))heading.current?.focus();},[state]);
  async function submit(event:FormEvent){
    event.preventDefault();if(!token)return;setState('processing');
    try{const newAccount=Boolean(password);const result=await new BurgowebApiClient().acceptInvitation(token,password||undefined);setToken('');setTenant(result.tenantPublicId);setState(newAccount?'accepted-new':'accepted-existing');}
    catch(reason){const problem=reason as Partial<ApiProblem>;if(problem.status===410){setToken('');setState('unavailable');return;}setRetryMessage(!navigator.onLine?'Você está offline. Reconecte-se e tente novamente.':'Não foi possível concluir agora. Seu convite foi preservado; tente novamente.');setState('retry');}
  }
  return <main id="conteudo-principal" className="onboarding-shell"><Link className="back-link" to="/">← Página inicial</Link><section className="onboarding-card"><p className="eyebrow">Convite de acesso</p><h1>Aceitar convite</h1>
    {(state==='ready'||state==='retry')&&<>{state==='retry'&&<section ref={heading} tabIndex={-1} className="error-summary" role="alert"><h2>Não foi possível ativar o acesso</h2><p>{retryMessage}</p></section>}<form onSubmit={submit}><p>Confirme para ativar o acesso. Se você ainda não possui uma Conta, defina uma senha com pelo menos 12 caracteres.</p><label htmlFor="invitation-password">Nova senha (somente para nova Conta)</label><input id="invitation-password" type="password" autoComplete="new-password" minLength={12} value={password} onChange={event=>setPassword(event.target.value)}/><button type="submit">{state==='retry'?'Tentar novamente':'Aceitar e ativar acesso'}</button></form></>}
    {state==='processing'&&<p role="status">Ativando acesso com segurança…</p>}
    {state==='accepted-new'&&<section ref={heading} tabIndex={-1} className="orientation"><h2>Conta e acesso ativados</h2><p>O convite foi consumido e não poderá ser reutilizado. Entre com seu e-mail e a senha que acabou de definir.</p><Link to="/entrar">Ir para entrar</Link></section>}
    {state==='accepted-existing'&&<section ref={heading} tabIndex={-1} className="orientation"><h2>Acesso ativado</h2><p>O convite foi consumido e não poderá ser reutilizado.</p><a href={`/condominios/${encodeURIComponent(tenant)}`}>Ir para o Condomínio</a></section>}
    {state==='unavailable'&&<section ref={heading} tabIndex={-1} className="error-summary"><h2>Convite indisponível</h2><p>Este convite não pode ser usado. Solicite um novo ao responsável.</p><p>Se você estiver usando outra Conta, entre com a Conta correta e abra novamente o link recebido.</p><Link to="/entrar">Entrar com outra Conta</Link></section>}
  </section></main>;
}
