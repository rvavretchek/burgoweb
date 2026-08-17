import { randomUUID } from 'node:crypto';
import type { PasswordHasher } from '../identity/password-hasher.js';
import { canonicalRequestHash } from './canonical-request.js';
import { AUTHORITY_DECLARATION, ProvisioningProblem, validateCreateCommand, type CreateCondominiumCommand, type PublicProvisioningResult } from './contracts.js';
import { IdempotencyClaimConflict, type AuditPort, type ProvisioningRepository, type TenantProvisioner } from './ports.js';
import type { VerificationTokenIssuer } from '../verification/verification-token-issuer.js';

const PUBLIC_MESSAGE = 'Sua solicitação foi registrada e está pendente. Verifique o controle do e-mail antes da ativação.';

export class CreateCondominium {
  constructor(private readonly deps: { repository: ProvisioningRepository; tenantProvisioner: TenantProvisioner; passwordHasher: PasswordHasher; audit: AuditPort; verificationIssuer?: VerificationTokenIssuer; now?: () => Date; uuid?: () => string; sleep?: (milliseconds: number) => Promise<void> }) {}

  private async knownResult(key: string, hash: string): Promise<PublicProvisioningResult> {
    const sleep = this.deps.sleep ?? (milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds)));
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const known = await this.deps.repository.findByIdempotencyKey(key);
      if (known) {
        if (known.requestHash !== hash) throw new ProvisioningProblem(409, 'https://burgoweb.local/problems/idempotency-conflict', 'Conflito de idempotência', 'A chave já foi usada com outro conteúdo.');
        if (known.state === 'compensated' || known.state === 'quarantined') {
          throw new ProvisioningProblem(410, 'https://burgoweb.local/problems/provisioning-failed', 'Solicitação não pôde ser concluída', 'Esta solicitação falhou de forma definitiva. Envie uma nova solicitação com uma nova chave de idempotência.');
        }
        if (known.result) return known.result;
      }
      await sleep(25);
    }
    throw new ProvisioningProblem(409, 'https://burgoweb.local/problems/provisioning-processing', 'Solicitação em processamento', 'Consulte novamente usando a mesma chave.');
  }

  async execute(command: CreateCondominiumCommand, idempotencyKey: string): Promise<PublicProvisioningResult> {
    validateCreateCommand(command);
    if (!idempotencyKey || idempotencyKey.length > 128) throw new ProvisioningProblem(400, 'https://burgoweb.local/problems/idempotency-key', 'Chave idempotente inválida', 'Envie uma Idempotency-Key válida.');
    const requestHash = canonicalRequestHash(command);
    const known = await this.deps.repository.findByIdempotencyKey(idempotencyKey);
    if (known) return this.knownResult(idempotencyKey, requestHash);

    const uuid = this.deps.uuid ?? randomUUID;
    const now = this.deps.now ?? (() => new Date());
    const requestId = uuid();
    const publicCondominiumId = uuid();
    const schemaName = `tenant_${uuid().replaceAll('-', '')}`;
    try {
      await this.deps.repository.begin({ requestId, idempotencyKey, requestHash, state: 'processing' });
    } catch (error) {
      if (error instanceof IdempotencyClaimConflict) return this.knownResult(idempotencyKey, requestHash);
      throw error;
    }

    try {
      // Always perform the expensive credential work, including for existing accounts,
      // so the public path remains structurally neutral.
      const [passwordHash] = await Promise.all([
        this.deps.passwordHasher.hash(command.password),
        this.deps.repository.accountExists(command.account.email.trim().toLowerCase()),
      ]);
      const staged = await this.deps.repository.persistGlobal({ requestId, publicCondominiumId, schemaName, command, passwordHash, declarationText: AUTHORITY_DECLARATION.text, declarationVersion: AUTHORITY_DECLARATION.version, acceptedAt: now() });
      // Always perform a comparable DB write path for both branches so an existing account
      // is not measurably faster to respond to than a new one (non-enumeration, AC 7).
      if (!staged.existingAccount) await this.deps.tenantProvisioner.createAndMigrate(schemaName, staged.seed);
      else await this.deps.tenantProvisioner.decoy();
      const result: PublicProvisioningResult = { requestId, publicCondominiumId, state: 'pending-email-verification', message: PUBLIC_MESSAGE };
      const verification = staged.accountId && this.deps.verificationIssuer ? this.deps.verificationIssuer.issue({ accountId: staged.accountId, requestId }) : undefined;
      await this.deps.repository.markPending(idempotencyKey, result, { type: 'provisioning.pending', requestId, occurredAt: now(), metadata: { declarationVersion: AUTHORITY_DECLARATION.version } }, verification);
      return result;
    } catch (error) {
      const compensated = await this.deps.tenantProvisioner.compensate(schemaName).catch(() => false);
      const state = compensated ? 'compensated' : 'quarantined';
      await this.deps.repository.markFailure(idempotencyKey, state, requestId);
      await this.deps.audit.record({ type: 'provisioning.failed', requestId, occurredAt: now(), metadata: { state } });
      throw new ProvisioningProblem(503, 'https://burgoweb.local/problems/provisioning-unavailable', 'Não foi possível concluir agora', `Tente novamente com a mesma chave. Referência: ${requestId}`);
    }
  }
}
