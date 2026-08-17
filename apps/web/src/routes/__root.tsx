import type { ErrorComponentProps } from '@tanstack/react-router';
import { HeadContent, Outlet, Scripts, createRootRoute, useRouter } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import '../styles.css';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Burgoweb — Organização e transparência condominial' },
      {
        name: 'description',
        content: 'Organize o condomínio, acompanhe os gastos e preste contas com transparência, gratuitamente.',
      },
    ],
  }),
  component: RootComponent,
  pendingComponent: LoadingState,
  errorComponent: SafeErrorState,
});

function RootComponent() {
  return (
    <RootDocument>
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function LoadingState() {
  return <div className="state-panel" role="status" aria-live="polite">Carregando a página…</div>;
}

function SafeErrorState({ reset }: ErrorComponentProps) {
  const router = useRouter();
  const retry = () => {
    reset();
    void router.invalidate();
  };
  return <SafeErrorPanel onRetry={retry} />;
}

export function SafeErrorPanel({ onRetry }: Readonly<{ onRetry: () => void }>) {
  return (
    <main id="conteudo-principal" className="state-shell">
      <section className="state-panel" aria-labelledby="erro-titulo">
        <h1 id="erro-titulo">Não foi possível abrir esta página</h1>
        <p>Confira sua conexão e tente novamente. Nenhuma informação foi criada.</p>
        <button type="button" onClick={onRetry}>Tentar novamente</button>
      </section>
    </main>
  );
}
