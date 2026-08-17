import { FormEvent, type MouseEvent, useEffect, useRef, useState } from "react";
import {
  BurgowebApiClient,
  type ApiProblem,
  type FinancialResponsible,
  type FinancialResponsibleDraft,
  type Person,
  type Unit,
} from "@burgoweb/api-client";

const api = new BurgowebApiClient();
const CSRF_KEY = "burgoweb.csrf";
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
const stateLabels: Record<string, string> = {
  scheduled: "Agendado",
  active: "Ativo",
  expired: "Expirado",
  revoked: "Removido",
};
type Mode = "assign" | "remove";

export function FinancialResponsiblesPanel({
  tenant,
  people,
  units,
  onAccessLost,
}: {
  tenant: string;
  people: Person[];
  units: Unit[];
  onAccessLost: () => void;
}) {
  const [items, setItems] = useState<FinancialResponsible[]>([]),
    [viewerCapabilities, setViewerCapabilities] = useState<string[]>([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [mode, setMode] = useState<Mode>(),
    [selected, setSelected] = useState<FinancialResponsible>(),
    [draft, setDraft] = useState<FinancialResponsibleDraft>(),
    [message, setMessage] = useState("");
  const alert = useRef<HTMLParagraphElement>(null),
    opener = useRef<HTMLButtonElement | null>(null),
    dialog = useRef<HTMLDivElement>(null),
    pendingKey = useRef<{ fingerprint: string; key: string } | undefined>(
      undefined,
    ),
    busyRef = useRef(false);
  busyRef.current = busy;
  const load = async () => {
    setLoading(true);
    try {
      const page = await api.listFinancialResponsibles(tenant);
      setItems(page.items);
      setViewerCapabilities(page.viewerCapabilities ?? []);
      setMessage("");
    } catch (reason) {
      const problem = reason as ApiProblem;
      const text =
        problem.status === 401
          ? "Sessão expirada. Entre novamente para continuar."
          : problem.status === 403
            ? "Acesso negado"
            : problem.status === 503
              ? "Serviço indisponível"
              : !problem.status || !navigator.onLine
                ? "Você está offline"
                : "Não foi possível carregar os Responsáveis Financeiros.";
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);
  useEffect(() => {
    if (message) alert.current?.focus();
  }, [message]);
  useEffect(() => {
    if (!mode) return;
    const node = dialog.current;
    node
      ?.querySelector<HTMLElement>("input, select, textarea, button")
      ?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (busyRef.current) return;
        close();
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
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, draft]);
  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setDraft({
      personPublicId: String(data.get("personPublicId")),
      unitPublicId: String(data.get("unitPublicId")),
      validFrom: String(data.get("validFrom")),
      validUntil: String(data.get("validUntil")) || undefined,
    });
  }
  async function assign() {
    if (!draft || busy) return;
    const fingerprint = JSON.stringify(draft);
    const key =
      pendingKey.current?.fingerprint === fingerprint
        ? pendingKey.current.key
        : crypto.randomUUID();
    pendingKey.current = { fingerprint, key };
    setBusy(true);
    try {
      await mutate((token) =>
        api.assignFinancialResponsible(tenant, draft, key, token),
      );
      pendingKey.current = undefined;
      setMode(undefined);
      setDraft(undefined);
      await load();
      setMessage("Responsável Financeiro atribuído com sucesso.");
    } catch (reason) {
      const problem = reason as ApiProblem;
      if (problem.status === 403 || problem.status === 404) {
        setMode(undefined);
        setMessage("Não foi possível concluir esta ação.");
        onAccessLost();
      } else if (problem.status === 409) {
        setMessage(
          "Já existe uma atribuição vigente para esta Pessoa nesta Unidade. A lista foi atualizada.",
        );
        await load();
      } else {
        setMessage(
          problem.detail ??
            "Não foi possível atribuir o Responsável Financeiro. Revise os dados, o Vínculo e o horário civil no fuso do Condomínio.",
        );
      }
    } finally {
      setBusy(false);
    }
  }
  async function remove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || busy) return;
    setBusy(true);
    try {
      const result = await mutate((token) =>
        api.removeFinancialResponsible(
          tenant,
          selected.publicId,
          { expectedVersion: selected.version },
          token,
        ),
      );
      setItems((current) =>
        current.map((item) =>
          item.publicId === selected.publicId ? result : item,
        ),
      );
      setMode(undefined);
      setSelected(undefined);
      setMessage("Responsável Financeiro removido.");
    } catch (reason) {
      const problem = reason as ApiProblem;
      if (problem.status === 409) {
        const current = problem.current as
          | Partial<FinancialResponsible>
          | undefined;
        setItems((current2) =>
          current2.map((item) =>
            item.publicId === selected.publicId ? { ...item, ...current } : item,
          ),
        );
        setSelected((current2) => (current2 ? { ...current2, ...current } : current2));
        setMessage("Revise o estado atual antes de tentar novamente.");
      } else if (problem.status === 403 || problem.status === 404) {
        setMode(undefined);
        setMessage("Não foi possível concluir esta ação.");
        onAccessLost();
      } else setMessage(problem.detail ?? "Não foi possível concluir esta ação.");
    } finally {
      setBusy(false);
    }
  }
  const openAssign = (target: HTMLButtonElement) => {
    opener.current = target;
    setDraft(undefined);
    setMode("assign");
  };
  const openRemove = (
    item: FinancialResponsible,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    opener.current = event.currentTarget;
    setSelected(item);
    setMode("remove");
  };
  const close = () => {
    setMode(undefined);
    setSelected(undefined);
    setDraft(undefined);
    setTimeout(() => opener.current?.focus());
  };
  const personName = (publicId: string) =>
    people.find((p) => p.publicId === publicId)?.fullName ?? "Pessoa autorizada";
  const unitName = (publicId: string) =>
    units.find((u) => u.publicId === publicId)?.identifier ?? "Unidade autorizada";
  const draftPerson = draft && personName(draft.personPublicId);
  const draftUnit = draft && unitName(draft.unitPublicId);
  const canManage = viewerCapabilities.includes("financial-responsibles.manage");
  return (
    <section className="records" aria-labelledby="financial-responsibles-title">
      <h2 id="financial-responsibles-title">Responsáveis Financeiros</h2>
      <p>
        Atribuir Responsável Financeiro é diferente de conceder Papel institucional ou de
        gerir Vínculos: autoriza apenas o acompanhamento de obrigações privadas da Unidade
        indicada, sem ampliar acesso a outras Unidades.
      </p>
      {!canManage && !loading && (
        <p>Você está vendo somente suas próprias atribuições de Responsável Financeiro.</p>
      )}
      {canManage && (
        <button
          type="button"
          onClick={(event) => openAssign(event.currentTarget)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              openAssign(event.currentTarget);
            }
          }}
          disabled={people.length === 0 || units.length === 0}
        >
          Atribuir Responsável Financeiro
        </button>
      )}
      {canManage && !loading && (people.length === 0 || units.length === 0) && (
        <p>Cadastre ao menos uma Pessoa e uma Unidade com Vínculo compatível.</p>
      )}
      <p
        ref={alert}
        tabIndex={-1}
        role={message && !message.startsWith("Responsável Financeiro atribuído") ? "alert" : "status"}
        aria-live="polite"
      >
        {loading ? "Carregando Responsáveis Financeiros" : message}
      </p>
      {!loading &&
        /^(Serviço|Não foi possível carregar|Você está offline)/.test(message) && (
          <button type="button" onClick={() => void load()}>
            Tentar novamente
          </button>
        )}
      {!loading && items.length === 0 && <p>Nenhum Responsável Financeiro atribuído</p>}
      <ul className="record-list">
        {items.map((item) => (
          <li key={item.publicId}>
            <strong>{personName(item.personPublicId)}</strong> — {unitName(item.unitPublicId)}{" "}
            —{" "}
            <span>
              <span aria-hidden="true">●</span> {stateLabels[item.state] ?? item.state}
            </span>
            {canManage && ["scheduled", "active"].includes(item.state) && (
              <button onClick={(event) => openRemove(item, event)}>
                Remover Responsável Financeiro de {personName(item.personPublicId)}
              </button>
            )}
          </li>
        ))}
      </ul>
      {mode === "assign" && (
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={draft ? "Revisar atribuição de Responsável Financeiro" : undefined}
          aria-labelledby={draft ? undefined : "assign-financial-responsible-title"}
        >
          <h3 id="assign-financial-responsible-title">Atribuir Responsável Financeiro</h3>
          {!draft ? (
            <form onSubmit={prepare}>
              <label>
                Pessoa
                <select name="personPublicId" required>
                  {people.map((person) => (
                    <option value={person.publicId} key={person.publicId}>
                      {person.fullName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Unidade
                <select name="unitPublicId" required>
                  {units.map((unit) => (
                    <option value={unit.publicId} key={unit.publicId}>
                      {unit.identifier}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Início da vigência
                <input name="validFrom" type="datetime-local" required />
              </label>
              <label>
                Fim da vigência (opcional)
                <input name="validUntil" type="datetime-local" />
              </label>
              <button>Revisar atribuição</button>
              <button type="button" onClick={close}>
                Cancelar
              </button>
            </form>
          ) : (
            <div>
              <h4>Revisar atribuição de Responsável Financeiro</h4>
              <dl>
                <dt>Pessoa</dt>
                <dd>{draftPerson}</dd>
                <dt>Unidade</dt>
                <dd>{draftUnit}</dd>
                <dt>O que passa a permitir</dt>
                <dd>
                  Acompanhar obrigações privadas somente desta Unidade, quando disponíveis.
                </dd>
                <dt>O que continua negado</dt>
                <dd>
                  Não concede Papel institucional, capacidade de gerir Vínculos nem acesso a
                  outras Unidades.
                </dd>
              </dl>
              <button disabled={busy} onClick={() => void assign()}>
                {busy ? "Atribuindo…" : "Confirmar atribuição"}
              </button>
              <button type="button" disabled={busy} onClick={() => setDraft(undefined)}>
                Voltar e editar
              </button>
            </div>
          )}
        </div>
      )}
      {mode === "remove" && selected && (
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-financial-responsible-title"
        >
          <h3 id="remove-financial-responsible-title">Remover Responsável Financeiro</h3>
          <p>
            <strong>{personName(selected.personPublicId)}</strong> deixará de ser
            Responsável Financeiro por <strong>{unitName(selected.unitPublicId)}</strong>{" "}
            imediatamente. O histórico é preservado.
          </p>
          <form onSubmit={remove}>
            <button disabled={busy}>
              {busy ? "Removendo…" : "Confirmar remoção"}
            </button>
            <button type="button" disabled={busy} onClick={close}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
