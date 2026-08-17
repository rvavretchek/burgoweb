import { FormEvent, useEffect, useRef, useState } from "react";
import {
  BurgowebApiClient,
  type ApiProblem,
  type Page,
  type Person,
  type Relationship,
  type Unit,
} from "@burgoweb/api-client";
import { CapabilitiesPanel } from "./CapabilitiesPanel";
import { FinancialResponsiblesPanel } from "./FinancialResponsiblesPanel";
import { InvitationsPanel } from "./InvitationsPanel";
import { RolesPanel } from "./RolesPanel";

const api = new BurgowebApiClient();
const CSRF_KEY = "burgoweb.csrf";
const idempotencyKey = () => crypto.randomUUID();

async function csrf(force = false) {
  if (force) sessionStorage.removeItem(CSRF_KEY);
  const saved = sessionStorage.getItem(CSRF_KEY);
  if (saved) return saved;
  const session = await api.getSession();
  sessionStorage.setItem(CSRF_KEY, session.csrfToken);
  return session.csrfToken;
}

async function mutate<T>(work: (token: string) => Promise<T>): Promise<T> {
  try {
    return await work(await csrf());
  } catch (reason) {
    if ((reason as ApiProblem).status !== 403) throw reason;
    return work(await csrf(true));
  }
}

function problemMessage(problem: ApiProblem) {
  return problem.status === 409
    ? "Não foi possível salvar porque o registro mudou. Compare os dados atuais antes de tentar novamente."
    : problem.detail || "Não foi possível salvar. A entrada foi preservada.";
}

type ConflictProps<T> = {
  current?: T;
  onReload: () => Promise<void>;
  onReapply: (current: T) => void;
};
function ConflictResolver<T extends { version: number }>({
  current,
  onReload,
  onReapply,
}: ConflictProps<T>) {
  if (!current) return null;
  return (
    <section className="conflict-resolver" role="alert">
      <h4>O registro foi alterado</h4>
      <p>
        A versão atual é {current.version}. Compare seus campos preservados com
        os dados atuais antes de escolher.
      </p>
      <dl>
        {Object.entries(current)
          .filter(([key]) => !["publicId", "version"].includes(key))
          .map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value == null ? "Não informado" : String(value)}</dd>
            </div>
          ))}
      </dl>
      <div className="form-actions">
        <button
          type="button"
          className="secondary-action"
          onClick={() => {
            onReapply(current);
            void onReload();
          }}
        >
          Recarregar dados atuais
        </button>
        <button type="button" onClick={() => onReapply(current)}>
          Reaplicar minha alteração
        </button>
      </div>
    </section>
  );
}

