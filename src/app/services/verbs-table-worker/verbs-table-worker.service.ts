import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { VerbDetails } from 'src/app/model/verb-details';
import {
  filterAndSortVerbs,
  rankVerbsByBaseSimilarity,
  VerbSortKey,
} from 'src/app/utils/functional';
import { LevenshteinWasmService } from '../levenshtein-wasm/levenshtein-wasm.service';

export interface VerbsTableProcessOptions {
  verbs: VerbDetails[];
  filter: string;
  sortKey: VerbSortKey;
}

@Injectable({
  providedIn: 'root',
})
export class VerbsTableWorkerService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly levenshteinWasm = inject(LevenshteinWasmService);

  private worker: Worker | null = null;

  async processVerbs(options: VerbsTableProcessOptions): Promise<VerbDetails[]> {
    const { verbs, filter, sortKey } = options;
    if (!verbs.length) return [];

    const sorted =
      isPlatformBrowser(this.platformId) && typeof Worker !== 'undefined'
        ? await this.runInWorker(options)
        : filterAndSortVerbs(verbs, filter, sortKey);

    const term = filter.trim();
    if (term.length < 2) return sorted;

    const distanceFn = await this.levenshteinWasm.getDistanceFn();
    return rankVerbsByBaseSimilarity(sorted, term, distanceFn) as VerbDetails[];
  }

  private runInWorker(options: VerbsTableProcessOptions): Promise<VerbDetails[]> {
    return new Promise<VerbDetails[]>((resolve, reject) => {
      try {
        const w =
          this.worker ??
          new Worker(new URL('../../workers/verbs-table.worker', import.meta.url), {
            type: 'module',
          });
        this.worker = w;
        const onMessage = (e: MessageEvent<VerbDetails[]>): void => {
          w.removeEventListener('message', onMessage);
          w.removeEventListener('error', onError);
          resolve(e.data);
        };
        const onError = (e: ErrorEvent): void => {
          w.removeEventListener('message', onMessage);
          w.removeEventListener('error', onError);
          reject(e.error ?? new Error(e.message));
        };
        w.addEventListener('message', onMessage);
        w.addEventListener('error', onError);
        w.postMessage(options);
      } catch (e) {
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    }).catch(() => filterAndSortVerbs(options.verbs, options.filter, options.sortKey) as VerbDetails[]);
  }
}
