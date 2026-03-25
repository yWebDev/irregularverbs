import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { type Request, type Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const browserDistFolder = join(dirname(fileURLToPath(import.meta.url)), '../browser');

/**
 * Where to forward `/api/*` when this Node process handles those requests.
 * - On App Engine, `dispatch.yaml` usually sends `/api/*` to the `api` service, so this proxy is skipped.
 * - Locally (`node dist/server/server.mjs`), `/api/*` would otherwise hit Angular and return HTML → HttpClient JSON parse errors.
 *
 * Override with `API_PROXY_TARGET` (empty string disables proxy).
 */
function resolveApiProxyTarget(): string | undefined {
  if (process.env['API_PROXY_TARGET'] !== undefined) {
    const v = process.env['API_PROXY_TARGET'].trim();
    return v === '' ? undefined : v;
  }
  if (process.env['GAE_RUNTIME']) {
    return undefined;
  }
  return 'http://127.0.0.1:3000';
}

const apiProxyTarget = resolveApiProxyTarget();

const app = express();
const angularApp = new AngularNodeAppEngine();

if (apiProxyTarget) {
  app.use(
    '/api',
    createProxyMiddleware<Request, Response>({
      target: apiProxyTarget,
      changeOrigin: true,
    }),
  );
}

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
