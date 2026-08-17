import { startWorker } from './composition-root.js';

export const workerEntrypoint = { name: 'burgoweb-worker', jobsEnabled: true } as const;

if (process.env.NODE_ENV !== 'test') {
  const ready = startWorker();
  const shutdown = async () => {
    try { const close = await ready; await close(); } catch { /* startup already failed; nothing to close */ }
    process.exit(0);
  };
  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());
  ready.catch(() => { process.exitCode = 1; });
}
