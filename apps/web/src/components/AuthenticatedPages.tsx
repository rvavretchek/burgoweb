import { Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BurgowebApiClient,
  type ApiProblem,
  type DashboardResponse,
  type TenantSummary,
} from "@burgoweb/api-client";

const api = new BurgowebApiClient();
const CSRF_KEY = "burgoweb.csrf";
function message(error: unknown) {
  const problem = error as Partial<ApiProblem>;
  return problem.status === 401
    ? "Não foi possível entrar. Confira os dados e tente novamente."
    : (problem.detail ?? "Não foi possível concluir. Tente novamente.");
}
export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [show, setShow] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => setHydrated(true), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !hydrated) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await api.login(
        String(form.get("email")),
        String(form.get("password")),
      );
      sessionStorage.setItem(CSRF_KEY, result.csrfToken);
      await navigate({ to: "/condominios" });
    } catch (reason) {
      setError(message(reason));
      queueMicrotask(() => heading.current?.focus());
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="conteudo-principal" className="onboarding-shell">
      <Link className="back-link" to="/">
        Voltar ao início
      </Link>
      <section className="onboarding-card">
        <p className="eyebrow">Acesso seguro</p>
        <h1 ref={heading} tabIndex={-1}>
          Entre no Burgoweb
        </h1>
        <p>
          Use o e-mail verificado da sua Conta. A mensagem de erro não revela se
          uma Conta existe.
        </p>
        {error && (
          <div className="error-summary" role="alert">
            <h2>Não foi possível entrar</h2>
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={submit} aria-busy={busy}>
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
          <label htmlFor="login-password">Senha</label>
          <div className="password-row">
            <input
              id="login-password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="secondary-action"
              aria-pressed={show}
              onClick={() => setShow((value) => !value)}
            >
              {show ? "Ocultar" : "Mostrar"} senha
            </button>
          </div>
          <button type="submit" disabled={busy || !hydrated}>
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

async function csrfToken() {
  const current = sessionStorage.getItem(CSRF_KEY);
  if (current) return current;
  const session = await api.getSession();
  sessionStorage.setItem(CSRF_KEY, session.csrfToken);
  return session.csrfToken;
}
function LogoutButton() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api.logout(await csrfToken());
      sessionStorage.removeItem(CSRF_KEY);
      await navigate({ to: "/entrar", replace: true });
    } catch {
      setError(
        "Não foi possível encerrar a sessão. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <button
        type="button"
        className="secondary-action"
        disabled={busy}
        onClick={logout}
      >
        {busy ? "Saindo…" : "Sair"}
      </button>
    </div>
  );
}
export function TenantSelectionPage() {
  const [items, setItems] = useState<TenantSummary[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error" | "expired">(
    "loading",
  );
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    let active = true;
    api
      .listAuthorizedTenants()
      .then((value) => {
        if (active) {
          setItems(value);
          setState("ready");
        }
      })
      .catch((reason: ApiProblem) => {
        if (active) {
          if (reason.status === 401) {
            sessionStorage.removeItem(CSRF_KEY);
            setItems([]);
            setState("expired");
          } else setState("error");
        }
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (state !== "loading") heading.current?.focus();
  }, [state]);
  return (
    <main id="conteudo-principal" className="onboarding-shell">
      <div className="authenticated-bar">
        <strong>Burgoweb</strong>
        <LogoutButton />
      </div>
      <section className="onboarding-card">
        <h1 ref={heading} tabIndex={-1}>
          {state === "expired" ? "Sessão expirada" : "Selecione o Condomínio"}
        </h1>
        {state === "loading" && (
          <p role="status">Carregando seus Condomínios…</p>
        )}
        {state === "error" && (
          <div className="error-summary" role="alert">
            <h2>Não foi possível carregar</h2>
            <p>Tente novamente mais tarde.</p>
          </div>
        )}
        {state === "expired" && (
          <div className="error-summary" role="alert">
            <p>Entre novamente para continuar.</p>
            <Link to="/entrar">Ir para a entrada</Link>
          </div>
        )}
        {state === "ready" && items.length === 0 && (
          <p>Não há Condomínio autorizado para esta Conta.</p>
        )}
        <ul className="tenant-list">
          {state === "ready" &&
            items.map((item) => (
              <li key={item.publicId}>
                <Link
                  className="tenant-link"
                  to="/condominios/$publicId"
                  params={{ publicId: item.publicId }}
                >
                  {item.displayName}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
export function DashboardPage({ publicId }: { publicId: string }) {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardResponse>();
  const [accessNotice, setAccessNotice] = useState<string | null>(null);
  const [state, setState] = useState<
    "loading" | "ready" | "denied" | "expired"
  >("loading");
  const heading = useRef<HTMLHeadingElement>(null);
  const current = data?.condominium.publicId === publicId ? data : undefined;
  useEffect(() => {
    const value = sessionStorage.getItem("burgoweb.access-lost");
    sessionStorage.removeItem("burgoweb.access-lost");
    setAccessNotice(value);
  }, []);
  useLayoutEffect(() => {
    document.title = "Burgoweb — Carregando Condomínio";
  }, [publicId]);
  useEffect(() => {
    const controller = new AbortController();
    setData(undefined);
    setState("loading");
    api
      .getTenantDashboard(publicId, controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) {
          setData(value);
          setState("ready");
          document.title = `${value.condominium.displayName} — Burgoweb`;
        }
      })
      .catch((reason: ApiProblem) => {
        if (!controller.signal.aborted) {
          setData(undefined);
          if (reason.status === 401) {
            sessionStorage.removeItem(CSRF_KEY);
            setState("expired");
            document.title = "Sessão expirada — Burgoweb";
          } else {
            setState("denied");
            document.title = "Acesso indisponível — Burgoweb";
          }
        }
      });
    return () => controller.abort();
  }, [publicId]);
  useEffect(() => {
    if (state !== "loading") heading.current?.focus();
  }, [state]);
  return (
    <main id="conteudo-principal" className="onboarding-shell">
      <div className="authenticated-bar">
        <button
          type="button"
          className="secondary-action"
          onClick={() => void navigate({ to: "/condominios" })}
        >
          Trocar Condomínio
        </button>
        <LogoutButton />
      </div>
      <section className="onboarding-card">
        {accessNotice && <p role="alert">{accessNotice}</p>}
        {(state === "loading" || (state === "ready" && !current)) && (
          <h1 ref={heading} tabIndex={-1}>
            Carregando o Condomínio…
          </h1>
        )}
        {state === "expired" && (
          <>
            <h1 ref={heading} tabIndex={-1}>
              Sessão expirada
            </h1>
            <p>Entre novamente para continuar.</p>
            <Link to="/entrar">Ir para a entrada</Link>
          </>
        )}
        {state === "denied" && (
          <>
            <h1 ref={heading} tabIndex={-1}>
              Acesso indisponível
            </h1>
            <p>Este Condomínio não está disponível para sua Conta.</p>
          </>
        )}
        {state === "ready" && current && (
          <>
            <p className="eyebrow">Condomínio ativo</p>
            <h1 ref={heading} tabIndex={-1}>
              {current.condominium.displayName}
            </h1>
            <div className="orientation">
              <strong>Comece pelo essencial</strong>
              <span>
                Seu Condomínio está ativo. As próximas ações aparecerão conforme
                suas permissões e os dados cadastrados.
              </span>
            </div>
            <p>Nenhum dado operacional foi cadastrado ainda.</p>
            {current.actions.includes("people-units-relationships.manage") && (
              <a
                className="primary-action"
                href={`/condominios/${encodeURIComponent(publicId)}/pessoas`}
              >
                Gerenciar Pessoas e acesso
              </a>
            )}
          </>
        )}
      </section>
    </main>
  );
}
