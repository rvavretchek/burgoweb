# Migrações globais

Os scripts são aditivos e executados em ordem no startup.

- `001_provisioning.sql`: provisionamento inicial.
- `002_email_verification_activation.sql`: ativação por e-mail.
- `003_sessions_memberships.sql`: sessões e projeções de acesso.
- `004_password_recovery_sessions.sql`: recuperação e controle de sessões.
- `005_relationship_authorization_provenance.sql`: proveniência de autorizações dependentes de Vínculo.
- `006_invitations.sql`: Convites, hashes de token, outbox e idempotência globais; Pessoa e Vínculo são referências opacas ao schema tenant.
- `007_tenant_time_zone.sql`: fuso IANA configurado do Condomínio (`tenant_registry.time_zone`), usado para validar horário civil ambíguo/inexistente na gestão de Papéis (Story 1.8).
