import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { Readable } from 'node:stream';
import application from '../apps/web/dist/server/server.js';

const port = Number(process.env.PORT ?? 3000);
const clientRoot = resolve('apps/web/dist/client');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? `localhost:${port}`}`);
    const assetPath = resolve(clientRoot, `.${decodeURIComponent(url.pathname)}`);
    if (url.pathname.startsWith('/assets/') && assetPath.startsWith(`${clientRoot}\\`)) {
      const asset = await readFile(assetPath);
      response.writeHead(200, {
        'content-type': contentTypes[extname(assetPath)] ?? 'application/octet-stream',
        'cache-control': 'public, max-age=31536000, immutable',
      });
      response.end(asset);
      return;
    }
    const webRequest = new Request(url, {
      method: request.method,
      headers: request.headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : Readable.toWeb(request),
      duplex: 'half',
    });
    const webResponse = await application.fetch(webRequest);
    response.writeHead(webResponse.status, Object.fromEntries(webResponse.headers));
    if (webResponse.body) Readable.fromWeb(webResponse.body).pipe(response);
    else response.end();
  } catch {
    response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Não foi possível servir a aplicação.');
  }
});

server.listen(port, '127.0.0.1');

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