function EditPerson({
  tenant,
  record,
  onSaved,
}: {
  tenant: string;
  record: Person;
  onSaved: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [conflict, setConflict] = useState<Person>(),
    [expectedVersion, setExpectedVersion] = useState(record.version);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setConflict(undefined);
    try {
      await mutate((token) =>
        api.updatePerson(
          tenant,
          record.publicId,
          {
            fullName: String(data.get("fullName")),
            email: String(data.get("email")) || undefined,
            expectedVersion,
            reason: String(data.get("reason")) || undefined,
          },
          token,
        ),
      );
      setOpen(false);
      await onSaved();
    } catch (reason) {
      const problem = reason as ApiProblem;
      setError(problemMessage(problem));
      if (problem.status === 409)
        setConflict(problem.current as Person | undefined);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <button
        type="button"
        className="secondary-action"
        onClick={() => setOpen((value) => !value)}
      >
        Editar Pessoa
      </button>
      {open && (
        <form
          className="inline-editor"
          onSubmit={(event) => void submit(event)}
        >
          <label>
            Nome completo (obrigatório)
            <input
              name="fullName"
              defaultValue={record.fullName}
              required
              maxLength={160}
            />
          </label>
          <label>
            E-mail (opcional)
            <input name="email" type="email" defaultValue={record.email} />
          </label>
          <label>
            Motivo (opcional)
            <input name="reason" />
          </label>
          {error && <p role="alert">{error}</p>}
          <ConflictResolver
            current={conflict}
            onReload={async () => {
              await onSaved();
              setOpen(false);
            }}
            onReapply={(current) => {
              setExpectedVersion(current.version);
              setConflict(undefined);
            }}
          />
          <div className="form-actions">
            <button
              type="button"
              className="secondary-action"
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" disabled={busy}>
              {busy ? "Salvando…" : "Salvar Pessoa"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function EditUnit({
  tenant,
  record,
  onSaved,
}: {
  tenant: string;
  record: Unit;
  onSaved: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [conflict, setConflict] = useState<Unit>(),
    [expectedVersion, setExpectedVersion] = useState(record.version);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setConflict(undefined);
    try {
      await mutate((token) =>
        api.updateUnit(
          tenant,
          record.publicId,
          {
            identifier: String(data.get("identifier")),
            expectedVersion,
            reason: String(data.get("reason")) || undefined,
          },
          token,
        ),
      );
      setOpen(false);
      await onSaved();
    } catch (reason) {
      const problem = reason as ApiProblem;
      setError(problemMessage(problem));
      if (problem.status === 409)
        setConflict(problem.current as Unit | undefined);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <button
        type="button"
        className="secondary-action"
        onClick={() => setOpen((value) => !value)}
      >
        Editar Unidade
      </button>
      {open && (
        <form
          className="inline-editor"
          onSubmit={(event) => void submit(event)}
        >
          <label>
            Identificação (obrigatória)
            <input
              name="identifier"
              defaultValue={record.identifier}
              required
              maxLength={160}
            />
          </label>
          <label>
            Motivo (opcional)
            <input name="reason" />
          </label>
          {error && <p role="alert">{error}</p>}
          <ConflictResolver
            current={conflict}
            onReload={async () => {
              await onSaved();
              setOpen(false);
            }}
            onReapply={(current) => {
              setExpectedVersion(current.version);
              setConflict(undefined);
            }}
          />
          <div className="form-actions">
            <button
              type="button"
              className="secondary-action"
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" disabled={busy}>
              {busy ? "Salvando…" : "Salvar Unidade"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function EditRelationship({
  tenant,
  record,
  onSaved,
}: {
  tenant: string;
  record: Relationship;
  onSaved: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [conflict, setConflict] = useState<Relationship>(),
    [expectedVersion, setExpectedVersion] = useState(record.version);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setConflict(undefined);
    try {
      await mutate((token) =>
        api.updateRelationship(
          tenant,
          record.publicId,
          {
            relationKind: String(data.get("relationKind")),
            startsOn: String(data.get("startsOn")),
            endsOn: String(data.get("endsOn")) || undefined,
            expectedVersion,
            reason: String(data.get("reason")) || undefined,
          },
          token,
        ),
      );
      setOpen(false);
      await onSaved();
    } catch (reason) {
      const problem = reason as ApiProblem;
      setError(problemMessage(problem));
      if (problem.status === 409)
        setConflict(problem.current as Relationship | undefined);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <button
        type="button"
        className="secondary-action"
        disabled={record.state === "ended"}
        onClick={() => setOpen((value) => !value)}
      >
        Editar Vínculo
      </button>
      {open && (
        <form
          className="inline-editor"
          onSubmit={(event) => void submit(event)}
        >
          <label>
            Natureza declarada (obrigatória)
            <input
              name="relationKind"
              defaultValue={record.relationKind}
              required
              maxLength={80}
            />
          </label>
          <label>
            Início (obrigatório)
            <input
              name="startsOn"
              type="date"
              defaultValue={record.startsOn}
              required
            />
          </label>
          <label>
            Fim exclusivo (opcional)
            <input name="endsOn" type="date" defaultValue={record.endsOn} />
          </label>
          <label>
            Motivo (opcional)
            <input name="reason" />
          </label>
          {error && <p role="alert">{error}</p>}
          <ConflictResolver
            current={conflict}
            onReload={async () => {
              await onSaved();
              setOpen(false);
            }}
            onReapply={(current) => {
              setExpectedVersion(current.version);
              setConflict(undefined);
            }}
          />
          <div className="form-actions">
            <button
              type="button"
              className="secondary-action"
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" disabled={busy}>
              {busy ? "Salvando…" : "Salvar Vínculo"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function EndRelationshipAction({
  tenant,
  condominiumName,
  record,
  personName,
  unitName,
  onEnded,
}: {
  tenant: string;
  condominiumName: string;
  record: Relationship;
  personName: string;
  unitName: string;
  onEnded: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [conflict, setConflict] = useState<Relationship>(),
    [expectedVersion, setExpectedVersion] = useState(record.version);
  const errorRef = useRef<HTMLParagraphElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const node = document.querySelector<HTMLElement>(
      `[aria-labelledby="end-${record.publicId}"]`,
    );
    node?.querySelector<HTMLElement>("button.secondary-action")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        setOpen(false);
        queueMicrotask(() => trigger.current?.focus());
        return;
      }
      if (event.key !== "Tab" || !node) return;
      const controls = Array.from(
        node.querySelectorAll<HTMLElement>(
          "button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]",
        ),
      );
      if (!controls.length) return;
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [open, busy, record.publicId]);
  async function end(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setConflict(undefined);
    try {
      await mutate((token) =>
        api.endRelationship(
          tenant,
          record.publicId,
          {
            effectiveOn: String(data.get("effectiveOn")),
            expectedVersion,
            reason: String(data.get("reason")) || undefined,
          },
          token,
        ),
      );
      setOpen(false);
      await onEnded();
      trigger.current?.focus();
    } catch (reason) {
      const problem = reason as ApiProblem;
      setError(
        problem.status === 409
          ? "O Vínculo mudou. Compare os dados atuais antes de tentar novamente."
          : "Não foi possível encerrar. O Vínculo permanece ativo.",
      );
      if (problem.status === 409)
        setConflict(problem.current as Relationship | undefined);
      queueMicrotask(() => errorRef.current?.focus());
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <button
        ref={trigger}
        type="button"
        className="secondary-action"
        disabled={record.state === "ended"}
        onClick={() => setOpen(true)}
      >
        {record.state === "ended" ? "Vínculo encerrado" : "Encerrar Vínculo"}
      </button>
      {open && (
        <section
          className="confirmation-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`end-${record.publicId}`}
        >
          <h4 id={`end-${record.publicId}`}>Encerrar Vínculo?</h4>
          <p>
            Pessoa: <strong>{personName}</strong>. Unidade:{" "}
            <strong>{unitName}</strong>. Condomínio:{" "}
            <strong>{condominiumName}</strong>. O histórico será preservado. Se
            este Vínculo já tiver sido usado para conceder acesso (ex.: aceite
            de Convite), esse acesso deixará de ser autorizado por este
            Condomínio. Isso não transfere pendências. O encerramento não é
            reversível por esta tela; uma correção exige nova alteração
            auditável.
          </p>
          {error && (
            <p ref={errorRef} tabIndex={-1} role="alert">
              {error}
            </p>
          )}
          <ConflictResolver
            current={conflict}
            onReload={onEnded}
            onReapply={(current) => {
              setExpectedVersion(current.version);
              setConflict(undefined);
            }}
          />
          <form onSubmit={(event) => void end(event)}>
            <label htmlFor={`effective-${record.publicId}`}>
              Data efetiva (obrigatória)
            </label>
            <input
              id={`effective-${record.publicId}`}
              name="effectiveOn"
              type="date"
              required
            />
            <label htmlFor={`reason-${record.publicId}`}>
              Motivo (opcional)
            </label>
            <input id={`reason-${record.publicId}`} name="reason" />
            <div className="form-actions">
              <button
                type="button"
                className="secondary-action"
                disabled={busy}
                onClick={() => {
                  setOpen(false);
                  trigger.current?.focus();
                }}
              >
                Manter Vínculo
              </button>
              <button type="submit" disabled={busy}>
                {busy ? "Encerrando…" : "Confirmar encerramento"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export function PeopleUnitsPage({ publicId }: { publicId: string }) {
  const [people, setPeople] = useState<Person[]>([]),
    [units, setUnits] = useState<Unit[]>([]),
    [relationships, setRelationships] = useState<Relationship[]>([]);
  const [condominiumName, setCondominiumName] = useState(
      "Condomínio autorizado",
    ),
    [timeZone, setTimeZone] = useState("America/Sao_Paulo"),
    [selectedPerson, setSelectedPerson] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "denied" | "error">(
      "loading",
    ),
    [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  const [busy, setBusy] = useState<"person" | "unit" | "relationship">(),
    [candidate, setCandidate] = useState<Person>();
  const heading = useRef<HTMLHeadingElement>(null),
    errors = useRef<HTMLDivElement>(null),
    pendingKeys = useRef<Record<string, { fingerprint: string; key: string }>>(
      {},
    );
  const submitting = useRef(false),
    loadGeneration = useRef(0);

  async function everyPage<T>(
    request: (cursor?: string) => Promise<Page<T>>,
  ): Promise<T[]> {
    const items: T[] = [];
    let cursor: string | undefined;
    do {
      const page = await request(cursor);
      items.push(...page.items);
      cursor = page.nextCursor;
    } while (cursor);
    return items;
  }

  async function load() {
    const generation = ++loadGeneration.current;
    setState("loading");
    try {
      const [p, u, r, dashboard] = await Promise.all([
        everyPage((cursor) => api.listPeople(publicId, cursor)),
        everyPage((cursor) => api.listUnits(publicId, cursor)),
        everyPage((cursor) => api.listRelationships(publicId, cursor)),
        api.getTenantDashboard(publicId),
      ]);
      if (generation !== loadGeneration.current) return;
      setPeople(p);
      setUnits(u);
      setRelationships(r);
      setCondominiumName(dashboard.condominium.displayName);
      setTimeZone(dashboard.condominium.timeZone);
      setState("ready");
      document.title = `${dashboard.condominium.displayName} — Pessoas e acesso — Burgoweb`;
    } catch (reason) {
      if (generation !== loadGeneration.current) return;
      const problem = reason as ApiProblem;
      setState(
        problem.status === 401 || problem.status === 404 ? "denied" : "error",
      );
      document.title = "Acesso indisponível — Burgoweb";
    }
  }
  useEffect(() => {
    loadGeneration.current++;
    setPeople([]);
    setUnits([]);
    setRelationships([]);
    setSelectedPerson("");
    setCandidate(undefined);
    setNotice("");
    setError("");
    pendingKeys.current = {};
    void load();
    return () => {
      loadGeneration.current++;
      document.title = "Burgoweb";
    };
  }, [publicId]);
  useEffect(() => {
    if (state !== "loading") heading.current?.focus();
  }, [state]);

  async function submit(
    event: FormEvent<HTMLFormElement>,
    kind: "person" | "unit" | "relationship",
  ) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setError("");
    setNotice("");
    setCandidate(undefined);
    const form = event.currentTarget,
      data = new FormData(form),
      fingerprint = JSON.stringify(Object.fromEntries(data));
    const pending = pendingKeys.current[kind];
    const key =
      pending?.fingerprint === fingerprint ? pending.key : idempotencyKey();
    pendingKeys.current[kind] = { fingerprint, key };
    setBusy(kind);
    try {
      if (kind === "person")
        await mutate((token) =>
          api.createPerson(
            publicId,
            {
              fullName: String(data.get("fullName")),
              email: String(data.get("email")) || undefined,
            },
            key,
            token,
          ),
        );
      if (kind === "unit")
        await mutate((token) =>
          api.createUnit(
            publicId,
            { identifier: String(data.get("identifier")) },
            key,
            token,
          ),
        );
      if (kind === "relationship")
        await mutate((token) =>
          api.createRelationship(
            publicId,
            {
              personPublicId: String(data.get("personPublicId")),
              unitPublicId: String(data.get("unitPublicId")),
              relationKind: String(data.get("relationKind")),
              startsOn: String(data.get("startsOn")),
              endsOn: String(data.get("endsOn")) || undefined,
            },
            key,
            token,
          ),
        );
      delete pendingKeys.current[kind];
      form.reset();
      if (kind === "relationship") setSelectedPerson("");
      setNotice("Cadastro salvo com sucesso.");
      await load();
    } catch (reason) {
      const problem = reason as ApiProblem;
      const duplicate = problem.current as { candidate?: Person } | undefined;
      if (problem.status === 409 && duplicate?.candidate) {
        setCandidate(duplicate.candidate);
        setError(
          "Encontramos uma possível duplicidade neste Condomínio. Associe ao cadastro autorizado existente ou cancele.",
        );
      } else
        setError(
          problem.status === 409
            ? "Não foi possível salvar porque o registro mudou ou a chave foi usada com outros dados. Revise antes de tentar novamente."
            : problem.detail ||
                "Não foi possível salvar. A entrada foi preservada.",
        );
      queueMicrotask(() => errors.current?.focus());
    } finally {
      submitting.current = false;
      setBusy(undefined);
    }
  }

  function handleAccessLost() {
    setPeople([]);
    setUnits([]);
    setRelationships([]);
    setSelectedPerson("");
    setState("denied");
    sessionStorage.setItem(
      "burgoweb.access-lost",
      "Não foi possível concluir esta ação.",
    );
    window.history.replaceState(
      null,
      "",
      `/condominios/${encodeURIComponent(publicId)}`,
    );
    document.title = "Acesso indisponível — Burgoweb";
  }

  return (
    <main id="conteudo-principal" className="people-shell">
      <nav aria-label="Condomínio">
        <a href={`/condominios/${encodeURIComponent(publicId)}`}>
          Voltar ao Condomínio
        </a>
      </nav>
      <p className="eyebrow">Condomínio ativo: {condominiumName}</p>
      <h1 ref={heading} tabIndex={-1}>
        Pessoas e acesso
      </h1>
      <p>
        Pessoa é o cadastro institucional; Conta é a credencial de entrada.
        Unidade e Vínculo não concedem Papel ou acesso automaticamente.
      </p>
      {state === "loading" && <p role="status">Carregando cadastros…</p>}
      {state === "denied" && (
        <section className="state-panel">
          <h2>Acesso indisponível</h2>
          <p role="alert">Não foi possível concluir esta ação.</p>
        </section>
      )}
      {state === "error" && (
        <section className="error-summary" role="alert">
          <h2>Não foi possível carregar</h2>
          <button type="button" onClick={() => void load()}>
            Tentar novamente
          </button>
        </section>
      )}
      {error && (
        <div className="error-summary" role="alert" ref={errors} tabIndex={-1}>
          <h2>Revise antes de continuar</h2>
          <p>{error}</p>
          {candidate && (
            <div>
              <p>
                Cadastro autorizado encontrado:{" "}
                <strong>{candidate.fullName}</strong>. Esta escolha não cria
                Conta, Papel, Convite ou acesso.
              </p>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPerson(candidate.publicId);
                    setCandidate(undefined);
                    setError("");
                    setNotice(
                      "Pessoa existente selecionada. Complete o formulário de Vínculo para associá-la a uma Unidade.",
                    );
                  }}
                >
                  Associar ao cadastro existente
                </button>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => {
                    setCandidate(undefined);
                    setError("");
                  }}
                >
                  Cancelar associação
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {notice && (
        <p className="success-message" role="status">
          {notice}
        </p>
      )}
      {state === "ready" && (
        <div className="institutional-grid">
          <section>
            <h2>Cadastrar Pessoa</h2>
            <form onSubmit={(event) => void submit(event, "person")}>
              <label htmlFor="person-name">Nome completo (obrigatório)</label>
              <input
                id="person-name"
                name="fullName"
                autoComplete="name"
                required
                maxLength={160}
              />
              <label htmlFor="person-email">E-mail (opcional)</label>
              <p id="person-email-help" className="field-help">
                E-mail coincidente sinaliza possível duplicidade, mas não prova
                identidade.
              </p>
              <input
                id="person-email"
                name="email"
                type="email"
                autoComplete="email"
                aria-describedby="person-email-help"
              />
              <button type="submit" disabled={Boolean(busy)}>
                {busy === "person" ? "Cadastrando…" : "Cadastrar Pessoa"}
              </button>
            </form>
          </section>
          <section>
            <h2>Cadastrar Unidade</h2>
            <form onSubmit={(event) => void submit(event, "unit")}>
              <label htmlFor="unit-id">
                Identificação no Condomínio (obrigatória)
              </label>
              <input id="unit-id" name="identifier" required maxLength={160} />
              <button type="submit" disabled={Boolean(busy)}>
                {busy === "unit" ? "Cadastrando…" : "Cadastrar Unidade"}
              </button>
            </form>
          </section>
          <section>
            <h2>Cadastrar Vínculo</h2>
            <form onSubmit={(event) => void submit(event, "relationship")}>
              <label htmlFor="rel-person">Pessoa (obrigatória)</label>
              <select
                id="rel-person"
                name="personPublicId"
                required
                value={selectedPerson}
                onChange={(event) => setSelectedPerson(event.target.value)}
              >
                <option value="">Selecione</option>
                {people
                  .filter((item) => item.state === "active")
                  .map((item) => (
                    <option value={item.publicId} key={item.publicId}>
                      {item.fullName}
                    </option>
                  ))}
              </select>
              <label htmlFor="rel-unit">Unidade (obrigatória)</label>
              <select id="rel-unit" name="unitPublicId" required>
                <option value="">Selecione</option>
                {units
                  .filter((item) => item.state === "active")
                  .map((item) => (
                    <option value={item.publicId} key={item.publicId}>
                      {item.identifier}
                    </option>
                  ))}
              </select>
              <label htmlFor="rel-kind">Natureza declarada (obrigatória)</label>
              <p id="rel-kind-help" className="field-help">
                Não representa prova de propriedade, posse ou responsabilidade
                jurídica.
              </p>
              <input
                id="rel-kind"
                name="relationKind"
                required
                maxLength={80}
                aria-describedby="rel-kind-help"
              />
              <label htmlFor="rel-start">Início (obrigatório)</label>
              <input id="rel-start" name="startsOn" type="date" required />
              <label htmlFor="rel-end">Fim exclusivo (opcional)</label>
              <input id="rel-end" name="endsOn" type="date" />
              <button type="submit" disabled={Boolean(busy)}>
                {busy === "relationship" ? "Cadastrando…" : "Cadastrar Vínculo"}
              </button>
            </form>
          </section>
          <section className="records">
            <h2>Registros institucionais</h2>
            {people.length + units.length + relationships.length === 0 ? (
              <p>Nenhuma Pessoa, Unidade ou Vínculo foi cadastrado ainda.</p>
            ) : (
              <>
                <h3>Pessoas</h3>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Pessoa</th>
                        <th scope="col">E-mail</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {people.map((item) => (
                        <tr key={item.publicId}>
                          <th scope="row">{item.fullName}</th>
                          <td>{item.email || "Não informado"}</td>
                          <td>
                            {item.state === "active" ? "Ativa" : "Encerrada"}
                          </td>
                          <td>
                            <EditPerson
                              tenant={publicId}
                              record={item}
                              onSaved={load}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h3>Unidades</h3>
                <ul className="record-list">
                  {units.map((item) => (
                    <li key={item.publicId}>
                      <strong>{item.identifier}</strong> —{" "}
                      {item.state === "active" ? "Ativa" : "Encerrada"}
                      <EditUnit
                        tenant={publicId}
                        record={item}
                        onSaved={load}
                      />
                    </li>
                  ))}
                </ul>
                <h3>Vínculos</h3>
                <ul className="record-list">
                  {relationships.map((item) => (
                    <li key={item.publicId}>
                      <strong>{item.relationKind}</strong> — {item.startsOn}
                      {item.endsOn
                        ? ` até ${item.endsOn} (exclusivo)`
                        : ""} —{" "}
                      {item.state === "active" ? "Ativo" : "Encerrado"}
                      <EditRelationship
                        tenant={publicId}
                        record={item}
                        onSaved={load}
                      />
                      <EndRelationshipAction
                        tenant={publicId}
                        condominiumName={condominiumName}
                        record={item}
                        personName={
                          people.find(
                            (person) => person.publicId === item.personPublicId,
                          )?.fullName || "Pessoa autorizada"
                        }
                        unitName={
                          units.find(
                            (unit) => unit.publicId === item.unitPublicId,
                          )?.identifier || "Unidade autorizada"
                        }
                        onEnded={load}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
          <InvitationsPanel
            tenant={publicId}
            people={people}
            relationships={relationships}
          />
          <RolesPanel
            tenant={publicId}
            condominiumName={condominiumName}
            timeZone={timeZone}
            people={people}
            relationships={relationships}
            units={units}
            onAccessLost={handleAccessLost}
          />
          <CapabilitiesPanel
            tenant={publicId}
            people={people}
            onAccessLost={handleAccessLost}
          />
          <FinancialResponsiblesPanel
            tenant={publicId}
            people={people}
            units={units}
            onAccessLost={handleAccessLost}
          />
        </div>
      )}
    </main>
  );
}
