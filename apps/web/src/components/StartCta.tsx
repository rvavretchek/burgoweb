import { Link, useRouterState } from '@tanstack/react-router';
import { useEffect, useState, type MouseEvent } from 'react';

export function StartCta({ label }: Readonly<{ label: string }>) {
  const [offline, setOffline] = useState(false);
  const navigating = useRouterState({ select: (state) => state.isLoading });

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (offline || navigating) {
      event.preventDefault();
      return;
    }
  };

  return (
    <div className="cta-group">
      <Link
        className="primary-action"
        to="/comecar"
        onClick={onClick}
        aria-disabled={offline || navigating}
        aria-busy={navigating || undefined}
      >
        {label}
      </Link>
      {offline ? (
        <p className="inline-state" role="status">Você está sem conexão. Reconecte-se para continuar.</p>
      ) : null}
    </div>
  );
}
