import { FormEvent, type MouseEvent, useEffect, useRef, useState } from "react";
import {
  BurgowebApiClient,
  type ApiProblem,
  type CapabilityCatalogEntry,
  type CapabilityDraft,
  type CapabilityGrant,
  type Person,
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
const stateLabels = {
  scheduled: "Agendada",
  active: "Ativa",
  expired: "Expirada",
  revoked: "Revogada",
};
type Mode = "grant" | "revoke";

export function CapabilitiesPanel({
  tenant,
  people,
  onAccessLost,
}: {
  tenant: string;
  people: Person[];
  onAccessLost: () => void;
}) {
  const [items, setItems] = useState<CapabilityGrant[]>([]),
    [catalog, setCatalog] = useState<CapabilityCatalogEntry[]>([]),
    [viewerCapabilities, setViewerCapabilities] = useState<string[]>([]),
    [auxiliares, setAuxiliares] = useState<{ publicId: string; fullName: string }[]>([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [mode, setMode] = useState<Mode>(),
    [selected, setSelected] = useState<CapabilityGrant>(),
    [draft, setDraft] = useState<CapabilityDraft>(),
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
      const [page, roles] = await Promise.all([
        api.listCapabilityGrants(tenant),
        api.listRoleAssignments(tenant),
      ]);
      setItems(page.items);
      setCatalog(page.catalog);
      setViewerCapabilities(page.viewerCapabilities ?? []);
      setAuxiliares(
        roles.items
          .filter((item) => item.role === "administrative-assistant" && item.state === "active")
          .map((item) => ({
            publicId: item.personPublicId,
            fullName:
              people.find((p) => p.publicId === item.personPublicId)?.fullName ??
              "Auxiliar autorizado",
          })),
      );
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
                : "Não foi possível carregar as capacidades.";
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
      capabilityId: String(data.get("capabilityId")),
      validFrom: String(data.get("validFrom")),
      validUntil: String(data.get("validUntil")) || undefined,
    });
  }
  async function grant() {
    if (!draft || busy) return;
    const fingerprint = JSON.stringify(draft);
    const key =
      pendingKey.current?.fingerprint === fingerprint
        ? pendingKey.current.key
        : crypto.randomUUID();
    pendingKey.current = { fingerprint, key };
    setBusy(true);
    try {
      await mutate((token) => api.grantCapability(tenant, draft, key, token));
      pendingKey.current = undefined;
      setMode(undefined);
      setDraft(undefined);
      await load();
      setMessage("Capacidade concedida com sucesso.");
    } catch (reason) {
      const problem = reason as ApiProblem;
      if (problem.status === 403 || problem.status === 404) {
        setMode(undefined);
        setMessage("Não foi possível concluir esta ação.");
        onAccessLost();
      } else if (problem.status === 409) {
        setMessage(
          "Já existe uma delegação vigente dessa capacidade para este Auxiliar. A lista foi atualizada.",
        );
        await load();
      } else if (problem.detail === "capabilityUnavailable") {
        setMessage("Esta capacidade ainda não está disponível para delegação nesta versão do Burgoweb.");
      } else {
        setMessage(
          problem.detail ??
            "Não foi possível conceder a capacidade. Revise os dados e o horário civil no fuso do Condomínio.",
        );
      }
    } finally {
      setBusy(false);
    }
  }
  async function revoke(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || busy) return;
    setBusy(true);
    try {
      const result = await mutate((token) =>
        api.revokeCapability(
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
      setMessage("Capacidade revogada.");
    } catch (reason) {
      const problem = reason as ApiProblem;
      if (problem.status === 409) {
        const current = problem.current as Partial<CapabilityGrant> | undefined;
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
  const openGrant = (target: HTMLButtonElement) => {
    opener.current = target;
    setDraft(undefined);
    setMode("grant");
  };
  const openRevoke = (item: CapabilityGrant, event: MouseEvent<HTMLButtonElement>) => {
    opener.current = event.currentTarget;
    setSelected(item);
    setMode("revoke");
  };
  const close = () => {
    setMode(undefined);
    setSelected(undefined);
    setDraft(undefined);
    setTimeout(() => opener.current?.focus());
  };
  const catalogEntry = (id: string) => catalog.find((entry) => entry.id === id);
  const draftPerson = draft && auxiliares.find((a) => a.publicId === draft.personPublicId);
  const draftCapability = draft && catalogEntry(draft.capabilityId);
  const canManage = viewerCapabilities.includes("capabilities.grant");
  return (
    <section className="records" aria-labelledby="capabilities-title">
      <h2 id="capabilities-title">Capacidades delegadas</h2>
      <p>
        Capacidades delegadas são diferentes de Papel institucional: cada uma autoriza somente a
        ação específica descrita, nunca um domínio inteiro.
      </p>
      {!canManage && !loading && (
        <p>Você está vendo somente as capacidades delegadas a você.</p>
      )}
      {canManage && (
        <button
          type="button"
          onClick={(event) => openGrant(event.currentTarget)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              openGrant(event.currentTarget);
            }
          }}
          disabled={auxiliares.length === 0}
        >
          Delegar capacidade
        </button>
      )}
      {canManage && !loading && auxiliares.length === 0 && (
        <p>Nenhum Auxiliar Administrativo com Papel vigente para delegar capacidades.</p>
      )}
      <p
        ref={alert}
        tabIndex={-1}
        role={message && !message.startsWith("Capacidade") ? "alert" : "status"}
        aria-live="polite"
      >
        {loading ? "Carregando capacidades" : message}
      </p>
      {!loading &&
        /^(Serviço|Não foi possível carregar|Você está offline)/.test(message) && (
          <button type="button" onClick={() => void load()}>
            Tentar novamente
          </button>
        )}
      {!loading && items.length === 0 && <p>Nenhuma capacidade delegada</p>}
      <ul className="record-list">
        {items.map((item) => {
          const name =
            people.find((p) => p.publicId === item.personPublicId)?.fullName ??
            "Pessoa autorizada";
          const entry = catalogEntry(item.capabilityId);
          return (
            <li key={item.publicId}>
              <strong>{name}</strong> — {entry?.domain ?? item.capabilityId} (
              {entry?.action ?? item.capabilityId}) —{" "}
              <span>
                <span aria-hidden="true">●</span> {stateLabels[item.state]}
              </span>
              {canManage && ["scheduled", "active"].includes(item.state) && (
                <button onClick={(event) => openRevoke(item, event)}>
                  Revogar capacidade de {name}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <h3>Catálogo de capacidades</h3>
      <dl>
        {Object.entries(
          catalog.reduce<Record<string, CapabilityCatalogEntry[]>>((groups, entry) => {
            (groups[entry.domain] ??= []).push(entry);
            return groups;
          }, {}),
        ).map(([domain, entries]) => (
          <div key={domain}>
            <dt>{domain}</dt>
            {entries.map((entry) => (
              <dd key={entry.id}>
                <strong>{entry.action}</strong>: {entry.grants}
                {!entry.available && " (ainda não disponível)"}
              </dd>
            ))}
          </div>
        ))}
      </dl>
      {mode === "grant" && (
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={draft ? "Revisar delegação de capacidade" : undefined}
          aria-labelledby={draft ? undefined : "grant-capability-title"}
        >
          <h3 id="grant-capability-title">Delegar capacidade</h3>
          {!draft ? (
            <form onSubmit={prepare}>
              <label>
                Auxiliar Administrativo
                <select name="personPublicId" required>
                  {auxiliares.map((person) => (
                    <option value={person.publicId} key={person.publicId}>
                      {person.fullName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Capacidade
                <select name="capabilityId" required>
                  {catalog
                    .filter((entry) => entry.available)
                    .map((entry) => (
                      <option value={entry.id} key={entry.id}>
                        {entry.domain} — {entry.action}
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
              <button>Revisar delegação</button>
              <button type="button" onClick={close}>
                Cancelar
              </button>
            </form>
          ) : (
            <div>
              <h4>Revisar delegação de capacidade</h4>
              <dl>
                <dt>Auxiliar</dt>
                <dd>{draftPerson?.fullName}</dd>
                <dt>Capacidade e alcance</dt>
                <dd>
                  {draftCapability?.domain} — {draftCapability?.action} (todo o Condomínio)
                </dd>
                <dt>O que passa a permitir</dt>
                <dd>{draftCapability?.grants}</dd>
                <dt>O que continua negado</dt>
                <dd>{draftCapability?.denies}</dd>
              </dl>
              <button disabled={busy} onClick={() => void grant()}>
                {busy ? "Concedendo…" : "Confirmar delegação de capacidade"}
              </button>
              <button type="button" disabled={busy} onClick={() => setDraft(undefined)}>
                Voltar e editar
              </button>
            </div>
          )}
        </div>
      )}
      {mode === "revoke" && selected && (
        <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="revoke-capability-title">
          <h3 id="revoke-capability-title">Revogar capacidade permanentemente</h3>
          <p>
            A capacidade{" "}
            <strong>
              {catalogEntry(selected.capabilityId)?.domain} —{" "}
              {catalogEntry(selected.capabilityId)?.action}
            </strong>{" "}
            deixará de autorizar imediatamente. O histórico é preservado.
          </p>
          <form onSubmit={revoke}>
            <button disabled={busy}>
              {busy ? "Revogando…" : "Confirmar revogação de capacidade"}
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
