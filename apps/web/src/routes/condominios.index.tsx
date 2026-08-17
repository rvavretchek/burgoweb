import { createFileRoute } from '@tanstack/react-router';
import { TenantSelectionPage } from '../components/AuthenticatedPages';

export const Route = createFileRoute('/condominios/')({
  head: () => ({ meta: [{ title: 'Selecionar Condomínio — Burgoweb' }] }),
  component: TenantSelectionPage,
});
