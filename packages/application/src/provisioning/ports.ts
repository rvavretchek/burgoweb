import type { PasswordHash } from '../identity/password-hasher.js';
import type { CreateCondominiumCommand, ProvisioningState, PublicProvisioningResult } from './contracts.js';
import type { PendingVerificationRecord } from '../verification/contracts.js';

export interface StoredProvisioning {
  requestId: string;
  idempotencyKey: string;
  requestHash: string;
  state: ProvisioningState;
  result?: PublicProvisioningResult;
}

export interface TenantSeed {
  personId: string;
  authorityId: string;
  fullName: string;
  acceptedAt: Date;
}

export class IdempotencyClaimConflict extends Error {}

export interface ProvisioningRepository {
  findByIdempotencyKey(key: string): Promise<StoredProvisioning | undefined>;
  begin(record: StoredProvisioning): Promise<void>;
  accountExists(email: string): Promise<boolean>;
  persistGlobal(input: { requestId: string; publicCondominiumId: string; schemaName: string; command: CreateCondominiumCommand; passwordHash: PasswordHash; declarationText: string; declarationVersion: string; acceptedAt: Date }): Promise<{ existingAccount: boolean; accountId?: string; seed?: TenantSeed }>;
  markPending(key: string, result: PublicProvisioningResult, event: { type: string; requestId: string; occurredAt: Date; metadata: Record<string, string> }, verification?: PendingVerificationRecord): Promise<void>;
  markFailure(key: string, state: 'compensated' | 'quarantined', correlationId: string): Promise<void>;
}

export interface TenantProvisioner {
  createAndMigrate(schemaName: string, seed?: TenantSeed): Promise<void>;
  compensate(schemaName: string): Promise<boolean>;
  /** Approximates the DB cost of createAndMigrate without creating a schema, so the existing-account path is not measurably faster (non-enumeration). */
  decoy(): Promise<void>;
}

export interface AuditPort {
  record(event: { type: string; requestId: string; occurredAt: Date; metadata: Record<string, string> }): Promise<void>;
}
