export const roleAtddData = {
  tenantPublicId: '11111111-1111-4111-8111-111111111111',
  personPublicId: '22222222-2222-4222-8222-222222222222',
  relationshipPublicId: '44444444-4444-4444-8444-444444444444',
  assignmentPublicId: '55555555-5555-4555-8555-555555555555',
  timeZone: 'America/Sao_Paulo',
  syndicSession: '__Host-burgoweb-session=syndic-session',
  assistantSession: '__Host-burgoweb-session=assistant-session',
  mutationHeaders: {
    origin: 'https://app.example.com',
    'sec-fetch-site': 'same-origin',
    'x-csrf-token': 'csrf',
    'idempotency-key': 'role-command-1',
  },
} as const;

