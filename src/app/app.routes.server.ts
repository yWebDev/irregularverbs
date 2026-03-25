import { RenderMode, ServerRoute } from '@angular/ssr';

/** More specific routes first. Only `/verbs` is SSR (SEO); everything else stays CSR. */
export const serverRoutes: ServerRoute[] = [
  { path: 'verbs', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Client },
];
