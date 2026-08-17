export { createNestApplication } from './nest-app.js';
export { openApiDocument } from './openapi.js';
export { createProductionApplication, startApi } from './composition-root.js';
export const apiEntrypoint = { name: 'burgoweb-api', basePath: '/api/v1' } as const;

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const { startApi } = await import('./composition-root.js');
  await startApi();
}
import { pathToFileURL } from 'node:url';
