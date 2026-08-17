import {
  FormEvent,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BurgowebApiClient,
  type ApiProblem,
  type Person,
  type Relationship,
  type RoleAssignment,
  type RoleAssignmentPreview,
  type RoleDraft,
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
const labels = {
  scheduled: "Agendado",
  active: "Ativo",
  suspended: "Suspenso",
  expired: "Expirado",
  revoked: "Revogado",
};
const roleLabels: Record<string, string> = {
  syndic: "Síndico",
  "administrative-assistant": "Assistente administrativo",
  councilor: "Conselheiro",
  resident: "Morador",
};
type Mode = "grant" | "suspend" | "restore" | "revoke";

export function RolesPanel({
  tenant,
  condominiumName,
  timeZone,
  people,
  relationships,
  units,
  onAccessLost,
}: {
  tenant: string;
  condominiumName: string;
  timeZone: string;
  people: Person[];
  relationships: Relationship[];
  units: Unit[];
  onAccessLost: () => void;
}) {
  const [items, setItems] = useState<RoleAssignment[]>([]),
    [viewerPersonPublicId, setViewerPersonPublicId] = useState<string>(),
    [viewerCapabilities, setViewerCapabilities] = useState<string[]>([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [mode, setMode] = useState<Mode>(),
    [selected, setSelected] = useState<RoleAssignment>(),
    [preview, setPreview] = useState<RoleAssignmentPreview>(),
    [message, setMessage] = useState(""),
    [draft, setDraft] = useState<RoleDraft>(),
    [scopeType, setScopeType] = useState<"tenant" | "unit">("tenant"),
    [suspensionReason, setSuspensionReason] = useState(""),
    [revocationReason, setRevocationReason] = useState("");
  const alert = useRef<HTMLParagraphElement>(null),
    opener = useRef<HTMLButtonElement | null>(null),
    validFrom = useRef<HTMLInputElement>(null),
    dialog = useRef<HTMLDivElement>(null),
    pendingKey = useRef<{ fingerprint: string; key: string } | undefined>(
      undefined,
    );
  const load = async () => {
    setLoading(true);
    try {
      const page = await api.listRoleAssignments(tenant);
      setItems(page.items);
      setViewerPersonPublicId(page.viewerPersonPublicId);
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
                : "Não foi possível carregar os Papéis.";
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
  }, [mode, preview]);
  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const scope: RoleDraft["scope"] =
      String(data.get("scopeType")) === "unit"
        ? { type: "unit", unitPublicId: String(data.get("unitPublicId")) }
        : { type: "tenant" };
    const value: RoleDraft = {
      personPublicId: String(data.get("personPublicId")),
      relationshipPublicId:
        String(data.get("relationshipPublicId")) || undefined,
      role: String(data.get("role")) as RoleDraft["role"],
      scope,
      validFrom: String(data.get("validFrom")),
      validUntil: String(data.get("validUntil")) || undefined,
      timeZone,
    };
    setBusy(true);
    setMessage("");
    try {
      setDraft(value);
      setPreview(await mutate((token) => api.previewRoleAssignment(tenant, value, token)));
    } catch (reason) {
      const problem = reason as ApiProblem;
      setMessage(
        problem.detail ??
          "Revise os dados e escolha um horário civil válido no fuso do Condomínio.",
      );
      setTimeout(() => validFrom.current?.focus(), 100);
    } finally {
      setBusy(false);
    }
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
      await mutate((token) => api.grantRoleAssignment(tenant, draft, key, token));
      pendingKey.current = undefined;
      setMode(undefined);
      setPreview(undefined);
      setDraft(undefined);
      await load();
      setMessage("Papel concedido com sucesso.");
    } catch (reason) {
      const problem = reason as ApiProblem;
      setMessage(problem.detail ?? "Não foi possível conceder o Papel.");
    } finally {
      setBusy(false);
    }
  }
  async function change(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !mode || mode === "grant" || busy) return;
    const reason =
      mode === "suspend"
        ? suspensionReason.trim()
        : mode === "revoke"
          ? revocationReason.trim()
          : undefined;
    setBusy(true);
    try {
      const result = await mutate((token) =>
        mode === "suspend"
          ? api.suspendRoleAssignment(
              tenant,
              selected.publicId,
              { expectedVersion: selected.version, reason: reason! },
              token,
            )
          : mode === "restore"
            ? api.restoreRoleAssignment(
                tenant,
                selected.publicId,
                { expectedVersion: selected.version },
                token,
              )
            : api.revokeRoleAssignment(
                tenant,
                selected.publicId,
                { expectedVersion: selected.version, reason: reason! },
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
      setMessage(
        mode === "restore"
          ? "Papel restaurado; uma nova autenticação será necessária."
          : mode === "revoke"
            ? "Papel revogado permanentemente."
            : "Papel suspenso.",
      );
    } catch (reason) {
      const problem = reason as ApiProblem;
      if (problem.status === 409) {
        const current = problem.current as Partial<RoleAssignment> | undefined;
        setItems((items) =>
          items.map((item) =>
            item.publicId === selected.publicId
              ? { ...item, ...current }
              : item,
          ),
        );
        setSelected((current2) =>
          current2 ? { ...current2, ...current } : current2,
        );
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
  const open = (
    kind: Mode,
    item?: RoleAssignment,
    event?: SyntheticEvent<HTMLButtonElement>,
  ) => {
    opener.current = event?.currentTarget ?? null;
    setSelected(item);
    setSuspensionReason("");
    setRevocationReason("");
    setScopeType("tenant");
    setMode(kind);
  };
  const close = () => {
    setMode(undefined);
    setSelected(undefined);
    setPreview(undefined);
    setDraft(undefined);
    setTimeout(() => opener.current?.focus());
  };
  return (
    <section className="records" aria-labelledby="roles-title">
      <h2 id="roles-title">Papéis e acesso</h2>
      <p>
        Papéis institucionais são diferentes de capacidade delegada, Responsável
        Financeiro e Contato de Continuidade.
      </p>
      <button
        type="button"
        onClick={(event) => open("grant", undefined, event)}
      >
        Conceder Papel
      </button>
      <p
        ref={alert}
        tabIndex={-1}
        role={
          message && !message.startsWith("Papel concedido") ? "alert" : "status"
        }
        aria-live="polite"
      >
        {loading ? "Carregando Papéis" : message}
      </p>
      {!loading && items.length === 0 && <p>Nenhum Papel atribuído</p>}
      {!loading &&
        /^(Serviço|Não foi possível carregar|Você está offline)/.test(
          message,
        ) && (
          <button type="button" onClick={() => void load()}>
            Tentar novamente
          </button>
        )}
      <ul className="record-list">
        {items.map((item) => {
          const name =
            people.find((p) => p.publicId === item.personPublicId)?.fullName ??
            "Pessoa autorizada";
          const isSelf = viewerPersonPublicId === item.personPublicId;
          const isSyndic = item.role === "syndic";
          return (
            <li key={item.publicId}>
              <strong>{name}</strong> — {roleLabels[item.role] ?? item.role} —{" "}
              <span>
                <span aria-hidden="true">●</span> {labels[item.state]}
              </span>
              {!isSyndic &&
                !isSelf &&
                viewerCapabilities.includes("roles.suspend") &&
                item.state === "active" && (
                  <button
                    onClick={(event) => open("suspend", item, event)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        open("suspend", item, event);
                      }
                    }}
                  >
                    Suspender Papel de {name}
                  </button>
                )}
              {!isSyndic &&
                !isSelf &&
                viewerCapabilities.includes("roles.restore") &&
                item.state === "suspended" && (
                  <button onClick={(event) => open("restore", item, event)}>
                    Restaurar Papel de {name}
                  </button>
                )}
              {!isSyndic &&
                !isSelf &&
                viewerCapabilities.includes("roles.revoke") &&
                !["expired", "revoked"].includes(item.state) && (
                  <button onClick={(event) => open("revoke", item, event)}>
                    Revogar Papel de {name}
                  </button>
                )}
            </li>
          );
        })}
      </ul>
      {mode === "grant" && (
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={preview ? "Revisar concessão de Papel" : undefined}
          aria-labelledby={preview ? undefined : "grant-title"}
        >
          <h3 id="grant-title">Conceder Papel institucional</h3>
          {!preview ? (
            <form onSubmit={prepare}>
              <label>
                Pessoa
                <select name="personPublicId" required>
                  {people.map((p) => (
                    <option value={p.publicId} key={p.publicId}>
                      {p.fullName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Vínculo
                <select name="relationshipPublicId">
                  <option value="">Sem Vínculo</option>
                  {relationships
                    .filter((r) => r.state === "active")
                    .map((r) => (
                      <option value={r.publicId} key={r.publicId}>
                        {r.relationKind}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                Papel institucional
                <select name="role">
                  <option value="administrative-assistant">
                    Assistente administrativo
                  </option>
                  <option value="councilor">Conselheiro</option>
                  <option value="resident">Morador</option>
                </select>
              </label>
              <label>
                Alcance
                <select
                  name="scopeType"
                  value={scopeType}
                  onChange={(event) =>
                    setScopeType(event.target.value as "tenant" | "unit")
                  }
                >
                  <option value="tenant">Todo o Condomínio</option>
                  <option value="unit">Uma Unidade específica</option>
                </select>
              </label>
              {scopeType === "unit" && (
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
              )}
              <label>
                Início da vigência (fuso do Condomínio: {timeZone})
                <input
                  ref={validFrom}
                  name="validFrom"
                  type="datetime-local"
                  required
                />
              </label>
              <label>
                Fim da vigência (fuso do Condomínio: {timeZone})
                <input name="validUntil" type="datetime-local" />
              </label>
              <button disabled={busy}>
                {busy ? "Revisando…" : "Revisar concessão de Papel"}
              </button>
              <button type="button" onClick={close}>
                Cancelar
              </button>
            </form>
          ) : (
            <div>
              <h4>Revisar concessão de Papel</h4>
              <dl>
                <dt>Pessoa</dt>
                <dd>
                  {
                    people.find((p) => p.publicId === draft?.personPublicId)
                      ?.fullName
                  }
                </dd>
                <dt>Vínculo e alcance</dt>
                <dd>
                  {relationships.find(
                    (relationship) =>
                      relationship.publicId === draft?.relationshipPublicId,
                  )?.relationKind ?? "Sem Vínculo"}{" "}
                  —{" "}
                  {draft && draft.scope.type === "unit"
                    ? (() => {
                        const unitPublicId = draft.scope.unitPublicId;
                        return (
                          units.find((unit) => unit.publicId === unitPublicId)
                            ?.identifier ?? "Unidade"
                        );
                      })()
                    : condominiumName}
                </dd>
                <dt>Efeitos de acesso</dt>
                <dd>
                  <strong>Papel institucional</strong>;{" "}
                  <strong>Capacidade delegada</strong>: nenhuma;{" "}
                  <strong>Responsável Financeiro</strong>: não;{" "}
                  <strong>Contato de Continuidade</strong>: não.
                </dd>
              </dl>
              <button disabled={busy} onClick={() => void grant()}>
                {busy
                  ? "Concedendo…"
                  : `Confirmar concessão de Papel no ${condominiumName}`}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setPreview(undefined)}
              >
                Voltar e editar
              </button>
            </div>
          )}
        </div>
      )}
      {mode && mode !== "grant" && selected && (
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="change-title"
        >
          <h3 id="change-title">
            {mode === "suspend"
              ? "Suspender Papel"
              : mode === "restore"
                ? "Restaurar Papel"
                : "Revogar Papel permanentemente"}
          </h3>
          <form onSubmit={change}>
            {mode === "suspend" && (
              <label>
                Motivo da suspensão
                <input
                  name="suspensionReason"
                  minLength={8}
                  maxLength={500}
                  required
                  value={suspensionReason}
                  onChange={(event) => setSuspensionReason(event.target.value)}
                />
              </label>
            )}
            {mode === "revoke" && (
              <label>
                Motivo da revogação
                <input
                  name="revocationReason"
                  minLength={8}
                  maxLength={500}
                  required
                  value={revocationReason}
                  onChange={(event) => setRevocationReason(event.target.value)}
                />
              </label>
            )}
            {mode === "restore" && (
              <p>
                As sessões invalidadas não serão restauradas; será necessária
                nova autenticação.
              </p>
            )}
            <button
              disabled={
                busy ||
                (mode === "suspend" && suspensionReason.trim().length < 8) ||
                (mode === "revoke" && revocationReason.trim().length < 8)
              }
            >
              {busy
                ? "Confirmando…"
                : mode === "suspend"
                  ? "Confirmar suspensão de Papel"
                  : mode === "restore"
                    ? "Confirmar restauração de Papel"
                    : "Confirmar revogação permanente"}
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
