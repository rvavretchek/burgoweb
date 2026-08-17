export const AUTHORITY_DECLARATION = {
  version: '2026-07-28',
  text: 'Declaro que possuo autoridade para iniciar a organização deste condomínio e reconheço que o Burgoweb não certifica identidade civil, mandato, eleição ou legitimidade jurídica.',
} as const;

export type ProvisioningState =
  | 'processing'
  | 'pending-email-verification'
  | 'compensated'
  | 'quarantined'
  | 'conflict';

export interface CreateCondominiumCommand {
  person: { fullName: string };
  account: { email: string };
  condominium: { displayName: string };
  password: string;
  authorityDeclarationAccepted: boolean;
}

export interface PublicProvisioningResult {
  requestId: string;
  publicCondominiumId: string;
  state: 'pending-email-verification';
  message: string;
}

export class ProvisioningProblem extends Error {
  constructor(
    public readonly status: number,
    public readonly type: string,
    public readonly title: string,
    public readonly detail: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(detail);
  }
}

export function validateCreateCommand(input: CreateCondominiumCommand): void {
  const errors: Record<string, string[]> = {};
  if (!input.person.fullName.trim()) errors.fullName = ['Informe o nome da pessoa responsável.'];
  if (!/^\S+@\S+\.\S+$/.test(input.account.email.trim())) errors.email = ['Informe um e-mail válido.'];
  if (!input.condominium.displayName.trim()) errors.condominiumName = ['Informe o nome do condomínio.'];
  if (input.password.length < 12) errors.password = ['Use pelo menos 12 caracteres.'];
  if (input.authorityDeclarationAccepted !== true) errors.authorityDeclarationAccepted = ['Confirme a declaração obrigatória.'];
  if (Object.keys(errors).length) {
    throw new ProvisioningProblem(422, 'https://burgoweb.local/problems/validation', 'Dados inválidos', 'Revise os campos indicados.', errors);
  }
}
